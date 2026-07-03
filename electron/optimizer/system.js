const { runCommand } = require("./utils");

async function enablePerformanceMode() {
  await runCommand("powercfg -setactive SCHEME_MIN");

  return {
    success: true,
    message: "Plano de desempenho ativado."
  };
}

async function disableHibernation() {
  await runCommand("powercfg -h off");

  return {
    success: true,
    message: "Hibernação desativada."
  };
}

async function runSfc() {
  await runCommand("sfc /scannow");

  return {
    success: true,
    message: "Verificação SFC concluída."
  };
}

async function runDism() {
  await runCommand("DISM /Online /Cleanup-Image /RestoreHealth");

  return {
    success: true,
    message: "Reparo DISM concluído."
  };
}

async function visualPerformance() {
  await runCommand(
    `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f`
  );

  return {
    success: true,
    message: "Aparência configurada para máximo desempenho."
  };
}

module.exports = {
  enablePerformanceMode,
  disableHibernation,
  runSfc,
  runDism,
  visualPerformance
};