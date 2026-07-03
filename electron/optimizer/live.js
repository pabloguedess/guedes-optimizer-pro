const { cleanTemp, cleanDns } = require("./cleaning");
const { cleanRam } = require("./ram");
const { enablePerformanceMode } = require("./system");

async function prepareLive(sendLog, sendProgress) {
  const steps = [
    ["Limpando Temp", cleanTemp],
    ["Limpando DNS", cleanDns],
    ["Ativando desempenho", enablePerformanceMode],
    ["Otimizando RAM", cleanRam]
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
    message: "Live Mode preparado com sucesso."
  };
}

module.exports = {
  prepareLive
};