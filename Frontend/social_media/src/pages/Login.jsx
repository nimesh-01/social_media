import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Password toggle state

  const loginhandler = async (user) => {
    setLoginError({ email: "", password: "" });

    try {
      await axios.post(`${backendUrl}/api/login`, user, {
        withCredentials: true
      });
      toast.success("Login Successful!", { autoClose: 800 });
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const msg = error.response.data.message;
        if (msg.includes("user")) {
          setLoginError(prev => ({ ...prev, email: msg }));
        } else if (msg.includes("Password")) {
          setLoginError(prev => ({ ...prev, password: msg }));
        } else {
          toast.error(msg, { autoClose: 800 });
        }
      } else {
        toast.error("Something went wrong", { autoClose: 800 });
      }
    }
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token) navigate('/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3D9D4] p-4">
      <form
        onSubmit={handleSubmit(loginhandler)}
        className="w-full max-w-md bg-[#2E3944] rounded-xl shadow-md px-8 py-10 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#124E66]">Login</h2>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <input
            {...register("email_id", { required: "Email is required" })}
            className="border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#124E66]"
            type="email"
            placeholder="Email ID"
          />
          <small className="text-[#e63946] text-xs">
            {errors?.email_id?.message || loginError.email}
          </small>
        </div>

        {/* Password Input with Toggle */}
        <div className="flex flex-col gap-1 relative">
          <input
            {...register("password", { required: "Password is required" })}
            className="border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#124E66]"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-2.5 text-xl"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
          <small className="text-[#e63946] text-xs">
            {errors?.password?.message || loginError.password}
          </small>
        </div>

        {/* Login Button */}
        <button className="bg-[#124E66] text-white py-2 rounded font-semibold hover:bg-[#2E3944] transition">
          Login
        </button>

        {/* Link to Register */}
        <p className="text-sm text-center text-[#D3D9D4]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#748D92] font-medium hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
