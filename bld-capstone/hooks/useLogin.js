import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// firebase imports
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const {dispatch} = useAuthContext();
    
    const login = (email, password) => {
        setError(null);
        signInWithEmailAndPassword(auth, email, password)
            .then((res) => {
                dispatch({type: 'LOGIN', payload: res.user})
            })
            .catch((err) => {
                console.log(err)
                let errorMessage = "An error occurred.";
                if (err.code === "auth/user-not-found") {
                    errorMessage = "User not found.";
                } else if (err.code === "auth/invalid-email") {
                    errorMessage = "Invalid email address.";
                } else if (err.code === "auth/invalid-login-credentials") {
                    errorMessage = "Incorrect email or password.";
                } else if (err.code === "auth/missing-password") {
                    errorMessage = "Please enter your password.";
                }
                setError(errorMessage);
            });
    }

    return { login,  error }
}