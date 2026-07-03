const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, { windowsHide: true }, (error) => {
      resolve({
        success: !error,
        message: error ? "Erro. Tente abrir como administrador." : "Executado com sucesso."
      });
    });
  });
}

function cleanFolder(folderPath) {
  let removed = 0;

  try {
    if (!folderPath || !fs.existsSync(folderPath)) {
      return removed;
    }

    const items = fs.readdirSync(folderPath);

    for (const item of items) {
      try {
        fs.rmSync(path.join(folderPath, item), {
          recursive: true,
          force: true
        });

        removed++;
      } catch {}
    }
  } catch {}

  return removed;
}

function getLocalAppDataPath(...paths) {
  return path.join(process.env.LOCALAPPDATA || "", ...paths);
}

function getAppDataPath(...paths) {
  return path.join(process.env.APPDATA || "", ...paths);
}

module.exports = {
  runCommand,
  cleanFolder,
  getLocalAppDataPath,
  getAppDataPath
};