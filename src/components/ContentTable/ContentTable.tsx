import type { ProjectContentTable } from "@/data/projects/types";
import "./ContentTable.css";

type ContentTableProps = {
  table: ProjectContentTable;
};

function formatIndex(index: number) {
  return String(index).padStart(2, "0");
}

export function ContentTable({ table }: ContentTableProps) {
  const caption = table.headers.join(" and ");

  return (
    <div className="content-table-container">
      <article className="content-table-card">
        <div className="content-table-scroll">
          <table className="content-table" aria-label={caption}>
            <thead>
              <tr>
                {table.headers.map((header) => (
                  <th key={header} scope="col">
                    <span className="content-table-title">{header}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={row.join("|")}>
                  {row.map((cell, index) => (
                    <td key={`${table.headers[index] ?? index}-${cell}`}>
                      {cell ? (
                        <span className="content-table-item">
                          <span className="content-table-index" aria-hidden="true">
                            {formatIndex(rowIndex)}
                          </span>
                          <span className="content-table-item-label">{cell}</span>
                        </span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
