class LocalStore {
    constructor(id) {
        this.key = id !== undefined ? `accessnotes-${id}` : 'accessnotes';
        this.notesKey = `notes-${id}`; // Separate key for notes
    }

    storeToJson(key = this.key) {
        const store = localStorage.getItem(key);
        let sources;
        try {
            sources = JSON.parse(store) || [];
        }
        catch (e) {
            sources = [];
        }
        return sources;
    }

    jsonToStore(stores, key = this.key) {
        localStorage.setItem(key, JSON.stringify(stores));
    }

    save(data, color, tooltipPos, tooltipLoc) {  
        const stores = this.storeToJson();
        const map = {};
        stores.forEach((store, idx) => map[store.hs.id] = idx);

        data.forEach(store => {
            store.color = color; 
            store.tooltipPos = tooltipPos; 
            store.tooltipLoc = tooltipLoc;
            if (map[store.hs.id] !== undefined) {
                stores[map[store.hs.id]] = store;
            } else {
                stores.push(store);
            }
        });
        this.jsonToStore(stores);
    }

    remove(id) {
        const stores = this.storeToJson();
        const index = stores.findIndex(store => store.hs.id === id);
        if (index !== -1) {
            stores.splice(index, 1);
            this.jsonToStore(stores);
        }
    }

    get(id) {
        const stores = this.storeToJson();
        return stores.find(store => store.hs.id === id) || null;
    }

    getAll() {
        return this.storeToJson();
    }

    removeAll() {
        this.jsonToStore([]);
    }

    // Note management functions
    saveNote(id, content) {
        const notes = this.storeToJson(this.notesKey);
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            notes[index].content = content;
        } else {
            notes.push({ id, content });
        }
        this.jsonToStore(notes, this.notesKey);
    }

    getNoteById(id) {
        const notes = this.storeToJson(this.notesKey);
        return notes.find(note => note.id === id) || null;
    }

    removeNoteById(id) {
        const notes = this.storeToJson(this.notesKey);
        const filteredNotes = notes.filter(note => note.id !== id);
        this.jsonToStore(filteredNotes, this.notesKey);
    }

    removeAllNotes() {
        this.jsonToStore([], this.notesKey);
    }

    getAllNotes() {
        return this.storeToJson(this.notesKey);
    }
}

export default LocalStore;
