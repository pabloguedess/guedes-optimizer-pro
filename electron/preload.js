const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("optimizer", {
  minimizar: () => ipcRenderer.invoke("window-minimize"),
  fechar: () => ipcRenderer.invoke("window-close"),
  maximizar: () => ipcRenderer.invoke("window-maximize"),

  setStartup: (enable) => ipcRenderer.invoke("set-startup", enable),
  setMonitorActive: (active) => ipcRenderer.invoke("set-monitor-active", active),

  cleanTemp: () => ipcRenderer.invoke("clean-temp"),
  cleanPrefetch: () => ipcRenderer.invoke("clean-prefetch"),
  cleanRecycle: () => ipcRenderer.invoke("clean-recycle"),
  cleanDns: () => ipcRenderer.invoke("clean-dns"),
  cleanChrome: () => ipcRenderer.invoke("clean-chrome"),
  cleanEdge: () => ipcRenderer.invoke("clean-edge"),
  cleanDiscord: () => ipcRenderer.invoke("clean-discord"),
  cleanNvidia: () => ipcRenderer.invoke("clean-nvidia"),
  cleanAmd: () => ipcRenderer.invoke("clean-amd"),
  deepClean: () => ipcRenderer.invoke("deep-clean"),

installUpdateNow: () => ipcRenderer.invoke("install-update-now"),

onUpdateStatus: (callback) =>
  ipcRenderer.on("update-status", (_, data) => callback(data)),


  cleanRam: () => ipcRenderer.invoke("clean-ram"),
  toggleAutoRam: (enable, minutes) =>
    ipcRenderer.invoke("toggle-auto-ram", enable, minutes),

  performanceMode: () => ipcRenderer.invoke("performance-mode"),
  disableHibernation: () => ipcRenderer.invoke("disable-hibernation"),
  sfc: () => ipcRenderer.invoke("sfc"),
  dism: () => ipcRenderer.invoke("dism"),
  visualPerformance: () => ipcRenderer.invoke("visual-performance"),

  flushDns: () => ipcRenderer.invoke("flush-dns"),
  resetNetwork: () => ipcRenderer.invoke("reset-network"),

  gpuNvidia: () => ipcRenderer.invoke("gpu-nvidia"),
  gpuAmd: () => ipcRenderer.invoke("gpu-amd"),

  liveMode: () => ipcRenderer.invoke("live-mode"),

  onLog: (callback) => ipcRenderer.on("app-log", (_, value) => callback(value)),
  onProgress: (callback) =>
    ipcRenderer.on("app-progress", (_, value) => callback(value)),
  onSystemInfo: (callback) =>
    ipcRenderer.on("system-info", (_, data) => callback(data)),

  onUpdateMessage: (callback) =>
    ipcRenderer.on("update-message", (_, message) => callback(message)),
  onUpdateProgress: (callback) =>
    ipcRenderer.on("update-progress", (_, progress) => callback(progress))
});