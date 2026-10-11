"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios, { Axios } from "axios"
import toast from "react-hot-toast"



export default function SignUpPage() {
    const router =  useRouter()
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false)
    
    const [loading, setLoading] = React.useState(false)

    const onSignup = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/users/signup", user) //user is also taken up in the api call
            console.log("Signup success", response.data); // prints the message which is coming from backend (response.data)

            toast.success("User registered successfully")

            //Redirected to login page once form submitted
            router.push("/login")   
            
        } catch (error: any) {
            console.log("Signup failed", error.message);
            
            const errorMessage = error.response?.data?.error || "Signup failed. Please try again."; 
            toast.error(errorMessage) // this error will be on the browser (client side) because this page is client side
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
            setButtonDisabled(false)
        }else {
            setButtonDisabled(true)
        }
    }, [user]) // this is dependant on user

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing..." : "Signup"}</h1>
            <hr />
            <label htmlFor="username">username</label>
            <input 
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="username" 
                type="text" 
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})} //Here, only the username is getting changed, rest everything is unchanged thats why I written ...user to make other properties unchanged
                placeholder="username"
            /> 

            <label htmlFor="email">email</label>
            <input 
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email" 
                type="email" 
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})} //Here, only the email is getting changed, rest everything is unchanged thats why I written ...user to make other properties unchanged
                placeholder="email"
            /> 
                
            <label htmlFor="password">password</label>
            <input 
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password" 
                type="password" 
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})} //Here, only the password is getting changed, rest everything is unchanged thats why I written ...user to make other properties unchanged
                placeholder="password"
            /> 

            <button
                onClick={onSignup}
                className="p-2 border broder-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{buttonDisabled ? "No signup" : "Signup"}
            </button>

            <Link href="/login">Already an user? Log in</Link>

        </div>
    )
}