// src/models/temperatureSensor.js
class TemperatureSensor extends Device {
    constructor(id, name, initialTemp = 23.0) {
        super(id, name, 'temperatureSensor');
        this.temperature = initialTemp;
        this.setStatus(`${this.temperature.toFixed(1)}°C`);
    }

    setTemperature(newTemp) {
        this.temperature = newTemp;
        this.setStatus(`${this.temperature.toFixed(1)}°C`);
        this.dispatchEvent('temperatureChange', { id: this.id, temperature: this.temperature });
    }

    getTemperature() {
        return this.temperature;
    }
}