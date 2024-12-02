"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
    const [showChart, setShowChart] = useState(false);
    const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({})
    const [editWorkout, setEditWorkout] = useState<Partial<Workout> | null>(null);
    const [showForm, setShowForm] = useState(false);



    const fetchWorkouts = async () => {
        console.log("fetching workouts");
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debugging log

        if (token) {
            try {
                const res = await fetch(`http://localhost:3000/api/workout`, {
                    method: "GET",
                    headers: { Authorization: `${token}` }, // Ensure Bearer token format
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Fetched data:", data);
                    setWorkouts(data.result);
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
                    fetchWorkouts();
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
                    fetchWorkouts();
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
        <div className="workout-container">
            <div className="button-container flex" >
                <h2 className="title justify-center">Workouts</h2>
                <button onClick={handleShowChart}>
                    {showChart ? "Hide Chart" : "Show Chart"}
                </button>
                <button onClick={handleAddUpdate}>
                    {"Add Workout"}
                </button>
            </div>
            {showForm && (
                <div className="workout-form">
                    {/* <h3>{editWorkout ? "Edit Workout" : "Add Workout"}</h3> */}
                    <input
                        type="text"
                        placeholder="Exercise"
                        value={editWorkout?.exercise || newWorkout.exercise || ""}
                        onChange={(e) => editWorkout ? setEditWorkout({ ...editWorkout, exercise: e.target.value }) : setNewWorkout({ ...newWorkout, exercise: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Type"
                        value={editWorkout?.type || newWorkout.type || ""}
                        onChange={(e) => editWorkout ? setEditWorkout({ ...editWorkout, type: e.target.value }) : setNewWorkout({ ...newWorkout, type: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Duration"
                        value={editWorkout?.duration || newWorkout.duration || ""}
                        onChange={(e) => editWorkout ? setEditWorkout({ ...editWorkout, duration: parseInt(e.target.value) }) : setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={(editWorkout?.date instanceof Date ? editWorkout.date.toISOString() : editWorkout?.date) || (newWorkout.date instanceof Date ? newWorkout.date.toISOString() : newWorkout.date) || new Date().toISOString()}
                        onChange={(e) => editWorkout ? setEditWorkout({ ...editWorkout, date: new Date(e.target.value) }) : setNewWorkout({ ...newWorkout, date: new Date(e.target.value) })}
                    />
                    <textarea
                        placeholder="Description"
                        value={editWorkout?.description || newWorkout.description || ""}
                        onChange={(e) => editWorkout ? setEditWorkout({ ...editWorkout, description: e.target.value }) : setNewWorkout({ ...newWorkout, description: e.target.value })}
                    />
                    {editWorkout ? (
                        <div className="edit-buttons">
                            <button onClick={handleUpdateWorkout}>Save</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    ) : (

                        <div className="edit-buttons">
                            <button onClick={handleAddWorkout}>Add</button>
                            <button onClick={handleCancelAdd}>Cancel</button>
                        </div>


                    )}

                </div>
            )}
            {showChart && (
                <div className="chart-container">
                    <Bar data={chartData} />
                </div>
            )}
            <div className="workout-list">
                {!editWorkout && workouts?.map((workout: Workout) => (
                    <div key={workout.id} className="workout-card">
                        <h3>{workout.exercise || "No Exercise Specified"}</h3>
                        <p><strong>Type:</strong> {workout.type}</p>
                        <p><strong>Description:</strong> {workout.description || "No Description"}</p>
                        <p><strong>Duration:</strong> {workout.duration} minutes</p>
                        <p><strong>Calories Burnt:</strong> {workout.calories_burnt}</p>
                        <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
                        <button onClick={() => handleEditWorkout(workout)}>
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}