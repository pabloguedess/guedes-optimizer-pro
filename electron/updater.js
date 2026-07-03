const { autoUpdater } = require("electron-updater");

let mainWindow = null;
let updateReady = false;

const changelog = [
  "Correção definitiva do botão Reiniciar Agora",
  "Download automático restaurado",
  "Auto Update mais estável",
  "Correção de mensagens duplicadas"
];

function send(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-status", data);
  }
}

function setupAutoUpdater(win) {
  mainWindow = win;
  updateReady = false;

  autoUpdater.removeAllListeners();

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on("checking-for-update", () => {
    send({
      status: "checking",
      message: "Verificando atualizações...",
      progress: 0,
      changelog: []
    });
  });

  autoUpdater.on("update-available", (info) => {
    send({
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 1,
      changelog
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    send({
      status: "downloading",
      message: "Baixando atualização...",
      progress: Math.round(progress.percent || 0),
      changelog
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    updateReady = true;

    send({
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    send({
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("error", (err) => {
    console.log("AUTO UPDATE ERROR:", err?.message || err);
  });
}

function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    console.log("CHECK UPDATE ERROR:", err?.message || err);
  });
}

function installUpdateNow() {
  if (!updateReady) {
    send({
      status: "downloading",
      message: "A atualização ainda está sendo baixada...",
      progress: 1,
      changelog
    });
    return;
  }

  autoUpdater.quitAndInstall(true, true);
}

module.exports = {
  setupAutoUpdater,
  checkForUpdates,
  installUpdateNow
};