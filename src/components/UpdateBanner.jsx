export default function UpdateBanner({ updateStatus }) {
  if (!updateStatus || updateStatus.status === "none") return null;

  const showButton = updateStatus.status === "ready";
  const hasChangelog = updateStatus.changelog && updateStatus.changelog.length > 0;

  return (
    <div className="updateBanner">
      <div>
        <strong>Atualização</strong>
        <p>{updateStatus.message}</p>

        {hasChangelog && (
          <ul className="updateChangelog">
            {updateStatus.changelog.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>
        )}

        <div className="updateProgress">
          <div style={{ width: `${updateStatus.progress || 0}%` }} />
        </div>
      </div>

      {showButton && (
        <button onClick={() => window.optimizer.installUpdateNow()}>
          Reiniciar Agora
        </button>
      )}
    </div>
  );
}