"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "@/atoms/atom";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const token = localStorage.getItem("session");
      if (token) {
        setToken(token);
      }
    };
    getSession();
  }, [setToken]);

  if (!token)
    return (
      <div>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/google/authorize`}
          rel="noreferrer"
        >
          <button>Sign in with Google</button>
        </a>
      </div>
    );

  return <div>{children}</div>;
}
