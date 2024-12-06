/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: any;
  profile: any;
  isAuth: boolean;
  loading: boolean;
  profileExists: boolean;
  isLoggedIn: boolean;
  quotes: any;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addProfile: (formData: object) => void;
  updateProfile: (formData: object) => void;
  setLoading: (loading: boolean) => void;
  setIsAuth: (isAuth: boolean) => void;
  forgotPassword: (
    email: string,
    birthdate: string,
    newPassword: string
  ) => Promise<void>;
  setAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quotes, setQuotes] = useState();
  const [isAdmin, setAdmin] = useState(false);

  const host = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const isTokenExpired = (token: string): boolean => {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, []);

  const fetchQuotes = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch(`${host}/api/quotes`, {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setQuotes(data.result);
        } else {
          console.error("Error fetching quotes:", res.status, res.statusText);
        }
      } catch (err) {
        console.error(`Error fetching quotes: ${err}`);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${host}/api/profile`, {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          setUser(data.user);
          setIsAuth(true);
          setProfile(data.result);
          setProfileExists(!!data.result);
          setAdmin(data.user.admin);
        } else if (res.status === 404) {
          setIsAuth(false);
          setProfileExists(false);
          setUser(null);
          setProfile(null);
        } else {
          console.error("Error fetching profile: ", res.statusText);
          setIsAuth(false);
        }
      } catch (err) {
        console.error(`Error fetching profile: ${err}`);
        setIsAuth(false);
        setProfileExists(false);
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
      const res = await fetch(`${host}/api/profile`, {
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
      const res = await fetch(`${host}/api/profile`, {
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
    const res = await fetch(`${host}/api/register`, {
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
    const res = await fetch(`${host}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      setIsAuth(true);
      setAdmin(data.user.admin);
      await fetchProfile();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    setProfileExists(false);
    setIsLoggedIn(false);
    router.push("/login");
  };

  const forgotPassword = async (
    email: string,
    birthdate: string,
    newPassword: string
  ) => {
    const res = await fetch("${host}/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, birthdate, newPassword }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
    return data;
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
        setLoading,
        setIsAuth,
        isLoggedIn,
        forgotPassword,
        quotes,
        isAdmin,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
