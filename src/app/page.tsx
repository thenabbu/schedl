// pages/index.tsx
'use client';

import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [num1, setNum1] = useState<number | ''>('');
  const [num2, setNum2] = useState<number | ''>('');
  const [results, setResults] = useState<{
    addition: number;
    subtraction: number;
    multiplication: number;
    division: string;
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCalculation = () => {
    const a = Number(num1);
    const b = Number(num2);
    setResults({
      addition: a + b,
      subtraction: a - b,
      multiplication: a * b,
      division: b !== 0 ? (a / b).toFixed(2) : 'Cannot divide by 0',
    });
  };

  if (!isClient) return null; // prevent hydration mismatch

  return (
    <div>
      <h1>Basic Math Operations</h1>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter second number"
        />
        <button onClick={handleCalculation}>Calculate</button>
      </div>
      {results && (
        <div>
          <h2>Results:</h2>
          <p>Addition: {results.addition}</p>
          <p>Subtraction: {results.subtraction}</p>
          <p>Multiplication: {results.multiplication}</p>
          <p>Division: {results.division}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
