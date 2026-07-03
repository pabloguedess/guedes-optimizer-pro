export default function StatusPanel({ status, progress, logs }) {
  return (
    <div className="statusPanel">
      <h3>Status</h3>
      <p>{status}</p>

      <div className="progressBox">
        <div className="progressFill" style={{ width: `${progress}%` }} />
      </div>

      <span>Progresso: {progress}%</span>

      <div className="logBox">
        {logs.length === 0 ? (
          <small>Aguardando execução...</small>
        ) : (
          logs.map((log, index) => <small key={index}>{log}</small>)
        )}
      </div>
    </div>
  );
}