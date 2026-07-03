export default function RealtimeChart({ title, data, suffix = "%" }) {
  const max = Math.max(...data, 1);

  return (
    <div className="chartCard">
      <div className="chartHeader">
        <h3>{title}</h3>
        <span>{data.length ? `${data[data.length - 1]}${suffix}` : `0${suffix}`}</span>
      </div>

      <div className="chartBars">
        {data.map((value, index) => (
          <div
            key={index}
            className="chartBar"
            style={{ height: `${Math.max(6, (value / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}