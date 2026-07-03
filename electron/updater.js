const { autoUpdater } = require("electron-updater");

let mainWindow = null;

const changelog = [
  "Novo sistema de notificações internas",
  "Modo RGB Premium mais leve",
  "Melhorias no Auto Update",
  "Correções de desempenho",
  "Minimizar para bandeja aprimorado"
];

function send(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

function setupAutoUpdater(win) {
  mainWindow = win;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    send("update-status", {
      status: "checking",
      message: "Verificando atualizações...",
      progress: 0,
      changelog: []
    });
  });

  autoUpdater.on("update-available", (info) => {
    send("update-status", {
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 0,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    send("update-status", {
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    send("update-status", {
      status: "downloading",
      message: "Baixando atualização...",
      progress: Math.round(progress.percent),
      changelog
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    send("update-status", {
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("error", () => {
    send("update-status", {
      status: "error",
      message: "Erro ao verificar atualização.",
      progress: 0,
      changelog: []
    });
  });
}

function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

function installUpdateNow() {
  autoUpdater.quitAndInstall(false, true);
}

module.exports = {
  setupAutoUpdater,
  checkForUpdates,
  installUpdateNow
};