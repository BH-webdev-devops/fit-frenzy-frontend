"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register }: any = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await register(name, email, password);
        if (response.message === "User registered successfully") {
          router.push("/login");
        } else if (response.message === "User already exists") {
          alert(response.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizeInput = (input: any) => {
    const element = document.createElement("div");
    element.innerText = input;
    return element.innerHTML;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateText = (input: any) => {
    const pattern = /^[a-zA-Z0-9 !._@-]+$/;
    return pattern.test(input);
  };

  const validate = () => {
    const errors: { name?: string; email?: string; password?: string } = {};
    const sanitizedForm = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    };

    if (!sanitizedForm.name) {
      errors.name = "Name is required";
    } else if (!validateText(sanitizedForm.name)) {
      errors.name = "Invalid name";
    }

    if (!sanitizedForm.email) {
      errors.email = "Email is required";
    } else if (!validateText(sanitizedForm.email)) {
      errors.email = "Invalid email";
    }

    if (!sanitizedForm.password) {
      errors.password = "Password is required";
    } else if (sanitizedForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!validateText(sanitizedForm.password)) {
      errors.password = "Invalid password";
    }
    setErrors(errors);
    console.log(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-1 flex-col justify-center bg-neutral-800 px-6 lg:px-8">
        <div className="mt-[-2rem] sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-white">
            Join FitFrenzy Family
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-white"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  placeholder="Name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-white"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 px-4 py-3 text-lg font-semibold shadow-sm hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
