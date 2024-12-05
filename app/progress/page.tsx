"use client";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface WeightEntry {
    id: number;
    user_id: number;
    weight: number;
    date: string;
}

interface WorkoutEntry {
    id: number;
    user_id: number;
    exercise: string | null;
    description: string | null;
    duration: number;
    date: string;
    type: string;
    calories_burnt: number;
    created_at: string;
    updated_at: string;
}

export default function Progress() {
    const { user, isAuth, loading, isLoggedIn }: any = useAuth();
    const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
    const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
    const [showPieChart, setShowPieChart] = useState(true);
    const [showLineChart, setShowLineChart] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        if (!token || !isAuth) {
            router.push('/login');
        } else {
            console.log('token:', token);
            fetchWeightEntries();
            fetchWorkoutEntries();
        }
    }, [isAuth]);

    const fetchWeightEntries = async () => {
        const token = localStorage.getItem('token'); if (!token) return;
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/profile/weight', {
                    method: 'GET',
                    headers: { Authorization: `${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setWeightEntries(data.result);
                } else {
                    console.error('Error fetching weight entries:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching weight entries:', error);
            }
        }
        else {
            console.error('No token found');
            return
        }
    }

    const fetchWorkoutEntries = async () => {
        const token = localStorage.getItem('token'); if (!token) return;
        if (token) {
            try {
                const response = await fetch('http://localhost:3000/api/workout/all', {
                    method: 'GET',
                    headers: { Authorization: `${token}` },
                });
                if (response.ok) {
                    const data = await response.json();

                    setWorkoutEntries(data.result);
                    console.log(data);
                } else {
                    console.error('Error fetching workout entries:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching workout entries:', error);
            }
        } else {
            console.error('No token found');
            return
        }
    }

    const workoutTypes = workoutEntries.reduce((acc: { [key: string]: number }, entry: WorkoutEntry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(workoutTypes),
        datasets: [
            {
                label: 'Workout Distribution',
                data: Object.values(workoutTypes),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(201, 203, 207, 0.5)',
                    'rgba(255, 99, 132, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(75, 192, 192, 0.3)',
                    'rgba(255, 206, 86, 0.3)',
                    'rgba(153, 102, 255, 0.3)',
                    'rgba(255, 159, 64, 0.3)',
                    'rgba(201, 203, 207, 0.3)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(201, 203, 207, 0.8)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartData = {
        labels: weightEntries.map((entry: WeightEntry) => new Date(entry.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Weight',
                data: weightEntries.map((entry: WeightEntry) => entry.weight),
                fill: false,
                backgroundColor: 'rgba(192, 248, 192, 0.4)',
                borderColor: 'rgba(192,75,192,1)',
                // backgroundColor: 'rgba(75,192,192,0.4)',
                // borderColor: 'rgba(75,192,192,1)',


            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <button onClick={() => setShowPieChart(!showPieChart)}>
                {showPieChart ? '▼ Hide Weight Tracker' : '► Show Weight Tracker'}
            </button>
            {showPieChart && (
                <div>
                    <h2 className="title">Weight Progress</h2>
                    <div className="chart-container bg-gray mb-4 ">
                        <Line data={chartData} />
                    </div>
                </div>
            )}

            <button onClick={() => setShowLineChart(!showLineChart)}>
                {showLineChart ? '▼ Hide Workout Progress' : '► Show Workout Progress'}
            </button>
            {showLineChart && (
                <div>
                    <h2 className="title">Workout Progress</h2>
                    <div className="chart-container bg-gray">
                        <Pie data={pieData} />
                    </div>
                </div>
            )}


        </div>
    );
}
