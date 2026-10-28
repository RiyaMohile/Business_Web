"use client";

import Sidebar from "../../components/Sidebar";
import {
  Wallet,
  FileText,
  MessageCircle,
  Shield,
  AlertTriangle,
  Landmark,
} from "lucide-react";

const cards = [
  {
    title: "Admins",
    value: "12",
    icon: Shield,
    color: "bg-blue-500",
  },
  {
    title: "Wallets",
    value: "1,240",
    icon: Wallet,
    color: "bg-green-500",
  },
  {
    title: "Posts",
    value: "8,421",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    title: "Vibes",
    value: "4,910",
    icon: MessageCircle,
    color: "bg-purple-500",
  },
  {
    title: "Reports",
    value: "15",
    icon: AlertTriangle,
    color: "bg-red-500",
  },
  {
    title: "Withdrawals",
    value: "27",
    icon: Landmark,
    color: "bg-indigo-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar />

      <main className="ml-72 h-screen overflow-y-auto p-10">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back Admin 👋
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">

              <h3 className="font-semibold">
                Admin
              </h3>

              <p className="text-gray-500 text-sm">
                admin@thover.com
              </p>

            </div>

            <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition"
            >

              <div>

                <p className="text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} w-16 h-16 rounded-xl flex items-center justify-center`}
              >
                <card.icon
                  size={30}
                  className="text-white"
                />
              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}