const { shell } = require("electron");
const http = require("http");

const CLIENT_ID = "1522672778652680294";
const PORT = 48732;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

function connectDiscord() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith("/callback")) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
          <html>
            <body style="background:#0b0b0b;color:white;font-family:Arial;display:flex;align-items:center;justify-content:center;height:100vh;">
              <div>
                <h2>Conectando Discord...</h2>
                <p>Você já pode voltar para o Guedes Optimizer PRO.</p>
              </div>

              <script>
                const hash = window.location.hash.replace("#", "");
                const params = new URLSearchParams(hash);
                const token = params.get("access_token");

                fetch("/token", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token })
                });
              </script>
            </body>
          </html>
        `);
      }

      if (req.url === "/token" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", async () => {
          try {
            const { token } = JSON.parse(body);

            if (!token) {
              throw new Error("Token não recebido.");
            }

            const response = await fetch("https://discord.com/api/users/@me", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const user = await response.json();

            const avatar = user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
              : null;

            resolve({
              connected: true,
              id: user.id,
              username: user.global_name || user.username,
              avatar
            });

            res.writeHead(200);
            res.end("OK");

            setTimeout(() => server.close(), 800);
          } catch (error) {
            reject(error);
            res.writeHead(500);
            res.end("ERROR");
            server.close();
          }
        });
      }
    });

    server.listen(PORT, () => {
      const authUrl =
        `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=token&scope=identify`;

      shell.openExternal(authUrl);
    });

    setTimeout(() => {
      try {
        server.close();
      } catch {}
    }, 120000);
  });
}

module.exports = { connectDiscord };