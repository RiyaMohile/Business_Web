"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import api from "../../services/businessApi";
import { useRouter } from "next/navigation";

interface Verification {
  _id: string;

  status: "PENDING" | "VERIFIED" | "REJECTED";

  rejectionReason?: string;

  createdAt: string;

  legalProof: {
    proofType: string;
    legaldocument: {
      fileName: string;
      fileUrl: string;
    };
  };

  addressProof?: {
    proofType: string;
    addressdocument: {
      fileName: string;
      fileUrl: string;
    };
  };

  storeId: {
    _id: string;
    storeName: string;
    category: string;
    gstNumber?: string;
  };

  userId: {
    _id: string;
    name: string;
    username: string;
    phoneNumber: string;
  };
}

function VerificationDetailsContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");
  const router = useRouter();

  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [loading, setLoading] = useState(true);

  const [rejectReason, setRejectReason] =useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchVerification = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/business-verification/user/${id}`
      );
      console.log(data.data);

      setVerification(data.data);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch verification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVerification();
    }
  }, [id]);

const approve = async () => {
  if (!verification) return;

  try {
    await api.put(`/business-verification/review/${verification._id}`, {
  status: "VERIFIED",
});

    
    setShowRejectInput(false);
    setRejectReason("");

    fetchVerification();

  } catch (err) {
    console.log(err);
    alert("Unable to approve.");
  }
};

const reject = async () => {
  if (!verification) return;

  if (!rejectReason.trim()) {
    alert("Please enter rejection reason.");
    return;
  }

  try {
    await api.put(
      `/business-verification/review/${verification._id}`,
      {
        status: "REJECTED",
        rejectionReason: rejectReason,
      }
    );

    

    setShowRejectInput(false);
    setRejectReason("");

    fetchVerification();

  } catch (err) {
    console.log(err);
    alert("Unable to reject.");
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          Loading...
        </main>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          Verification Not Found
        </main>
      </div>
    );
  }
  const addressProof = verification.addressProof;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-4xl font-bold">
          Verification Details
        </h1>

        <p className="text-gray-500 mt-2">
          Review business verification request.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow md:p-8">

  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">

            

            <div>

  <h2 className="mb-6 text-xl font-semibold md:text-2xl">
    Verification Information
  </h2>

  <div className="space-y-4">

    <div>
      <span className="font-semibold">
        Submitted :
      </span>{" "}
      {new Date(
        verification.createdAt
      ).toLocaleDateString()}
    </div>

    <div>
      <span className="font-semibold">
        Status :
      </span>{" "}
      {verification.status}
    </div>

    <div>
      <span className="font-semibold">
        Legal Proof :
      </span>{" "}
      GST Certificate
    </div>

    <div>
      <span className="font-semibold">
        Address Proof :
      </span>{" "}
      Aadhaar Card
    </div>

    <div className="mt-6">

  <h3 className="mb-4 text-lg font-semibold md:text-xl">
    Uploaded Documents
  </h3>

  {/* Legal Proof */}

  <div className="mb-4">

    <p className="font-medium">
      {verification.legalProof.proofType}
    </p>

    <button
      onClick={() =>
        window.open(
          verification.legalProof.legaldocument.fileUrl,
          "_blank"
        )
      }
      className="text-blue-600 underline"
    >
      View Legal Document
    </button>

  </div>

  {/* Address Proof */}

  {addressProof && (

    <div>

      <p className="font-medium">
        {addressProof.proofType}
      </p>

     <button
  onClick={() => {
    if (verification.addressProof?.addressdocument.fileUrl) {
      window.open(
  addressProof.addressdocument.fileUrl,
  "_blank"
)
    }
  }}
  className="text-blue-600 underline"
>
  View Address Document
</button>

    </div>

  )}

</div>

  </div>

</div>

            {/* User */}

            <div>

              <h2 className="text-2xl font-semibold mb-6">
                Owner Information
              </h2>

              <div className="space-y-4">

                <div>

                  <span className="font-semibold">
                    Name :
                  </span>{" "}

                  {verification.userId.name}

                </div>

                <div>

                  <span className="font-semibold">
                    Username :
                  </span>{" "}

                  @{verification.userId.username}

                </div>

                {/* <div>

                  <span className="font-semibold">
                    Email :
                  </span>{" "}

                  {verification.userId.email}

                </div> */}

                <div>

                  <span className="font-semibold">
                    Phone :
                  </span>{" "}

                  {verification.userId.phoneNumber}

                </div>

              </div>

            </div>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-semibold mb-4">
              Current Status
            </h2>

            <span
              className={`px-4 py-2 rounded-full text-white ${
                verification.status==="VERIFIED"
                  ? "bg-green-600"
                  : verification.status === "PENDING"
                  ? "bg-yellow-500"
                  : "bg-red-600"
              }`}
            >
              {verification.status}
            </span>

          </div>

          {verification.status === "REJECTED" && (

            <div className="mt-6">

              <h3 className="font-semibold">
                Rejection Reason
              </h3>

              <p className="mt-2 text-red-600">
                {verification.rejectionReason}
              </p>

            </div>

          )}

          {verification.storeId && (

  <button
    onClick={() =>
      router.push(
  `/admins/users/view/store?id=${verification.userId._id}`
)
    }
    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
  >
    View Store
  </button>

)}

{/* Pending */}
{verification.status === "PENDING" && (
  <div className="mt-6 flex flex-wrap gap-3 md:gap-5">
    <button
      onClick={approve}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
    >
      Approve
    </button>

    <button
      onClick={() => setShowRejectInput(true)}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
    >
      Reject
    </button>
  </div>
)}

{/* Verified */}
{verification.status === "VERIFIED" && (
  <div className="mt-6">
    <button
      onClick={() => setShowRejectInput(true)}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
    >
      Reject
    </button>
  </div>
)}

{/* Rejected */}
{verification.status === "REJECTED" && (
  <div className="mt-6">
    <button
      onClick={approve}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
    >
      Approve
    </button>
  </div>
)}
        </div>

{showRejectInput && (
  <div className="mt-6">

    <textarea
      rows={4}
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      placeholder="Enter rejection reason..."
       className="w-full resize-none rounded-xl border border-gray-300 p-4"
    />

    <div className="mt-4 flex flex-wrap gap-3 md:gap-4">

      <button
        onClick={reject}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
      >
        Confirm Reject
      </button>

      <button
        onClick={() => {
          setShowRejectInput(false);
          setRejectReason("");
        }}
        className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-xl"
      >
        Cancel
      </button>

    </div>

  </div>
)}
      </main>

    </div>
  );
}

export default function VerificationDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationDetailsContent />
    </Suspense>
  );
}