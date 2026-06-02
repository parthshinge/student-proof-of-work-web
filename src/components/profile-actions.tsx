"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProfileActions({ username, walletAddress }: { username: string; walletAddress?: string | null }) {
  const [copying, setCopying] = useState(false);

  async function copyProfileUrl() {
    setCopying(true);
    await navigator.clipboard.writeText(`${window.location.origin}/profile/${username}`);
    toast.success("Profile URL copied");
    setCopying(false);
  }

  async function copyWalletAddress() {
    if (!walletAddress) {
      toast.error("No wallet address available");
      return;
    }

    await navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied");
  }

  async function shareProfile() {
    const url = `${window.location.origin}/profile/${username}`;

    if (navigator.share) {
      await navigator.share({ title: `@${username}`, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={copyProfileUrl} disabled={copying}>
        <Copy className="h-4 w-4" /> Copy Profile URL
      </Button>
      <Button variant="outline" onClick={shareProfile}>
        <Share2 className="h-4 w-4" /> Share Profile
      </Button>
      {walletAddress ? (
        <Button variant="outline" onClick={copyWalletAddress}>
          <Copy className="h-4 w-4" /> Copy Wallet Address
        </Button>
      ) : null}
    </div>
  );
}