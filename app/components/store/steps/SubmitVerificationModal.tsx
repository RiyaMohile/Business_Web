"use client";

import { useState } from "react";
import axios from "axios";
import { X, FileText, Upload } from "lucide-react";

interface SubmitVerificationModalProps {
  storeId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function SubmitVerificationModal({
  storeId,
  onClose,
  onSubmitted,
}: SubmitVerificationModalProps) {
  const [legalProofType, setLegalProofType] = useState("GST");
const [legalFile, setLegalFile] = useState<File | null>(null);

const [addressProofType, setAddressProofType] =
  useState("ELECTRICITY");
const [addressFile, setAddressFile] = useState<File | null>(null);

const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

 // ===============================
// LEGAL PROOF VALIDATION
// ===============================

if (!legalFile) {
  alert("Please upload legal proof document.");
  return;
}

if (
  legalFile.type !== "application/pdf" ||
  !legalFile.name.toLowerCase().endsWith(".pdf")
) {
  alert("Legal proof must be a PDF file.");
  return;
}

// ===============================
// ADDRESS PROOF VALIDATION
// ===============================

if (!addressFile) {
  alert("Please upload address proof document.");
  return;
}

if (
  addressFile.type !== "application/pdf" ||
  !addressFile.name.toLowerCase().endsWith(".pdf")
) {
  alert("Address proof must be a PDF file.");
  return;
}

      // ===============================
      // FORM DATA
      // ===============================

    const verificationForm = new FormData();

verificationForm.append(
  "storeId",
  storeId
);

// ===============================
// LEGAL PROOF
// ===============================

verificationForm.append(
  "legalProof",
  legalProofType
);

verificationForm.append(
  "legalProofDocument",
  legalFile
);

// ===============================
// ADDRESS PROOF
// ===============================

verificationForm.append(
  "addressProof",
  addressProofType
);

verificationForm.append(
  "addressProofDocument",
  addressFile
);

      console.log(
        "SUBMIT VERIFICATION STORE ID:",
        storeId
      );

      // ===============================
      // SUBMIT
      // ===============================

      setLoading(true);

      const { data } = await axios.post(
        "https://api.thover.in/v1/api/business-verification/submit",
        verificationForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "VERIFICATION RESPONSE:",
        data
      );

      if (!data?.success) {
        alert(
          data?.message ||
            "Document submission failed."
        );
        return;
      }

      alert(
        "Documents submitted successfully."
      );

      onSubmitted();

    } catch (error: any) {
      console.error(
        "SUBMIT VERIFICATION ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to submit documents."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================= HEADER ================= */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            border-b
            border-slate-100
            p-5
            sm:p-6
          "
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Submit Verification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload your business documents for verification.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-900
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">

          <div className="space-y-6">

            {/* ================= GST ================= */}

            {/* ================= LEGAL PROOF ================= */}

<div>
  <label className="mb-2 block text-sm font-semibold text-slate-800">
    Legal Proof
    <span className="ml-1 text-red-500">*</span>
  </label>

  {/* DOCUMENT TYPE DROPDOWN */}
  <select
    value={legalProofType}
    onChange={(e) => setLegalProofType(e.target.value)}
    disabled={loading}
    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
  >
    <option value="GST">
  GST
</option>

<option value="SHOP_ESTABLISHMENT">
  Shop Establishment Certificate
</option>

<option value="TRADE_LICENCE">
  Trade Licence
</option>
  </select>

  {/* FILE */}
  <div
    className="
      mt-3
      flex
      items-center
      gap-3
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      p-4
    "
  >
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-blue-50
      "
    >
      <FileText
        size={20}
        className="text-blue-600"
      />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-800">
        {legalProofType === "GST"
  ? "GST"
  : legalProofType === "SHOP_ESTABLISHMENT"
    ? "Shop Establishment Certificate"
    : "Trade Licence"}
      </p>

      <p className="text-xs text-slate-500">
        PDF file only
      </p>
    </div>
  </div>

  <input
    type="file"
    accept="application/pdf,.pdf"
    onChange={(e) => {
      setLegalFile(
        e.target.files?.[0] || null
      );
    }}
    disabled={loading}
    className="
      mt-3
      w-full
      rounded-xl
      border
      border-slate-300
      p-3
      text-sm
      outline-none
      focus:border-blue-500
    "
  />

  {legalFile && (
    <p className="mt-2 text-xs text-green-600">
      Selected: {legalFile.name}
    </p>
  )}
</div>

            {/* ================= ELECTRICITY ================= */}

            {/* ================= ADDRESS PROOF ================= */}

<div>
  <label className="mb-2 block text-sm font-semibold text-slate-800">
    Address Proof
    <span className="ml-1 text-red-500">*</span>
  </label>

  {/* DOCUMENT TYPE DROPDOWN */}
  <select
    value={addressProofType}
    onChange={(e) =>
      setAddressProofType(e.target.value)
    }
    disabled={loading}
    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
  >
    <option value="ELECTRICITY">
      Electricity Bill
    </option>

    <option value="PHONE">
      Phone Bill
    </option>
  </select>

  {/* FILE */}
  <div
    className="
      mt-3
      flex
      items-center
      gap-3
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      p-4
    "
  >
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-blue-50
      "
    >
      <FileText
        size={20}
        className="text-blue-600"
      />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-800">
        {addressProofType === "ELECTRICITY"
          ? "Electricity Bill"
          : "Phone Bill"}
      </p>

      <p className="text-xs text-slate-500">
        PDF file only
      </p>
    </div>
  </div>

  <input
    type="file"
    accept="application/pdf,.pdf"
    onChange={(e) => {
      setAddressFile(
        e.target.files?.[0] || null
      );
    }}
    disabled={loading}
    className="
      mt-3
      w-full
      rounded-xl
      border
      border-slate-300
      p-3
      text-sm
      outline-none
      focus:border-blue-500
    "
  />

  {addressFile && (
    <p className="mt-2 text-xs text-green-600">
      Selected: {addressFile.name}
    </p>
  )}
</div>

          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <div
          className="
            flex
            shrink-0
            justify-end
            gap-3
            border-t
            border-slate-100
            p-5
            sm:p-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-50
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
  loading ||
  !legalFile ||
  !addressFile
}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:bg-slate-300
            "
          >
            <Upload size={17} />

            {loading
              ? "Submitting..."
              : "Submit Verification"}
          </button>
        </div>

      </div>
    </div>
  );
}