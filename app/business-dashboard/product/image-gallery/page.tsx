
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryData {
  images: string[];
  title: string;
}

export default function ImageGalleryPage() {
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem("productImageGallery");

    if (data) {
      try {
        setGallery(JSON.parse(data));
      } catch {
        setGallery(null);
      }
    }

    // Remove access to the opener after reading the gallery data.
    window.opener = null;
  }, []);

  if (!gallery || gallery.images.length === 0) {
    return <main className="p-8">No images available.</main>;
  }

  const total = gallery.images.length;

  const previous = () => {
    setIndex((current) => (current === 0 ? total - 1 : current - 1));
  };

  const next = () => {
    setIndex((current) => (current === total - 1 ? 0 : current + 1));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 text-white">
      <h1 className="mb-5 text-lg font-semibold">{gallery.title}</h1>

      <div className="relative flex w-full max-w-5xl items-center justify-center">
        <button
          onClick={previous}
          aria-label="Previous image"
          className="absolute left-0 z-10 rounded-full bg-white/15 p-3 hover:bg-white/30"
        >
          <ChevronLeft size={28} />
        </button>

        <img
          src={gallery.images[index]}
          alt={`${gallery.title} image ${index + 1}`}
          className="max-h-[78vh] max-w-[80%] object-contain"
        />

        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-0 z-10 rounded-full bg-white/15 p-3 hover:bg-white/30"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <p className="mt-5 text-sm text-white/80">
        Image {index + 1} of {total}
      </p>

      {total > 1 && (
        <div className="mt-4 flex max-w-full gap-2 overflow-x-auto">
          {gallery.images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`shrink-0 rounded-lg border-2 ${
                i === index ? "border-white" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="h-16 w-16 rounded-md object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
