import React from "react";
import Dropdown from "../Ui/Dropdown";
import "./TaskFilters.scss";

function TaskFilters({
    filters,
    onChange,
    categories = [],
    priorities = [],
    completionOptions = []
}) {

    // Behåller exakt din logik
    const hasActiveFilters =
        filters.category ||
        filters.priority ||
        filters.completed !== undefined;

    return (
        <div className="task-filters">
            {/* CATEGORY */}
            <Dropdown
                value={filters.category}
                placeholder="All categories"
                onChange={(val) =>
                    onChange(prev => ({
                        ...prev,
                        category: val,
                        priority: ""
                    }))
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
                    onChange(prev => ({
                        ...prev,
                        priority: val
                    }))
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
                    onChange(prev => ({
                        ...prev,
                        completed: val === "" ? undefined : val
                    }))
                }
                options={[
                    { label: "All", value: "" },
                    completionOptions.includes(true) && {
                        label: "Completed",
                        value: true
                    },
                    completionOptions.includes(false) && {
                        label: "Not completed",
                        value: false
                    }
                ].filter(Boolean)}
            />

            {/* RESET */}
            {hasActiveFilters && (
                <button
                    className="reset-btn"
                    onClick={() =>
                        onChange(prev => ({
                            ...prev,
                            search: "",
                            category: "",
                            priority: "",
                            completed: undefined
                        }))
                    }
                >
                    Reset filters
                </button>
            )}
        </div>
    );
}

export default React.memo(TaskFilters);
