import type { ProjectContentTable } from "@/data/projects/types";
import "./ContentTable.css";

type ContentTableProps = {
  table: ProjectContentTable;
};

export function ContentTable({ table }: ContentTableProps) {
  return (
    <div className="content-table-scroll">
      <table className="content-table">
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (
                <td key={`${table.headers[index] ?? index}-${cell}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
