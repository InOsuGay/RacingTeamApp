import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const DataTable = ({ columns, data, onDelete, tabType }) => {
  if (!data || data.length === 0) {
    return <div className="empty-state">No records found in the database.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="formal-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {onDelete && (
                <td className="actions-cell">
                  <button className="action-btn delete" onClick={() => onDelete(row)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="action-btn edit">
                    <Edit3 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
