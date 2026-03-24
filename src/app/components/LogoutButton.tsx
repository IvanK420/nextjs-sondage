"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="btn btn-primary btn-wide text-white bg-gradient-to-r from-[#e600ff] via-[#6800ff] to-[#00b8ff] border-none shadow-[0_0_18px_rgba(230,0,255,0.65)] hover:shadow-[0_0_25px_rgba(0,239,255,0.9)]"
    >
      Se déconnecter
    </button>
  );
}
