"use client";

import {
  ArrowLeft,
  CircleHelp,
  X,
  Coins,
  WalletCards,
  Landmark,
  ArrowRight,
  Eye,
  ReceiptText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WithdrawalModal from "./WithdrawalModal";
import EditBankAccount from "./bank/EditBankAccount";
import { getMyBankAccount, } from "../../../services/bankAccountApi";
import { getWallet } from "../../../services/walletApi";
import WalletTransactions from "./WalletTransactions";
import WithdrawalHistory from "./WithdrawalHistory";
import MobileDashboardNav from "../../dashboard/MobileDashboardNav";
import CreateBankAccount from "./bank/CreateBankAccount";

interface Wallet {
  _id: string;
  walletId: string;
  walletName: string;
  userId: string;
  totalCoin: number;
  professionalWallet: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BankAccount {
  _id: string;
  userId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}


interface WalletDashboardProps {
  onClose: () => void;
  wallet?: Wallet;
}

export default function WalletDashboard({
  onClose,
  wallet: initialWallet,
}: WalletDashboardProps) {
  const router = useRouter();
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showEditBankAccount, setShowEditBankAccount] =useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

const [bankAccount, setBankAccount] =
  useState<BankAccount | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(
  initialWallet ?? null
);
const [bankLoading, setBankLoading] = useState(true);
const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
const [showCreateBankAccount, setShowCreateBankAccount] = useState(false);

const fetchBankAccount = async () => {
  try {
    setBankLoading(true);

    const response = await getMyBankAccount();

    console.log("BANK ACCOUNT RESPONSE:", response);

    if (response?.success) {
      setBankAccount(response.bank);
    } else {
      setBankAccount(null);
    }
  } catch (error: any) {
    console.error(
      "FETCH BANK ACCOUNT ERROR:",
      error.response?.data || error.message
    );

    setBankAccount(null);
  } finally {
    setBankLoading(false);
  }
};

useEffect(() => {
  const fetchWallet = async () => {
    try {
      const response = await getWallet();

      console.log("WALLET DATA:", response);

      if (response?.success) {
        setWallet(response.wallet);
      }
    } catch (error) {
      console.error("FETCH WALLET ERROR:", error);
    }
  };

  fetchWallet();
  fetchBankAccount();
}, []);

  return (
    <main className="min-h-screen bg-slate-50 overflow-y-auto pb-24">
        {!showCreateBankAccount &&
  !showEditBankAccount &&
  !showWithdrawalModal &&
  !showTransactions &&
  !showWithdrawalHistory && (
    <MobileDashboardNav />
  )}

      <div className="mx-auto w-full max-w-md px-3">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-center py-3">
  <h1 className="text-lg font-semibold text-slate-900">
    Wallet
  </h1>
</div>

        {/* ================= WALLET CARD ================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-indigo-600
            p-4
            text-white
            shadow-md
          "
        >

          {/* Close */}

          <button
            type="button"
            className="
              absolute
              right-3
              top-3
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              text-white/80
              hover:bg-white/10
            "
          >
            <X size={18} />
          </button>

          {/* Wallet Name */}

          <div className="flex items-center gap-2">

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/15
              "
            >
              <WalletCards size={18} />
            </div>

            <span className="text-xs font-medium">
              {wallet?.walletName || "My Wallet"}
            </span>

          </div>

          {/* Coins */}

          <div className="mt-4">

            <p className="text-xl font-semibold">
              {wallet?.totalCoin ?? 0} Coins
            </p>

            <p className="mt-1 text-[12px] font-medium text-white/80">
  ₹{((wallet?.totalCoin ?? 0) / 100).toFixed(2)} available
</p>

          </div>

          {/* Coin Conversion */}

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2">

            <div
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-yellow-400
              "
            >
              <Coins
                size={13}
                className="text-white"
              />
            </div>

            <span className="text-xs font-medium">
              100 Coins = ₹1
            </span>

          </div>

          {/* Withdraw info */}

          <div className="mt-4 border-t border-white/15 pt-3">

            <p className="text-[12px] font-medium leading-4 text-white/85">
              You can withdraw when you have minimum 1,00,000 Coins.
            </p>

          </div>

          {/* Withdraw */}

          <button
            type="button"
             onClick={() => setShowWithdrawalModal(true)}
            className="
              mt-4
              h-10
              w-full
              rounded-xl
              bg-white
              text-xs
              font-semibold
              text-indigo-600
            "
          >
            Withdraw
          </button>

        </div>

        {/* ================= PRIMARY BANK ================= */}

        {/* PRIMARY BANK ACCOUNT */}

<div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">

 <div className="flex items-center justify-between">
  <h3 className="text-xs font-semibold text-slate-700">
    Primary Bank Account
  </h3>

  {!bankLoading && !bankAccount && (
  <button
    type="button"
    onClick={() => setShowCreateBankAccount(true)}
    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
  >
    + Add Bank
  </button>
)}
</div>

  {bankLoading ? (
    <div className="mt-4 text-sm text-slate-400">
      Loading bank account...
    </div>
  ) : bankAccount ? (
    <div className="mt-4 flex items-center gap-3">

      {/* BANK ICON */}
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-50
        "
      >
        <Landmark
          size={22}
          className="text-indigo-600"
        />
      </div>

      {/* BANK DETAILS */}
      <div className="min-w-0 flex-1">

        <p className="text-sm font-bold text-slate-900">
          {bankAccount.bankName}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {bankAccount.accountNumber
            ? `XXXX ${bankAccount.accountNumber.slice(-4)}`
            : "XXXX"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          UPI: {bankAccount.upiId || "Not added"}
        </p>

      </div>

      {/* MANAGE */}
      <button
        type="button"
        onClick={() => {
          setShowEditBankAccount(true);
        }}
        className="
          rounded-xl
          border
          border-indigo-200
          px-4
          py-2
          text-xs
          font-medium
          text-indigo-600
        "
      >
        Manage
      </button>

    </div>
 ) : (
  <div className="mt-4">
    <p className="text-sm text-slate-500">
      No bank account added.
    </p>
  </div>
)}

</div>

        {/* ================= MANAGE WITHDRAWAL ================= */}

        <button
  type="button"
  onClick={() => setShowWithdrawalHistory(true)}
  className="
    mt-3
    flex
    w-full
    items-center
    gap-3
    rounded-xl
    border
    border-indigo-100
    bg-white
    p-3
    text-left
    shadow-sm
    transition
    hover:bg-indigo-50
    active:scale-[0.99]
  "
>

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-indigo-50
            "
          >
            <Landmark
              size={18}
              className="text-indigo-600"
            />
          </div>

          <div className="flex-1">

            <p className="text-xs font-semibold text-slate-800">
              Manage Withdrawal
            </p>

            <p className="mt-1 text-[9px] font-medium text-slate-500">
              Request and track your withdrawal easily
            </p>

          </div>

          <ArrowRight
            size={17}
            className="text-indigo-500"
          />

        </button>

        {/* ================= TRANSACTIONS ================= */}

<button
  type="button"
  onClick={() => setShowTransactions(true)}
  className="
    mt-2
    flex
    w-full
    items-center
    gap-3
    rounded-xl
    border
    border-indigo-100
    bg-white
    p-3
    text-left
    shadow-sm
    transition
    hover:bg-indigo-50
  "
>
  {/* ICON */}

  <div
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-full
      bg-indigo-50
    "
  >
    <ReceiptText
      size={18}
      className="text-indigo-600"
    />
  </div>

  {/* TEXT */}

  <div className="flex-1">

    <p className="text-xs font-semibold text-slate-800">
      Transactions
    </p>

    <p className="mt-1 text-[9px] font-medium text-slate-500">
      View your wallet transaction history
    </p>

  </div>

  <ArrowRight
    size={17}
    className="text-indigo-500"
  />
</button>

      </div>

      {showWithdrawalModal && (
  <WithdrawalModal
    onClose={() => setShowWithdrawalModal(false)}
  />
)}

{showEditBankAccount && bankAccount && (
  <EditBankAccount
    account={bankAccount}
    onClose={() => setShowEditBankAccount(false)}
    onUpdated={async () => {
      await fetchBankAccount();
      setShowEditBankAccount(false);
    }}
  />
)}
{showCreateBankAccount && (
  <CreateBankAccount
    onClose={() => setShowCreateBankAccount(false)}
    onSuccess={async () => {
      setShowCreateBankAccount(false);
      await fetchBankAccount();
    }}
  />
)}
{showTransactions && (
  <WalletTransactions
    onClose={() => setShowTransactions(false)}
  />
)}
{showWithdrawalHistory && (
  <WithdrawalHistory
    onClose={() => setShowWithdrawalHistory(false)}
  />
)}
    </main>
  );
}