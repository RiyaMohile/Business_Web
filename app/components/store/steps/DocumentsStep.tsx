"use client";

import axios from "axios";
import { StoreForm } from "../types";

interface Props {
  form: StoreForm;
  updateForm: (data: Partial<StoreForm>) => void;
  onBack: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  onComplete: () => void;
}

export default function DocumentsStep({
  form,
  updateForm,
  onBack,
  loading,
  setLoading,
  onComplete,
}: Props) {

  const createStore = async (skipDocuments = false) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    // ==========================================
    // 1. CHECK ADDRESS
    // ==========================================

    if (!form.address?.addressId) {
      alert("Please select an address.");
      return;
    }

    // ==========================================
    // 2. DOCUMENT VALIDATION
    // Only when user DOES NOT skip
    // ==========================================

    if (!skipDocuments) {
      // GST
      if (!form.document1) {
        alert("Please upload GST document.");
        return;
      }

      if (
        form.document1.type !== "application/pdf" ||
        !form.document1.name.toLowerCase().endsWith(".pdf")
      ) {
        alert("GST document must be a PDF file.");
        return;
      }

      // Electricity
      if (!form.document2) {
        alert("Please upload Electricity document.");
        return;
      }

      if (
        form.document2.type !== "application/pdf" ||
        !form.document2.name.toLowerCase().endsWith(".pdf")
      ) {
        alert("Electricity document must be a PDF file.");
        return;
      }
    }

    // ==========================================
    // 3. CREATE STORE
    // ==========================================

    const storePayload = {
      address: {
        addressId: form.address.addressId,
        area: form.address.area || "",
        city: form.address.city || "",
      },

      storeName: form.storeName,
      category: form.category,
      gstNumber: form.gstNumber || "",

      mailContactId: form.mailContactId,

      workingDays: form.workingDays,
      openingHours: form.openingHours,

      isOnline: false,
    };

    console.log("STORE PAYLOAD:", storePayload);

    const storeResponse = await axios.post(
      "https://api.thover.in/v1/api/store/create",
      storePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "CREATE STORE RESPONSE:",
      storeResponse.data
    );

    // ==========================================
    // 4. GET STORE ID
    // ==========================================

    let storeId =
      storeResponse.data?.data?._id ||
      storeResponse.data?._id ||
      storeResponse.data?.data?.store?._id ||
      storeResponse.data?.store?._id;

    // Fallback
    if (!storeId) {
      const myStoreResponse = await axios.get(
        "https://api.thover.in/v1/api/store/my-store",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "MY STORE RESPONSE:",
        myStoreResponse.data
      );

      storeId =
        myStoreResponse.data?.data?._id ||
        myStoreResponse.data?._id ||
        myStoreResponse.data?.data?.store?._id ||
        myStoreResponse.data?.store?._id;
    }

    if (!storeId) {
      console.error(
        "Unable to find MongoDB store _id."
      );

      alert(
        "Store was created, but its ID could not be found."
      );

      return;
    }

    console.log(
      "MONGO STORE ID:",
      storeId
    );

    // ==========================================
    // 5. IF SKIPPED
    // ==========================================

    if (skipDocuments) {
      console.log(
        "STORE CREATED WITHOUT DOCUMENT VERIFICATION"
      );

      alert(
        "Store created successfully. You can upload documents later."
      );

      onComplete();

      return;
    }

    // ==========================================
    // 6. CREATE VERIFICATION FORMDATA
    // ==========================================

    const verificationForm = new FormData();

    verificationForm.append(
      "storeId",
      storeId
    );

    // GST
    verificationForm.append(
      "legalProof",
      "GST"
    );

    verificationForm.append(
      "legalProofDocument",
      form.document1!
    );

    // Electricity
    verificationForm.append(
      "addressProof",
      "Electricity"
    );

    verificationForm.append(
      "addressProofDocument",
      form.document2!
    );

    // ==========================================
    // 7. SUBMIT VERIFICATION
    // ==========================================

    const verificationResponse =
      await axios.post(
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
      verificationResponse.data
    );

    if (verificationResponse.data?.success) {
      console.log(
        "STORE CREATED AND VERIFIED SUCCESSFULLY"
      );

      onComplete();

      return;
    }

    alert(
      verificationResponse.data?.message ||
      "Document submission failed."
    );

  } catch (error: any) {

    console.error(
      "CREATE STORE / VERIFICATION ERROR:",
      error
    );

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Unable to create store."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div>

      <h3 className="text-2xl font-bold">
        Business Documents
      </h3>

      <p className="text-gray-500 mt-2">
        Upload your GST and electricity documents.
      </p>

      <div className="mt-8 space-y-6">

        {/* =====================================
            GST DOCUMENT
        ====================================== */}

        <div>

          <label className="block font-medium mb-2">
            GST Document
            <span className="text-red-500 ml-1">
              *
            </span>
          </label>

          {/* READ ONLY PROOF TYPE */}

          <input
            type="text"
            value="GST"
            readOnly
            className="w-full border border-gray-300 rounded-xl p-4 bg-gray-100 text-gray-700 cursor-not-allowed"
          />

          <p className="text-xs text-gray-500 mt-1">
            Proof Type
          </p>

          {/* FILE */}

          <input
  type="file"
  accept="application/pdf,.pdf"
  onChange={(e) =>
    updateForm({
      document1: e.target.files?.[0] || null,
    })
  }
  className="w-full border border-gray-300 rounded-xl p-4 mt-3 outline-none focus:border-blue-500"
/>

<p className="text-xs text-gray-500 mt-1">
  PDF files only
</p>

        </div>

        {/* =====================================
            ELECTRICITY DOCUMENT
        ====================================== */}

        <div>

          <label className="block font-medium mb-2">
            Electricity Document
            <span className="text-red-500 ml-1">
              *
            </span>
          </label>

          {/* READ ONLY PROOF TYPE */}

          <input
            type="text"
            value="Electricity"
            readOnly
            className="w-full border border-gray-300 rounded-xl p-4 bg-gray-100 text-gray-700 cursor-not-allowed"
          />

          <p className="text-xs text-gray-500 mt-1">
            Proof Type
          </p>

          {/* FILE */}

          <input
  type="file"
  accept="application/pdf,.pdf"
  onChange={(e) =>
    updateForm({
      document2: e.target.files?.[0] || null,
    })
  }
  className="w-full border border-gray-300 rounded-xl p-4 mt-3 outline-none focus:border-blue-500"
/>

<p className="text-xs text-gray-500 mt-1">
  PDF files only
</p>

        </div>

      </div>

      {/* =====================================
          BUTTONS
      ====================================== */}

      <div className="flex items-center justify-between mt-10">

  {/* BACK */}
  <button
    type="button"
    onClick={onBack}
    disabled={loading}
    className="
      px-6
      py-3
      border
      border-gray-300
      rounded-xl
      hover:bg-gray-50
      disabled:opacity-50
    "
  >
    Back
  </button>


  {/* RIGHT BUTTONS */}
  <div className="flex items-center gap-3">

    {/* SKIP */}
    <button
      type="button"
      onClick={() => createStore(true)}
      disabled={loading}
      className="
        px-6
        py-3
        border
        border-gray-300
        rounded-xl
        text-gray-700
        hover:bg-gray-50
        disabled:opacity-50
      "
    >
      Skip for now
    </button>


    {/* VERIFY & CREATE */}
    <button
      type="button"
      onClick={() => createStore(false)}
      disabled={loading}
      className="
        px-8
        py-3
        bg-blue-600
        text-white
        rounded-xl
        hover:bg-blue-700
        disabled:bg-gray-300
      "
    >
      {loading
        ? "Creating..."
        : "Verify & Create Store"}
    </button>

  </div>

</div>

    </div>
  );
}