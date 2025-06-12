// src/models/electronicLock.js
class ElectronicLock extends Device {
    constructor(id, name) {
        super(id, name, 'lock');
        this.isLocked = true; // Inicia trancada
    }

    lock() {
        if (!this.isLocked) {
            this.isLocked = true;
            this.setStatus('locked');
            this.dispatchEvent('lockStateChange', { id: this.id, locked: true });
        }
    }

    unlock() {
        if (this.isLocked) {
            this.isLocked = false;
            this.setStatus('unlocked');
            this.dispatchEvent('lockStateChange', { id: this.id, locked: false });
        }
    }
}