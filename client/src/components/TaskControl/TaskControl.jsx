import { useState, useRef, useEffect, useCallback } from "react";
import TaskFilters from "../TaskFilters/TaskFilters";
import TaskSort from "../TaskSort/TaskSort";
import TaskSearch from "../TaskSearch/TaskSearch";
import "./TaskControl.scss";

function TaskControls({
    filters,
    setFilters,
    categories,
    priorities,
    completionOptions,
}) {
    const [open, setOpen] = useState(null); // "filter" | "sort" | null
    const ref = useRef(null);

    /* =====================
       CLICK OUTSIDE
       ===================== */
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

    const handleSearchChange = useCallback((value) => {
        setFilters(prev => ({
            ...prev,
            search: value
        }));
    }, [setFilters]);

    const handleSortChange = useCallback((value) => {
        setFilters(prev => ({
            ...prev,
            sortBy: value
        }));
    }, [setFilters]);

    const handleSortReset = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            sortBy: ""
        }));
    }, [setFilters]);


    /* =====================
       COUNTERS
       ===================== */
    const activeFiltersCount = Object.entries(filters)
        .filter(([key, value]) =>
            key !== "sortBy" &&
            key !== "search" &&
            value !== "" &&
            value !== undefined
        ).length;


    const hasSort = Boolean(filters.sortBy);

    return (
        <div className="task-controls" ref={ref}>
            {/* =====================
               FILTER
               ===================== */}
            <div className="control left">
                <button
                    className={`control-btn ${activeFiltersCount ? "is-active" : ""} ${open === "filter" ? "open" : ""}`}
                    onClick={() =>
                        setOpen(open === "filter" ? null : "filter")
                    }
                >
                    <span>
                        Filter

                        {activeFiltersCount > 0 && (
                            <span className="count">({activeFiltersCount})</span>
                        )}
                    </span>

                    <span className={`arrow ${open === "filter" ? "up" : "down"}`} />
                </button>

                {open === "filter" && (
                    <div className="dropdown-panel">
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

            {/* =====================
               SEARCH
               ===================== */}
            <div className="search-wrapper">
                <TaskSearch
                    value={filters.search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* =====================
               SORT
               ===================== */}
            <div className="control right">
                <button
                    className={`control-btn ${hasSort ? "is-active" : ""} ${open === "sort" ? "open" : ""}`}
                    onClick={() =>
                        setOpen(open === "sort" ? null : "sort")
                    }
                >
                    <span>Sort</span>


                    <span className={`arrow ${open === "sort" ? "up" : "down"}`} />

                </button>

                {open === "sort" && (
                    <div className="dropdown-panel">
                        <TaskSort
                            value={filters.sortBy}
                            onChange={handleSortChange}
                            onReset={handleSortReset}
                        />

                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskControls;