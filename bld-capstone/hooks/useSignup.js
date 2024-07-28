import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// firebase imports
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updatePassword, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/router'
import { addUser } from '@/firebase/users'
import { useLogout } from '@/hooks/useLogout';

export const useSignup = () => {
  const [error, setError] = useState(null)
  const { dispatch } = useAuthContext()
  const router = useRouter()
  const logout = useLogout();

  const signup = (email, password, displayName, confirmPassword) => {
    setError(null);
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          dispatch({ type: 'LOGIN', payload: res.user });
          updateProfile(auth.currentUser, {
            displayName: displayName
          }).then(() => {
            addUser(auth.currentUser.uid, auth.currentUser.displayName);
            router.push("/");
            console.log("User registered with display name: ", auth.currentUser.displayName);
          }).catch((error) => {
            console.error("Error updating display name: ", error);
          });
        })
        .catch((err) => {
          let errorMessage = "An error occurred";
          if (err.code === "auth/weak-password") {
            errorMessage = "Weak password. Please choose a stronger password.";
          } else if (err.code === "auth/invalid-email") {
            errorMessage = "Invalid email address.";
          } else if (err.code === "auth/email-already-in-use") {
            errorMessage = "Email already in use. Please choose a different email. (try logging in?)";
          } else {
            errorMessage = err.message;
          }
          setError(errorMessage);
        });
    } else {
      setError("Passwords don't match");
    }
  };

  const changePassword = (user, password, confirmPassword) => {
    setError(null);

    if (password == confirmPassword) {
      updatePassword(user, password)
        .then(() => {
          router.push('/');
        })
        .catch((err) => {
          let errorMessage = "An error occurred";
          if (err.code === "auth/weak-password") {
            errorMessage = "Weak password. Please choose a stronger password.";
          } else if (err.code === "auth/requires-recent-login") {
            errorMessage = "Please reauthenticate before changing the password.";
          } else if (err.code === "auth/user-disabled") {
            errorMessage = "This account has been disabled.";
          } else if (err.code === "auth/user-not-found") {
            errorMessage = "User not found.";
          } else {
            errorMessage = err.message;
          }
          setError(errorMessage);
        });
    } else {
      setError("Password don't match")
    }
  }

  return { signup, changePassword, error }
}