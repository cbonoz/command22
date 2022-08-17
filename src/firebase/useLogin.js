import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";
import { useState } from "react";

export const useLogin = () => {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(undefined)
  const provider = new GoogleAuthProvider();

  const login = async () => {
    setError(null);
    setIsPending(true);
    setUser(null)

    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        const e = new Error("Could not complete signup");
        alert(e.message)
        throw e
      }

      const newUser = res.user;
      console.log('user', newUser);
      setUser(newUser);
      setIsPending(false)
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
        setIsPending(false)
    }
  };

  const logout = () => {
    signOut(user)
    setUser(undefined)
  }

  return { login, error, isPending, user, logout };
};