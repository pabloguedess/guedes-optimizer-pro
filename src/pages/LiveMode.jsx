import ActionCard from "../components/ActionCard.jsx";

export default function LiveMode({ running, runAction }) {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Live Mode</h1>
          <p>Preparação rápida para stream e jogos.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="Preparar Live" description="Limpa, otimiza RAM e ativa desempenho." disabled={running} onClick={() => runAction("Live Mode", window.optimizer.liveMode)} />
        <ActionCard title="Limpeza Premium" description="Executa limpeza geral antes da transmissão." disabled={running} onClick={() => runAction("Limpeza Premium", window.optimizer.deepClean)} />
        <ActionCard title="Limpar RAM" description="Otimiza a RAM antes da live." disabled={running} onClick={() => runAction("Limpar RAM", window.optimizer.cleanRam)} />
      </div>
    </section>
  );
}