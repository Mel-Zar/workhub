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
            {/* CATEGORY */}
            <Dropdown
                value={filters.category}
                placeholder="All categories"
                onChange={(val) =>
                    onChange({
                        ...filters,
                        category: val,
                        priority: "" // reset child
                    })
                }
                options={[
                    { label: "All categories", value: "" },
                    ...categories.map(c => ({
                        label: c,
                        value: c
                    }))
                ]}
            />

            {/* PRIORITY */}
            <Dropdown
                value={filters.priority}
                placeholder="All priorities"
                onChange={(val) =>
                    onChange({
                        ...filters,
                        priority: val
                    })
                }
                options={[
                    { label: "All priorities", value: "" },
                    ...priorities.map(p => ({
                        label: p,
                        value: p
                    }))
                ]}
            />

            {/* STATUS */}
            <Dropdown
                value={filters.completed ?? ""}
                placeholder="Status"
                onChange={(val) =>
                    onChange({
                        ...filters,
                        completed: val === "" ? undefined : val
                    })
                }
                options={[
                    { label: "All", value: "" },
                    completionOptions.includes("true") && {
                        label: "Completed",
                        value: true
                    },
                    completionOptions.includes("false") && {
                        label: "Not completed",
                        value: false
                    }
                ].filter(Boolean)}
            />

            <button
                className="reset-btn"
                onClick={() =>
                    onChange({
                        search: "",
                        category: "",
                        priority: "",
                        completed: undefined
                    })
                }
            >
                Reset filters
            </button>
        </div>
    );
}

export default TaskFilters;
