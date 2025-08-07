import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state

  const registerhandler = async (user) => {
    try {
      await axios.post('http://localhost:3000/api/register', user, {
        withCredentials: true
      });

      toast.success("Registered Successfully", { autoClose: 800 });
      navigate('/login');
    } catch (error) {
      const { response } = error;
      if (response?.status === 409) {
        const { field, message } = response.data;
        setError(field, { type: "manual", message });
      } else {
        toast.error("Registration failed");
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
        onSubmit={handleSubmit(registerhandler)}
        className="w-full max-w-md bg-[#2E3944] rounded-xl shadow-md px-8 py-10 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#124E66]">Register</h2>

        <div className="flex gap-2">
          <div className="w-1/2">
            <input
              {...register("fname", { required: "First name is required" })}
              className="w-full border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#124E66]"
              placeholder="First Name"
            />
            {errors.fname && <small className="text-red-400">{errors.fname.message}</small>}
          </div>
          <div className="w-1/2">
            <input
              {...register("lname", { required: "Last name is required" })}
              className="w-full border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#124E66]"
              placeholder="Last Name"
            />
            {errors.lname && <small className="text-red-400">{errors.lname.message}</small>}
          </div>
        </div>

        <div>
          <input
            {...register("username", { required: "Username is required" })}
            className="w-full border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#124E66]"
            placeholder="Username"
          />
          {errors.username && <small className="text-red-400">{errors.username.message}</small>}
        </div>

        <div>
          <input
            {...register("email_id", { required: "Email is required" })}
            type="email"
            className="w-full border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#124E66]"
            placeholder="Email ID"
          />
          {errors.email_id && <small className="text-red-400">{errors.email_id.message}</small>}
        </div>

        {/* Password field with toggle button */}
        <div className="relative">
          <input
            {...register("password", { required: "Password is required" })}
            type={showPassword ? "text" : "password"}
            className="w-full border border-[#748D92] bg-[#D3D9D4] text-[#212A31] rounded px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#124E66]"
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
          {errors.password && <small className="text-red-400">{errors.password.message}</small>}
        </div>

        <button className="bg-[#124E66] text-white py-2 rounded font-semibold hover:bg-[#2E3944] transition">
          Register
        </button>

        <p className="text-sm text-center text-[#D3D9D4]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#748D92] font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
