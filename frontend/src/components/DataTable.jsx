import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const DataTable = ({ columns, data, onDelete, onEdit, tabType }) => {
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
            {(onDelete || onEdit) && <th>Actions</th>}
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
              {(onDelete || onEdit) && (
                <td className="actions-cell">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {onEdit && (
                      <button className="action-btn edit" onClick={() => onEdit(row)} title="Edit Record">
                        <Edit3 size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button className="action-btn delete" onClick={() => onDelete(row)} title="Delete Record">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
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
