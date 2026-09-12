export function SkeletonLine({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return <div className="skeleton-pulse rounded" style={{ width, height }} />;
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  const widths = ["40%", "25%", "20%", "15%", "10%"];
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
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }, (_, c) => (
                <td key={c} className="td"><SkeletonLine width={widths[c] || "20%"} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
