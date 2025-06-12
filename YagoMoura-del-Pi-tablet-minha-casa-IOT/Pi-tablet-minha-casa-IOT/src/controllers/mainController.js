// src/controllers/mainController.js
class MainController {
    constructor() {
        this.devices = {
            lights: {
                'livingRoomLight': new Light('lrLight01', 'Luz da Sala'),
                'kitchenLight': new Light('kLight01', 'Luz da Cozinha')
            },
            cameras: {
                'frontDoorCam': new Camera('fdCam01', 'Câmera Porta Frente'),
                'backyardCam': new Camera('byCam01', 'Câmera Quintal')
            },
            presenceSensors: {
                'hallwaySensor': new PresenceSensor('hwSensor01', 'Sensor Corredor'),
                'livingRoomSensor': new PresenceSensor('lrSensor01', 'Sensor Sala')
            },
            locks: {
                'mainDoorLock': new ElectronicLock('mdLock01', 'Fechadura Principal')
            },
            smartTvs: {
                'livingRoomTv': new SmartTv('lrTv01', 'Smart TV Sala')
            },
            temperatureSensors: {
                'mainTempSensor': new TemperatureSensor('mts01', 'Sensor Temp. Principal', 24.5)
            }
        };
        this.securityMode = 'Desativado'; // 'Desativado', 'Ativado', 'Modo Ausente'

        this.setupEventListeners();
    }

    // Dispara eventos para a UI (app.js)
    dispatchEventToUI(eventName, detail) {
        const event = new CustomEvent(eventName, { detail: detail });
        window.dispatchEvent(event);
    }

    setupEventListeners() {
        // Exemplo de como reagir a eventos de dispositivo e atualizar o log/dashboard
        window.addEventListener('statusChange', (e) => {
            this.dispatchEventToUI('logEvent', { message: `[${e.detail.deviceId}] status: ${e.detail.newStatus}` });
            this.dispatchEventToUI('updateDashboard');
        });
        window.addEventListener('presenceDetected', (e) => {
            const sensor = this.devices.presenceSensors[e.detail.id];
            if (e.detail.detected) {
                this.dispatchEventToUI('logEvent', { message: `ALERTA: Presença detectada em ${sensor.name}!` });
                if (this.securityMode === 'Ativado' || this.securityMode === 'Modo Ausente') {
                    // Exemplo de automação: ligar câmera e luz ao detectar presença em modo de segurança
                    this.devices.cameras.frontDoorCam.startRecording();
                    this.devices.lights.livingRoomLight.turnOn();
                    this.dispatchEventToUI('logEvent', { message: `Automação: Câmera iniciada e luz ligada.` });
                }
            } else {
                this.dispatchEventToUI('logEvent', { message: `Presença limpa em ${sensor.name}.` });
            }
            this.dispatchEventToUI('updateDashboard');
        });
        window.addEventListener('temperatureChange', (e) => {
            const sensor = this.devices.temperatureSensors[e.detail.id];
            this.dispatchEventToUI('logEvent', { message: `Temperatura em ${sensor.name}: ${e.detail.temperature.toFixed(1)}°C` });
            this.dispatchEventToUI('updateDashboard');
            // Exemplo de automação: ligar ou desligar algo com base na temperatura
            if (e.detail.temperature > 28 && this.devices.lights.livingRoomLight.getStatus() === 'off') {
                this.dispatchEventToUI('logEvent', { message: "Automação: Temperatura alta, considerar ligar AC ou ventoinha." });
            }
        });
    }

    getSystemStatus() {
        let lightsOn = 0;
        for (const key in this.devices.lights) {
            if (this.devices.lights[key].getStatus() === 'on') {
                lightsOn++;
            }
        }
        const doorsLocked = Object.values(this.devices.locks).every(lock => lock.isLocked);
        const tvOn = Object.values(this.devices.smartTvs).some(tv => tv.getStatus() === 'on');
        const mainTemp = this.devices.temperatureSensors.mainTempSensor.getTemperature();

        return {
            temperatura: mainTemp,
            lightsOn: lightsOn,
            securityMode: this.securityMode,
            doorsLocked: doorsLocked,
            tvOn: tvOn
        };
    }

