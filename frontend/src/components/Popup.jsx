import { X } from "lucide-react";

function Popup({ title, children, onClose, onSubmit }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <hr />

        {/* Form */}
        <form onSubmit={onSubmit}>
          {children}

          <button className="btn-primary">
            Commit Registry
          </button>
        </form>

      </div>
    </div>
  );
}

export default Popup;