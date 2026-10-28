"use client";

import { useEffect, useRef, useState } from "react";
import { Barcode, Plus, Search } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface BillSearchProps {
  onSearch: (value: string) => void;
  loading?: boolean;
}

export default function BillSearch({
  onSearch,
  loading = false,
}: BillSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showScanner, setShowScanner] = useState(false);

const videoRef = useRef<HTMLVideoElement>(null);
const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const handleSearch = () => {
    const value = searchValue.trim();

    if (!value) return;

    onSearch(value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
  if (!showScanner) return;

  let controls: any = null;

  const startScanner = async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();

      codeReaderRef.current = codeReader;

      if (!videoRef.current) return;

      controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            const scannedValue = result
              .getText()
              .trim()
              .toUpperCase();

            console.log("✅ BARCODE SCANNED:", scannedValue);

            setSearchValue(scannedValue);
            setShowScanner(false);

            onSearch(scannedValue);

            // Stop scanner immediately
            controls?.stop();
          }
        }
      );
    } catch (error) {
      console.error("BARCODE SCANNER ERROR:", error);
    }
  };

  startScanner();

  return () => {
    // Stop ZXing scanner
    if (controls) {
      controls.stop();
      controls = null;
    }

    // Stop camera stream
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }

    codeReaderRef.current = null;
  };
}, [showScanner, onSearch]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900">
          Add Product
        </h2>

        <p className="text-sm text-slate-500">
          Search product using product number
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
          ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) =>
              setSearchValue(e.target.value.toUpperCase())
            }
            onKeyDown={handleKeyDown}
            placeholder="Enter product number e.g. ABCD1234"
            className="
              h-11 w-full rounded-xl
              border border-slate-200
              bg-slate-50
              pl-10 pr-3
              text-sm
              outline-none
              transition
              focus:border-slate-400
              focus:bg-white
            "
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !searchValue.trim()}
          className="
            flex h-11 items-center gap-2
            rounded-xl bg-slate-900
            px-4 text-sm font-medium text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Plus size={17} />

          {loading ? "Searching..." : "Add"}
        </button>

        <button
          type="button"
         onClick={() => {
  setShowScanner(true);
}}
          className="
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            border border-slate-200
            bg-white
            text-slate-600
            hover:bg-slate-50
          "
        >
          <Barcode size={19} />
        </button>
      </div>
            {showScanner && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/60
            px-4
          "
        >
          <div
            className="
              w-full max-w-md
              rounded-2xl
              bg-white
              p-5
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Scan Barcode
                </h3>

                <p className="text-sm text-slate-500">
                  Point your camera at the product barcode
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowScanner(false)}
                className="
                  rounded-lg
                  px-3 py-2
                  text-sm font-medium
                  text-slate-500
                  hover:bg-slate-100
                "
              >
                ✕
              </button>
            </div>

            {/* Camera */}
            <div className="overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-64 w-full object-cover"
              />
            </div>

            {/* Instruction */}
            <p className="mt-4 text-center text-sm text-slate-500">
              Keep the barcode inside the camera view
            </p>

            {/* Close */}
            <button
              type="button"
              onClick={() => setShowScanner(false)}
              className="
                mt-4
                w-full
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-3
                text-sm font-semibold
                text-slate-700
                hover:bg-slate-50
              "
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}