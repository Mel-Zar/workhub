import { useState, useRef, useEffect } from "react";
import "./Dropdown.scss";

function Dropdown({ label, value, options = [], onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected =
        options.find(o => o.value === value)?.label || placeholder;

    return (
        <div className={`dropdown ${open ? "is-open" : ""}`} ref={ref}>
            {label && <span className="dropdown-label">{label}</span>}

            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setOpen(!open)}
            >
                <span className="dropdown-text">{selected}</span>
                <span className="arrow" />
            </button>

            {open && (
                <div className="dropdown-menu">
                    {options.map(opt => (
                        <button
                            key={opt.value ?? "all"}
                            className={`dropdown-item ${opt.value === value ? "active" : ""
                                }`}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
