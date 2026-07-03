import { useUser } from "../context/UserContext.jsx";

const menu = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "optimization", icon: "🚀", label: "Otimização" },
  { id: "cleaning", icon: "🧹", label: "Limpeza" },
  { id: "system", icon: "🖥️", label: "Sistema" },
  { id: "network", icon: "🌐", label: "Rede" },
  { id: "gpu", icon: "🎮", label: "GPU" },
  { id: "live", icon: "🔴", label: "Live Mode" },
  { id: "account", icon: "👤", label: "Conta" },
  { id: "settings", icon: "⚙️", label: "Configurações" }
];

export default function Sidebar({ activePage, setPage }) {
  const { user } = useUser();

  return (
    <aside className="sidebar sidebarPremium">
      <div>
        <div className="sidebarProfile">
          <div className="profileAvatarRing bigAvatarRing">
            <div className="profileAvatar bigAvatar">
              {user.avatar ? <img src={user.avatar} alt="Avatar Discord" /> : "G"}
            </div>
          </div>

          <h2>{user.connected ? user.username : "Guedes"}</h2>
          <p>{user.plan} • {user.license}</p>
          
        </div>

        <nav className="menuList premiumMenuList">
          {menu.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? "menuButton active premiumMenuButton" : "menuButton premiumMenuButton"}
              onClick={() => setPage(item.id)}
            >
              <span className="menuIcon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebarFooter">
        <strong>GUEDES</strong>

        <small>Optimizer PRO</small>

        <div className="footerDivider" ></div>

        <span className="sidebarVersion">
          v{user.version}

          </span> 
      </div>
    </aside>
  );
}