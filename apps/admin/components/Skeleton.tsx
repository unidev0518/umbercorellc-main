// Reusable skeleton primitives for loading states

export function SkeletonLine({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return (
    <div className="skeleton-pulse rounded" style={{ width, height }} />
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  const widths = ["40%", "25%", "20%", "15%", "10%"];
  return (
    <tr>
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="td">
          <SkeletonLine width={widths[i] || "20%"} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="table-wrap">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
            {Array.from({ length: cols }, (_, i) => (
              <th key={i} className="th"><SkeletonLine width={60} height={11} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => <SkeletonRow key={i} cols={cols} />)}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonStatCards({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-${count} gap-3 mb-5`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="stat-card space-y-2">
          <SkeletonLine width="50%" height={11} />
          <SkeletonLine width="35%" height={26} />
        </div>
      ))}
    </div>
  );
}
