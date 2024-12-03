"use client";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeightEntry {
    id: number;
    user_id: number;
    weight: number;
    date: string;
}

export default function Progress() {
    const { user, isAuth, loading }: any = useAuth();
    const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

    const fetchWeightEntries = async () => {
        const token = localStorage.getItem('token');
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
    };

    useEffect(() => {
        fetchWeightEntries();
    }, []);

    const chartData = {
        labels: weightEntries.map((entry: WeightEntry) => new Date(entry.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Weight',
                data: weightEntries.map((entry: WeightEntry) => entry.weight),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="title">Weight Progress</h2>
            <div className="chart-container mb-4">
                <Line data={chartData} />
            </div>
        </div>
    );
}