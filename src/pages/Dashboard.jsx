import ActionCard from "../components/ActionCard.jsx";
import GaugeCard from "../components/GaugeCard.jsx";
import LineChartCard from "../components/LineChartCard.jsx";

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
  const cpu = systemInfo?.cpu;
  const ram = systemInfo?.ram;
  const gpu = systemInfo?.gpu;
  const disk = systemInfo?.disk;
  const windows = systemInfo?.windows;
  const network = systemInfo?.network;

  return (
    <section className="premiumDashboard">
      <div className="premiumHero">
        <div>
          <span>GUEDES OPTIMIZER PRO</span>
          <h1>Dashboard Gamer</h1>
          <p>
            {systemInfo
              ? `${systemInfo.hostname} • ${systemInfo.username} • Ligado há ${formatUptime(systemInfo.uptime)}`
              : "Carregando dados do sistema..."}
          </p>
        </div>

        
      </div>

      <div className="hardwareStrip">
        <div>
          <span>Windows</span>
          <strong>{windows ? `${windows.distro} ${windows.version}` : "--"}</strong>
        </div>

        <div>
          <span>CPU</span>
          <strong>{cpu?.brand || "--"}</strong>
        </div>

        <div>
          <span>GPU</span>
          <strong>{gpu?.model || "--"}</strong>
        </div>

        <div>
          <span>Disco</span>
          <strong>{disk ? `${formatBytes(disk.used)} / ${formatBytes(disk.size)}` : "--"}</strong>
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
  subtitle={
    gpu
      ? `${gpu.vendor} • ${gpu.temperature ? gpu.temperature + "°C • " : ""}VRAM ${gpu.vram || "--"} MB`
      : "Monitorando..."
  }
/>
      </div>

      <div className="chartsGrid premiumCharts">
        <LineChartCard title="CPU em tempo real" data={systemInfo?.history?.cpu || []} />
        <LineChartCard title="RAM em tempo real" data={systemInfo?.history?.ram || []} />
        <LineChartCard title="Download" data={systemInfo?.history?.download || []} suffix=" MB/s" />
        <LineChartCard title="Upload" data={systemInfo?.history?.upload || []} suffix=" MB/s" />
      </div>

      <div className="networkStrip">
        <div>
          <span>Download atual</span>
          <strong>{formatSpeed(network?.rx)}</strong>
        </div>

        <div>
          <span>Upload atual</span>
          <strong>{formatSpeed(network?.tx)}</strong>
        </div>

        <div>
          <span>VRAM</span>
          <strong>{gpu?.vram ? `${gpu.vram} MB` : "--"}</strong>
        </div>
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