import React from "react";

interface Column {
  key: string;
  header: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, string | number>[];
  striped?: boolean;
  hoverable?: boolean;
}

export function Table({
  columns,
  data,
  striped = false,
  hoverable = false,
}: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
      <table className="w-full">
        <thead className="bg-[#f8fafc]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-[#0f172a] border-b border-[#e2e8f0]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 1 ? "bg-[#f8fafc]" : "bg-white"}
                ${hoverable ? "hover:bg-[#f1f5f9]" : ""}
                transition-colors duration-150
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm text-[#475569] border-b border-[#e2e8f0]"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
