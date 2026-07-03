const { autoUpdater } = require("electron-updater");

let mainWindow = null;
let hasUpdate = false;
let isDownloaded = false;

const changelog = [
  "Correção definitiva do Auto Update",
  "Download automático após encontrar nova versão",
  "Botão Reiniciar Agora corrigido",
  "Remoção de mensagens duplicadas",
  "Atualizador mais estável"
];

function send(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-status", data);
  }
}

function setupAutoUpdater(win) {
  mainWindow = win;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.removeAllListeners();

  autoUpdater.on("checking-for-update", () => {
    hasUpdate = false;
    isDownloaded = false;

    send({
      status: "checking",
      message: "Verificando atualizações...",
      progress: 0,
      changelog: []
    });
  });

  autoUpdater.on("update-available", async (info) => {
    hasUpdate = true;

    send({
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 0,
      changelog
    });

    setTimeout(async () => {
      try {
        send({
          status: "downloading",
          message: "Baixando atualização...",
          version: info.version,
          progress: 1,
          changelog
        });

        await autoUpdater.downloadUpdate();
      } catch (err) {
        console.log("DOWNLOAD UPDATE ERROR:", err?.message || err);
      }
    }, 1000);
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
    isDownloaded = true;

    send({
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    if (hasUpdate || isDownloaded) return;

    send({
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("error", (err) => {
    console.log("AUTO UPDATE ERROR:", err?.message || err);

    if (hasUpdate || isDownloaded) return;

    send({
      status: "silent-error",
      message: "",
      progress: 0,
      changelog: []
    });
  });
}

function checkForUpdates() {
  autoUpdater.checkForUpdates().catch((err) => {
    console.log("CHECK UPDATE ERROR:", err?.message || err);
  });
}

function installUpdateNow() {
  if (!isDownloaded) {
    send({
      status: "downloading",
      message: "A atualização ainda está sendo baixada...",
      progress: 1,
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