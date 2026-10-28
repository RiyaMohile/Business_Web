"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import {
  downloadSamplePdf,
  parseProductsFromPdf,
  PdfProduct,
} from "./pdfProductParser";

interface PdfProductImportProps {
  subcategories: string[];
  onImport: (products: PdfProduct[]) => void;
}

type ImportStatus =
  | { type: "idle" }
  | { type: "reading"; fileName: string }
  | { type: "done"; fileName: string; count: number }
  | { type: "error"; message: string };

const MAX_PDF_SIZE = 15 * 1024 * 1024;

export default function PdfProductImport({
  subcategories,
  onImport,
}: PdfProductImportProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<ImportStatus>({ type: "idle" });
  const [dragging, setDragging] = useState(false);

  const reading = status.type === "reading";

  const handleFile = async (file: File | undefined) => {
    if (!file || reading) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setStatus({ type: "error", message: "Please upload a PDF file." });
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setStatus({ type: "error", message: "PDF is too large. Maximum size is 15 MB." });
      return;
    }

    setStatus({ type: "reading", fileName: file.name });

    try {
      const { hasText, products } = await parseProductsFromPdf(file, subcategories);

      if (!hasText) {
        setStatus({
          type: "error",
          message:
            "This PDF has no readable text. It may be a scanned image — please upload a PDF exported from Excel, Word or your billing software.",
        });
        return;
      }

      if (products.length === 0) {
        setStatus({
          type: "error",
          message:
            "No products found. Make sure the PDF has a product name and price for each item, or use the sample format.",
        });
        return;
      }

      onImport(products);

      setStatus({ type: "done", fileName: file.name, count: products.length });
    } catch (error) {
      console.error("PDF IMPORT ERROR:", error);

      setStatus({
        type: "error",
        message: "Unable to read this PDF. It may be password protected or damaged.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      {/* HEADER */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Import from PDF
            </h2>

            <p className="text-sm text-slate-500">
              Upload your product list or catalog and we&apos;ll fill in the products below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => downloadSamplePdf()}
          className="
            flex items-center justify-center gap-1.5
            rounded-xl border border-slate-200 bg-white
            px-3 py-2
            text-[13px] font-semibold text-slate-700
            hover:bg-slate-50
          "
        >
          <Download size={15} />
          Sample PDF
        </button>
      </div>

      {/* DROP ZONE */}

      <button
        type="button"
        disabled={reading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`
          flex w-full flex-col items-center justify-center gap-2
          rounded-xl border-2 border-dashed
          px-4 py-8
          text-center transition
          ${
            dragging
              ? "border-blue-500 bg-blue-100"
              : "border-blue-300 bg-blue-50 hover:bg-blue-100"
          }
          disabled:cursor-wait disabled:opacity-80
        `}
      >
        {reading ? (
          <Loader2 size={26} className="animate-spin text-blue-600" />
        ) : (
          <Upload size={26} className="text-blue-600" />
        )}

        <span className="text-sm font-semibold text-blue-600">
          {reading
            ? `Reading ${status.fileName}...`
            : "Click to upload or drag a PDF here"}
        </span>

        <span className="text-xs text-slate-500">
          Needs a product name and price per item · Max 15 MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* RESULT */}

      {status.type === "done" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

          <p>
            Added <span className="font-semibold">{status.count}</span>{" "}
            {status.count === 1 ? "product" : "products"} from{" "}
            <span className="font-semibold">{status.fileName}</span>. Check each
            one below and add an image before confirming.
          </p>
        </div>
      )}

      {status.type === "error" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <p>{status.message}</p>
        </div>
      )}
    </div>
  );
}
