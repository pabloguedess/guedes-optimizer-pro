import { useCallback, useEffect, useMemo, useState } from "react";
import TitleBar from "./components/TitleBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StatusPanel from "./components/StatusPanel.jsx";
import UpdateBanner from "./components/UpdateBanner.jsx";
import NotificationToast from "./components/NotificationToast.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Optimization from "./pages/Optimization.jsx";
import Cleaning from "./pages/Cleaning.jsx";
import System from "./pages/System.jsx";
import Network from "./pages/Network.jsx";
import GPU from "./pages/GPU.jsx";
import LiveMode from "./pages/LiveMode.jsx";
import Account from "./pages/Account.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [status, setStatus] = useState("Aguardando...");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [autoRam, setAutoRam] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [accentColor, setAccentColor] = useState("#00ff66");
  const [rgbMode, setRgbMode] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const isPremium = true;

  const notify = useCallback((title, message) => {
    const id = Date.now() + Math.random();

    setNotifications((prev) => [{ id, title, message }, ...prev].slice(0, 4));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const addLog = useCallback((text) => {
    const hour = new Date().toLocaleTimeString("pt-BR");
    setLogs((prev) => [`[${hour}] ${text}`, ...prev].slice(0, 12));
  }, []);

  const runAction = useCallback(
    async (actionName, fn) => {
      if (running) return;

      setRunning(true);
      setProgress(0);
      setStatus("Executando...");
      addLog(`Iniciando: ${actionName}`);

      try {
        const result = await fn();
        const message = result?.message || "Operação concluída.";

        setStatus(message);
        addLog(message);
        setProgress(100);
        notify("Concluído", message);
      } catch {
        setStatus("Erro ao executar.");
        addLog("Erro ao executar operação.");
        notify("Erro", "Não foi possível executar a operação.");
      }

      setRunning(false);
    },
    [running, addLog, notify]
  );

  const toggleAutoRam = useCallback(
    async (minutes) => {
      const next = !autoRam;
      setAutoRam(next);

      const result = await window.optimizer.toggleAutoRam(next, minutes);
      const message = result?.message || "Auto RAM atualizado.";

      setStatus(message);
      addLog(message);
      notify("Auto RAM", message);
    },
    [autoRam, addLog, notify]
  );

  useEffect(() => {
    if (!rgbMode) {
      document.documentElement.style.setProperty("--accent", accentColor);
    }
  }, [accentColor, rgbMode]);

  useEffect(() => {
    if (!rgbMode) return;

    let hue = 120;

    const timer = setInterval(() => {
      hue = (hue + 8) % 360;
      document.documentElement.style.setProperty(
        "--accent",
        `hsl(${hue}, 100%, 50%)`
      );
    }, 120);

    return () => clearInterval(timer);
  }, [rgbMode]);

  useEffect(() => {
    if (window.optimizer?.setMonitorActive) {
      window.optimizer.setMonitorActive(page === "dashboard");
    }
  }, [page]);

  useEffect(() => {
    window.optimizer.onLog((text) => addLog(text));
    window.optimizer.onProgress((value) => setProgress(value));
    window.optimizer.onSystemInfo((data) => setSystemInfo(data));

    if (window.optimizer.onUpdateStatus) {
      window.optimizer.onUpdateStatus((data) => {
        setUpdateStatus((prev) => {

if (data?.status === "silent-error") return;

          if (
            data?.status === "error" &&
            ["available", "downloading", "ready"].includes(prev?.status)
          ) {
            return prev;
          }

          if (
            data?.status === "none" &&
            ["available", "downloading", "ready"].includes(prev?.status)
          ) {
            return prev;
          }

          return data;
        });

        if (data?.status === "available") {
          notify("Atualização", data.message);
        }

        if (data?.status === "downloading") {
          setStatus("Baixando atualização...");
        }

        if (data?.status === "ready") {
          notify("Atualização pronta", "Reinicie para aplicar a nova versão.");
          setStatus("Atualização pronta para instalar.");
        }

        if (data?.status === "error") {
          notify("Atualização", data.message || "Erro ao verificar atualização.");
        }
      });
    }
  }, [addLog, notify]);

  const sharedProps = useMemo(
    () => ({
      running,
      runAction,
      toggleAutoRam,
      autoRam,
      systemInfo,
      notify
    }),
    [running, runAction, toggleAutoRam, autoRam, systemInfo, notify]
  );

  const currentPage = useMemo(() => {
    const pages = {
      dashboard: <Dashboard {...sharedProps} />,
      optimization: <Optimization {...sharedProps} />,
      cleaning: <Cleaning {...sharedProps} />,
      system: <System {...sharedProps} />,
      network: <Network {...sharedProps} />,
      gpu: <GPU {...sharedProps} />,
      live: <LiveMode {...sharedProps} />,
      account: <Account notify={notify} />,
      settings: (
        <Settings
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          rgbMode={rgbMode}
          setRgbMode={setRgbMode}
          isPremium={isPremium}
          notify={notify}
        />
      )
    };

    return pages[page] || pages.dashboard;
  }, [page, sharedProps, accentColor, rgbMode, notify]);

  return (
    <div className={rgbMode ? "appWindow rgbActive" : "appWindow"}>
      <TitleBar />

      <div className="appBody">
        <Sidebar activePage={page} setPage={setPage} />

        <main className="contentArea">
          <UpdateBanner updateStatus={updateStatus} />
          {currentPage}
        </main>

        <StatusPanel status={status} progress={progress} logs={logs} />
      </div>

      <NotificationToast notifications={notifications} />
    </div>
  );
}