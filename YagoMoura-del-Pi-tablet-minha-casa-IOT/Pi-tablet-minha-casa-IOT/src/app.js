// app.js (Controlador principal da interface)
const app = {
    // Referências aos elementos HTML que serão atualizados
    elements: {
        currentTime: document.getElementById('current-time'),
        tempDisplay: document.getElementById('temp-display'),
        lightsOnCount: document.getElementById('lights-on-count'),
        securityStatus: document.getElementById('security-status'),
        doorsStatus: document.getElementById('doors-status'),
        eventLog: document.getElementById('event-log')
    },

    // Instância do controlador principal do sistema
    mainController: null,

    init: function() {
        this.mainController = new MainController();
        this.updateTime();
        setInterval() <= (this.updateTime, 1000); // Atualiza a hora a cada segundo

        this.setupEventListeners();
        this.updateDashboard(); // Atualiza o dashboard inicialmente
        this.addLogEntry("Sistema Smart Home iniciado.");

        // Simular eventos de sensores e assistente de voz
        setInterval(() => this.mainController.simulateTemperatureChange(), 5000); // Temperatura muda a cada 5s
        setInterval(() => this.mainController.simulateRandomPresence(), 10000); // Presença aleatória a cada 10s
    },

    updateTime: function() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit'};
        app.elements.currentTime.textContent = now.toLocaleTimeString('pt-BR', options);
    },

    updateDashboard: function() {
        const status = this.mainController.getSystemStatus();
        this.elements.tempDisplay.textContent = status.temperatura.toFixed(1);
        this.elements.lightsOnCount.textContent = status.lightsOn;
        this.elements.securityStatus.textContent = status.securityMode;
        this.elements.doorsStatus.textContent = status.doorsLocked ? 'Trancadas' : 'Destrancadas';
    },

    addLogEntry: function(message) {
        const listItem = document.createElement('li');
        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        listItem.innerHTML = `<span class="log-timestamp">[${time}]</span> <span class="log-message">${message}</span>`;
        this.elements.eventLog.prepend(listItem); // Adiciona no topo
        // Limita o número de logs para não sobrecarregar
        if (this.elements.eventLog.children.length > 50) {
            this.elements.eventLog.removeChild(this.elements.eventLog.lastChild);
        }
    },

    // --- Funções de interação com o controlador ---
    toggleAllLights: function() {
        const anyLightOn = this.mainController.getSystemStatus().lightsOn > 0;
        if (anyLightOn) {
            this.mainController.turnOffAllLights();
            this.addLogEntry("Todas as lâmpadas foram desligadas.");
        } else {
            this.mainController.turnOnAllLights();
            this.addLogEntry("Todas as lâmpadas foram ligadas.");
        }
        this.updateDashboard();
    },

    viewCamera: function(cameraName) {
        this.mainController.activateCamera(cameraName);
        this.addLogEntry(`Visualizando câmera: ${cameraName}`);
        // Em um sistema real, aqui abriria um modal de vídeo
        alert(`Simulando visualização da Câmera: ${cameraName}`);
    },

    simulatePresence: function() {
        this.mainController.simulatePresenceDetection();
        this.addLogEntry("Simulação de detecção de presença acionada.");
        this.updateDashboard(); // Pode mudar o status de segurança
    },

    toggleLock: function() {
        const doorsLocked = this.mainController.getSystemStatus().doorsLocked;
        if (doorsLocked) {
            this.mainController.unlockAllDoors();
            this.addLogEntry("Portas destrancadas.");
        } else {
            this.mainController.lockAllDoors();
            this.addLogEntry("Portas trancadas.");
        }
        this.updateDashboard();
    },

    toggleTv: function() {
        const tvOn = this.mainController.getSystemStatus().tvOn;
        if (tvOn) {
            this.mainController.turnOffTv();
            this.addLogEntry("Smart TV desligada.");
        } else {
            this.mainController.turnOnTv();
            this.addLogEntry("Smart TV ligada.");
        }
        this.updateDashboard();
    },

    openVoiceAssistant: function() {
        this.addLogEntry("Abrindo aplicativo do assistente de voz (simulado).");
        alert("Abrindo interface da Alexa/Google Home...");
        // Em um sistema real, aqui você integraria com a API ou o app do assistente.
    },

    // Configura os listeners de eventos globais ou de elementos específicos
    setupEventListeners: function() {
        // Exemplo: listener para o botão de ativar/desativar segurança
        const securityCard = document.getElementById('card-seguranca');
        if (securityCard) {
            securityCard.addEventListener('click', () => {
                const currentMode = this.mainController.getSystemStatus().securityMode;
                if (currentMode === "Desativado") {
                    this.mainController.activateSecurity("Ativado");
                    this.addLogEntry("Modo de segurança ATIVADO.");
                } else {
                    this.mainController.deactivateSecurity();
                    this.addLogEntry("Modo de segurança DESATIVADO.");
                }
                this.updateDashboard();
            });
        }
    }
};

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Listener para eventos que o MainController pode disparar para a UI
window.addEventListener('updateDashboard', () => app.updateDashboard());
window.addEventListener('logEvent', (event) => app.addLogEntry(event.detail.message));