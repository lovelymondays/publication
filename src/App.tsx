import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, AmbientLight, DirectionalLight, Clock } from "three";
import { FlipBook } from "quick_flipbook";
import { useEffect, useMemo } from "react";

/* -------------------------------- */
/* FLIPBOOK COMPONENT */
/* -------------------------------- */

function Book() {
  const clock = useMemo(() => new Clock(), []);

  const book = useMemo(() => {
    const instance = new FlipBook({
      flipDuration: 0.7,
      yBetweenPages: 0.001,
      pageSubdivisions: 20,
    });

    instance.setPages([
      "pages/1.jpeg",
      "pages/2.jpeg",
      "pages/3.jpeg",
      "pages/4.jpeg",
      "pages/1.jpeg",
      "pages/2.jpeg",
      "pages/3.jpeg",
      "pages/4.jpeg",
    ]);

    return instance;
  }, []);

  useEffect(() => {
    function updateBookScale() {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        book.scale.set(0.55, 1.4, 1);
      } else {
        book.scale.set(0.9, 2, 1);
      }
    }

    updateBookScale();

    window.addEventListener("resize", updateBookScale);

    return () => {
      window.removeEventListener("resize", updateBookScale);
    };
  }, [book]);

  useFrame(() => {
    const delta = clock.getDelta();

    book.animate(delta);
  });

  useEffect(() => {
    const nextPage = () => {
      book.nextPage();
    };

    const previousPage = () => {
      book.previousPage();
    };

    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    nextBtn?.addEventListener("click", nextPage);
    prevBtn?.addEventListener("click", previousPage);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          nextPage();
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          previousPage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;

      if (touchEndX < touchStartX - 50) {
        nextPage();
      }

      if (touchEndX > touchStartX + 50) {
        previousPage();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);

    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      nextBtn?.removeEventListener("click", nextPage);
      prevBtn?.removeEventListener("click", previousPage);

      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("touchstart", handleTouchStart);

      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [book]);

  return <primitive object={book} />;
}

/* -------------------------------- */
/* APP */
/* -------------------------------- */

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white font-sans">
      {/* UI */}
      <div className="pointer-events-none fixed top-[30px] z-10 w-full text-center">
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[4px]">
          CLASS OF 2026
        </h1>

        <p className="mt-2 text-sm opacity-70">Digital Yearbook Memories</p>
      </div>

      {/* INFO */}
      <div className="fixed bottom-[85px] md:bottom-[100px] z-10 flex w-full justify-center gap-8 text-xs md:text-sm opacity-70">
        <span>← Previous</span>
        <span>→ Next</span>
      </div>

      {/* BUTTONS */}
      <button
        className="
          btn prev
          fixed bottom-[30px] left-5 z-20
          rounded-full
          bg-white/10
          px-[18px] py-3
          text-sm text-white
          backdrop-blur-xl
          transition-all duration-200
          hover:-translate-y-1
          hover:bg-white/20
          md:px-6 md:py-[14px]
        "
      >
        Previous
      </button>

      <button
        className="
          btn next
          fixed bottom-[30px] right-5 z-20
          rounded-full
          bg-white/10
          px-[18px] py-3
          text-sm text-white
          backdrop-blur-xl
          transition-all duration-200
          hover:-translate-y-1
          hover:bg-white/20
          md:px-6 md:py-[14px]
        "
      >
        Next
      </button>

      {/* THREE */}
      <Canvas
        className="block"
        camera={{
          position: [0, 1.2, 4.5],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        onCreated={({ scene }) => {
          scene.background = new Color(0x0f172a);
        }}
      >
        {/* LIGHTS */}
        <primitive object={new AmbientLight(0xffffff, 2)} />

        <primitive
          object={new DirectionalLight(0xffffff, 3)}
          position={[5, 5, 5]}
        />

        {/* CONTROLS */}
        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />

        {/* BOOK */}
        <Book />
      </Canvas>
    </div>
  );
}
