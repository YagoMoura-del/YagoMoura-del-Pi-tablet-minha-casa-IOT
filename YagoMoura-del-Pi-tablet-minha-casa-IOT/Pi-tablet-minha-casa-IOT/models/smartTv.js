// src/models/smartTv.js
class SmartTv extends Device {
    constructor(id, name) {
        super(id, name, 'smartTv');
        this.volume = 20;
        this.channel = 1;
    }

    turnOn() {
        this.setStatus('on');
        this.dispatchEvent('tvStateChange', { id: this.id, state: 'on' });
    }

    turnOff() {
        this.setStatus('off');
        this.dispatchEvent('tvStateChange', { id: this.id, state: 'off' });
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(100, level));
        this.dispatchEvent('tvVolumeChange', { id: this.id, volume: this.volume });
    }

    changeChannel(channelNum) {
        this.channel = channelNum;
        this.dispatchEvent('tvChannelChange', { id: this.id, channel: this.channel });
    }
}