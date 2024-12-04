"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    user,
    loading,
    isAuth,
    profileExists,
    logout,
    profile,
    addProfile,
    updateProfile,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any = useAuth();
  const router = useRouter();

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
    if (!loading && !isAuth && !user) {
      router.push("/register");
    }
  }, [loading, isAuth, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const combinedData = { ...profileForm, ...userForm };
    const result = await updateProfile(combinedData);

    if (result.success) {
      alert(result.message);
      setIsEditing(false);
      console.log(combinedData);
      console.log(result);
    } else {
      alert(result.details);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addProfile(profileForm);

    if (result.success) {
      alert(result.message);
      router.push("/profile");
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profileExists) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Hello {user?.name}
        </h1>
        <p className="text-gray-600 mb-4">
          Please complete your profile information:
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center text-black bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10"
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Create Your Profile
          </h1>

          <input
            type="text"
            placeholder="Gender"
            value={profileForm.gender}
            onChange={(e) =>
              setProfileForm({ ...profileForm, gender: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Age"
            value={profileForm.age}
            onChange={(e) =>
              setProfileForm({ ...profileForm, age: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Weight"
            value={profileForm.weight}
            onChange={(e) =>
              setProfileForm({ ...profileForm, weight: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Height"
            value={profileForm.height}
            onChange={(e) =>
              setProfileForm({ ...profileForm, height: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <textarea
            placeholder="Bio"
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm({ ...profileForm, bio: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="text"
            placeholder="Location"
            value={profileForm.location}
            onChange={(e) =>
              setProfileForm({ ...profileForm, location: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="date"
            value={profileForm.birthday}
            onChange={(e) =>
              setProfileForm({ ...profileForm, birthday: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Create Profile
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Welcome, {user?.name}
      </h1>
      <p className="text-gray-700 mb-6 text-lg">
        Here is your profile information:
      </p>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        {isEditing ? (
          <form
            onSubmit={handleUpdate}
            className="flex flex-col items-center text-black bg-white p-6 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Update Your Profile
            </h1>

            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={userForm.password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setUserForm((prevUserForm) => ({
                  ...prevUserForm,
                  password: newPassword ? newPassword : prevUserForm.password,
                }));
              }}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />

            <input
              type="text"
              placeholder="Gender"
              value={profileForm.gender}
              onChange={(e) =>
                setProfileForm({ ...profileForm, gender: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Age"
              value={profileForm.age}
              onChange={(e) =>
                setProfileForm({ ...profileForm, age: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Weight"
              value={profileForm.weight}
              onChange={(e) =>
                setProfileForm({ ...profileForm, weight: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="number"
              placeholder="Height"
              value={profileForm.height}
              onChange={(e) =>
                setProfileForm({ ...profileForm, height: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <textarea
              placeholder="Bio"
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Location"
              value={profileForm.location}
              onChange={(e) =>
                setProfileForm({ ...profileForm, location: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="date"
              value={profileForm.birthday}
              onChange={(e) =>
                setProfileForm({ ...profileForm, birthday: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Update Profile
            </button>
          </form>
        ) : (
          <>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Gender:</strong> {profile.gender}
            </p>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Age:</strong> {profile.age}
            </p>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Weight:</strong> {profile.weight}
            </p>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Height:</strong> {profile.height}
            </p>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Bio:</strong> {profile.bio}
            </p>
            <p className="text-lg font-medium text-black mb-2">
              <strong>Location:</strong> {profile.location}
            </p>
            <p className="text-lg font-medium text-black mb-6">
              <strong>Birthday:</strong> {profile.birthday}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-yellow-500 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
}
