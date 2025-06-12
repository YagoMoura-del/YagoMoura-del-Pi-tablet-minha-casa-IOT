// src/models/camera.js
class Camera extends Device {
    constructor(id, name) {
        super(id, name, 'camera');
        this.isRecording = false;
    }

    startRecording() {
        this.isRecording = true;
        this.setStatus('recording');
        this.dispatchEvent('cameraRecording', { id: this.id, recording: true });
    }

    stopRecording() {
        this.isRecording = false;
        this.setStatus('idle');
        this.dispatchEvent('cameraRecording', { id: this.id, recording: false });
    }

    viewLiveFeed() {
        this.setStatus('streaming');
        this.dispatchEvent('cameraStreaming', { id: this.id, streaming: true });
        console.log(`Visualizando feed ao vivo da câmera: ${this.name}`);
        // Em um sistema real, aqui iniciaria o streaming de vídeo
    }
}