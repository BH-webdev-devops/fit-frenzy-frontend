"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    FaDumbbell,
    FaClock,
    FaFire,
    FaCalendarAlt,
    FaEdit,
    FaTrash,
    FaTimes,
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
    const router = useRouter();
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
    const [errors, setErrors] = useState<{
        exercise?: string;
        type?: string;
        duration?: string;
        date?: string;
        description?: string;
    }>({});
    const host = process.env.NEXT_PUBLIC_API_URL;
    // const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchActivitySuggestions = async (category: string, filter: any) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch(
                    `${host}/api/workout/activity?category=${category}&filter=${filter}`,
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
            } catch (error) {
                console.error("Error fetching activity suggestions:", error);
            }
        }
    };

    const fetchFilteredWorkouts = async (page: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `${host}/api/workout/filter?filterDate=${filterDate}&page=${page}&limit=9`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
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
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `${host}/api/workout/filter?filterDate=${filterDate}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=9`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (event: any) => {
        if (event.target.value) {
            // setCurrentPage(1);
            setFilterDate(event.target.value);
        }
    };

    const removeFilter = () => {
        setFilterDate("");
        fetchWorkouts(currentPage);
    };

    const fetchWorkouts = async (page: number) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await fetch(`${host}/api/workout?page=${page}&limit=9`, {
                    method: "GET",
                    headers: { Authorization: `${token}` }, // Ensure Bearer token format
                });

                if (res.ok) {
                    const data = await res.json();
                    setWorkouts(data.result);
                    setCurrentPage(data.pagination.currentPage);
                    setTotalPages(data.pagination.totalPages);
                } else if (!user) {
                    const errorText = await res.text();
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

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleAddWorkout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await fetch(`${host}/api/workout`, {
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
        setEditWorkout(workout);
        setShowForm(true);
    };

    const handleDeleteWorkout = async (workout: Workout) => {
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
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${host}/api/workout/${workout.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });

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

        if (token && editWorkout?.id) {
            try {
                const res = await fetch(`${host}/api/workout/${editWorkout.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(editWorkout),
                });

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

    const handleShowChart = () => {
        setShowChart(!showChart);
        setNewWorkout({});
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
                label: "Calories Burnt (cal)",
                text: "rgba(255,255,255,1)",
                data: workouts?.map((workout: Workout) => workout.calories_burnt),
                backgroundColor: "rgba(30, 144, 255, 1)",
                borderColor: "rgba(30, 144, 255, 1)",
                borderWidth: 1,
            },
            {
                label: "Duration (minutes)",
                data: workouts?.map((workout) => workout.duration),
                backgroundColor: "rgba(106, 13, 173, 1)",
                borderColor: "rgba(106, 13, 173, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Utility function to sanitize inputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizeInput = (input: any) => {
        const element = document.createElement("div");
        element.innerText = input;
        return element.innerHTML;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validateText = (input: any) => {
        const pattern = /^[^$]+$/;
        return pattern.test(input);
    };

    const validate = () => {
        const errors: {
            exercise?: string;
            type?: string;
            duration?: string;
            date?: string;
            description?: string;
        } = {};
        const sanitizedNewWorkout = {
            exercise: sanitizeInput(newWorkout.exercise),
            type: sanitizeInput(newWorkout.type),
            duration: newWorkout.duration,
            date: newWorkout.date,
            description: sanitizeInput(newWorkout.description),
        };

        const sanitizedEditWorkout = editWorkout && {
            exercise: sanitizeInput(editWorkout.exercise),
            type: sanitizeInput(editWorkout.type),
            duration: editWorkout.duration,
            date: editWorkout.date,
            description: sanitizeInput(editWorkout.description),
        };

        if (!sanitizedNewWorkout.exercise && !sanitizedEditWorkout?.exercise) {
            errors.exercise = "Exercise is required";
        } else if (
            !validateText(sanitizedNewWorkout.exercise) ||
            !validateText(sanitizedEditWorkout?.exercise)
        ) {
            errors.exercise = "Invalid characters in exercise";
        }

        if (!sanitizedNewWorkout.type && !sanitizedEditWorkout?.type) {
            errors.type = "Type is required";
        } else if (
            !validateText(sanitizedNewWorkout.type) ||
            !validateText(sanitizedEditWorkout?.type)
        ) {
            errors.type = "Invalid characters in type";
        }

        if (!sanitizedNewWorkout.duration && !sanitizedEditWorkout?.duration) {
            errors.duration = "Duration is required";
        }

        if (
            (sanitizedNewWorkout.description &&
                !validateText(sanitizedNewWorkout.description)) ||
            (sanitizedEditWorkout?.description &&
                !validateText(sanitizedEditWorkout.description))
        ) {
            errors.description = "Invalid characters in description";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        // e.preventDefault();
        if (validate()) {
            if (editWorkout) {
                handleUpdateWorkout();
            } else {
                handleAddWorkout();
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchWorkouts(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        if (newWorkout.type || editWorkout?.type) {
            fetchActivitySuggestions(newWorkout.type || editWorkout?.type || "", "");
        }
    }, [newWorkout.type, editWorkout?.type]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            if (filterDate && filterDate !== "custom") {
                fetchFilteredWorkouts(currentPage);
            } else {
                setFilterDate("");
                fetchWorkouts(currentPage);
            }
        }
    }, [filterDate]);

    return (
        <div className="container mx-auto p-4">
            {!showForm && (
                <div>
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
                </div>
            )}
            {!showForm && (
                <div className="mb-4 flex items-center space-x-0">
                    <select
                        id="filterDate"
                        value={filterDate}
                        onChange={handleFilterChange}
                        className="p-3 bg-gray-700 text-white rounded-l-md rounded-r-none"
                    >
                        <option value="">Filter Date Range</option>
                        <option value="one_week">Last Week</option>
                        <option value="one_month">Last Month</option>
                        <option value="three_months">Last 3 Months</option>
                        <option value="six_months">Last 6 Months</option>
                        <option value="one_year">Last Year</option>
                        <option value="custom">Custom Date Range</option>
                    </select>

                    {filterDate && (
                        <button
                            onClick={removeFilter}
                            className="p-3 text-white rounded-r-md rounded-l-none flex items-center"
                        >
                            <FaTimes />
                        </button>
                    )}
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
                            const value = e.target.value; // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
                    {errors.exercise && (
                        <div className="text-red-500">{errors.exercise}</div>
                    )}
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
                    {errors.duration && (
                        <div className="text-red-500">{errors.duration}</div>
                    )}
                    <input
                        className="w-full p-3 mb-4 border border-gray-300 rounded text-black"
                        type="date"
                        placeholder="Date"
                        value={
                            (editWorkout?.date instanceof Date
                                ? editWorkout.date
                                : editWorkout?.date
                                    ? new Date(editWorkout.date)
                                    : undefined
                            )
                                ?.toISOString()
                                .split("T")[0] ||
                            (newWorkout.date instanceof Date
                                ? newWorkout.date
                                : newWorkout.date
                                    ? new Date(newWorkout.date)
                                    : undefined
                            )
                                ?.toISOString()
                                .split("T")[0] ||
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
                    {errors.date && <div className="text-red-500">{errors.date}</div>}
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
                    {errors.description && (
                        <div className="text-red-500">{errors.description}</div>
                    )}
                    <div className="button-container  justify-self-center">
                        {editWorkout ? (
                            <div className="buttons">
                                <button onClick={handleSubmit}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        ) : (
                            <div className="buttons">
                                <button onClick={handleSubmit}>Add</button>
                                <button onClick={handleCancelAdd}>Cancel</button>
                            </div>
                        )}
                    </div>
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
                            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300 w-32"
                        >
                            Previous
                        </button>
                        <span className="text-black mx-4">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage == totalPages}
                            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300 w-32"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
