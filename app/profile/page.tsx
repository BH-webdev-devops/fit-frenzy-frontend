"use client";
import { error } from "console";
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
  const {
    user,
    loading,
    isAuth,
    profileExists,
    profile,
    addProfile,
    updateProfile,
    isLoggedIn,
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
  const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string, age?: string, weight?: string, height?: string, location?: string, birthday?: string, bio?: string }>({});

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
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isAuth, router, isLoggedIn]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const result = await addProfile(profileForm);

      if (result.success) {
        router.push("/profile");
      } else {
        alert(result.message);
      }
    };
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const combinedData = { ...profileForm, ...userForm };
      const result = await updateProfile(combinedData);

      if (result.success) {
        router.push("/profile");
        setIsEditing(false);
      } else {
        alert(result.details);
      }
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

  const sanitizeInput = (input: any) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  const validateText = (input: any) => {
    const pattern = /^[a-zA-Z0-9 !_@-]+$/;
    return pattern.test(input);
  };

  const validate = () => {
    const errors: { name?: string, email?: string, password?: string, age?: string, weight?: string, height?: string, location?: string, birthday?: string, bio?: string } = {};

    const sanitizedForm = {
      name: sanitizeInput(userForm.name),
      email: sanitizeInput(userForm.email),
      password: sanitizeInput(userForm.password),
      location: sanitizeInput(profileForm.location),
      bio: sanitizeInput(profileForm.bio),
    };

    if (!sanitizedForm.name) {
      errors.name = 'Name is required';
    } else if (!validateText(sanitizedForm.name)) {
      errors.name = 'Invalid name';
    }

    if (!sanitizedForm.email) {
      errors.email = 'Email is required';
    } else if (!validateText(sanitizedForm.email)) {
      errors.email = 'Invalid email';
    }

    if (!sanitizedForm.password) {
      errors.password = 'Password is required';
    } else if (sanitizedForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!validateText(sanitizedForm.password)) {
      errors.password = 'Invalid password';
    }

    if (!profileForm.age) {
      errors.age = 'Age is required';
    } else if (isNaN(Number(profileForm.age))) {
      errors.age = 'Invalid age';
    }

    if (!profileForm.weight) {
      errors.weight = 'Weight is required';
    } else if (isNaN(Number(profileForm.weight))) {
      errors.weight = 'Invalid weight';
    }

    if (!profileForm.height) {
      errors.height = 'Height is required';
    } else if (isNaN(Number(profileForm.height))) {
      errors.height = 'Invalid height';
    }

    if (!validateText(sanitizedForm.location)) {
      errors.location = 'Invalid location';
    }

    if (!profileForm.birthday) {
      errors.birthday = 'Birthday is required';
    } else if (isNaN(Date.parse(profileForm.birthday))) {
      errors.birthday = 'Invalid birthday';
    }

    if (!validateText(sanitizedForm.bio)) {
      errors.bio = 'Invalid bio';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;

  }

  return (
    <div className="flex flex-col items-center text-center p-6 bg-neutral-800 min-h-screen text-white py-24">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="my-16">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

          {profileExists ? (
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm text-black">
              <div className="flex ">
                <button
                  onClick={() => router.push("/workout")}
                  className="mt-4 bg-neutral-500 py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition mx-6"
                >
                  My Workouts
                </button>

                <button
                  onClick={() => router.push("/nutrition")}
                  className="mt-4 bg-neutral-500 py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition mx-6"
                >
                  My Recipes
                </button>
              </div>
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6 mt-16">
                  <h1 className="text-2xl font-semibold text-gray-300 mb-4">
                    Update Your Profile
                  </h1>

                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

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
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

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

                  <div>
                    <input
                      type="number"
                      placeholder="Age"
                      value={profileForm.age}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, age: e.target.value })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}

                  <div>
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={profileForm.weight}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          weight: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}

                  <div>
                    <input
                      type="number"
                      placeholder="Height (cm)"
                      value={profileForm.height}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          height: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                  <textarea
                    placeholder="Bio"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                  />
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
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
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
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
                  {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}

                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="w-full bg-neutral-400 text-black py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition"
                    >
                      Update Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full bg-red-400 text-black py-3 px-6 rounded-md font-semibold hover:bg-red-500 transition ml-4"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-16 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-lg bg-neutral-600">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-2 gap-y-4 text-left">
                    <div className="text-gray-200 font-medium">Gender:</div>
                    <div className="text-white">
                      {profile.gender || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Age:</div>
                    <div className="text-white">
                      {profile.age || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Weight:</div>
                    <div className="text-white">
                      {profile.weight || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Height:</div>
                    <div className="text-white">
                      {profile.height || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Bio:</div>
                    <div className="text-white">
                      {profile.bio || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Location:</div>
                    <div className="text-white">
                      {profile.location || "Not specified"}
                    </div>

                    <div className="text-gray-200 font-medium">Birthday:</div>
                    <div className="text-white">
                      {profile.birthday || "Not specified"}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 w-full bg-neutral-500 text-white py-3 px-6 rounded-md font-semibold transition"
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
                  placeholder="Age"
                  value={profileForm.age}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, age: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="number"
                  placeholder="Weight"
                  value={profileForm.weight}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, weight: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300 mt-2"
                />

                <input
                  type="number"
                  placeholder="Height"
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
                  className="w-full bg-neutral-400 text-black py-3 px-6 rounded-md font-semibold hover:bg-neutral-500 transition"
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
