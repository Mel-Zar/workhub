import { useState, useRef, useEffect } from "react";
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="task-controls" ref={ref}>
            {/* SORT */}
            <div className="control">
                <button
                    className="control-btn"
                    onClick={() => setOpen(open === "sort" ? null : "sort")}
                >
                    Sort
                </button>

                {open === "sort" && (
                    <div className="control-dropdown">
                        <TaskSort
                            sortBy={sortBy}
                            onSortChange={(val) => {
                                setSortBy(val);
                                setOpen(null);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* FILTER */}
            <div className="control">
                <button
                    className="control-btn"
                    onClick={() => setOpen(open === "filter" ? null : "filter")}
                >
                    Filter
                </button>

                {open === "filter" && (
                    <div className="control-dropdown">
                        <TaskFilters
                            filters={filters}
                            onChange={setFilters}
                            categories={categories}
                            priorities={priorities}
                            completionOptions={completionOptions}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskControls;
