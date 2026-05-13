"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { InterestModal } from "./interest-modal";
import {
  loadProfile,
  getConfirmedInterests,
} from "@/lib/interests/storage";
import type { InterestProfile } from "@/types/interests";
import { cn } from "@/lib/utils";

export function InterestBadge() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<InterestProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());

    // storage 이벤트로 다른 탭/창과 동기화
    function onStorage(e: StorageEvent) {
      if (e.key === "interest_profile_v1") {
        setProfile(loadProfile());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const count = profile ? getConfirmedInterests(profile).length : 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
          count > 0
            ? "bg-primary-soft/60 text-primary hover:bg-primary-soft"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        )}
        aria-label={`내 관심사 ${count}개`}
        title="내 관심사"
      >
        <Star
          className={cn("h-3.5 w-3.5", count > 0 && "fill-primary text-primary")}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">관심사</span>
        {count > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {count}
          </span>
        )}
      </button>

      <InterestModal
        open={open}
        onClose={() => setOpen(false)}
        onProfileChange={(p) => setProfile(p)}
      />
    </>
  );
}
