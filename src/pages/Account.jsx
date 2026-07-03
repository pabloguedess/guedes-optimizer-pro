import { useEffect, useState } from "react";

const emptyDiscordUser = {
  connected: false,
  username: "Discord não conectado",
  id: "Aguardando conexão",
  avatar: null
};

export default function Account({ notify }) {
  const [version, setVersion] = useState("...");
  const [discordUser, setDiscordUser] = useState(() => {
    const saved = localStorage.getItem("discordUser");
    return saved ? JSON.parse(saved) : emptyDiscordUser;
  });

  useEffect(() => {
    window.optimizer.getAppVersion().then(setVersion);
  }, []);

  async function connectDiscord() {
    try {
      notify("Discord", "Abrindo login no navegador padrão...");

      const user = await window.optimizer.connectDiscord();

      localStorage.setItem("discordUser", JSON.stringify(user));
      window.dispatchEvent(new Event("discord-user-updated"));

      setDiscordUser(user);
      notify("Discord conectado", `Bem-vindo, ${user.username}.`);
    } catch {
      notify("Discord", "Não foi possível conectar sua conta.");
    }
  }

  function disconnectDiscord() {
    localStorage.removeItem("discordUser");
    window.dispatchEvent(new Event("discord-user-updated"));

    setDiscordUser(emptyDiscordUser);
    notify("Discord", "Conta desconectada.");
  }

  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Conta</h1>
          <p>Gerencie seu perfil, plano e licença.</p>
        </div>
      </div>

      <div className="accountPremiumCard">
        <div className="accountAvatarRing">
          <div className="accountAvatar">
            {discordUser.avatar ? (
              <img src={discordUser.avatar} alt="Avatar Discord" />
            ) : (
              <span>G</span>
            )}
          </div>
        </div>

        <div className="accountProfileInfo">
          <span>GUEDES OPTIMIZER PRO</span>
          <h2>{discordUser.username}</h2>
          <p>Discord ID: {discordUser.id}</p>

          <div className="accountBadges">
            <strong>Premium</strong>
            <strong>Licença ativa</strong>
            <strong>Versão {version}</strong>
          </div>

          <div className="accountButtons">
            <button onClick={connectDiscord}>
              {discordUser.connected ? "Reconectar Discord" : "Conectar Discord"}
            </button>

            {discordUser.connected && (
              <button className="secondaryButton" onClick={disconnectDiscord}>
                Desconectar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}