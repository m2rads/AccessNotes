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

    save(data, color, tooltipPos, tooltipLoc) {  
        const stores = this.storeToJson();
        const map = {};
        stores.forEach((store, idx) => map[store.hs.id] = idx);

        if (!Array.isArray(data)) {
            data = [data];
        }

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

    // Note management functions
    saveNote(id, content) {
        const notes = this.getAllNotes();
        const noteIndex = notes.findIndex(note => note.id === id);

        if (noteIndex !== -1) {
            notes[noteIndex].content = content;
        } else {
            notes.push({ id, content });
        }

        this.jsonToStore(notes);
    }

    getNoteById(id) {
        const notes = this.getAllNotes();
        return notes.find(note => note.id === id) || null;
    }

    removeNoteById(id) {
        const notes = this.getAllNotes();
        const filteredNotes = notes.filter(note => note.id !== id);
        this.jsonToStore(filteredNotes);
    }

    removeAllNotes() {
        this.jsonToStore([]);
    }

    getAllNotes() {
        return this.storeToJson();
    }
}

export default LocalStore;
