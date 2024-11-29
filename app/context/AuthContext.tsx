/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
  isAuth: boolean;
  loading: boolean;
  profileExists: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addProfile: (formData: object) => void;
  updateProfile: (formData: object) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`http://localhost:3000/api/profile`, {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuth(true);
          setProfileExists(!!data.result);
          setProfile(data.result);
        } else {
          setIsAuth(false);
          setProfileExists(false);
        }
      } catch (err) {
        setIsAuth(false);
        setProfileExists(false);
        console.error(`Error fetching profile: ${err}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const addProfile = async (profileData: object) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.result);
        setProfileExists(true);
        return { success: true, message: "Profile added successfully" };
      } else {
        console.error("Failed to create profile");
        return { success: false, message: "Failed to create profile" };
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      return { success: false, message: "Error creating profile" };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (userData: {
    name?: string;
    email?: string;
    password?: string;
    gender?: string;
    age?: number;
    weight?: number;
    height?: number;
    bio?: string;
    location?: string;
    birthday?: string;
  }): Promise<{ success: boolean; message: string; result?: any }> => {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Authentication token not found" };
    }

    try {
      const res = await fetch(`http://localhost:3000/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setProfile(data.result);
        return { success: true, message: data.message, result: data.result };
      } else {
        console.error("Update failed", data);
        return { success: false, message: data.message || "Update failed" };
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      return {
        success: false,
        message: "An error occurred while updating details",
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
    return data;
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      await fetchProfile();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    setProfileExists(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        login,
        register,
        logout,
        profileExists,
        profile,
        addProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
