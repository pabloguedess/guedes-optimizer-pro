import { useEffect, useState } from "react";
import ActionCard from "../components/ActionCard.jsx";
import GaugeCard from "../components/GaugeCard.jsx";
import LineChartCard from "../components/LineChartCard.jsx";
import { useUser } from "../context/UserContext.jsx";

function formatBytes(bytes) {
  if (!bytes) return "--";
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatSpeed(bytes) {
  if (!bytes) return "0 KB/s";
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB/s`;
  return `${(bytes / 1024).toFixed(0)} KB/s`;
}

function formatUptime(seconds) {
  if (!seconds) return "--";
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);
  return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
}

export default function Dashboard({ running, runAction, systemInfo }) {

const [selectedDiskMount, setSelectedDiskMount] = useState(() => {
  return localStorage.getItem("selectedDiskMount") || "C:";
});

useEffect(() => {
  function updateSelectedDisk() {
    setSelectedDiskMount(localStorage.getItem("selectedDiskMount") || "C:");
  }

  window.addEventListener("selected-disk-updated", updateSelectedDisk);

  return () => {
    window.removeEventListener("selected-disk-updated", updateSelectedDisk);
  };
}, []);


  const { user } = useUser();

  const cpu = systemInfo?.cpu;
  const ram = systemInfo?.ram;
  const gpu = systemInfo?.gpu;
  const disks = systemInfo?.disks || [];

const disk =
  disks.find((item) => item.mount === selectedDiskMount) ||
  disks.find((item) => item.mount?.startsWith(selectedDiskMount)) ||
  disks[0];
  const windows = systemInfo?.windows;
  const network = systemInfo?.network;

  return (
    <section className="premiumDashboard dashboardV3">
      <div className="dashboardHeroV3">
        <div>
          <span>GUEDES OPTIMIZER PRO</span>
          <h1>Olá, {user.connected ? user.username : "Pablo"} 👋</h1>
          <p>
            {systemInfo
              ? `${systemInfo.hostname} • Ligado há ${formatUptime(systemInfo.uptime)}  `
              : "Carregando informações do computador..."}
          </p>
        </div>

        <div className="dashboardHeroBadge">
          <strong>{user.plan}</strong>
          <small>{user.license}</small>
        </div>
      </div>

      <div className="dashboardStatusGrid">
        <div className="statusMiniCard">
          <span>Windows</span>
          <strong>{windows ? `${windows.distro}` : "--"}</strong>
          <small>{windows ? `Build ${windows.build}` : "Monitorando..."}</small>
        </div>

        <div className="statusMiniCard">
          <span>CPU</span>
          <strong>{cpu?.usage ? `${cpu.usage}%` : "--%"}</strong>
          <small>{cpu?.brand || "Monitorando..."}</small>
        </div>

        <div className="statusMiniCard">
          <span>GPU</span>
          <strong>{gpu?.usage !== undefined ? `${gpu.usage}%` : "--%"}</strong>
          <small>{gpu?.model || "Monitorando..."}</small>
        </div>

        <div className="statusMiniCard">
          <span>Internet</span>
          <strong>{formatSpeed(network?.rx)}</strong>
          <small>Download atual</small>
        </div>
      </div>

      <div className="gaugesGrid">
        <GaugeCard
          title="CPU"
          value={cpu?.usage || 0}
          subtitle={cpu ? `${cpu.cores} núcleos • ${cpu.threads} threads` : "Monitorando..."}
        />

        <GaugeCard
          title="RAM"
          value={ram?.percent || 0}
          subtitle={ram ? `${formatBytes(ram.used)} / ${formatBytes(ram.total)}` : "Monitorando..."}
        />

        <GaugeCard
          title="Disco"
          value={disk?.percent || 0}
          subtitle={disk ? disk.fs : "Monitorando..."}
        />

        <GaugeCard
          title="GPU"
          value={gpu?.usage || 0}
          subtitle={gpu ? `${gpu.temperature ? gpu.temperature + "°C • " : ""}VRAM ${gpu.vram || "--"} MB` : "Monitorando..."}
        />
      </div>

      <div className="chartsGrid premiumCharts">
        <LineChartCard title="CPU em tempo real" data={systemInfo?.history?.cpu || []} />
        <LineChartCard title="RAM em tempo real" data={systemInfo?.history?.ram || []} />
        <LineChartCard title="Download" data={systemInfo?.history?.download || []} suffix=" MB/s" />
        <LineChartCard title="GPU em tempo real" data={systemInfo?.history?.gpu || []} />
      </div>

      <div className="ultraOptimizeCard">
        <div>
          <span>OTIMIZAÇÃO INTELIGENTE</span>
          <h2>Ultra Optimize</h2>
          <p>
            Executa uma sequência segura de limpeza, RAM, DNS e modo desempenho para preparar o PC para jogos e lives.
          </p>
        </div>

        <button
          disabled={running}
          onClick={() => runAction("Ultra Optimize", window.optimizer.liveMode)}
        >
          {running ? "Executando..." : "Ativar Ultra Optimize"}
        </button>
      </div>

      <div className="actionsGrid">
        <ActionCard
          title="Limpeza Premium"
          description="Executa limpeza geral em caches, temporários, DNS e lixeira."
          disabled={running}
          onClick={() => runAction("Limpeza Premium", window.optimizer.deepClean)}
        />

        <ActionCard
          title="Live Mode"
          description="Prepara o PC para TikTok Live Studio, OBS, Discord e jogos."
          disabled={running}
          onClick={() => runAction("Live Mode", window.optimizer.liveMode)}
        />

        <ActionCard
          title="Limpar RAM"
          description="Otimiza a memória RAM rapidamente."
          disabled={running}
          onClick={() => runAction("Limpar RAM", window.optimizer.cleanRam)}
        />
      </div>
    </section>
  );
}