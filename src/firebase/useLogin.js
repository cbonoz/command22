import {  getAuth, GoogleAuthProvider, inMemoryPersistence, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";
import React, { useEffect, useState } from "react";

/* Note: Should just have one instance created */
export const useLogin = () => {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [init, setInit] = useState(false)
  const [user, setUser] = useState(auth.currentUser)
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    console.log('user', user, auth.currentUser)
  }, [user])

  onAuthStateChanged(auth, (user) => {
    setUser(user)
    if (!init) {
      setInit(true)
    }
  })

  const login = async () => {
    setError(null);
    setIsPending(true);
    setUser(null)

    try {
      // await setPersistence(auth, inMemoryPersistence);
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        const e = new Error("Could not complete signup");
        alert(e.message)
        throw e
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
        setIsPending(false)
    }
  };

  const logout = () => {
    signOut(auth)
    setUser(undefined)
  }

  return { login, error, isPending: isPending, init, user, logout };
};