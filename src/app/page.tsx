"use client";

// ===== IMPORTS =====
import { useMemo, useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { glass, shapes } from "@dicebear/collection";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
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
import { Badge } from "@/components/ui/badge";
import PlannerLayout from "@/components/plannerLayout";

// ===== COMPONENT: DatePickerWithRange =====
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

// ===== TYPE DEFINITIONS =====
type Range = { from: Date; to: Date };
type User = { username: string; name: string };
const enum GroupStatus {
  Planned = 2,
  Planning = 1,
  AtRest = 0,
}
type Group = { name: string; status: GroupStatus; members: string[] };

// ===== FUNCTION: Generate Avatar URI for Groups =====
const generateGroupAvatar = (groupName: string): string => {
  const avatar = createAvatar(shapes, { seed: groupName });
  return avatar.toDataUri();
};

// ===== MAIN COMPONENT: Home =====
export default function Home() {
  // Busy date ranges state
  const [dateRanges, setDateRanges] = useState<Range[]>([
    { from: new Date(2025, 3, 25), to: new Date(2025, 4, 8) },
    { from: new Date(2025, 4, 18), to: new Date(2025, 4, 29) },
    { from: new Date(2025, 5, 8), to: new Date(2025, 5, 14) },
  ]);

  const groups: Group[] = [
    {
      name: "Mountain Hikers",
      status: GroupStatus.Planned,
      members: ["alice", "bob", "carol", "dave", "eve"],
    },
    {
      name: "Late-Night Coders",
      status: GroupStatus.Planning,
      members: ["frank", "grace", "heidi", "ivan", "judy", "mallory"],
    },
    {
      name: "Movie Marathon",
      status: GroupStatus.AtRest,
      members: ["nick", "oscar", "peggy"],
    },
    {
      name: "Weekend Cyclists",
      status: GroupStatus.Planned,
      members: [
        "alice",
        "frank",
        "trent",
        "victor",
        "wendy",
        "rachel",
        "carol",
      ],
    },
    {
      name: "Board Game Night",
      status: GroupStatus.Planning,
      members: ["dave", "eve", "grace", "heidi", "nick"],
    },
    {
      name: "Book Club",
      status: GroupStatus.AtRest,
      members: ["oscar", "peggy", "quentin", "rachel"],
    },
    {
      name: "Coffee Enthusiasts",
      status: GroupStatus.Planned,
      members: [
        "sybil",
        "trent",
        "judy",
        "alice",
        "bob",
        "mallory",
        "victor",
        "wendy",
      ],
    },
    {
      name: "Weekend Warriors",
      status: GroupStatus.Planning,
      members: ["nick", "oscar", "frank", "grace", "heidi", "trent", "carol"],
    },
    {
      name: "Art & Crafts",
      status: GroupStatus.AtRest,
      members: ["peggy", "quentin", "rachel", "sybil", "judy", "dave"],
    },
    {
      name: "Startup Founders",
      status: GroupStatus.Planned,
      members: [
        "alice",
        "bob",
        "carol",
        "dave",
        "eve",
        "frank",
        "grace",
        "heidi",
        "ivan",
      ],
    },
    {
      name: "Yoga Retreat",
      status: GroupStatus.Planning,
      members: [
        "judy",
        "mallory",
        "nick",
        "oscar",
        "peggy",
        "trent",
        "rachel",
        "sybil",
      ],
    },
    {
      name: "Language Exchange",
      status: GroupStatus.AtRest,
      members: ["trent", "victor", "wendy", "alice", "bob"],
    },
    {
      name: "Game Dev Jam",
      status: GroupStatus.Planned,
      members: [
        "carol",
        "dave",
        "eve",
        "frank",
        "grace",
        "heidi",
        "ivan",
        "judy",
        "nick",
        "oscar",
        "peggy",
        "quentin",
      ],
    },
    {
      name: "Photography Walk",
      status: GroupStatus.Planning,
      members: ["rachel", "sybil", "trent", "victor", "wendy"],
    },
    {
      name: "Cooking Challenge",
      status: GroupStatus.AtRest,
      members: ["alice", "bob", "carol", "dave", "eve", "frank"],
    },
  ];

  // User information state
  const user: User = { username: "nabbu", name: "Navya Gupta" };
  const { username, name } = user;

  // Avatar generation state
  const [avatarUri, setAvatarUri] = useState<string>("");
  useEffect(() => {
    const avatar = createAvatar(glass, { seed: username });
    setAvatarUri(avatar.toDataUri());
  }, [username]);

  // Precompute busy days from ranges
  const preselectedDays: Date[] = useMemo(
    () =>
      dateRanges.flatMap((rng) =>
        eachDayOfInterval({ start: rng.from, end: rng.to })
      ),
    [dateRanges]
  );

  // Calculate calendar modifiers for start and end dates
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

  // State for date range picker dialog
  const [open, setOpen] = useState(false);
  const [busyRange, setBusyRange] = useState<DateRange | undefined>(undefined);
  const [editingRange, setEditingRange] = useState<Range | null>(null);

  // ===== FUNCTION: Save Busy Date Range =====
  const handleSave = () => {
    if (!busyRange?.from || !busyRange.to) {
      alert("Please select a valid date range.");
      return;
    }
    if (busyRange.from > busyRange.to) {
      alert("'From' date must be on or before 'To' date.");
      return;
    }
    if (editingRange) {
      const updatedRange: Range = { from: busyRange.from, to: busyRange.to };
      setDateRanges((prev) =>
        prev.map((rng) =>
          rng.from.getTime() === editingRange.from.getTime() &&
          rng.to.getTime() === editingRange.to.getTime()
            ? updatedRange
            : rng
        )
      );
    } else {
      const newRange: Range = { from: busyRange.from, to: busyRange.to };
      setDateRanges((prev) => [...prev, newRange]);
    }
    setOpen(false);
    setBusyRange(undefined);
    setEditingRange(null);
  };

  // ===== FUNCTION: Delete a Busy Date Range =====
  const handleDelete = (rangeToDelete: Range) => {
    setDateRanges((prev) =>
      prev.filter(
        (rng) =>
          rng.from.getTime() !== rangeToDelete.from.getTime() ||
          rng.to.getTime() !== rangeToDelete.to.getTime()
      )
    );
  };

  // ===== FUNCTION: Initiate Edit on a Busy Date Range =====
  const handleEdit = (rangeToEdit: Range) => {
    setBusyRange({ from: rangeToEdit.from, to: rangeToEdit.to });
    setEditingRange(rangeToEdit);
    setOpen(true);
  };

  // ===== RENDER COMPONENT =====
  return (
    <PlannerLayout>
      <div className="w-full h-full grid gap-2 grid-cols-1 md:grid-cols-[0.8fr_2.4fr_0.8fr] grid-rows-[auto_auto] md:grid-rows-[1fr_1fr]">
        {/* Calendar and Busy Dates Panel */}
        <Card className="col-span-1 md:col-start-1 md:row-start-1 w-full max-w-md mx-auto p-0">
          <div className="rounded-md w-auto max-w-md mx-auto mt-2">
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

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-md border w-full mt-2"
                >
                  <Plus /> Busy Days
                </Button>
              </PopoverTrigger>
              <PopoverContent className="ml-3 p-0 w-94">
                <div className="grid">
                  <div className="border-t p-4 flex">
                    <Button type="button" onClick={handleSave}>
                      Save
                    </Button>
                    <Separator orientation="vertical" className="mx-2" />
                    <span className="w-65">
                      <DatePickerWithRange
                        date={busyRange}
                        setDate={setBusyRange}
                      />
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ScrollArea className="w-full h-[16.125rem] mt-2 font-mono">
              {dateRanges.map((rng) => {
                const msPerDay = 1000 * 60 * 60 * 24;
                const diff = rng.to.getTime() - rng.from.getTime();
                const days = Math.ceil(diff / msPerDay) + 1;
                const paddedDays = days < 10 ? `0${days}` : `${days}`;

                return (
                  <Card
                    key={`${rng.from.toISOString()}-${rng.to.toISOString()}`}
                    className="relative group overflow-hidden mb-2 border w-full h-10 p-0"
                  >
                    <div className="flex w-full h-full transition-opacity duration-300 group-hover:opacity-0">
                      <div className="w-[15%] h-full flex items-center justify-center bg-foreground text-background">
                        {paddedDays}
                      </div>
                      <div className="w-[85%] h-full flex items-center justify-center text-muted-foreground text-sm transition-opacity duration-300">
                        {format(rng.from, "dd MMM").toUpperCase()} –{" "}
                        {format(rng.to, "dd MMM").toUpperCase()}
                      </div>
                    </div>

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
                );
              })}
            </ScrollArea>
          </div>
        </Card>

        {/* User Information Panel */}
        <Card className="col-span-1 md:col-start-1 md:row-start-2 h-full p-3 overflow-hidden">
          <div className="flex items-center gap-2">
            <Avatar className="w-[clamp(1.5rem,5vw,2.5rem)] h-[clamp(1.5rem,5vw,2.5rem)] flex-shrink-0 rounded-full">
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

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-[clamp(0.6rem,2vw,1rem)]">
                {name}
              </p>
              <p className="truncate text-gray-500 text-[clamp(0.2rem, 1vw, 0.4rem)]">
                @{username}
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </div>
        </Card>

        {/* Main Content Panel */}
        <Card className="col-span-1 md:col-start-2 md:row-start-1 md:row-span-2 h-full p-4 overflow-auto">
          {/* Groups & Polls can be added here */}
        </Card>

        {/* Planning Status Panel */}
        <Card className="col-span-1 md:col-start-3 md:row-start-1 md:row-span-2 h-full p-2 flex flex-col gap-4">
          <div className="flex flex-col">
            <Badge
              variant="secondary"
              className="px-1.5 py-1 w-20 font-medium font-mono self-center"
            >
              PLANNED
            </Badge>
            <ScrollArea className="mt-2 h-40 overflow-auto">
              {groups
                .filter((group) => group.status === GroupStatus.Planned)
                .map((group) => (
                  <div key={group.name} className="p-2 flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={generateGroupAvatar(group.name)}
                        alt={`${group.name} avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {group.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{group.name}</span>
                  </div>
                ))}
            </ScrollArea>
          </div>

          <div className="flex flex-col">
            <Badge
              variant="secondary"
              className="px-1.5 py-1 w-20 font-medium font-mono self-center"
            >
              PLANNING
            </Badge>
            <ScrollArea className="mt-2 h-40 overflow-auto">
              {groups
                .filter((group) => group.status === GroupStatus.Planning)
                .map((group) => (
                  <div key={group.name} className="p-2 flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={generateGroupAvatar(group.name)}
                        alt={`${group.name} avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {group.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{group.name}</span>
                  </div>
                ))}
            </ScrollArea>
          </div>

          <div className="flex flex-col">
            <Badge
              variant="secondary"
              className="px-1.5 py-1 w-20 font-medium font-mono self-center"
            >
              AT REST
            </Badge>
            <ScrollArea className="mt-2 h-40 overflow-auto">
              {groups
                .filter((group) => group.status === GroupStatus.AtRest)
                .map((group) => (
                  <div key={group.name} className="p-2 flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={generateGroupAvatar(group.name)}
                        alt={`${group.name} avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {group.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{group.name}</span>
                  </div>
                ))}
            </ScrollArea>
          </div>
        </Card>
      </div>
    </PlannerLayout>
  );
}
