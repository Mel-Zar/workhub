import { useState, useRef, useEffect, useMemo } from "react";
import TaskFilters from "../TaskFilters/TaskFilters";
import TaskSort from "../TaskSort/TaskSort";
import "./TaskControl.scss";

function TaskControls({
    filters,
    setFilters,
    categories,
    priorities,
    completionOptions,
    sortBy,
    setSortBy
}) {
    const [open, setOpen] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.category) count++;
        if (filters.priority) count++;
        if (filters.completed !== undefined) count++;
        if (filters.fromDate) count++;
        if (filters.toDate) count++;
        return count;
    }, [filters]);

    return (
        <div className="task-controls" ref={ref}>

            {/* SORT */}
            <div className="control">
                <button
                    className={`control-btn ${open === "sort" ? "active" : ""}`}
                    onClick={() => setOpen(open === "sort" ? null : "sort")}
                >
                    <span>Sort</span>
                    <span className={`chevron ${open === "sort" ? "up" : ""}`} />
                </button>

                <div className={`control-dropdown ${open === "sort" ? "open" : ""}`}>
                    {open === "sort" && (
                        <TaskSort
                            sortBy={sortBy}
                            onSortChange={(val) => {
                                setSortBy(val);
                                setOpen(null);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* FILTER */}
            <div className="control">
                <button
                    className={`control-btn filter-btn ${activeFilterCount > 0 ? "has-active" : ""
                        } ${open === "filter" ? "active" : ""}`}
                    onClick={() => setOpen(open === "filter" ? null : "filter")}
                >
                    <span>Filter</span>

                    <div className="right">
                        {activeFilterCount > 0 && (
                            <span className="filter-count">{activeFilterCount}</span>
                        )}
                        <span className={`chevron ${open === "filter" ? "up" : ""}`} />
                    </div>
                </button>

                <div className={`control-dropdown ${open === "filter" ? "open" : ""}`}>
                    {open === "filter" && (
                        <TaskFilters
                            filters={filters}
                            onChange={setFilters}
                            categories={categories}
                            priorities={priorities}
                            completionOptions={completionOptions}
                        />
                    )}
                </div>
            </div>

        </div>
    );
}

export default TaskControls;
