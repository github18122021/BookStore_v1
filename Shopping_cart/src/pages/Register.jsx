import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  let [Error, setError] = useState(null);
  let [Success, setSuccess] = useState(null);
  
  const navigate = useNavigate();


  // form validation and error handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function submitForm(data) {
    // alert("Form submitted");

   let {name, email, password} = data;

   let currentUser = {
      name,
      email,
      password
   }

  //  console.log(currentUser);
   registerUser.mutate(currentUser);
  }


  // register user
  const registerUser = useMutation({
    mutationKey: "register",
    mutationFn: async (user) => {
      let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/register`, user);

      return response.data;
    },
    onSuccess: (data) => {
      setError(null);
      setSuccess(data.message);
      toast.success("User registered successfully!", {
        theme: "dark",
      })
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      setSuccess(null);
      if(error.response) {
        if(error.response.data && error.response.data.error) {

          setError(error.response.data.error);
          toast.error(error.response.data.error, {
            theme: "dark",
          });

        } else {

          setError("Error occurred while registering user!");

          toast.error("Error occurred while registering user!", {
            theme: "dark",
          });
        }
      } else if (error.request) {

        setError("Error occurred while requesting data from server!");
        toast.error("Error occurred while requesting data from server!", {
          theme: "dark",
        });

      } else {
        
        setError("Something Went Wrong!");
        toast.error("Something Went Wrong!", {
          theme: "dark",
        });
      }
      // setError(error.response.data.error);
    }
  })

  
  return (
    <section className="flex flex-col items-center justify-start h-screen bg-gray-100">
      <section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-20">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <form onSubmit={handleSubmit(submitForm)}>

          {Success && <p className="text-green-500 text-xl italic">{Success}</p>}

          {Error && <p className="text-red-500 text-xl italic">{Error}</p>}

          <section className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:outline-blue-700 focus:shadow-outline-blue"
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
                },
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm italic">{errors.name.message}</p>
            )}
          </section>

          <section className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none 
              focus:outline-blue-700 focus:shadow-outline-blue"
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm italic">{errors.email.message}</p>
            )}
          </section>

          <section className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none 
              focus:outline-blue-700 focus:shadow-outline-blue"
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 6,
                  message: "Password should have at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    "Password should have at least one letter and one number",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm italic">{errors.password.message}</p>
            )}

          </section>
          <section className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
            <Link
              className="font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/login"
            >
              Already a member?
            </Link>
          </section>
        </form>
      </section>
      <ToastContainer />
    </section>
  );
}

export default Register;
