const {
  runCommand,
  cleanFolder,
  getLocalAppDataPath,
  getAppDataPath
} = require("./utils");

async function cleanTemp() {
  const removedUser = cleanFolder(getLocalAppDataPath("Temp"));
  const removedWindows = cleanFolder("C:\\Windows\\Temp");

  return {
    success: true,
    message: `Temp limpo com sucesso. Itens removidos: ${removedUser + removedWindows}`
  };
}

async function cleanPrefetch() {
  const removed = cleanFolder("C:\\Windows\\Prefetch");

  return {
    success: true,
    message: `Prefetch limpo com sucesso. Itens removidos: ${removed}`
  };
}

async function cleanRecycleBin() {
  await runCommand(
    `powershell -NoProfile -ExecutionPolicy Bypass -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"`
  );

  return {
    success: true,
    message: "Lixeira limpa com sucesso."
  };
}

async function cleanDns() {
  await runCommand("ipconfig /flushdns");

  return {
    success: true,
    message: "Cache DNS limpo com sucesso."
  };
}

async function cleanChrome() {
  const total =
    cleanFolder(getLocalAppDataPath("Google", "Chrome", "User Data", "Default", "Cache")) +
    cleanFolder(getLocalAppDataPath("Google", "Chrome", "User Data", "Default", "Code Cache")) +
    cleanFolder(getLocalAppDataPath("Google", "Chrome", "User Data", "Default", "GPUCache"));

  return {
    success: true,
    message: `Cache do Chrome limpo. Itens removidos: ${total}`
  };
}

async function cleanEdge() {
  const total =
    cleanFolder(getLocalAppDataPath("Microsoft", "Edge", "User Data", "Default", "Cache")) +
    cleanFolder(getLocalAppDataPath("Microsoft", "Edge", "User Data", "Default", "Code Cache")) +
    cleanFolder(getLocalAppDataPath("Microsoft", "Edge", "User Data", "Default", "GPUCache"));

  return {
    success: true,
    message: `Cache do Edge limpo. Itens removidos: ${total}`
  };
}

async function cleanDiscord() {
  const total =
    cleanFolder(getAppDataPath("discord", "Cache")) +
    cleanFolder(getAppDataPath("discord", "Code Cache")) +
    cleanFolder(getAppDataPath("discord", "GPUCache"));

  return {
    success: true,
    message: `Cache do Discord limpo. Itens removidos: ${total}`
  };
}

async function cleanNvidia() {
  const total =
    cleanFolder("C:\\ProgramData\\NVIDIA Corporation\\NV_Cache") +
    cleanFolder(getLocalAppDataPath("NVIDIA", "DXCache")) +
    cleanFolder(getLocalAppDataPath("NVIDIA", "GLCache"));

  return {
    success: true,
    message: `Cache NVIDIA limpo. Itens removidos: ${total}`
  };
}

async function cleanAmd() {
  const total =
    cleanFolder(getLocalAppDataPath("AMD", "DxCache")) +
    cleanFolder(getLocalAppDataPath("AMD", "GLCache"));

  return {
    success: true,
    message: `Cache AMD limpo. Itens removidos: ${total}`
  };
}

async function deepClean(sendLog, sendProgress) {
  const steps = [
    ["Limpando Temp", cleanTemp],
    ["Limpando Prefetch", cleanPrefetch],
    ["Limpando DNS", cleanDns],
    ["Limpando Chrome", cleanChrome],
    ["Limpando Edge", cleanEdge],
    ["Limpando Discord", cleanDiscord],
    ["Limpando NVIDIA", cleanNvidia],
    ["Limpando AMD", cleanAmd],
    ["Limpando Lixeira", cleanRecycleBin]
  ];

  for (let i = 0; i < steps.length; i++) {
    const [name, action] = steps[i];

    sendLog(`Executando: ${name}`);
    await action();
    sendLog(`Concluído: ${name}`);

    sendProgress(Math.round(((i + 1) / steps.length) * 100));
  }

  return {
    success: true,
    message: "Limpeza profunda concluída com sucesso."
  };
}

module.exports = {
  cleanTemp,
  cleanPrefetch,
  cleanRecycleBin,
  cleanDns,
  cleanChrome,
  cleanEdge,
  cleanDiscord,
  cleanNvidia,
  cleanAmd,
  deepClean
};