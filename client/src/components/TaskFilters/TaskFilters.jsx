import Dropdown from "../Ui/Dropdown";
import "./TaskFilters.scss";

function TaskFilters({
    filters,
    onChange,
    categories = [],
    priorities = [],
    completionOptions = []
}) {
    return (
        <div className="task-filters">

            <Dropdown
                placeholder="Alla kategorier"
                value={filters.category}
                onChange={(val) => onChange({ ...filters, category: val })}
                options={[
                    { label: "Alla kategorier", value: "" },
                    ...categories.map(c => ({ label: c, value: c }))
                ]}
            />

            <Dropdown
                placeholder="Alla prioriteter"
                value={filters.priority}
                onChange={(val) => onChange({ ...filters, priority: val })}
                options={[
                    { label: "Alla prioriteter", value: "" },
                    ...priorities.map(p => ({ label: p, value: p }))
                ]}
            />

            <Dropdown
                placeholder="Status"
                value={filters.completed}
                onChange={(val) =>
                    onChange({
                        ...filters,
                        completed: val === "" ? undefined : val
                    })
                }
                options={[
                    { label: "Alla", value: "" },
                    completionOptions.includes("true") && { label: "Klara", value: true },
                    completionOptions.includes("false") && { label: "Ej klara", value: false }
                ].filter(Boolean)}
            />

            <button
                className="reset-btn"
                onClick={() =>
                    onChange({
                        priority: "",
                        category: "",
                        completed: undefined,
                        fromDate: "",
                        toDate: ""
                    })
                }
            >
                Rensa filter
            </button>
        </div>
    );
}

export default TaskFilters;
