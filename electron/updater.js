const { autoUpdater } = require("electron-updater");
const { app } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow = null;
let hasUpdate = false;
let isDownloaded = false;

const changelog = [
  "Correção final do sistema de atualização",
  "Logs salvos em AppData",
  "Download automático forçado",
  "Melhor diagnóstico de erro",
  "Botão Reiniciar Agora corrigido"
];

function log(text) {
  try {
    const dir = app.getPath("userData");
    const file = path.join(dir, "update-log.txt");
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

  autoUpdater.autoDownload = false;
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
    log(`Atualização encontrada: ${info.version}`);

    send({
      status: "available",
      message: `Nova versão disponível: ${info.version}`,
      version: info.version,
      progress: 1,
      changelog
    });

    setTimeout(() => {
      log("Iniciando download manual");

      autoUpdater.downloadUpdate().catch((err) => {
        const message = err?.message || String(err);
        log(`Erro no download: ${message}`);

        send({
          status: "download-error",
          message: `Erro ao baixar atualização: ${message}`,
          progress: 0,
          changelog
        });
      });
    }, 1200);
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = Math.round(progress.percent || 0);
    log(`Download: ${percent}%`);

    send({
      status: "downloading",
      message: "Baixando atualização...",
      progress: percent,
      changelog
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
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
    log(`Erro geral: ${message}`);

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
  log("checkForUpdates chamado");

  autoUpdater.checkForUpdates().catch((err) => {
    log(`Erro ao verificar: ${err?.message || err}`);
  });
}

function installUpdateNow() {
  log("installUpdateNow chamado");

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