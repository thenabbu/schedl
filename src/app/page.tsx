"use client";

// Import necessary libraries and components
import React, { useMemo, useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { addDays, eachDayOfInterval, isSameDay, format } from "date-fns";
import { Settings, Plus, CalendarIcon, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateRange } from "react-day-picker";
import PlannerLayout from "@/components/plannerLayout";

// Date picker component for selecting a range of dates
function DatePickerWithRange({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "PPP")} – {format(date.to, "PPP")}
              </>
            ) : (
              format(date.from, "PPP")
            )
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}

// Type definitions for date range and user
type Range = { title: string; from: Date; to: Date };
type User = { username: string; name: string };

// Utility function to create a date range with a title
function createRange(input: Partial<Range> & { from: Date; to: Date }): Range {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = input.to.getTime() - input.from.getTime();
  const days = Math.ceil(diff / msPerDay) + 1;
  const paddedDays = days < 10 ? `0${days}` : `${days}`;
  const title = `${paddedDays}`;

  return { title, from: input.from, to: input.to };
}

// Main component for the planner application
export default function Home() {
  // State to manage date ranges
  const [dateRanges, setDateRanges] = useState<Range[]>([
    createRange({ from: new Date(2025, 3, 25), to: new Date(2025, 4, 8) }),
    createRange({
      title: "ghumi ghumi",
      from: new Date(2025, 4, 18),
      to: new Date(2025, 4, 29),
    }),
    createRange({ from: new Date(2025, 5, 8), to: new Date(2025, 5, 14) }),
  ]);

  // User information
  const user: User = { username: "nabbu", name: "Navya Gupta" };
  const { username, name } = user;

  // State for avatar URI
  const [avatarUri, setAvatarUri] = useState<string>("");

  // Generate avatar based on username
  useEffect(() => {
    const avatar = createAvatar(glass, { seed: username });
    setAvatarUri(avatar.toDataUri());
  }, [username]);

  // Precompute selected days for the calendar
  const preselectedDays: Date[] = useMemo(
    () =>
      dateRanges.flatMap((rng) =>
        eachDayOfInterval({ start: rng.from, end: rng.to })
      ),
    [dateRanges]
  );

  // Compute start and end dates for highlighting in the calendar
  const { startDates, endDates } = useMemo(() => {
    const starts: Date[] = [];
    const ends: Date[] = [];
    preselectedDays.forEach((day) => {
      const prev = addDays(day, -1);
      const next = addDays(day, 1);
      if (!preselectedDays.some((d) => isSameDay(d, prev))) starts.push(day);
      if (!preselectedDays.some((d) => isSameDay(d, next))) ends.push(day);
    });
    return { startDates: starts, endDates: ends };
  }, [preselectedDays]);

  // State for dialog form
  const [open, setOpen] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [busyRange, setBusyRange] = useState<DateRange | undefined>(undefined);

  // Handle saving a new busy date range
  let handleSave = () => {
    if (!busyRange?.from || !busyRange.to) {
      alert("Please select a valid date range.");
      return;
    }
    if (busyRange.from > busyRange.to) {
      alert("'From' date must be on or before 'To' date.");
      return;
    }
    const newRange = createRange({
      title: inputTitle,
      from: busyRange.from,
      to: busyRange.to,
    });
    setDateRanges((prev) => [...prev, newRange]);
    setOpen(false);
    setInputTitle("");
    setBusyRange(undefined);
  };

  // Function to handle deleting a date range
  const handleDelete = (rangeToDelete: Range) => {
    setDateRanges((prev) =>
      prev.filter(
        (rng) =>
          rng.from.getTime() !== rangeToDelete.from.getTime() ||
          rng.to.getTime() !== rangeToDelete.to.getTime()
      )
    );
  };

  // Function to handle editing a date range
  const handleEdit = (rangeToEdit: Range) => {
    setInputTitle(rangeToEdit.title);
    setBusyRange({ from: rangeToEdit.from, to: rangeToEdit.to });
    setOpen(true);

    // When saving, replace the edited range
    const saveEditedRange = () => {
      if (!busyRange?.from || !busyRange.to) {
        alert("Please select a valid date range.");
        return;
      }
      if (busyRange.from > busyRange.to) {
        alert("'From' date must be on or before 'To' date.");
        return;
      }
      const updatedRange = createRange({
        title: inputTitle,
        from: busyRange.from,
        to: busyRange.to,
      });

      setDateRanges((prev) =>
        prev.map((rng) =>
          rng.from.getTime() === rangeToEdit.from.getTime() &&
          rng.to.getTime() === rangeToEdit.to.getTime()
            ? updatedRange
            : rng
        )
      );
      setOpen(false);
      setInputTitle("");
      setBusyRange(undefined);
    };

    // Override the save handler temporarily
    handleSave = saveEditedRange;
  };

  return (
    <PlannerLayout>
      {/* Main layout with grid structure */}
      <div className="w-full h-full grid gap-2 grid-cols-1 md:grid-cols-[0.8fr_2.4fr_0.8fr] grid-rows-[auto_auto] md:grid-rows-[1fr_1fr]">
        {/* Left panel with calendar and busy days dialog */}
        <Card className="col-span-1 md:col-start-1 md:row-start-1 w-full max-w-md mx-auto p-0">
          <div className="rounded-md w-auto max-w-md mx-auto mt-2">
            {/* Calendar with highlighted busy days */}
            <Calendar
              className="rounded-md w-full flex justify-center"
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

            {/* Popover for adding busy days */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-md border w-full mt-2"
                >
                  <Plus /> Busy Days
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="grid gap-4">
                  {/* Date range picker - directly shown */}
                  <div className="p-4">
                    <DatePickerWithRange
                      date={busyRange}
                      setDate={setBusyRange}
                    />
                  </div>

                  {/* Save Button */}
                  <div className="border-t p-4 flex justify-end">
                    <Button type="button" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* List of busy date ranges */}
            <ScrollArea className="w-full h-[16.125rem] mt-2 font-mono">
              {dateRanges.map((rng) => (
                <Card
                  key={`${rng.from.toISOString()}-${rng.to.toISOString()}`}
                  className="relative group overflow-hidden mb-2 border w-full h-10 p-0"
                >
                  {/* Section: Display of title and date range */}
                  <div className="flex w-full h-full transition-opacity duration-300 group-hover:opacity-0">
                    <div className="w-[15%] h-full flex items-center justify-center bg-foreground text-background">
                      {rng.title}
                    </div>
                    <div className="w-[85%] h-full flex items-center justify-center text-muted-foreground text-sm transition-opacity duration-300">
                      {format(rng.from, "dd MMM").toUpperCase()} –{" "}
                      {format(rng.to, "dd MMM").toUpperCase()}
                    </div>
                  </div>

                  {/* Section: Hover overlay with Edit and Delete actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Button
                      className="flex-1 h-full rounded-none gap-2"
                      onClick={() => handleEdit(rng)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 h-full rounded-none"
                      onClick={() => handleDelete(rng)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </div>
        </Card>

        {/* Profile Card */}
        <Card className="col-span-1 md:col-start-1 md:row-start-2 h-full p-3 overflow-hidden">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <Avatar
              className="
        w-[clamp(1.5rem,5vw,2.5rem)]
        h-[clamp(1.5rem,5vw,2.5rem)]
        flex-shrink-0
        rounded-full
      "
            >
              {avatarUri ? (
                <AvatarImage
                  src={avatarUri}
                  alt={`${username}'s avatar`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-[clamp(0.75rem,2.5vw,1.25rem)]">
                  {name?.[0]?.toUpperCase() ||
                    username?.[0]?.toUpperCase() ||
                    "?"}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Name + Username */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-[clamp(0.6rem,2vw,1rem)]">{name}</p>
              <p className="truncate text-gray-500 text-[clamp(0.2rem, 1vw, 0.4rem)]">@{username}</p>
            </div>

            {/* Settings Icon */}
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </div>
        </Card>

        {/* Placeholder for groups and polls */}
        <Card className="col-span-1 md:col-start-2 md:row-start-1 md:row-span-2 h-full p-4 overflow-auto">
          {/* Groups & Polls */}
        </Card>

        {/* Placeholder for additional content */}
        <Card className="col-span-1 md:col-start-3 md:row-start-1 md:row-span-2 h-full p-4 overflow-auto"></Card>
      </div>
    </PlannerLayout>
  );
}
