const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");

app.disableHardwareAcceleration();
app.setName("Guedes Optimizer PRO");

const cleaning = require("./optimizer/cleaning");
const ram = require("./optimizer/ram");
const system = require("./optimizer/system");
const network = require("./optimizer/network");
const gpu = require("./optimizer/gpu");
const live = require("./optimizer/live");
const monitor = require("./monitor/systemInfo");
const { setupAutoUpdater, checkForUpdates, installUpdateNow } = require("./updater");
let win = null;
let tray = null;
let monitorTimer = null;
let monitorActive = true;
let isQuitting = false;

const gotLock = app.requestSingleInstanceLock();

const { connectDiscord } = require("./discord");

if (!gotLock) {
  app.quit();
}

function stopMonitor() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1220,
    height: 760,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    backgroundColor: "#050505",
    title: "Guedes Optimizer PRO",
    icon: path.join(__dirname, "..", "assets", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: true,
      spellcheck: false,
      webgl: false
    }
  });

  win.setMenuBarVisibility(false);
  win.webContents.setBackgroundThrottling(true);

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

win.once("ready-to-show", () => {
  if (app.isPackaged) {
    setupAutoUpdater(win);

    setTimeout(() => {
      checkForUpdates();
    }, 3000);
  }
});

  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });

  win.on("closed", () => {
    stopMonitor();
    win = null;
  });

  createTray();
}

function createTray() {
  if (tray) return;

  tray = new Tray(path.join(__dirname, "..", "assets", "icon.ico"));

  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Abrir Guedes Optimizer PRO",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        }
      }
    },
    {
      label: "Sair",
      click: () => {
        isQuitting = true;
        stopMonitor();

        if (tray) {
          tray.destroy();
          tray = null;
        }

        if (win && !win.isDestroyed()) {
          win.destroy();
        }

        app.quit();
      }
    }
  ]);

  tray.setToolTip("Guedes Optimizer PRO");
  tray.setContextMenu(trayMenu);

  tray.on("double-click", () => {
    if (win) {
      win.show();
      win.focus();
    }
  });
}

function sendLog(text) {
  if (win && !win.isDestroyed()) {
    win.webContents.send("app-log", text);
  }
}

function sendProgress(value) {
  if (win && !win.isDestroyed()) {
    win.webContents.send("app-progress", value);
  }
}

function startMonitor() {
  stopMonitor();

  monitorTimer = setInterval(async () => {
    try {
      if (!monitorActive) return;
      if (!win || win.isDestroyed()) return;

      const info = await monitor.getSystemInfo();
      win.webContents.send("system-info", info);
    } catch (err) {
  console.log("ERRO MONITOR:", err);
}
  }, 5000);
}

function createHandler(channel, action) {
  ipcMain.handle(channel, async (_, ...args) => {
    try {
      sendProgress(0);
      sendLog("Iniciando operação.");

      const result = await action(...args);

      sendProgress(100);
      sendLog(result.message);

      return result;
    } catch {
      return {
        success: false,
        message: "Erro ao executar operação."
      };
    }
  });
}

ipcMain.handle("window-minimize", () => {
  if (win) win.minimize();
});

ipcMain.handle("window-close", () => {
  if (win && !win.isDestroyed()) {
    win.hide();
  }
});

ipcMain.handle("window-maximize", () => {
  if (!win) return;

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.handle("connect-discord", async () => {
  return await connectDiscord();
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("install-update-now", () => {
  isQuitting = true;
  stopMonitor();

  if (tray) {
    tray.destroy();
    tray = null;
  }

  installUpdateNow();
});

ipcMain.handle("set-monitor-active", (_, active) => {
  monitorActive = Boolean(active);
  return true;
});

ipcMain.handle("set-startup", (_, enable) => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: process.execPath
  });

  return {
    success: true,
    message: enable
      ? "Inicialização com Windows ativada."
      : "Inicialização com Windows desativada."
  };
});

createHandler("clean-temp", cleaning.cleanTemp);
createHandler("clean-prefetch", cleaning.cleanPrefetch);
createHandler("clean-recycle", cleaning.cleanRecycleBin);
createHandler("clean-dns", cleaning.cleanDns);
createHandler("clean-chrome", cleaning.cleanChrome);
createHandler("clean-edge", cleaning.cleanEdge);
createHandler("clean-discord", cleaning.cleanDiscord);
createHandler("clean-nvidia", cleaning.cleanNvidia);
createHandler("clean-amd", cleaning.cleanAmd);
createHandler("deep-clean", () => cleaning.deepClean(sendLog, sendProgress));

createHandler("clean-ram", ram.cleanRam);
createHandler("toggle-auto-ram", (enable, minutes) =>
  ram.toggleAutoRam(enable, minutes, sendLog)
);

createHandler("performance-mode", system.enablePerformanceMode);
createHandler("disable-hibernation", system.disableHibernation);
createHandler("sfc", system.runSfc);
createHandler("dism", system.runDism);
createHandler("visual-performance", system.visualPerformance);

createHandler("flush-dns", network.flushDns);
createHandler("reset-network", network.resetNetwork);

createHandler("gpu-nvidia", gpu.optimizeNvidia);
createHandler("gpu-amd", gpu.optimizeAmd);

createHandler("live-mode", () => live.prepareLive(sendLog, sendProgress));

app.whenReady().then(() => {
  createWindow();
  startMonitor();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
});

app.on("before-quit", () => {
  isQuitting = true;
  stopMonitor();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopMonitor();
  }
});