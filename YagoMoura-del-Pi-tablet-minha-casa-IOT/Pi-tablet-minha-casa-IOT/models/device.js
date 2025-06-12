// src/models/device.js
class Device {
    constructor(id, name, type, status = 'off') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    setStatus(newStatus) {
        this.status = newStatus;
        this.dispatchEvent('statusChange', { deviceId: this.id, newStatus: this.status });
    }

    // Método para disparar eventos customizados
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail: detail });
        window.dispatchEvent(event);
    }
}