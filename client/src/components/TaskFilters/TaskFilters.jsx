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
                placeholder="All categories"
                value={filters.category}
                onChange={(val) => onChange({ ...filters, category: val })}
                options={[
                    { label: "All categories", value: "" },
                    ...categories.map(c => ({ label: c, value: c }))
                ]}
            />

            <Dropdown
                placeholder="All priorities"
                value={filters.priority}
                onChange={(val) => onChange({ ...filters, priority: val })}
                options={[
                    { label: "All priorities", value: "" },
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
                    { label: "All", value: "" },
                    completionOptions.includes("true") && { label: "Completed", value: true },
                    completionOptions.includes("false") && { label: "Not completed", value: false }
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
                Reset filters
            </button>
        </div>
    );
}

export default TaskFilters;
