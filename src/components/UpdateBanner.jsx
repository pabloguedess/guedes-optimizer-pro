export default function UpdateBanner({ updateStatus }) {
  if (
    !updateStatus ||
    updateStatus.status === "none" ||
    updateStatus.status === "silent-error" ||
    updateStatus.status === "error"
  ) {
    return null;
  }

  const showModal =
    updateStatus.status === "downloading" ||
    updateStatus.status === "ready";

  if (showModal) {
    return (
      <div className="updateOverlay">
        <div className="updateModal">
          <h2>Guedes Optimizer PRO</h2>
          <h3>
            {updateStatus.status === "ready"
              ? "Atualização pronta"
              : "Atualizando..."}
          </h3>

          <p>{updateStatus.message}</p>

          <div className="updateProgress modalProgress">
            <div style={{ width: `${updateStatus.progress || 0}%` }} />
          </div>

          <span>{updateStatus.progress || 0}%</span>

          {updateStatus.changelog?.length > 0 && (
            <ul className="updateChangelog">
              {updateStatus.changelog.map((item, index) => (
                <li key={index}>✓ {item}</li>
              ))}
            </ul>
          )}

          {updateStatus.status === "ready" && (
            <button onClick={() => window.optimizer.installUpdateNow()}>
              Reiniciar Agora
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="updateBanner">
      <div>
        <strong>Atualização</strong>
        <p>{updateStatus.message}</p>

        {updateStatus.changelog?.length > 0 && (
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
    </div>
  );
}