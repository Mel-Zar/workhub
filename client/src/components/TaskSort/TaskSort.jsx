import Dropdown from "../Ui/Dropdown";
import "./TaskSort.scss";

function TaskSort({ value, onChange, onReset }) {
    return (
        <div className="task-sort">
            <Dropdown
                placeholder="Sort by"
                value={value || ""}
                onChange={onChange}
                options={[
                    { label: "Created date", value: "createdAt" },
                    { label: "Deadline", value: "deadline" },
                    { label: "Priority", value: "priority" },
                    { label: "Title", value: "title" }
                ]}
            />

            {value && (
                <button
                    type="button"
                    className="reset-btn"
                    onClick={onReset}
                >
                    Reset sorting
                </button>
            )}
        </div>
    );
}

export default TaskSort;
