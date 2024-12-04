"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  FaDumbbell,
  FaClock,
  FaFire,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Workout {
  id: number;
  user_id: number;
  exercise: string;
  description: string;
  duration: number;
  date: Date;
  type: string;
  calories_burnt: number;
}

export default function Workout() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    user,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = useAuth();

  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showChart, setShowChart] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({});
  const [editWorkout, setEditWorkout] = useState<Partial<Workout> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activitySuggestions, setActivitySuggestions] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  console.log("current pageeeee", currentPage);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchActivitySuggestions = async (category: string, filter: any) => {
    console.log("Fetching activity suggestions");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/workout/activity?category=${category}&filter=${filter}`,
        {
          method: "GET",
          headers: { Authorization: `${token}` }, // Ensure Bearer token format
        }
      );
      if (response.ok) {
        const data = await response.json();
        setActivitySuggestions(data);
      } else {
        console.error(
          "Error fetching activity suggestions:",
          response.status,
          response.statusText
        );
      }
      console.log("Activity Suggestions:", activitySuggestions);
    } catch (error) {
      console.error("Error fetching activity suggestions:", error);
    }
  };

  useEffect(() => {
    if (newWorkout.type || editWorkout?.type) {
      fetchActivitySuggestions(newWorkout.type || editWorkout?.type || "", "");
    }
  }, [newWorkout.type, editWorkout?.type]);

  const fetchFilteredWorkouts = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/workout/filter?filterDate=${filterDate}&page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data.result);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleFilterByDate = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/workout/filter?filterDate=${filterDate}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data.result);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    if (filterDate && filterDate !== "custom") {
      fetchFilteredWorkouts(currentPage);
    } else {
      setFilterDate("");
      fetchWorkouts(currentPage);
    }
  }, [filterDate]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (event: any) => {
    if (event.target.value) {
      // setCurrentPage(1);
      setFilterDate(event.target.value);
    }
  };

  const fetchWorkouts = async (page: number) => {
    console.log("fetching workouts");
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging log

    if (token) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/workout?page=${page}&limit=10`,
          {
            method: "GET",
            headers: { Authorization: `${token}` }, // Ensure Bearer token format
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Fetched data:", data);
          setWorkouts(data.result);
          setCurrentPage(data.pagination.currentPage);
          setTotalPages(data.pagination.totalPages);
        } else if (!user) {
          const errorText = await res.text();
          console.log(res);
          console.error(
            "Error fetching workouts:",
            res.status,
            res.statusText,
            errorText
          );
        }
      } catch (err) {
        console.log(err);
        console.error(`Error fetching workouts: ${err}`);
      }
    } else {
      console.error("No token found");
    }
  };

  useEffect(() => {
    fetchWorkouts(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    console.log("Current Page:", currentPage);
  };

  const handleAddWorkout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`http://localhost:3000/api/workout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(newWorkout),
        });

        if (res.ok) {
          fetchWorkouts(currentPage);
          setNewWorkout({});
          setShowForm(false);
        } else {
          const errorText = await res.text();
          console.error(
            "Error adding workout:",
            res.status,
            res.statusText,
            errorText
          );
        }
      } catch (err) {
        console.error(`Error adding workout: ${err}`);
      }
    } else {
      console.error("No token found");
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    console.log("Setting edit workout:", workout); // Debugging log
    setEditWorkout(workout);
    setShowForm(true);
  };

  const handleDeleteWorkout = async (workout: Workout) => {
    const token = localStorage.getItem("token");
    if (!workout.id) {
      alert("Workout ID is required");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/workout/${workout.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        // Update the state to remove the deleted workout
        setWorkouts((prevWorkouts) =>
          prevWorkouts ? prevWorkouts.filter((w) => w.id !== workout.id) : []
        );
        alert("Workout deleted successfully");
      } else {
        alert("Failed to delete workout");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("An error occurred while deleting the workout");
    }
  };

  const handleUpdateWorkout = async () => {
    const token = localStorage.getItem("token");
    console.log("Token for update:", token); // Debugging log
    console.log("Edit Workout:", editWorkout); // Debugging log

    if (token && editWorkout?.id) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/workout/${editWorkout.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify(editWorkout),
          }
        );

        if (res.ok) {
          fetchWorkouts(currentPage);
          setEditWorkout(null);
          setShowForm(false);
        } else {
          const errorText = await res.text();
          console.error(
            "Error updating workout:",
            res.status,
            res.statusText,
            errorText
          );
        }
      } catch (err) {
        console.error(`Error updating workout: ${err}`);
      }
    } else {
      console.error("No token found or no workout selected for editing");
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditWorkout(null);
  };

  const handleCancelAdd = () => {
    setNewWorkout({});
    setShowForm(false);
  };

  useEffect(() => {
    fetchWorkouts(currentPage);
  }, []);

  const handleShowChart = () => {
    setShowChart(!showChart);
  };

  const handleAddUpdate = () => {
    setNewWorkout({});
    setEditWorkout(null);
    setShowForm(true);
  };

  const chartData = {
    labels: workouts?.map((workout: Workout) =>
      new Date(workout.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Calories Burnt",
        data: workouts?.map((workout: Workout) => workout.calories_burnt),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Duration (minutes)",
        data: workouts?.map((workout) => workout.duration),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="button-container">
        <h2 className="title">Workouts</h2>
        <div className="buttons">
          <button onClick={handleShowChart}>
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
          <button onClick={handleAddUpdate} className="add">
            New Workout
          </button>
        </div>
      </div>
      {!showForm && (
        <div className="filter-container mb-4">
          <select
            id="filterDate"
            value={filterDate}
            onChange={handleFilterChange}
            className="p-3 bg-gray-700 text-white rounded"
          >
            <option value="">Filter Date Range</option>
            <option value="one_week">Last Week</option>
            <option value="one_month">Last Month</option>
            <option value="three_months">Last 3 Months</option>
            <option value="six_months">Last 6 Months</option>
            <option value="one_year">Last Year</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>
      )}
      {filterDate === "custom" && (
        <div className="custom-date-range mb-4">
          <div>
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              className="p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              minDate={startDate ?? undefined}
              className="p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <button
            onClick={() => handleFilterByDate(currentPage)}
            className="p-3 bg-blue-500 text-white rounded mt-2"
          >
            Custom Date Range
          </button>
        </div>
      )}
      {showChart && (
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      )}
      {showForm && (
        <div className="workout-form p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <select
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
            value={editWorkout?.type || newWorkout.type || ""}
            onChange={(e) =>
              editWorkout
                ? setEditWorkout({ ...editWorkout, type: e.target.value })
                : setNewWorkout({ ...newWorkout, type: e.target.value })
            }
          >
            <option value="" disabled>
              Select Exercise Type
            </option>
            <option value="cycling">Cycling</option>
            <option value="running">Running</option>
            <option value="walking">Walking</option>
            <option value="swimming">Swimming</option>
            <option value="hiking">Hiking</option>
            <option value="aerobics">Aerobics/Yoga/Dance</option>
            <option value="sports">Sports</option>
            <option value="hobbies">Hobbies</option>
            <option value="gym">Gym</option>
            <option value="other">Other</option>
          </select>
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
            type="text"
            placeholder="Running 5 miles"
            value={editWorkout?.exercise || newWorkout.exercise || ""}
            onChange={(e) => {
              const value = e.target.value;
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              editWorkout
                ? setEditWorkout({ ...editWorkout, exercise: value })
                : setNewWorkout({ ...newWorkout, exercise: value });
              fetchActivitySuggestions(
                newWorkout.type || editWorkout?.type || "",
                value
              );
            }}
            list="activity-suggestions"
          />
          <datalist id="activity-suggestions">
            {activitySuggestions.map((activity, index) => (
              <option key={index} value={activity} />
            ))}
          </datalist>
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
            type="number"
            placeholder="Duration(mins): 40"
            value={editWorkout?.duration || newWorkout.duration || ""}
            onChange={(e) =>
              editWorkout
                ? setEditWorkout({
                    ...editWorkout,
                    duration: parseInt(e.target.value),
                  })
                : setNewWorkout({
                    ...newWorkout,
                    duration: parseInt(e.target.value),
                  })
            }
          />
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            type="date"
            placeholder="Date"
            value={
              (editWorkout?.date instanceof Date
                ? editWorkout.date.toISOString().split("T")[0]
                : editWorkout?.date) ||
              (newWorkout.date instanceof Date
                ? newWorkout.date.toISOString().split("T")[0]
                : newWorkout.date) ||
              new Date().toISOString().split("T")[0]
            }
            onChange={(e) =>
              editWorkout
                ? setEditWorkout({
                    ...editWorkout,
                    date: new Date(e.target.value),
                  })
                : setNewWorkout({
                    ...newWorkout,
                    date: new Date(e.target.value),
                  })
            }
          />
          <textarea
            className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
            placeholder="Description: Morning run in the park"
            value={editWorkout?.description || newWorkout.description || ""}
            onChange={(e) =>
              editWorkout
                ? setEditWorkout({
                    ...editWorkout,
                    description: e.target.value,
                  })
                : setNewWorkout({ ...newWorkout, description: e.target.value })
            }
          />
          {editWorkout ? (
            <div className="edit-buttons flex justify-between mt-4">
              <button
                className="btn btn-primary w-1/2 ml-2"
                onClick={handleUpdateWorkout}
              >
                Save
              </button>
              <button
                className="btn btn-secondary w-1/2 ml-2"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="edit-buttons flex justify-between mt-4">
              <button
                className="btn btn-primary w-1/2 ml-2"
                onClick={handleAddWorkout}
              >
                Add
              </button>
              <button
                className="btn btn-secondary w-1/2 ml-2"
                onClick={handleCancelAdd}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {!editWorkout && !showForm && (
        <div>
          <div className="workout-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!editWorkout &&
              !showForm &&
              workouts?.map((workout) => (
                <div key={workout.id} className="workout-card">
                  <h3>{workout.exercise || "No Exercise Specified"}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaDumbbell className="icon" />
                      <span>{workout.type}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="icon" />
                      <span>{workout.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <FaFire className="icon" />
                      <span>{workout.calories_burnt}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="icon" />
                      <span>{new Date(workout.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <p>{workout.description || "No Description"}</p>
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      onClick={() => handleEditWorkout(workout)}
                      className="edit"
                    >
                      <FaEdit size={25} />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout)}
                      className="delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="pagination flex justify-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage == 1}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300"
            >
              Previous
            </button>
            <span className="text-black mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage == totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
