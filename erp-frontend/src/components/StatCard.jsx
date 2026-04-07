import "./StatCard.css";

export default function StatCard({ title, value, sub, icon, color = "var(--gold)", trend }) {
  return (
    <div className="stat-card" style={{ "--card-color": color }}>
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
