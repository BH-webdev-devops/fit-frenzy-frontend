"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { login, forgotPassword }: any = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<{ newPassword?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.log(response);
      if (response.message === "Login successful") {
        router.push("/profile");
      } else if (response.message === "Invalid credentials") {
        alert(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizeInput = (input: any) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateText = (input: any) => {
    const pattern = /^[a-zA-Z0-9 !_@-]+$/;
    return pattern.test(input);
  };

  const validate = () => {
    if (!forgotEmail || !birthdate || !newPassword) {
      alert("Please provide all required fields");
      return;
    }
    const errors: { newPassword?: string } = {};
    const sanitizedForm = {
      newPassword: sanitizeInput(newPassword),
    };
    if (!sanitizedForm.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (sanitizedForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!validateText(sanitizedForm.newPassword)) {
      errors.newPassword = 'Invalid password';
    }
    setErrors(errors);
    console.log(errors);
    return Object.keys(errors).length === 0;
  }


  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {

      try {
        const response = await forgotPassword(forgotEmail, birthdate, newPassword);
        if (response.ok) {
          alert(response.message);
          setShowForgotPassword(false);
          router.push("/login");
        } else {
          alert(response.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-1 flex-col justify-center bg-neutral-800 px-6 lg:px-8">
        <div className="mt-[-2rem] sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-white">
            Welcome Back!
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                  />
                </div>
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
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-neutral-400 px-4 py-3 text-lg font-semibold text-black shadow-sm hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                >
                  Login
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} method="POST" className="space-y-6">
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-lg font-medium text-white"
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-lg font-medium text-white"
                >
                  Birthdate
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-lg font-medium text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                />
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-500 px-4 py-3 text-lg font-semibold text-black shadow-sm hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                >
                  Update Password
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
