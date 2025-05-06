// src/app/page.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Settings } from "lucide-react";

import PlannerLayout from "@/components/plannerLayout";

type Range = { from: Date; to: Date };
type User = { username: string; name: string };

export default function Home() {
  const preselectedRanges: Range[] = [
    { from: new Date(2025, 3, 26), to: new Date(2025, 4, 8) },
    { from: new Date(2025, 4, 15), to: new Date(2025, 4, 29) },
  ];

  const user: User = {
    username: "nabbu",
    name: "Navya Gupta",
  };

  const { username, name } = user;

  // Generate avatar data URI on the client
  const [avatarUri, setAvatarUri] = useState<string>("");

  useEffect(() => {
    const avatar = createAvatar(glass, { seed: username });
    const uri = avatar.toDataUri();
    setAvatarUri(uri);
  }, [username]);

  const preselectedDays: Date[] = useMemo(
    () =>
      preselectedRanges.flatMap((rng) =>
        eachDayOfInterval({ start: rng.from, end: rng.to })
      ),
    [preselectedRanges]
  );

  const { startDates, endDates } = useMemo(() => {
    const starts: Date[] = [];
    const ends: Date[] = [];

    preselectedDays.forEach((day) => {
      const prev = addDays(day, -1);
      const next = addDays(day, 1);
      const hasPrev = preselectedDays.some((d) => isSameDay(d, prev));
      const hasNext = preselectedDays.some((d) => isSameDay(d, next));
      if (!hasPrev) starts.push(day);
      if (!hasNext) ends.push(day);
    });
    return { startDates: starts, endDates: ends };
  }, [preselectedDays]);

  return (
    <PlannerLayout>
      <div
        className="
          w-full h-full
          grid gap-[1.25vmin]
          grid-cols-1 grid-rows-[auto_auto_auto]
          sm:grid-cols-[25%_75%] sm:grid-rows-[90%_10%]
        "
      >
        {/* Calendar Card */}
        <Card className="col-start-1 row-start-1">
          <Calendar
            className="rounded-md border w-auto max-w-md mx-auto"
            mode="multiple"
            modifiers={{
              highlighted: preselectedDays,
              start: startDates,
              end: endDates,
            }}
            modifiersClassNames={{
              highlighted: "!rounded-none bg-secondary",
              start:
                "!rounded-none !rounded-tl-[0.625rem] !rounded-bl-[0.625rem] !bg-primary text-primary-foreground hover:text-black",
              end: "!rounded-none !rounded-tr-[0.625rem] !rounded-br-[0.625rem] !bg-primary text-primary-foreground hover:text-black",
            }}
          />
        </Card>

        {/* Profile Card */}
        <Card className="col-start-1 row-start-2 h-full p-4 overflow-hidden">
          <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Profile Photo */}
            <div className="relative w- aspect-square rounded-full overflow-hidden">
              {avatarUri && (
                <Image
                  src={avatarUri}
                  alt={`${name}'s avatar`}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Name / @username */}
            <div className="flex flex-col justify-center overflow-hidden min-w-0">
              <p className="text-lg font-semibold truncate">{name}</p>
              <p className="text-sm text-gray-500 truncate">@{username}</p>
            </div>

            {/* Settings Icon */}
            <button
              type="button"
              aria-label="Open settings"
              className="flex items-center justify-center p-2 rounded hover:bg-gray-700 transition"
              onClick={() => {
                /* your settings handler here */
              }}
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </Card>

        {/* Groups & Polls Card */}
        <Card className="col-start-2 row-start-1 row-span-2 h-full p-4 overflow-auto">
          {/* Groups & Polls */}
        </Card>
      </div>
    </PlannerLayout>
  );
}
