import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, AmbientLight, DirectionalLight, Clock } from "three";
import { FlipBook } from "quick_flipbook";
import { useEffect, useMemo } from "react";

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

    return () => {
      nextBtn?.removeEventListener("click", nextPage);
      prevBtn?.removeEventListener("click", previousPage);
    };
  }, [book]);

  return <primitive object={book} />;
}

export default function FlipBookScene() {
  return (
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
      <primitive object={new AmbientLight(0xffffff, 2)} />

      <primitive
        object={new DirectionalLight(0xffffff, 3)}
        position={[5, 5, 5]}
      />

      <OrbitControls
        enableDamping
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2}
      />

      <Book />
    </Canvas>
  );
}
