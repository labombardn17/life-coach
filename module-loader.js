// Module Loader - Handles dynamic module loading and caching
// Modules are loaded on-demand for better performance

const ModuleLoader = {
    // Module cache
    cache: new Map(),
    
    // Module loading status
    loading: new Map(),
    
    // Load module with caching
    async load(moduleName) {
        // Return cached if available
        if (this.cache.has(moduleName)) {
            return this.cache.get(moduleName);
        }
        
        // Wait if already loading
        if (this.loading.has(moduleName)) {
            return this.loading.get(moduleName);
        }
        
        // Start loading
        const loadPromise = this.loadModuleScript(moduleName);
        this.loading.set(moduleName, loadPromise);
        
        try {
            const module = await loadPromise;
            this.cache.set(moduleName, module);
            this.loading.delete(moduleName);
            return module;
        } catch (error) {
            this.loading.delete(moduleName);
            throw error;
        }
    },
    
    // Load module script
    async loadModuleScript(moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `modules/${moduleName}.js`;
            script.async = true;
            
            script.onload = () => {
                // Module should register itself in window.modules
                if (window.modules && window.modules[moduleName]) {
                    resolve(window.modules[moduleName]);
                } else {
                    reject(new Error(`Module ${moduleName} did not register properly`));
                }
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load module: ${moduleName}`));
            };
            
            document.head.appendChild(script);
        });
    },
    
    // Preload modules (for better UX)
    async preload(moduleNames) {
        const promises = moduleNames.map(name => this.load(name));
        await Promise.allSettled(promises);
    },
    
    // Clear cache (for development/debugging)
    clearCache() {
        this.cache.clear();
        this.loading.clear();
    }
};

// Make available globally
window.ModuleLoader = ModuleLoader;