    // --- Métodos de Controle ---
    turnOnAllLights() {
        for (const key in this.devices.lights) {
            this.devices.lights[key].turnOn();
        }
    }

    turnOffAllLights() {
        for (const key in this.devices.lights) {
            this.devices.lights[key].turnOff();
        }
    }

    activateCamera(cameraId) {
        const camera = this.devices.cameras[cameraId];
        if (camera) {
            camera.viewLiveFeed();
        }
    }

    simulatePresenceDetection() {
        // Simula detecção em um sensor específico ou aleatoriamente
        const sensor = this.devices.presenceSensors.hallwaySensor;
        if (!sensor.presenceDetected) {
            sensor.detectPresence();
            // Simula a presença desaparecendo após um tempo
            setTimeout(() => sensor.clearPresence(), 5000);
        }
    }

    lockAllDoors() {
        for (const key in this.devices.locks) {
            this.devices.locks[key].lock();
        }
    }

    unlockAllDoors() {
        for (const key in this.devices.locks) {
            this.devices.locks[key].unlock();
        }
    }

    turnOnTv() {
        this.devices.smartTvs.livingRoomTv.turnOn();
    }

    turnOffTv() {
        this.devices.smartTvs.livingRoomTv.turnOff();
    }

    activateSecurity(mode) {
        this.securityMode = mode;
        if (mode === 'Ativado' || mode === 'Modo Ausente') {
            this.lockAllDoors();
            this.devices.cameras.frontDoorCam.startRecording();
            this.devices.cameras.backyardCam.startRecording();
            this.dispatchEventToUI('logEvent', { message: `Modo de segurança '${mode}' ativado. Portas trancadas, câmeras gravando.` });
        }
        this.dispatchEventToUI('updateDashboard');
    }

    deactivateSecurity() {
        this.securityMode = 'Desativado';
        this.devices.cameras.frontDoorCam.stopRecording();
        this.devices.cameras.backyardCam.stopRecording();
        this.dispatchEventToUI('logEvent', { message: "Modo de segurança DESATIVADO. Câmeras paradas." });
        this.dispatchEventToUI('updateDashboard');
    }

    // Simulações de eventos externos
    simulateTemperatureChange() {
        const tempSensor = this.devices.temperatureSensors.mainTempSensor;
        const currentTemp = tempSensor.getTemperature();
        const newTemp = currentTemp + (Math.random() * 2 - 1); // Muda entre -1 e +1 grau
        tempSensor.setTemperature(newTemp);
    }

    simulateRandomPresence() {
        const sensorKeys = Object.keys(this.devices.presenceSensors);
        const randomSensorKey = sensorKeys[Math.floor(Math.random() * sensorKeys.length)];
        const sensor = this.devices.presenceSensors[randomSensorKey];

        if (Math.random() > 0.5) { // 50% de chance de detectar presença
            sensor.detectPresence();
            // Simula a presença desaparecendo após 3-7 segundos
            setTimeout(() => sensor.clearPresence(), Math.random() * 4000 + 3000);
        }
    }

    // A integração com Alexa/Google Home seria feita aqui,
    // através de APIs reais ou uma simulação mais elaborada
    processVoiceCommand(command) {
        this.dispatchEventToUI('logEvent', { message: `Comando de voz recebido: "${command}"` });
        command = command.toLowerCase();
        if (command.includes('ligar luz da sala')) {
            this.devices.lights.livingRoomLight.turnOn();
        } else if (command.includes('desligar luz da cozinha')) {
            this.devices.lights.kitchenLight.turnOff();
        } else if (command.includes('trancar porta principal')) {
            this.devices.locks.mainDoorLock.lock();
        } else if (command.includes('ativar modo ausente')) {
            this.activateSecurity('Modo Ausente');
        } else {
            this.dispatchEventToUI('logEvent', { message: `Comando de voz "${command}" não reconhecido.` });
        }
        this.dispatchEventToUI('updateDashboard');
    }
}