import { lazy, Suspense } from "react";

const FlipBookScene = lazy(() => import("./components/FlipBookScene"));

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-slate-900 to-slate-950 text-white font-sans">
      {/* UI */}
      <div className="pointer-events-none fixed top-7.5 z-10 w-full text-center">
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[4px]">
          CLASS OF 2026
        </h1>

        <p className="mt-2 text-sm opacity-70">Digital Yearbook Memories</p>
      </div>

      {/* BUTTONS */}
      <button
        className="
          prev fixed bottom-7.5 left-5 z-20
          rounded-full bg-white/10
          px-4.5 py-3 text-sm
          backdrop-blur-xl
        "
      >
        Previous
      </button>

      <button
        className="
          next fixed bottom-7.5 right-5 z-20
          rounded-full bg-white/10
          px-4.5 py-3 text-sm
          backdrop-blur-xl
        "
      >
        Next
      </button>

      {/* LAZY 3D */}
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            Loading Yearbook...
          </div>
        }
      >
        <FlipBookScene />
      </Suspense>
    </div>
  );
}
