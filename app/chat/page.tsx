"use client";

import { useAtom } from "jotai";
import { tokenAtom } from "@/atoms/atom";

export default function Chat() {
  const [token, setToken] = useAtom(tokenAtom);

  const chat = async (messages: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: messages,
    });
  };

  return (
    <div>
      <h1>Chat</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const messages = formData.get("messages");
          chat(messages);
        }}
      >
        <input type="text" name="messages" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
