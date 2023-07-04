"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [session, setSession] = useState("");

  const getSession = async () => {
    const token = localStorage.getItem("session");
    if (token) {
      setSession(token);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const signOut = async () => {
    localStorage.removeItem("session");
    setSession("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>SST Auth</h1>
      {session ? (
        <div>
          <p>Yeah! You are signed in.</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <div>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/google/authorize`}
            rel="noreferrer"
          >
            <button>Sign in with Google</button>
          </a>
        </div>
      )}
    </main>
  );
}
