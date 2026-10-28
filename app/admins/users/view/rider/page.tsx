"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Bike,
  Star,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../../../../components/Sidebar";
import api from "../../../../services/businessApi";

interface Rider {
  _id: string;

  riderId: string;

  vehicleType: string;

  vehicleNumber: string;

  drivingLicenceNumber: string;

  isAvailable: boolean;

  isVerified: boolean;

//   totalDeliveries: number;

//   rating: number;

  createdAt: string;

  userId: {
    _id: string;
    name: string;
    username: string;
    phoneNumber: string;
    // email: string;
  };
}

function RiderContent() {
  const searchParams = useSearchParams();
const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [rider, setRider] = useState<Rider | null>(null);

  const fetchRider = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/rider/user/${id}`
      );

      setRider(data.rider);

    } catch (err) {
      console.log(err);
      alert("Unable to fetch rider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRider();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="ml-0 md:ml-72 flex-1 h-screen overflow-y-auto px-4 pb-8 pt-20 md:p-8">

        <h1 className="text-3xl font-bold md:text-4xl">
          Rider Details
        </h1>

        <p className="text-gray-500 mt-2">
          Complete rider information.
        </p>

        {loading ? (

          <div className="mt-10">
            Loading...
          </div>

        ) : !rider ? (

          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow md:p-10">

            Rider not found.

          </div>

        ) : (
<div className="mt-8 rounded-2xl bg-white p-4 shadow md:p-8">

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

              <div>

                <h2 className="mb-6 text-xl font-semibold md:text-2xl">

                  Rider Information

                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <User size={18} />

                    <span>{rider.userId.name}</span>

                  </div>

                  <div className="flex items-center gap-3">

                    <User size={18} />

                    <span>
                      @{rider.userId.username}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Phone size={18} />

                    <span>
                      {rider.userId.phoneNumber}
                    </span>

                  </div>
{/* 
                  <div className="flex items-center gap-3">

                    <Mail size={18} />

                    <span>
                      {rider.userId.email}
                    </span>

                  </div> */}

                </div>

              </div>

              <div>

                <h2 className="text-2xl font-semibold mb-6">

                  Delivery Information

                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <Bike size={18} />

                    <span>

                      {rider.vehicleType}

                    </span>

                  </div>

                  <div>

                    <span className="font-medium">

                      Vehicle Number :

                    </span>

                    <span className="ml-2">

                      {rider.vehicleNumber}

                    </span>

                  </div>

                  <div>

                    <span className="font-medium">

                      License :

                    </span>

                    <span className="ml-2">

                      {rider.drivingLicenceNumber}

                    </span>

                  </div>

                  {/* <div className="flex items-center gap-3">

                    <Star
                      className="text-yellow-500"
                      size={18}
                    />

                    <span>

                      {rider.rating}

                    </span>

                  </div> */}

                  {/* <div>

                    <span className="font-medium">

                      Deliveries :

                    </span>

                    <span className="ml-2">

                      {rider.totalDeliveries}

                    </span>

                  </div> */}

                  <div>

                    <span className="font-medium">

                      Available :

                    </span>

                    <span className="ml-2">

                      {rider.isAvailable
                        ? "Yes"
                        : "No"}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <ShieldCheck
                      className="text-green-600"
                      size={18}
                    />

                    <span>

                      {rider.isVerified
                        ? "Verified"
                        : "Not Verified"}

                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}
export default function RiderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiderContent />
    </Suspense>
  );
}