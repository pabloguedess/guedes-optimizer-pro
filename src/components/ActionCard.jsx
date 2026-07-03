export default function ActionCard({ title, description, buttonText = "Executar", onClick, disabled, danger }) {
  return (
    <div className={danger ? "actionCard danger" : "actionCard"}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button disabled={disabled} onClick={onClick}>
        {disabled ? "Executando..." : buttonText}
      </button>
    </div>
  );
}