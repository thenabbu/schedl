// pages/index.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function HomePage() {
  const [num1, setNum1] = useState<number | "">("");
  const [num2, setNum2] = useState<number | "">("");
  const [results, setResults] = useState<null | {
    addition: number;
    subtraction: number;
    multiplication: number;
    division: string;
  }>(null);

  const calculate = () => {
    const a = Number(num1);
    const b = Number(num2);

    setResults({
      addition: a + b,
      subtraction: a - b,
      multiplication: a * b,
      division: b !== 0 ? (a / b).toFixed(2) : "Cannot divide by 0",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md shadow-2xl p-6 rounded-2xl animate-fade-in">
        <CardContent className="space-y-6">
          <h1 className="text-3xl font-bold text-center tracking-tight">🧮 Simple Calculator</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="First Number"
              value={num1}
              onChange={(e) => setNum1(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Second Number"
              value={num2}
              onChange={(e) => setNum2(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <Button
            onClick={calculate}
            className="w-full"
            disabled={num1 === "" || num2 === ""}
          >
            Calculate
          </Button>

          {results && (
            <div className="space-y-2 mt-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-muted-foreground">➕ Addition: {results.addition}</p>
              <p className="text-muted-foreground">➖ Subtraction: {results.subtraction}</p>
              <p className="text-muted-foreground">✖️ Multiplication: {results.multiplication}</p>
              <p className="text-muted-foreground">➗ Division: {results.division}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
