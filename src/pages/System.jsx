import ActionCard from "../components/ActionCard.jsx";

export default function System({ running, runAction }) {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Sistema</h1>
          <p>Ferramentas para manutenção e estabilidade do Windows.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="SFC" description="Verifica arquivos corrompidos do Windows." disabled={running} onClick={() => runAction("SFC", window.optimizer.sfc)} />
        <ActionCard title="DISM" description="Repara a imagem do Windows." disabled={running} onClick={() => runAction("DISM", window.optimizer.dism)} />
        <ActionCard title="Aparência" description="Configura efeitos visuais para máximo desempenho." disabled={running} onClick={() => runAction("Aparência", window.optimizer.visualPerformance)} />
        <ActionCard title="Desativar Hibernação" description="Libera espaço em disco." disabled={running} onClick={() => runAction("Hibernação", window.optimizer.disableHibernation)} />
      </div>
    </section>
  );
}