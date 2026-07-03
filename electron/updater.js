const { autoUpdater } = require("electron-updater");

let mainWindow = null;
let updateFound = false;
let updateReady = false;
let listenersConfigured = false;

const changelog = [
  "Correção do download automático da atualização",
  "Correção do aviso duplicado de atualização",
  "Melhoria na estabilidade do Auto Update",
  "Correção do botão Reiniciar Agora",
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
  updateReady = false;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  if (listenersConfigured) return;
  listenersConfigured = true;

  autoUpdater.on("checking-for-update", () => {
    send("update-status", {
      status: "checking",
      message: "Verificando atualizações...",
      progress: 0,
      changelog: []
    });
  });

  autoUpdater.on("update-available", async (info) => {
    updateFound = true;

    send("update-status", {
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 0,
      changelog
    });

    try {
      await autoUpdater.downloadUpdate();
    } catch (err) {
      console.log("AUTO UPDATE DOWNLOAD ERROR:", err?.message || err);
    }
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
    updateReady = true;

    send("update-status", {
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    if (updateFound || updateReady) return;

    send("update-status", {
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("error", (err) => {
    console.log("AUTO UPDATE ERROR:", err?.message || err);

    if (updateFound || updateReady) return;

    send("update-status", {
      status: "silent-error",
      message: "",
      progress: 0,
      changelog: []
    });
  });
}

function checkForUpdates() {
  try {
    autoUpdater.checkForUpdates();
  } catch (err) {
    console.log("AUTO UPDATE CHECK ERROR:", err?.message || err);

    if (!updateFound && !updateReady) {
      send("update-status", {
        status: "silent-error",
        message: "",
        progress: 0,
        changelog: []
      });
    }
  }
}

function installUpdateNow() {
  if (!updateReady) {
    send("update-status", {
      status: "downloading",
      message: "A atualização ainda está sendo preparada...",
      progress: 0,
      changelog
    });
    return;
  }

  autoUpdater.quitAndInstall(false, true);
}

module.exports = {
  setupAutoUpdater,
  checkForUpdates,
  installUpdateNow
};