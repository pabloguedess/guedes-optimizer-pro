import ActionCard from "../components/ActionCard.jsx";

export default function GPU({ running, runAction }) {
  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>GPU</h1>
          <p>Ajustes seguros para NVIDIA, AMD e Intel.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="NVIDIA" description="Aplica ajuste seguro de GPU no Windows." disabled={running} onClick={() => runAction("NVIDIA", window.optimizer.gpuNvidia)} />
        <ActionCard title="AMD" description="Aplica ajuste seguro de GPU no Windows." disabled={running} onClick={() => runAction("AMD", window.optimizer.gpuAmd)} />
        <ActionCard title="Curve Optimizer" description="Deve ser configurado manualmente pela BIOS." buttonText="Aviso" danger disabled={running} onClick={() => alert("Curve Optimizer precisa ser ajustado manualmente pela BIOS.")} />
      </div>
    </section>
  );
}