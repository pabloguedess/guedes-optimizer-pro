const { runCommand } = require("./utils");

async function optimizeNvidia() {
  await runCommand(
    `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f`
  );

  return {
    success: true,
    message: "Otimização NVIDIA aplicada. Reinicie o PC."
  };
}

async function optimizeAmd() {
  await runCommand(
    `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f`
  );

  return {
    success: true,
    message: "Otimização AMD aplicada. Reinicie o PC."
  };
}

module.exports = {
  optimizeNvidia,
  optimizeAmd
};