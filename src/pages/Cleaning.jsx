import ActionCard from "../components/ActionCard.jsx";

export default function Cleaning({ running, runAction }) {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Limpeza</h1>
          <p>Escolha exatamente o que deseja limpar.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="%TEMP%" description="Limpa AppData/Local/Temp e Windows Temp." disabled={running} onClick={() => runAction("Temp", window.optimizer.cleanTemp)} />
        <ActionCard title="Prefetch" description="Remove cache antigo de inicialização." disabled={running} onClick={() => runAction("Prefetch", window.optimizer.cleanPrefetch)} />
        <ActionCard title="Lixeira" description="Esvazia a lixeira do Windows." disabled={running} onClick={() => runAction("Lixeira", window.optimizer.cleanRecycle)} />
        <ActionCard title="DNS" description="Limpa o cache DNS da conexão." disabled={running} onClick={() => runAction("DNS", window.optimizer.cleanDns)} />
        <ActionCard title="Chrome" description="Limpa cache, code cache e GPU cache." disabled={running} onClick={() => runAction("Chrome", window.optimizer.cleanChrome)} />
        <ActionCard title="Edge" description="Limpa cache, code cache e GPU cache." disabled={running} onClick={() => runAction("Edge", window.optimizer.cleanEdge)} />
        <ActionCard title="Discord" description="Limpa cache, code cache e GPU cache." disabled={running} onClick={() => runAction("Discord", window.optimizer.cleanDiscord)} />
        <ActionCard title="NVIDIA Cache" description="Limpa caches gráficos da NVIDIA." disabled={running} onClick={() => runAction("NVIDIA", window.optimizer.cleanNvidia)} />
        <ActionCard title="AMD Cache" description="Limpa caches gráficos da AMD." disabled={running} onClick={() => runAction("AMD", window.optimizer.cleanAmd)} />
        <ActionCard title="Limpeza Profunda" description="Executa as principais limpezas em sequência." buttonText="Executar Tudo" disabled={running} onClick={() => runAction("Limpeza Profunda", window.optimizer.deepClean)} />
      </div>
    </section>
  );
}