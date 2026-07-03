import { useEffect, useState } from "react";

const menu = [
  { id: "dashboard", label: "Dashboard" },
  { id: "optimization", label: "Otimização" },
  { id: "cleaning", label: "Limpeza" },
  { id: "system", label: "Sistema" },
  { id: "network", label: "Rede" },
  { id: "gpu", label: "GPU" },
  { id: "live", label: "Live Mode" },
  { id: "account", label: "Conta" },
  { id: "settings", label: "Configurações" }
];

const emptyDiscordUser = {
  connected: false,
  username: "Guedes",
  avatar: null
};

export default function Sidebar({ activePage, setPage }) {
  const [version, setVersion] = useState("...");
  const [discordUser, setDiscordUser] = useState(() => {
    const saved = localStorage.getItem("discordUser");
    return saved ? JSON.parse(saved) : emptyDiscordUser;
  });

  useEffect(() => {
    window.optimizer.getAppVersion().then(setVersion);

    function updateUser() {
      const saved = localStorage.getItem("discordUser");
      setDiscordUser(saved ? JSON.parse(saved) : emptyDiscordUser);
    }

    window.addEventListener("discord-user-updated", updateUser);

    return () => {
      window.removeEventListener("discord-user-updated", updateUser);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brandIcon">G</div>

          <div>
            <h2>GUEDES</h2>
            <span>Optimizer PRO</span>
          </div>
        </div>

        <nav className="menuList">
          {menu.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? "menuButton active" : "menuButton"}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="licenseBox profileLicenseBox">
        <div className="profileAvatarRing">
          <div className="profileAvatar">
            {discordUser.avatar ? (
              <img src={discordUser.avatar} alt="Avatar Discord" />
            ) : (
              "G"
            )}
          </div>
        </div>

        <div className="profileInfo">
          <span>{discordUser.username}</span>
          <strong>Premium</strong>
          <small>Licença ativa</small>
          <small>Versão {version}</small>
        </div>
      </div>
    </aside>
  );
}