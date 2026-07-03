const { autoUpdater } = require("electron-updater");

let mainWindow = null;
let updateReady = false;

const changelog = [
  "Sistema de atualização mais estável",
  "Verificação automática ao abrir o app",
  "Download em segundo plano",
  "Botão Reiniciar Agora corrigido",
  "Melhor integração com a interface",
  "Adição de logs de atualização no painel de controle",
  "Possivel conexão com Discord para notificações de atualização",
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