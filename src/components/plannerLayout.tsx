// components/plannerLayout.tsx

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        w-screen h-screen
        box-border

        pt-[1vmin] pl-[1vmin]        /* outer margin top/left */
        pr-[1vmin] pb-[1vmin]        /* outer margin right/bottom = 1vmin + 2vmin inner gap */
      "
    >
      {children}
    </div>
  );
}
