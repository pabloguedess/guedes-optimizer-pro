const { runCommand } = require("./utils");

async function flushDns() {
  await runCommand("ipconfig /flushdns");

  return {
    success: true,
    message: "DNS limpo com sucesso."
  };
}

async function resetNetwork() {
  await runCommand("ipconfig /flushdns");
  await runCommand("netsh winsock reset");
  await runCommand("netsh int ip reset");

  return {
    success: true,
    message: "Rede resetada. Reinicie o PC para aplicar tudo."
  };
}

module.exports = {
  flushDns,
  resetNetwork
};