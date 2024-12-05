"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FaEdit, FaTrash, FaEye, FaArrowLeft } from 'react-icons/fa';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Profile {
    gender: "",
    age: "",
    weight: "",
    height: "",
    bio: "",
    location: "",
    birthday: "",
};

const host = process.env.NEXT_PUBLIC_API_URL;

export default function Admin() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isAuth, isAdmin }: any = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<Profile | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const { getAllUsers, getUserById, deleteUser }: any = useAuth();
    // const router = useRouter();

    useEffect(() => {
        if (isAuth && isAdmin) {
            fetchAllUsers();
        }
    }, [isAuth, isAdmin]);

    const handleDelete = async (id: number) => {
        const deleteId = id
        const token = localStorage.getItem("token");
        if (token && isAdmin) {
            try {
                const response = await fetch(`${host}/api/admin/users/${deleteId}`, {
                    method: "DELETE",
                    headers: { Authorization: `${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    fetchAllUsers();
                } else {
                    console.error(
                        "Error fetching users:",
                        response.status,
                        response.statusText
                    );
                }
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleView = async (id: number) => {
        const token = localStorage.getItem("token");
        if (token && isAdmin) {
            try {
                const response = await fetch(`${host}/api/admin/users/${id}`, {
                    method: "GET",
                    headers: { Authorization: `${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.result);
                    setUser(data.result);
                } else {
                    console.error(
                        "Error fetching users:",
                        response.status,
                        response.statusText
                    );
                }
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const fetchAllUsers = async () => {
        const token = localStorage.getItem("token");
        if (token && isAdmin) {
            try {
                const response = await fetch(`${host}/api/admin/users`, {
                    method: "GET",
                    headers: { Authorization: `${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.result);
                } else {
                    console.error(
                        "Error fetching users:",
                        response.status,
                        response.statusText
                    );
                }
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <div>
                {user ? (
                    <div className="profile-container">
                        <button onClick={() => setUser(null)} className="back-button">
                            <FaArrowLeft />
                        </button>
                        <div className="profile-card mt-16 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-lg bg-neutral-600">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Profile Information
                            </h2>
                            <div className="grid grid-cols-2 gap-y-4 text-left">
                                <div className="text-gray-200 font-medium">Gender:</div>
                                <div className="text-white">
                                    {user.gender || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Age:</div>
                                <div className="text-white">
                                    {user.age || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Weight:</div>
                                <div className="text-white">
                                    {user.weight || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Height:</div>
                                <div className="text-white">
                                    {user.height || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Bio:</div>
                                <div className="text-white">
                                    {user.bio || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Location:</div>
                                <div className="text-white">
                                    {user.location || "Not specified"}
                                </div>

                                <div className="text-gray-200 font-medium">Birthday:</div>
                                <div className="text-white">
                                    {user.birthday || "Not specified"}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <table className="users-table w-full justify-center bg-black ">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="view" onClick={() => handleView(user.id)}>
                                            <FaEye className="icon" />
                                        </button>
                                        {/* <button onClick={() => handleEdit(user.id)}>
                                    <FaEdit className="icon"} />
                                </button> */}
                                        <button className="trash" onClick={() => handleDelete(user.id)}>
                                            <FaTrash className="icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>)}
            </div>
        </div>
    );
};

