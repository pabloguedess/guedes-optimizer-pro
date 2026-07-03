export default function StatCard({ title, value, subtitle, percent }) {
  const safePercent = Math.min(100, Math.max(0, Number(percent) || 0));

  return (
    <div className="statCard">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{subtitle}</p>

      <div className="miniProgress">
        <div className="miniProgressFill" style={{ width: `${safePercent}%` }} />
      </div>
    </div>
  );
}