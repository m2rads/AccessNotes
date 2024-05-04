/* global Chrome */
class LocalStore {
    constructor(id) {
        if (LocalStore.instance) {
            return LocalStore.instance;
        }

        this.baseKey = `accessnotes${id ? `-${id}` : ''}`;
        this.notesKey = `notes${id ? `-${id}` : ''}`;
        this.localMode = true;  // Use the defined variable
        console.log("__LOCAL_MODE__", this.localMode)

        LocalStore.instance = this;
    }

    async fetchFromStorage(key) {
        if (this.localMode) {
            return Promise.resolve(JSON.parse(localStorage.getItem(key) || '[]'));
        } else {
            return new Promise((resolve, reject) => {
                chrome.storage.local.get([key], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result[key] ? JSON.parse(result[key]) : []);
                    }
                });
            });
        }
    }

    async saveToStorage(key, data) {
        if (this.localMode) {
            localStorage.setItem(key, JSON.stringify(data));
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                chrome.storage.local.set({[key]: JSON.stringify(data)}, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    async save(data, color, tooltipPos, tooltipLoc, url) {
        const stores = await this.fetchFromStorage(this.baseKey);
        const map = {};

        stores.forEach((store, idx) => map[store.hs.id] = idx);
        data.forEach(store => {
            store.color = color;
            store.tooltipPos = tooltipPos;
            store.tooltipLoc = tooltipLoc;
            store.url = url;
            if (map[store.hs.id] !== undefined) {
                stores[map[store.hs.id]] = store;
            } else {
                stores.push(store);
            }
        });
        await this.saveToStorage(this.baseKey, stores);
    }

    async remove(id) {
        const stores = await this.fetchFromStorage(this.baseKey);
        const index = stores.findIndex(store => store.hs.id === id);
        if (index !== -1) {
            stores.splice(index, 1);
            await this.saveToStorage(this.baseKey, stores);
        }
    }

    async get(id) {
        const stores = await this.fetchFromStorage(this.baseKey);
        return stores.find(store => store.hs.id === id) || null;
    }

    async getAll() {
        return await this.fetchFromStorage(this.baseKey);
    }

    async removeAll() {
        await this.saveToStorage(this.baseKey, []);
    }

    async saveNote(id, content, url) {
        const notes = await this.fetchFromStorage(this.notesKey);
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            notes[index].content = content;
        } else {
            notes.push({ id, content, url });
        }
        await this.saveToStorage(this.notesKey, notes);
    }

    async getNoteById(id) {
        const notes = await this.fetchFromStorage(this.notesKey);
        return notes.find(note => note.id === id) || null;
    }

    async removeNoteById(id) {
        const notes = await this.fetchFromStorage(this.notesKey);
        const filteredNotes = notes.filter(note => note.id !== id);
        await this.saveToStorage(this.notesKey, filteredNotes);
    }

    async removeAllNotes() {
        await this.saveToStorage(this.notesKey, []);
    }

    async getAllNotes() {
        return await this.fetchFromStorage(this.notesKey);
    }
}

export const localStore = new LocalStore();
