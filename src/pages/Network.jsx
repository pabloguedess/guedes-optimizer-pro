import ActionCard from "../components/ActionCard.jsx";

export default function Network({ running, runAction }) {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Rede</h1>
          <p>Correções e otimizações para conexão.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="Flush DNS" description="Limpa cache DNS da conexão." disabled={running} onClick={() => runAction("Flush DNS", window.optimizer.flushDns)} />
        <ActionCard title="Reset Rede" description="Reseta Winsock e TCP/IP. Reinicie depois." disabled={running} onClick={() => runAction("Reset Rede", window.optimizer.resetNetwork)} />
      </div>
    </section>
  );
}