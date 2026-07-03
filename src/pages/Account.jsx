export default function Account() {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Conta</h1>
          <p>Área preparada para login, licença e key.</p>
        </div>
      </div>

      <div className="accountBox">
        <h3>Licença Premium</h3>
        <p>Status: ativa</p>
        <p>Expiração: sistema será conectado depois ao painel online.</p>
        <button>Gerenciar licença</button>
      </div>
    </section>
  );
}