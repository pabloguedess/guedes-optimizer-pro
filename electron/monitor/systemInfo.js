const si = require("systeminformation");
const os = require("os");
const { exec } = require("child_process");

const history = {
  cpu: [],
  ram: [],
  download: [],
  upload: [],
  gpu: []
};

function pushHistory(key, value) {
  history[key].push(value);
  if (history[key].length > 40) history[key].shift();
}

function getNvidiaUsage() {
  return new Promise((resolve) => {
    exec(
      'nvidia-smi --query-gpu=utilization.gpu,temperature.gpu --format=csv,noheader,nounits',
      { windowsHide: true },
      (error, stdout) => {
        if (error || !stdout) {
          resolve({ usage: 0, temp: null });
          return;
        }

        const [usage, temp] = stdout.trim().split(",").map(v => Number(v.trim()));
        resolve({
          usage: Number.isFinite(usage) ? usage : 0,
          temp: Number.isFinite(temp) ? temp : null
        });
      }
    );
  });
}

async function getSystemInfo() {
  const cpuLoad = await si.currentLoad();
  const mem = await si.mem();
  const graphics = await si.graphics();
  const disks = await si.fsSize();
  const osInfo = await si.osInfo();
  const system = await si.system();
  const cpuInfo = await si.cpu();
  const network = await si.networkStats();

  const controller = graphics.controllers?.[0] || null;

  let gpuUsage = 0;
  let gpuTemp = null;

  if (controller) {
    gpuUsage =
      controller.utilizationGpu ||
      controller.utilizationGPU ||
      controller.load ||
      0;

    gpuTemp =
      controller.temperatureGpu ||
      controller.temperatureGPU ||
      controller.temp ||
      null;
  }

  if (controller?.vendor?.toLowerCase().includes("nvidia") || controller?.model?.toLowerCase().includes("nvidia")) {
    const nvidia = await getNvidiaUsage();
    gpuUsage = nvidia.usage;
    gpuTemp = nvidia.temp;
  }

  const cpuUsage = Number(cpuLoad.currentLoad.toFixed(1));
  const ramPercent = Number(((mem.used / mem.total) * 100).toFixed(1));

  const rx = network.length ? network[0].rx_sec || 0 : 0;
  const tx = network.length ? network[0].tx_sec || 0 : 0;

  const rxMb = Number((rx / 1024 / 1024).toFixed(2));
  const txMb = Number((tx / 1024 / 1024).toFixed(2));

  pushHistory("cpu", cpuUsage);
  pushHistory("ram", ramPercent);
  pushHistory("download", rxMb);
  pushHistory("upload", txMb);
  pushHistory("gpu", gpuUsage);

  return {
    cpu: {
      usage: cpuUsage,
      cores: cpuInfo.physicalCores,
      threads: cpuInfo.cores,
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      speed: cpuInfo.speed
    },

    ram: {
      total: mem.total,
      used: mem.used,
      free: mem.available,
      percent: ramPercent
    },

    gpu: controller
      ? {
          model: controller.model,
          vendor: controller.vendor,
          vram: controller.vram || 0,
          usage: gpuUsage,
          temperature: gpuTemp
        }
      : null,

    disk: disks.length
      ? {
          fs: disks[0].fs,
          size: disks[0].size,
          used: disks[0].used,
          percent: Number(disks[0].use.toFixed(1))
        }
      : null,

    windows: {
      platform: osInfo.platform,
      distro: osInfo.distro,
      version: osInfo.release,
      build: osInfo.build
    },

    system: {
      manufacturer: system.manufacturer,
      model: system.model
    },

    hostname: os.hostname(),
    username: os.userInfo().username,
    uptime: os.uptime(),

    network: {
      rx,
      tx
    },

    history
  };
}

module.exports = {
  getSystemInfo
};