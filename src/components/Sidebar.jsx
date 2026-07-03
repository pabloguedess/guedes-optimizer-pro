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

export default function Sidebar({ activePage, setPage }) {
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

      <div className="licenseBox">
        <span>Plano</span>
        <strong>Premium</strong>
        <small>Licença ativa</small>
      </div>
    </aside>
  );
}