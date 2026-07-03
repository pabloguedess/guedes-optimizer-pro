import { useUser } from "../context/UserContext.jsx";

export default function Account({ notify }) {
  const { user, connectDiscord, disconnectDiscord } = useUser();

  async function handleConnectDiscord() {
    try {
      notify("Discord", "Abrindo login no navegador padrão...");
      await connectDiscord(notify);
    } catch {
      notify("Discord", "Não foi possível conectar sua conta.");
    }
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
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar Discord" />
            ) : (
              <span>G</span>
            )}
          </div>
        </div>

        <div className="accountProfileInfo">
          <span>GUEDES OPTIMIZER PRO</span>
          <h2>{user.connected ? user.username : "Discord não conectado"}</h2>
          <p>Discord ID: {user.id}</p>

          <div className="accountBadges">
            <strong>{user.plan}</strong>
            <strong>{user.license}</strong>
            <strong>Versão {user.version}</strong>
          </div>

          <div className="accountButtons">
            <button onClick={handleConnectDiscord}>
              {user.connected ? "Reconectar Discord" : "Conectar Discord"}
            </button>

            {user.connected && (
              <button className="secondaryButton" onClick={() => disconnectDiscord(notify)}>
                Desconectar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}