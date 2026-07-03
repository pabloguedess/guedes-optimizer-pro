const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");

let mainWindow = null;
let hasUpdate = false;
let isDownloaded = false;

const changelog = [
  "Correção definitiva do Auto Update",
  "Download automático corrigido",
  "Botão Reiniciar Agora corrigido",
  "Remoção de mensagens duplicadas",
  "Logs de erro do atualizador"
];

function log(text) {
  try {
    const file = path.join(process.cwd(), "update-log.txt");
    fs.appendFileSync(file, `[${new Date().toLocaleString()}] ${text}\n`);
  } catch {}
}

function send(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update-status", data);
  }
}

function setupAutoUpdater(win) {
  mainWindow = win;
  hasUpdate = false;
  isDownloaded = false;

  autoUpdater.removeAllListeners();

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on("checking-for-update", () => {
    log("Verificando atualização");

    send({
      status: "checking",
      message: "Verificando atualizações...",
      progress: 0,
      changelog: []
    });
  });

  autoUpdater.on("update-available", (info) => {
    hasUpdate = true;
    log(`Atualização disponível: ${info.version}`);

    send({
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 1,
      changelog
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    hasUpdate = true;
    log(`Download: ${Math.round(progress.percent || 0)}%`);

    send({
      status: "downloading",
      message: "Baixando atualização...",
      progress: Math.round(progress.percent || 0),
      changelog
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    hasUpdate = true;
    isDownloaded = true;
    log(`Atualização baixada: ${info.version}`);

    send({
      status: "ready",
      message: `Atualização ${info.version} pronta para instalar.`,
      version: info.version,
      progress: 100,
      changelog
    });
  });

  autoUpdater.on("update-not-available", () => {
    log("Nenhuma atualização disponível");

    if (hasUpdate || isDownloaded) return;

    send({
      status: "none",
      message: "Você já está na versão mais recente.",
      progress: 100,
      changelog: []
    });
  });

  autoUpdater.on("error", (err) => {
    const message = err?.message || String(err);
    log(`ERRO: ${message}`);

    send({
      status: hasUpdate ? "download-error" : "silent-error",
      message: hasUpdate
        ? `Erro ao baixar atualização: ${message}`
        : "",
      progress: 0,
      changelog: hasUpdate ? changelog : []
    });
  });
}

function checkForUpdates() {
  log("checkForUpdates chamado");

  autoUpdater.checkForUpdates().catch((err) => {
    const message = err?.message || String(err);
    log(`CHECK ERROR: ${message}`);

    send({
      status: "silent-error",
      message: "",
      progress: 0,
      changelog: []
    });
  });
}

function installUpdateNow() {
  log("installUpdateNow chamado");

  if (!isDownloaded) {
    send({
      status: "downloading",
      message: "A atualização ainda não terminou de baixar...",
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