export default function LineChartCard({ title, data = [], suffix = "%" }) {
  const values = data.length ? data : [0];
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - (value / max) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  const lastValue = values[values.length - 1] || 0;

  return (
    <div className="lineChartCard">
      <div className="chartHeader">
        <h3>{title}</h3>
        <span>{lastValue}{suffix}</span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} />
      </svg>
    </div>
  );
}