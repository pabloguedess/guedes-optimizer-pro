const { autoUpdater } = require("electron-updater");

let mainWindow = null;
let updateFound = false;

const changelog = [
  "Correção do aviso duplicado de atualização",
  "Melhoria na estabilidade do Auto Update",
  "Correção do botão Reiniciar Agora",
  "Melhor tratamento de erro do atualizador",
  "Atualização automática mais confiável"
];

function send(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

function setupAutoUpdater(win) {
  mainWindow = win;
  updateFound = false;

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
    updateFound = true;

    send("update-status", {
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 0,
      changelog
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    updateFound = true;

    send("update-status", {
      status: "downloading",
      message: "Baixando atualização...",
      progress: Math.round(progress.percent || 0),
      changelog
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    updateFound = true;

    send("update-status", {
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    if (updateFound) return;

    send("update-status", {
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("error", (err) => {
    if (updateFound) return;

    send("update-status", {
      status: "error",
      message: err?.message || "Erro ao verificar atualização.",
      progress: 0,
      changelog: []
    });
  });
}

function checkForUpdates() {
  try {
    autoUpdater.checkForUpdates();
  } catch (err) {
    if (!updateFound) {
      send("update-status", {
        status: "error",
        message: err?.message || "Erro ao verificar atualização.",
        progress: 0,
        changelog: []
      });
    }
  }
}

function installUpdateNow() {
  autoUpdater.quitAndInstall(false, true);
}

module.exports = {
  setupAutoUpdater,
  checkForUpdates,
  installUpdateNow
};