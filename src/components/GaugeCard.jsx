export default function GaugeCard({ title, value = 0, subtitle = "", unit = "%" }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="gaugeCard">
      <div className="gaugeTop">
        <span>{title}</span>
        <strong>{safeValue}{unit}</strong>
      </div>

      <div className="gaugeCircle" style={{ "--value": safeValue }}>
        <div className="gaugeInner">
          <strong>{safeValue}{unit}</strong>
          <small>{title}</small>
        </div>
      </div>

      <p>{subtitle}</p>
    </div>
  );
}
