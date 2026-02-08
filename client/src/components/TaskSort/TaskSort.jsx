import Dropdown from "../Ui/Dropdown";
import "./TaskSort.scss";

function TaskSort({ sortBy, onSortChange }) {
    return (
        <div className="task-sort">
            <Dropdown
                placeholder="Sortera efter"
                value={sortBy ?? ""}
                onChange={(val) => onSortChange(val)}
                options={[
                    { label: "Välj", value: "" },
                    { label: "Skapad datum", value: "createdAt" },
                    { label: "Deadline", value: "deadline" },
                    { label: "Priority", value: "priority" },
                    { label: "Titel", value: "title" }
                ]}
            />
        </div>
    );
}

export default TaskSort;
