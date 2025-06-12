// src/models/presenceSensor.js
class PresenceSensor extends Device {
    constructor(id, name) {
        super(id, name, 'presenceSensor');
        this.presenceDetected = false;
    }

    detectPresence() {
        if (!this.presenceDetected) {
            this.presenceDetected = true;
            this.setStatus('presence detected');
            this.dispatchEvent('presenceDetected', { id: this.id, detected: true });
        }
    }

    clearPresence() {
        if (this.presenceDetected) {
            this.presenceDetected = false;
            this.setStatus('no presence');
            this.dispatchEvent('presenceDetected', { id: this.id, detected: false });
        }
    }
}