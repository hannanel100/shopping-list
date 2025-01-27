"use client";

import { useSession, signIn, signOut } from "@repo/auth";
import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session.user?.name || session.user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("github")} variant="outline" size="sm">
      <Github className="h-4 w-4 mr-2" />
      Sign in with GitHub
    </Button>
  );
}
