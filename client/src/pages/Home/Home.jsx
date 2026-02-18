import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "../../services/taskService";
import "./Home.scss";



const slides = [
  {
    // title: "Smart Dashboard",
    text: "Track progress and stay focused.",
    image: "/workhub-1.JPG",
  },
  {
    // title: "Organized Tasks",
    text: "Keep everything structured and clear.",
    image: "/workhub-2.JPG",
  },
  {
    // title: "Dark & Light Mode",
    text: "Work your way, day or night.",
    image: "/workhub-3.JPG",
  },
];

function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    productivity: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await taskService.getAll();

        console.log("API response:", response);

        const tasks = Array.isArray(response)
          ? response
          : response.tasks || [];

        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;

        setStats({
          total,
          completed,
          productivity: total
            ? Math.round((completed / total) * 100)
            : 0
        });

      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="home-page">
      {/* CAROUSEL */}
      <section className="home-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
          >
            <img src={slide.image} alt={slide.text} />
            <div className="overlay">
              {/* <h2>{slide.title}</h2> */}
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
      </section>
      {/* HERO */}
      <section className="home-hero">
        <h1>Organize smarter. Work cleaner.</h1>
        <p>All your tasks in one professional space.</p>
        <button
          className="cta"
          onClick={() => navigate("/dashboard")}
        >
          Create Task
        </button>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="stat">
          <h3>{stats.completed}</h3>
          <p>Tasks Completed</p>
        </div>
        <div className="stat">
          <h3>{stats.productivity}%</h3>
          <p>Productivity Rate</p>
        </div>
        <div className="stat">
          <h3>{stats.total}</h3>
          <p>Focus Mode</p>
        </div>
      </section>

    </main>
  );
}

export default Home;
