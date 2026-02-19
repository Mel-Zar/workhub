import { useState, useRef, useEffect } from "react";
import "./Dropdown.scss";

function Dropdown({
    value,
    options = [],
    onChange,
    placeholder,
    className = ""
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = options.find(o => o.value === value);
    const isActive = value !== "" && value !== undefined;

    return (
        <div
            ref={ref}
            className={`dropdown ${className} ${open ? "open" : ""} ${isActive ? "active" : ""}`}
        >
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setOpen(o => !o)}
            >
                <span>{selected ? selected.label : placeholder}</span>
                <span className="dropdown-chevron" />
            </button>

            {open && (
                <div className="dropdown-menu">
                    {options.map(opt => (
                        <button
                            key={String(opt.value)}
                            className={`dropdown-item ${opt.value === value ? "active" : ""}`}
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
