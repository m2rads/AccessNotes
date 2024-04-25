class LocalStore {
    constructor(id) {
        this.key = id !== undefined ? `accessnotes-${id}` : 'accessnotes';
    }

    storeToJson() {
        const store = localStorage.getItem(this.key);
        let sources;
        try {
            sources = JSON.parse(store) || [];
        }
        catch (e) {
            sources = [];
        }
        return sources;
    }

    jsonToStore(stores) {
        localStorage.setItem(this.key, JSON.stringify(stores));
    }

    save(data, color, tooltipPos) {  
        const stores = this.storeToJson();
        const map = {};
        stores.forEach((store, idx) => map[store.hs.id] = idx);

        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach(store => {
            store.color = color; 
            store.tooltipPos = tooltipPos;  
            if (map[store.hs.id] !== undefined) {
                stores[map[store.hs.id]] = store;
            } else {
                stores.push(store);
            }
        });
        this.jsonToStore(stores);
    }

    forceSave(store, tooltipPos) {  
        const stores = this.storeToJson();
        store.tooltipPos = tooltipPos;  
        stores.push(store);
        this.jsonToStore(stores);
    }

    remove(id) {
        const stores = this.storeToJson();
        let index = null;
        for (let i = 0; i < stores.length; i++) {
            if (stores[i].hs.id === id) {
                index = i;
                break;
            }
        }
        if (index !== null) {
            stores.splice(index, 1);
        }
        this.jsonToStore(stores);
    }

    get(id) {
        const stores = this.storeToJson();
        const found = stores.find(store => store.hs.id === id);
        return found || null;
    }

    getAll() {
        return this.storeToJson();
    }

    removeAll() {
        this.jsonToStore([]);
    }
}

export default LocalStore;
