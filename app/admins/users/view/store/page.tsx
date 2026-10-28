"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import api from "../../../../services/businessApi";

import {
  Store,
  User,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  FileText,
} from "lucide-react";

interface StoreType {
  _id: string;

  storeName: string;
  category: string;
  gstNumber?: string;

  status: "public" | "suspended";
  isVerified: boolean;
  isOnline: boolean;

  workingDays: {
    from: string;
    to: string;
  };

  openingHours: {
    from: string;
    to: string;
  };

  address?: {
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  contacts?: {
    phoneContactId?: {
      number: string;
      countryCode: string;
    };

    // mailContactId?: {
    //   email: string;
    // };
  };

  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
  };
}

function StoreContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");

  const router = useRouter();

  const [store, setStore] = useState<StoreType | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const fetchStore = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/store/user/${id}`
      );

      setStore(data.store);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch store");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStore();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-4xl font-bold">
          Store Details
        </h1>

        <p className="text-gray-500 mt-2">
          Store profile and owner information.
        </p>

        {loading ? (

          <div className="mt-10">
            Loading...
          </div>

        ) : !store ? (

          <div className="bg-white rounded-2xl shadow mt-8 p-10 text-center">

            Store not found.

          </div>

        ) : (

          <div className="mt-8 rounded-2xl bg-white p-4 shadow md:p-8">

  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">

              {/* Store */}

              <div>

                <h2 className="mb-6 text-xl font-semibold md:text-2xl">

                  Store Information

                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <Store size={18} />

                    <span>

                      {store.storeName}

                    </span>

                  </div>

                  <div className="flex items-start gap-3">

                    <FileText
                      size={18}
                      className="mt-1"
                    />

                    <span>

                      {store.category || "-"}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Phone size={18} />

                    <span>

                      {store.contacts?.phoneContactId?.number ?? "-"}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <ShieldCheck
                      size={18}
                      className="text-green-600"
                    />

                    <span>

                      {store.isVerified
                        ? "Verified"
                        : "Not Verified"}

                    </span>

                  </div>

                  <div>

                    <span className="font-medium">

                      Status :

                    </span>

                    <span className="ml-2">

                      {store.isOnline ? "Online" : "Offline"}

                    </span>

                  </div>

                  <div className="flex items-start gap-3">

                    <MapPin
                      size={18}
                      className="mt-1"
                    />

                    <span>

                      {store.address?.area}

                      {store.address?.city
                        ? `, ${store.address.city}`
                        : ""}

                      {/* {store.address?.state
                        ? `, ${store.address.state}`
                        : ""} */}

                    </span>

                  </div>

                </div>

              </div>

              {/* Owner */}

              <div>

                <h2 className="text-2xl font-semibold mb-6">

                  Owner Information

                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <User size={18} />

                    <span>

                      {store.userId.name}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <User size={18} />

                    <span>

                      @{store.userId.username}

                    </span>

                  </div>

                  {/* <div className="flex items-center gap-3">

                    <Mail size={18} />

                    <span>

                      {store.userId.email}

                    </span>

                  </div> */}

                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/admins/users/view/post?id=${id}`
                    )
                  }
                  className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 md:mt-10 md:px-6"
                >
                  View Store Posts
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreContent />
    </Suspense>
  );
}