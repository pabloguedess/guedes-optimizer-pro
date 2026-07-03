const { runCommand } = require("./utils");

let autoRamTimer = null;

async function cleanRam() {
  await runCommand(
    `powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Process | ForEach-Object { try { $_.MinWorkingSet = $_.MinWorkingSet } catch {} }"`
  );

  return {
    success: true,
    message: "Memória RAM otimizada com sucesso."
  };
}

async function toggleAutoRam(enable, minutes, sendLog) {
  if (autoRamTimer) {
    clearInterval(autoRamTimer);
    autoRamTimer = null;
  }

  if (!enable) {
    return {
      success: true,
      message: "Auto RAM desativado."
    };
  }

  const interval = Math.max(1, Number(minutes) || 5) * 60 * 1000;

  await cleanRam();

  autoRamTimer = setInterval(async () => {
    sendLog("Auto RAM: executando limpeza automática.");
    await cleanRam();
    sendLog("Auto RAM: limpeza concluída.");
  }, interval);

  return {
    success: true,
    message: `Auto RAM ativado a cada ${minutes} minuto(s).`
  };
}

module.exports = {
  cleanRam,
  toggleAutoRam
};