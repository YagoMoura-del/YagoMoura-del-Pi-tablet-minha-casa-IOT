// src/models/light.js
class Light extends Device {
    constructor(id, name, brightness = 100, color = 'white') {
        super(id, name, 'light');
        this.brightness = brightness;
        this.color = color;
    }

    turnOn() {
        this.setStatus('on');
        this.dispatchEvent('lightStateChange', { id: this.id, state: 'on' });
    }

    turnOff() {
        this.setStatus('off');
        this.dispatchEvent('lightStateChange', { id: this.id, state: 'off' });
    }

    setBrightness(value) {
        this.brightness = value;
        this.dispatchEvent('lightBrightnessChange', { id: this.id, brightness: this.brightness });
    }
}