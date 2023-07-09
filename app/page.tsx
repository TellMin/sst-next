"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "@/atoms/atom";
import Jotai from "@/app/_components/jotai";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useAtom(tokenAtom);

  const getSession = async () => {
    const token = localStorage.getItem("session");
    if (token) {
      setToken(token);
      const user = await getUserInfo(token);
      if (user) setUser(user);
    }
    setLoading(false);
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

  const getUserInfo = async (session: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/session`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      return response.json();
    } catch (error) {
      alert(error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("session");
    setToken("");
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>SST Auth</h1>
      {token ? (
        <div className="profile">
          <img
            src={user?.picture}
            style={{ borderRadius: "50%" }}
            width={100}
            height={100}
            alt=""
          />
          <p>{user?.email}</p>
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
      <Jotai />
    </main>
  );
}
