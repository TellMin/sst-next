"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { tokenAtom } from "@/atoms/atom";
import type { ChatCompletionRequestMessage } from "openai";

export default function Chat() {
  const [token, setToken] = useAtom(tokenAtom);
  const [response, setResponse] = useState<string>("");

  const chat = async (message: string) => {
    const messages: Array<ChatCompletionRequestMessage> = [
      {
        role: "user",
        content: message,
      },
    ];

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });
    setResponse((await res.json()).choices[0].text);
  };

  return (
    <div>
      <h1>Chat</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const message = formData.get("message")?.toString() ?? "";
          chat(message);
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
      <div>{response}</div>
    </div>
  );
}
