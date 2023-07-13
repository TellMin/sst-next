"use client";

import { useAtom } from "jotai";
import { useChat } from "ai/react";
import { tokenAtom } from "@/atoms/atom";

export default function Chat() {
  const [token, setToken] = useAtom(tokenAtom);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${process.env.NEXT_PUBLIC_APP_API_URL}/chat`,
    headers: { Authorization: `Bearer ${token}` },
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
