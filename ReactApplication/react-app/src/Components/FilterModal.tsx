import React, { useState } from "react";
import "./FilterModal.css";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (name: string, cls: string) => void;
  onReset: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
}) => {
  const [name, setName] = useState("");
  const [cls, setClass] = useState("");

  const handleApply = () => {
    onApply(name, cls);
  };

  const handleReset = () => {
    setName("");
    setClass("");
    onReset();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Filter Instruments</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Class:</label>
              <select
                className="form-select"
                value={cls}
                onChange={(e) => setClass(e.target.value)}
              >
                <option value="">All Classes</option>
                <option value="Bylaw">Bylaw</option>
                <option value="Guideline">Guideline</option>
                <option value="Code/Charter">Code/Charter</option>
                <option value="Regulations">Regulations</option>
                <option value="Principles/Framework">
                  Principles/Framework
                </option>
                <option value="Policy">Policy</option>
                <option value="Procedure">Procedure</option>
                <option value="Rule">Rule</option>
                <option value="Statutes">Statutes</option>
              </select>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="form-button"
                onClick={handleApply}
              >
                Apply Filter
              </button>
              <button
                type="button"
                className="form-button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
