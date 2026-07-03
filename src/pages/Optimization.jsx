import { useState } from "react";
import ActionCard from "../components/ActionCard.jsx";

export default function Optimization({ running, runAction, toggleAutoRam, autoRam }) {
  const [minutes, setMinutes] = useState("5");

  return (
    <section>
      <div className="pageHeader">
        <div>
          <h1>Otimização</h1>
          <p>Modos rápidos para melhorar o desempenho do PC.</p>
        </div>
      </div>

      <div className="actionsGrid">
        <ActionCard title="Modo Desempenho" description="Ativa o plano de energia focado em performance." disabled={running} onClick={() => runAction("Modo Desempenho", window.optimizer.performanceMode)} />

        <ActionCard title="Limpar RAM" description="Executa limpeza rápida da memória RAM." disabled={running} onClick={() => runAction("Limpar RAM", window.optimizer.cleanRam)} />

        <div className="actionCard">
          <h3>Auto RAM</h3>
          <p>Executa limpeza automática de RAM no intervalo escolhido.</p>

          <select className="selectInput" value={minutes} onChange={(e) => setMinutes(e.target.value)}>
            <option value="1">A cada 1 minuto</option>
            <option value="5">A cada 5 minutos</option>
            <option value="10">A cada 10 minutos</option>
            <option value="15">A cada 15 minutos</option>
          </select>

          <button disabled={running} onClick={() => toggleAutoRam(minutes)}>
            {autoRam ? "Desativar Auto RAM" : "Ativar Auto RAM"}
          </button>
        </div>

        <ActionCard title="Desativar Hibernação" description="Libera espaço em disco e desativa hibernação." disabled={running} onClick={() => runAction("Desativar Hibernação", window.optimizer.disableHibernation)} />

        <ActionCard title="Aparência Desempenho" description="Reduz efeitos visuais para priorizar desempenho." disabled={running} onClick={() => runAction("Aparência", window.optimizer.visualPerformance)} />
      </div>
    </section>
  );
}