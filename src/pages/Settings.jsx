export default function Settings({
  accentColor,
  setAccentColor,
  rgbMode,
  setRgbMode,
  isPremium,
  notify
}) {
  async function toggleStartup(enable) {
    const result = await window.optimizer.setStartup(enable);
    notify("Configurações", result.message);
  }

  function toggleRgb() {
    if (!isPremium) {
      notify("Premium", "Modo RGB disponível apenas para usuários Premium.");
      return;
    }

    const next = !rgbMode;
    setRgbMode(next);

    notify(
      "Modo RGB Premium",
      next ? "RGB Premium ativado." : "RGB Premium desativado."
    );
  }

  function changeColor(color) {
    setRgbMode(false);
    setAccentColor(color);
    notify("Tema", "Cor principal alterada.");
  }

  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Configurações</h1>
          <p>Personalize o Guedes Optimizer PRO.</p>
        </div>
      </div>

      <div className="settingsGrid">
        <div className="settingsCard premiumCard">
          <h3>Modo RGB Premium</h3>
          <p>Ativa um efeito RGB automático em toda a interface do aplicativo.</p>

          <button onClick={toggleRgb}>
            {rgbMode ? "Desativar RGB" : "Ativar RGB"}
          </button>

          <small className="premiumTag">
            {isPremium ? "Premium ativo" : "Requer Premium"}
          </small>
        </div>

        <div className="settingsCard">
          <h3>Cor principal</h3>
          <p>Escolha a cor fixa do tema do aplicativo.</p>

          <div className="colorOptions">
            <button
              className={accentColor === "#00ff66" ? "selected" : ""}
              style={{ background: "#00ff66" }}
              onClick={() => changeColor("#00ff66")}
            />

            <button
              className={accentColor === "#008cff" ? "selected" : ""}
              style={{ background: "#008cff" }}
              onClick={() => changeColor("#008cff")}
            />

            <button
              className={accentColor === "#a855f7" ? "selected" : ""}
              style={{ background: "#a855f7" }}
              onClick={() => changeColor("#a855f7")}
            />

            <button
              className={accentColor === "#ff003c" ? "selected" : ""}
              style={{ background: "#ff003c" }}
              onClick={() => changeColor("#ff003c")}
            />

            <button
              className={accentColor === "#ff9500" ? "selected" : ""}
              style={{ background: "#ff9500" }}
              onClick={() => changeColor("#ff9500")}
            />
          </div>
        </div>

        <div className="settingsCard">
          <h3>Iniciar com Windows</h3>
          <p>Faz o aplicativo iniciar automaticamente com o sistema.</p>

          <div className="settingsButtons">
            <button onClick={() => toggleStartup(true)}>Ativar</button>
            <button onClick={() => toggleStartup(false)}>Desativar</button>
          </div>
        </div>

        <div className="settingsCard">
          <h3>Administrador</h3>
          <p>Algumas funções precisam do aplicativo aberto como administrador.</p>

          <button
            onClick={() =>
              notify(
                "Administrador",
                "Clique com o botão direito no app e escolha Executar como administrador."
              )
            }
          >
            Ver orientação
          </button>
        </div>

        <div className="settingsCard">
          <h3>Auto RAM</h3>
          <p>Em breve: iniciar o Auto RAM automaticamente ao abrir o programa.</p>

          <button
            onClick={() =>
              notify("Auto RAM", "Essa opção será conectada na próxima atualização.")
            }
          >
            Em breve
          </button>
        </div>

        <div className="settingsCard">
          <h3>Atualizações</h3>
          <p>As atualizações são verificadas automaticamente ao abrir o aplicativo.</p>

          <button
            onClick={() =>
              notify("Atualizações", "O app verifica atualizações automaticamente ao abrir.")
            }
          >
            Automático
          </button>
        </div>

<div className="settingsCard">
  <h3>Disco monitorado</h3>
  <p>Escolha qual disco local será exibido no Dashboard.</p>

  <select
    className="selectInput"
    defaultValue={localStorage.getItem("selectedDiskMount") || "C:"}
    onChange={(e) => {
  localStorage.setItem("selectedDiskMount", e.target.value);
  window.dispatchEvent(new Event("selected-disk-updated"));
  notify("Disco monitorado", `Agora o Dashboard exibirá o disco ${e.target.value}`);
}}
  >
    <option value="C:">Disco C:</option>
    <option value="D:">Disco D:</option>
    <option value="E:">Disco E:</option>
    <option value="F:">Disco F:</option>
  </select>
</div>

      </div>
    </section>
  );
}