import { useState, useRef, useEffect } from "react";
import "./Dropdown.scss";

function Dropdown({ value, options = [], onChange, placeholder }) {
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

    const selectedOption = options.find(opt => opt.value === value);
    const label = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={`dropdown ${open ? "is-open" : ""}`} ref={ref}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setOpen(o => !o)}
            >
                <span className="dropdown-text">{label}</span>
                <span className={`arrow ${open ? "up" : "down"}`} />
            </button>

            {open && (
                <div className="dropdown-menu">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            className={`dropdown-item ${opt.value === value ? "active" : ""
                                }`}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            <span>{opt.label}</span>
                            {opt.value === value && <span className="check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
