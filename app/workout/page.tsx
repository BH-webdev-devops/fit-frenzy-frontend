"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaDumbbell, FaClock, FaFire, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


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
        loading,
        isAuth
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any = useAuth();
    const router = useRouter();

    const [workouts, setWorkouts] = useState<Workout[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showChart, setShowChart] = useState(false);
    const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({})
    const [editWorkout, setEditWorkout] = useState<Partial<Workout> | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [activitySuggestions, setActivitySuggestions] = useState<string[]>([]);
    const [deleteWorkout, setDeleteWorkout] = useState<Workout | null>(null);

    const fetchActivitySuggestions = async (category: string, filter: any) => {
        console.log("Fetching activity suggestions");
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/workout/activity?category=${category}&filter=${filter}`, {
                method: "GET",
                headers: { Authorization: `${token}` }, // Ensure Bearer token format
            });
            if (response.ok) {
                const data = await response.json();
                setActivitySuggestions(data);
            } else {
                console.error('Error fetching activity suggestions:', response.status, response.statusText);
            }
            console.log("Activity Suggestions:", activitySuggestions);
        } catch (error) {
            console.error('Error fetching activity suggestions:', error);
        }
    };

    useEffect(() => {
        if (newWorkout.type || editWorkout?.type) {
            fetchActivitySuggestions(newWorkout.type || editWorkout?.type || '', '');
        }
    }, [newWorkout.type, editWorkout?.type]);



    const fetchWorkouts = async (page: number) => {
        console.log("fetching workouts");
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debugging log

        if (token) {
            try {
                const res = await fetch(`http://localhost:3000/api/workout?page=${page}&limit=10`, {
                    method: "GET",
                    headers: { Authorization: `${token}` }, // Ensure Bearer token format
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Fetched data:", data);
                    setWorkouts(data.result);
                    setCurrentPage(data.pagination.currentPage);
                    setTotalPages(data.pagination.totalPages);
                } else {
                    const errorText = await res.text();
                    console.log(res)
                    console.error("Error fetching workouts:", res.status, res.statusText, errorText);
                }
            } catch (err) {
                console.log(err);
                console.error(`Error fetching workouts: ${err}`);
            }
        } else {
            console.error("No token found");
        }
    }

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
    };

    const handleAddWorkout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await fetch(`http://localhost:3000/api/workout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`
                    },
                    body: JSON.stringify(newWorkout),
                });

                if (res.ok) {
                    fetchWorkouts(currentPage);
                    setNewWorkout({});
                    setShowForm(false);
                } else {
                    const errorText = await res.text();
                    console.error("Error adding workout:", res.status, res.statusText, errorText);
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

        const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/workout/${workout.id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`
                }
            });

            if (response.ok) {
                // Update the state to remove the deleted workout
                setWorkouts((prevWorkouts) => prevWorkouts ? prevWorkouts.filter((w) => w.id !== workout.id) : []);
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
                const res = await fetch(`http://localhost:3000/api/workout/${editWorkout.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`
                    },
                    body: JSON.stringify(editWorkout),
                });

                if (res.ok) {
                    fetchWorkouts(currentPage);
                    setEditWorkout(null);
                    setShowForm(false);
                } else {
                    const errorText = await res.text();
                    console.error("Error updating workout:", res.status, res.statusText, errorText);
                }
            } catch (err) {
                console.error(`Error updating workout: ${err}`);
            }
        } else {
            console.error("No token found or no workout selected for editing");
        }
    };

    const handleCancelEdit = () => {
        setEditWorkout(null);
    };

    const handleCancelAdd = () => {
        setNewWorkout({});
        setShowForm(false);
    };

    useEffect(() => {
        fetchWorkouts();
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
        labels: workouts?.map((workout: Workout) => new Date(workout.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Calories Burnt',
                data: workouts?.map((workout: Workout) => (workout.calories_burnt)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Duration (minutes)',
                data: workouts?.map(workout => workout.duration),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
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
                        Add Workout
                    </button>
                </div>
            </div>
            {showChart && (
                <div className="chart-container">
                    <Bar data={chartData} />
                </div>
            )}
            <div className="workout-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts?.map((workout) => (
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
                                <span>{workout.calories_burnt} calories</span>
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
                            <button onClick={() => handleEditWorkout(workout)} className="edit">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteWorkout(workout)} className="delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination flex justify-center mt-6">
                <button onClick={handlePreviousPage} disabled={currentPage == 1} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300">
                    Previous
                </button>
                <span className="text-black mx-4">Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage == totalPages} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-300">
                    Next
                </button>
            </div>
        </div>
    );
}