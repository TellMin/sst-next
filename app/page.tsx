"use client";

import { useAtom } from "jotai";
import { tokenAtom } from "@/atoms/atom";
import AuthProvider from "@/app/_components/authProvider";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      if (token) {
        const user = await getUserInfo(token);
        if (user) {
          setUser(user);
        }
      }
      setLoading(false);
    };
    getSession();
  }, [token, setUser]);

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
    } catch (error) {}
  };

  const signOut = async () => {
    localStorage.removeItem("session");
    setToken("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>SST Auth</h1>
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
      </main>
    </AuthProvider>
  );
}
