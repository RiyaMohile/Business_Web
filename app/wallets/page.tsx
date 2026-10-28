"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import WalletSearch from "../components/wallets/WalletSearch";
import WalletTable from "../components/wallets/WalletTable";
import CoinModal from "../components/wallets/CoinModal";

interface WalletType {
  _id: string;
  walletName: string;
  walletId: string;
  totalCoin: number;
  professionalWallet: boolean;
  userId: {
    username: string;
    name: string;
    email: string;
  };
}

export default function WalletPage() {
    const [wallets, setWallets] = useState<WalletType[]>([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(false);

const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
const [coinAmount, setCoinAmount] = useState("");
const [action, setAction] = useState<"give" | "take" | null>(null);
 
const giveCoins = async () => {
  if (!selectedWallet) return;

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://api.thover.in/v1/api/admin/admin-give",
      {
        walletId: selectedWallet._id,
        coins: Number(coinAmount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Coins added successfully");

    setSelectedWallet(null);
    setCoinAmount("");
    setAction(null);

    fetchWallets(search);

  } catch (err: any) {
    alert(err.response?.data?.message);
  }
};

const takeCoins = async () => {
  if (!selectedWallet) return;

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "https://api.thover.in/v1/api/admin/admin-take",
      {
        walletId: selectedWallet._id,
        coins: Number(coinAmount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Coins deducted successfully");

    setSelectedWallet(null);
    setCoinAmount("");
    setAction(null);

    fetchWallets(search);

  } catch (err: any) {
    alert(err.response?.data?.message);
  }
};

  const fetchWallets = async (walletName = "") => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `https://api.thover.in/v1/api/admin/search-wallet?walletName=${walletName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWallets(data.wallets);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets("");
  }, []);

return (
  <div className="flex min-h-screen bg-gray-50">

    <Sidebar />

    <main className="ml-0 md:ml-72 flex-1 h-screen overflow-hidden px-4 pb-6 pt-20 md:p-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold">
          Wallet Management
        </h1>

        <p className="text-gray-500 mt-2">
          Search and manage user wallets
        </p>

      </div>

      {/* Search */}
      <WalletSearch
        value={search}
        onChange={setSearch}
        onSearch={() => fetchWallets(search)}
      />

      {/* Table */}
      <WalletTable
        wallets={wallets}
        loading={loading}
        onGive={(wallet) => {
          setSelectedWallet(wallet);
          setAction("give");
        }}
        onTake={(wallet) => {
          setSelectedWallet(wallet);
          setAction("take");
        }}
      />

      {/* Modal */}
      <CoinModal
        open={selectedWallet !== null}
        wallet={selectedWallet}
        action={action}
        coinAmount={coinAmount}
        setCoinAmount={setCoinAmount}
        onClose={() => {
          setSelectedWallet(null);
          setCoinAmount("");
          setAction(null);
        }}
        onSubmit={
          action === "give"
            ? giveCoins
            : takeCoins
        }
      />

    </main>

  </div>
);
}