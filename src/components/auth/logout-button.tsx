"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      disabled={isSigningOut}
      onClick={handleLogout}
      size="sm"
      variant="outline"
    >
      {isSigningOut ? "Saindo..." : "Sair"}
    </Button>
  );
}
