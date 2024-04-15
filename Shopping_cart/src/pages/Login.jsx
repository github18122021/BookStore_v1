import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react";

function Login() {
    let [Error, isError] = useState(null);

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if(token) {
            checkToken();
        }

        async function checkToken() {
            try {

                const response = await axios.get("http://localhost:3000/verify", {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                });
                
                console.log("Response:", response.data);

                navigate("/bookstore");
              } catch (error) {
                  
                console.error("Error:", error.message);
              }
        }
    })
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    function submitForm(data) {
        // alert("Form submitted");

        const {email, password} = data;

        const currentUser = {
            email, 
            password
        }

        loginUser.mutate(currentUser);
    }

    let loginUser = useMutation({
        mutationKey: "login",
        mutationFn: async (user) => {
            let response = await axios.post("http://localhost:3000/login", user);

            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
            localStorage.setItem("token", data.token)
            navigate("/bookstore");
            
        },
        onError: (error) => {
            console.log(error);
            if(error.response) {
                if(error.response.data && error.response.data.error) {
                    isError(error.response.data.error);
                } else {
                    isError("Error occurred while logging in user!");
                }
            } else if (error.request) {
                isError("Error occurred while requesting data from server!");
            } else {
                isError("Something went wrong!");
            }
        }
    })



    return (
        <section className="flex flex-col items-center justify-start h-screen bg-gray-100">
            <section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-20">
                <h2 className="text-2xl font-bold mb-6">Login</h2>

                <form onSubmit={handleSubmit(submitForm)}>

                {Error && <p className="text-red-500 text-xl italic">{Error}</p>}
                
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
                            Login
                        </button>
                        <Link
                            className="font-bold text-sm text-blue-500 hover:text-blue-800"
                            to="/"
                        >
                            Not a member yet?
                        </Link>
                    </section>
                </form>
            </section>
        </section>
    );
}

export default Login;