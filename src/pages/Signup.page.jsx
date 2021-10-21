import axios from "axios";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import getCurrentUser from "../tools/getCurrentUser";
import inknestLogo from "../assets/inknest-logo.svg"
import background from "../assets/background.jpg"

const Signup = () => {
    const history = useHistory();

    const handleSignup = (e) => {
        e.preventDefault();
        // get elements from form
        const {firstName, lastName, email, password} = e.target.elements;

        console.log(firstName, lastName, email, password);

        // POST request for signup
        axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`,
        {
            firstName: firstName.value, 
            lastName: lastName.value, 
            email: email.value, 
            password: password.value
        }).then(response => {
            // Server returns accessToken if there is no existing same user
            const {accessToken, msg} = response.data;
            if(accessToken){
                reactLocalStorage.set("accessToken", accessToken);
                history.push("/mybooks");
            }else{
                alert(msg);
            }
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        if(getCurrentUser()){
            history.push("/mybooks")
        }
    }, [])

    return (
        <div className="min-h-screen bg-white flex">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img
                            className="h-48 w-auto"
                            src={inknestLogo}
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for new account</h2>
                    </div>

                    <div className="mt-8">

                        <div className="mt-6">
                            <form className="space-y-6" action="#" onSubmit={(e) => handleSignup(e)} >
                                {/* First name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            autoComplete="given-name"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Last name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            autoComplete="family-name"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Email input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Sign up
                                    </button>
                                </div>

                                <div>
                                    <Link to="/signin"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Already have account? &nbsp; <span className="text-indigo-500">Sign in</span>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={background}
                    alt=""
                />
            </div>
        </div>
    )
}

export default Signup;