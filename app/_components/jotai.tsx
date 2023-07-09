"use client";

import { useAtom } from "jotai";
import { tokenAtom } from "@/atoms/atom";

export default function Jotai() {
  const [token] = useAtom(tokenAtom);

  return <p>{token}</p>;
}
