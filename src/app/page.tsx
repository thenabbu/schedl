// src/app/page.tsx
"use client"
import React from "react";

import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker"


import PlannerLayout from "@/components/plannerLayout";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })

  return (
    <PlannerLayout>
      <div
        className="
          w-full h-full         /* fill the padded wrapper */
          grid
          gap-[1.25vmin]            /* inner gutters = 2vmin */

          /* Mobile: stack */
          grid-cols-1
          grid-rows-[auto_auto_auto]

          /* ≥sm: 25%/75% × 66.667%/33.333% */
          sm:grid-cols-[25%_75%]
          sm:grid-rows-[90%_10%]
        "
      >
        <Card className="col-start-1 row-start-1">
        <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-md border"
      />
        </Card>

        <Card className="col-start-1 row-start-2">
          {/* User Info */}
          </Card>

        <Card className="col-start-2 row-start-1 row-span-2">
          {/* Groups & Polls */}
        </Card>

      </div>
    </PlannerLayout>
  );
}
