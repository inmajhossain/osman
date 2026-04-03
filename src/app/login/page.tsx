"use client";

import { useState } from "react";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow p-6 w-80">
        <h1 className="mb-4 font-bold text-xl">Login</h1>

        <input
          placeholder="Username"
          className="mb-3 p-2 border w-full"
          onChange={e => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-3 p-2 border w-full"
          onChange={e => setPass(e.target.value)}
        />

        <button onClick={login} className="bg-blue-600 p-2 w-full text-white">
          Login
        </button>
      </div>
    </div>
  );
}
