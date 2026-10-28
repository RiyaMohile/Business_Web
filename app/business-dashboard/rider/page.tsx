"use client";

import { useEffect, useState } from "react";
import { searchRiders } from "../../services/orderApi";

interface Rider {
  _id: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  city?: string;
  area?: string;

  userId?: {
    _id: string;
    name?: string;
    username?: string;
    phoneNumber?: string;
    city?: string;
    area?: string;
  };
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await searchRiders();

        console.log("RIDERS RESPONSE:", response);

        setRiders(response?.riders || []);
      } catch (error: any) {
        console.error("GET RIDERS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to fetch riders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">
            Riders
          </h1>

          <div className="mt-8 bg-white rounded-2xl p-8 text-center">
            Loading riders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold">
            Riders
          </h1>

          <div className="mt-8 bg-white rounded-2xl p-8 text-center text-red-500">
            {error}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Riders
            </h1>

            <p className="text-gray-500 mt-1">
              Find available online riders
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl shadow-sm">
            <span className="text-gray-500">
              Online Riders
            </span>

            <span className="font-bold ml-2">
              {riders.length}
            </span>
          </div>

        </div>

        {/* RIDERS */}

        {riders.length === 0 ? (

          <div className="mt-8 bg-white rounded-2xl p-12 text-center">

            <div className="text-5xl mb-4">
              🚴
            </div>

            <h2 className="text-xl font-semibold">
              No riders available
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no online riders.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {riders.map((rider) => {

              const riderName =
                rider.userId?.name ||
                rider.name ||
                rider.userId?.username ||
                rider.username ||
                "Rider";

              const username =
                rider.userId?.username ||
                rider.username ||
                "-";

              const phone =
                rider.userId?.phoneNumber ||
                rider.phoneNumber ||
                "-";

              const city =
                rider.userId?.city ||
                rider.city ||
                "-";

              const area =
                rider.userId?.area ||
                rider.area ||
                "-";

              return (
                <div
                  key={rider._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >

                  {/* RIDER HEADER */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                        🚴
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {riderName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          @{username}
                        </p>
                      </div>

                    </div>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Online
                    </span>

                  </div>

                  {/* RIDER DETAILS */}

                  <div className="border-t mt-5 pt-5 space-y-3">

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium">
                        {phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        City
                      </p>

                      <p className="font-medium">
                        {city}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Area
                      </p>

                      <p className="font-medium">
                        {area}
                      </p>
                    </div>

                  </div>

                  {/* ACTION */}

                  <button
                    type="button"
                    className="w-full mt-5 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700"
                  >
                    Select Rider
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}