"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaTransgenderAlt,
  FaBirthdayCake,
  FaWeightHanging,
  FaRuler,
  FaMapMarkerAlt,
  FaRegUserCircle,
} from "react-icons/fa";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export default function Profile() {
  const {
    user,
    loading,
    isAuth,
    profileExists,
    profile,
    addProfile,
    updateProfile,
    isLoggedIn,
    quotes,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = useAuth();
  const router = useRouter();

  const [randomQuote, setRandomQuote] = useState("Keep pushing forward!");

  const [profileForm, setProfileForm] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    bio: "",
    location: "",
    birthday: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        gender: profile.gender || "",
        age: profile.age || "",
        weight: profile.weight || "",
        height: profile.height || "",
        bio: profile.bio || "",
        location: profile.location || "",
        birthday: profile.birthday ? formatDate(profile.birthday) : "",
      });
    }

    if (user) {
      setUserForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [profile, user]);

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]?.name || "Keep pushing forward!");
    }
  }, [quotes]);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isAuth, router, isLoggedIn]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addProfile(profileForm);

    if (result.success) {
      router.push("/profile");
    } else {
      alert(result.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedData = { ...profileForm, ...userForm };
    const result = await updateProfile(combinedData);

    if (result.success) {
      router.push("/profile");
      setIsEditing(false);
    } else {
      alert(result.details);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setProfileForm({
        gender: profile.gender || "",
        age: profile.age || "",
        weight: profile.weight || "",
        height: profile.height || "",
        bio: profile.bio || "",
        location: profile.location || "",
        birthday: profile.birthday || "",
      });
    }

    if (user) {
      setUserForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }

    setIsEditing(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center text-center p-6 bg-neutral-800 min-h-screen text-white py-24">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="my-16">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
          {quotes && (
            <div className="mt-16 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-lg bg-neutral-600">
              <h1 className="text-2xl">{randomQuote}</h1>
            </div>
          )}

          {profileExists ? (
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm text-black">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6 mt-16">
                  <h1 className="text-2xl font-semibold text-gray-300 mb-4">
                    Update Your Profile
                  </h1>

                  <input
                    type="text"
                    placeholder="Name"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setUserForm((prevUserForm) => ({
                        ...prevUserForm,
                        password: newPassword
                          ? newPassword
                          : prevUserForm.password,
                      }));
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />

                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, gender: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Age"
                    value={profileForm.age}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, age: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />

                  <input
                    type="number"
                    placeholder="Weight"
                    value={profileForm.weight}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        weight: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={profileForm.height}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        height: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <textarea
                    placeholder="Bio"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                  />
                  <input
                    type="date"
                    value={profileForm.birthday}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        birthday: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                  />

                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition"
                    >
                      Update Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full bg-red-400 py-3 px-6 rounded-md font-semibold hover:bg-red-500 transition ml-4"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-16 p-6 rounded-lg shadow-lg min-w-[360px] w-full max-w-md mx-auto text-lg bg-neutral-600">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-2 gap-y-4 text-left">
                    <div className="text-gray-200 font-medium flex items-center">
                      <FaTransgenderAlt className="mr-2 text-blue-500" />{" "}
                      Gender:
                    </div>
                    <div className="text-white">
                      {profile.gender || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaRegUserCircle className="mr-2 text-blue-500" /> Age:
                    </div>
                    <div className="text-white">
                      {profile.age || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaWeightHanging className="mr-2 text-blue-500" /> Weight:
                    </div>
                    <div className="text-white">
                      {profile.weight || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaRuler className="mr-2 text-blue-500" /> Height:
                    </div>
                    <div className="text-white">
                      {profile.height || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaRegUserCircle className="mr-2 text-blue-500" /> Bio:
                    </div>
                    <div className="text-white">
                      {profile.bio || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />{" "}
                      Location:
                    </div>
                    <div className="text-white">
                      {profile.location || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium flex items-center">
                      <FaBirthdayCake className="mr-2 text-blue-500" />{" "}
                      Birthday:
                    </div>
                    <div className="text-white">
                      {profile.birthday || "Not specified"}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-md font-semibold transition"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm text-black">
              <form onSubmit={handleFormSubmit} className="space-y-6 mt-16">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Create your profile!
                </h2>
                <select
                  value={profileForm.gender}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, gender: e.target.value })
                  }
                  className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Age*"
                  value={profileForm.age}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, age: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="number"
                  placeholder="Weight*"
                  value={profileForm.weight}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, weight: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="number"
                  placeholder="Height*"
                  value={profileForm.height}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, height: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <textarea
                  placeholder="Bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={profileForm.location}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, location: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, birthday: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-500 py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition"
                >
                  Create Profile
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
