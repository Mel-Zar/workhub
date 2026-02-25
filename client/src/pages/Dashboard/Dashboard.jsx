import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { taskService } from "../../services/taskService";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskControls from "../../components/TaskControl/TaskControl";
import TaskForm from "../../components/TaskForm/TaskForm";

import "./Dashboard.scss";

function Dashboard() {

    const { user, loading: authLoading } = useAuth();

    const {
        tasks,
        loading,
        error,
        page,
        pages,
        filters,
        categories,
        priorities,
        completionOptions,
        setPage,
        setFilters,
        refreshTasks,
    } = useTasks({ limit: 12 });


    /* ---------- DERIVED DATA ---------- */

    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const totalTasks = tasks.length;


    /* ---------- STATES ---------- */

    if (authLoading)
        return <p className="status-text">Loading user...</p>;

    if (!user)
        return <p className="status-text">You are not logged in.</p>;


    /* ---------- HANDLERS ---------- */

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this task?"))
            return;

        await taskService.remove(id);

        refreshTasks();

    };


    /* ---------- JSX ---------- */

    return (

        <main className="dashboard-page">


            {/* ---------- HEADER ---------- */}

            <header className="page-header">


                <div className="page-header-text">

                    <h1>Dashboard</h1>

                    <p>
                        Overview of your tasks and quick actions
                    </p>

                </div>



                {/* ---------- STATS ---------- */}

                <div className="stats-row">

                    <div className="stat-card">

                        <span className="stat-number">
                            {totalTasks}
                        </span>

                        <span className="stat-label">
                            Total Tasks
                        </span>

                    </div>



                    <div className="stat-card">

                        <span className="stat-number">
                            {incompleteTasks.length}
                        </span>

                        <span className="stat-label">
                            To Do
                        </span>

                    </div>



                    <div className="stat-card">

                        <span className="stat-number">
                            {completedTasks.length}
                        </span>

                        <span className="stat-label">
                            Completed
                        </span>

                    </div>

                </div>


            </header>



            {/* ---------- CREATE TASK ---------- */}

            <section className="tasks-section">

                <TaskForm
                    onCreate={refreshTasks}
                />

            </section>



            {/* ---------- FILTERS ---------- */}

            <section className="tasks-section">

                <div className="tasks-controls">

                    <TaskControls

                        filters={filters}

                        setFilters={(data) => {

                            setPage(1);

                            setFilters(data);

                        }}

                        categories={categories}

                        priorities={priorities}

                        completionOptions={completionOptions}

                        onSearch={(value) =>

                            setFilters(prev => ({
                                ...prev,
                                search: value
                            }))

                        }

                    />

                </div>

            </section>



            {/* ---------- TASK LIST ---------- */}

            <section className="tasks-section">

                <div className="tasks-content">


                    {loading && (

                        <p className="status-text">

                            Loading tasks...

                        </p>

                    )}



                    {error && (

                        <p className="error-text">

                            {error}

                        </p>

                    )}



                    {!loading && totalTasks === 0 && (

                        <div className="empty-state">

                            <p>No tasks found</p>

                            <span>

                                Try creating a new task
                                or adjusting your filters.

                            </span>

                        </div>

                    )}



                    <div className="tasks-layout">


                        {/* ---------- TODO ---------- */}

                        {incompleteTasks.length > 0 && (

                            <section className="task-group">

                                <h3 className="task-group-title">

                                    To Do ({incompleteTasks.length})

                                </h3>



                                <div className="tasks-layout grid">

                                    {incompleteTasks.map(task => (

                                        <TaskItem

                                            key={task._id}

                                            task={task}

                                            showActions

                                            editable

                                            onUpdate={refreshTasks}

                                            onDelete={handleDelete}

                                        />

                                    ))}

                                </div>

                            </section>

                        )}




                        {/* ---------- COMPLETED ---------- */}

                        {completedTasks.length > 0 && (

                            <section className="task-group completed-group">

                                <h3 className="task-group-title">

                                    Completed ({completedTasks.length})

                                </h3>



                                <div className="tasks-layout grid">

                                    {completedTasks.map(task => (

                                        <TaskItem

                                            key={task._id}

                                            task={task}

                                            showActions

                                            editable

                                            onUpdate={refreshTasks}

                                            onDelete={handleDelete}

                                        />

                                    ))}

                                </div>

                            </section>

                        )}


                    </div>

                </div>

            </section>



            {/* ---------- PAGINATION ---------- */}

            {pages > 1 && (

                <footer className="pagination">


                    <button

                        disabled={page <= 1}

                        onClick={() =>
                            setPage(p => p - 1)
                        }

                    >
                        Previous
                    </button>



                    <span>

                        {page} / {pages}

                    </span>



                    <button

                        disabled={page >= pages}

                        onClick={() =>
                            setPage(p => p + 1)
                        }

                    >
                        Next
                    </button>


                </footer>

            )}


        </main>

    );

}

export default Dashboard;
