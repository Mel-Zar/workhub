import React from "react";
import "./TaskSort.scss";

const options = [
    { label: "Created date", value: "createdAt" },
    { label: "Deadline", value: "deadline" },
    { label: "Priority", value: "priority" },
    { label: "Title", value: "title" }
];

function TaskSort({ value, onChange, onReset }) {

    return (

        <div className="task-sort">

            {/* SORT LIST */}
            <div className="dropdown-menu">

                {options.map(opt => (

                    <button

                        key={opt.value}

                        className={`dropdown-item ${value === opt.value ? "active" : ""}`}

                        onClick={() => onChange(opt.value)}
                    >

                        <span>{opt.label}</span>

                        {value === opt.value && (
                            <span className="check">✓</span>
                        )}

                    </button>

                ))}

            </div>


            {/* RESET — visas bara om value finns */}
            {value && (

                <button

                    className="reset-btn"

                    onClick={onReset}
                >

                    Reset sorting

                </button>

            )}

        </div>

    );

}

export default React.memo(TaskSort);
