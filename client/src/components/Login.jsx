import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = useState("login"); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password
      });

      if (data.success) {
        navigate('/')
        setUser(data.user)
        setShowUserLogin(false);
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium text-center mb-4">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type here"
              required
              className="border border-gray-200 rounded w-full p-2 outline-primary"
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type here"
            required
            className="border border-gray-200 rounded w-full p-2 outline-primary"
          />
        </div>

        <div className="w-full relative">
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type here"
            required
            className="border border-gray-200 rounded w-full p-2 outline-primary pr-16"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 cursor-pointer text-primary font-medium select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {state === "register" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span onClick={() => setState("login")} className="text-primary cursor-pointer">Click here</span>
          </p>
        ) : (
          <p className="text-sm">
            Create an account?{" "}
            <span onClick={() => setState("register")} className="text-primary cursor-pointer">Click here</span>
          </p>
        )}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
