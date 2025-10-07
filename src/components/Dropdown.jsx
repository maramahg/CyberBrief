import React, { useState, useEffect } from "react";
import "./Dropdown.css";

const Dropdown = ({
  options,
  placeholder = "Select",
  onSelect,
  selectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValue || "");

  // Update internal state when selectedValue prop changes
  useEffect(() => {
    setSelected(selectedValue || "");
  }, [selectedValue]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="dropdown-label">
          <span
            className={selected ? "dropdown-selected" : "dropdown-placeholder"}
          >
            {selected || placeholder}
          </span>
        </div>
        <svg
          className={`dropdown-chevron ${isOpen ? "dropdown-chevron-open" : ""}`}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.6927 11.3602C8.21767 10.8851 7.44751 10.8851 6.97248 11.3602C6.49745 11.8352 6.49745 12.6054 6.97248 13.0804L14.2708 20.3787C14.7458 20.8537 15.5159 20.8537 15.991 20.3787L23.2892 13.0804C23.7643 12.6054 23.7643 11.8352 23.2892 11.3602C22.8142 10.8851 22.0441 10.8851 21.569 11.3602L15.1309 17.7983L8.6927 11.3602Z"
            fill="#313144"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-items">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
