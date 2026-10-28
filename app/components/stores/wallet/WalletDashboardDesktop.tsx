"use client";

import {
  ArrowRight,
  Building2,
  CircleHelp,
  Coins,
  FileText,
  Landmark,
  Pencil,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

import WithdrawalModal from "./WithdrawalModal";
import EditBankAccount from "./bank/EditBankAccount";
import CreateBankAccount from "./bank/CreateBankAccount";
import WalletTransactions from "./WalletTransactions";
import WithdrawalHistory from "./WithdrawalHistory";

import { getMyBankAccount } from "../../../services/bankAccountApi";
import { getWallet } from "../../../services/walletApi";

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

interface WalletDashboardDesktopProps {
  onClose?: () => void;
}

export default function WalletDashboardDesktop({
  onClose,
}: WalletDashboardDesktopProps) {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showEditBankAccount, setShowEditBankAccount] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
  const [showCreateBankAccount, setShowCreateBankAccount] = useState(false);

  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const [bankLoading, setBankLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      setWalletLoading(true);

      const response = await getWallet();

      console.log("DESKTOP WALLET DATA:", response);

      if (response?.success) {
        setWallet(response.wallet);
      } else {
        setWallet(null);
      }
    } catch (error: any) {
      console.error(
        "DESKTOP FETCH WALLET ERROR:",
        error.response?.data || error.message
      );
      setWallet(null);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchBankAccount = async () => {
    try {
      setBankLoading(true);

      const response = await getMyBankAccount();

      console.log("DESKTOP BANK ACCOUNT RESPONSE:", response);

      if (response?.success) {
        setBankAccount(response.bank);
      } else {
        setBankAccount(null);
      }
    } catch (error: any) {
      console.error(
        "DESKTOP FETCH BANK ACCOUNT ERROR:",
        error.response?.data || error.message
      );
      setBankAccount(null);
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchBankAccount();
  }, []);

  const totalCoins = wallet?.totalCoin ?? 0;
  const availableAmount = totalCoins / 100;

  return (
    <section className="hidden w-full md:block">
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Wallet
          </h1>

          <p className="mt-1 text-base text-slate-500">
            Manage your earnings, withdrawals and bank account.
          </p>
        </div>

        {/* <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <CircleHelp size={17} />
          Need Help?
        </button> */}
      </div>

      {/* ================= TOP SECTION ================= */}

      <div className="grid grid-cols-12 gap-4">
        {/* ================= WALLET CARD ================= */}

        <div className="relative col-span-7 overflow-hidden rounded-2xl bg-indigo-600 p-5 text-white shadow-sm">
          {/* Wallet name */}

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <WalletCards size={23} />
            </div>

            <div>
              <p className="text-sm font-medium">
                {wallet?.walletName || "My Wallet"}
              </p>

              <p className="text-xs text-white/70">
                Available Balance
              </p>
            </div>
          </div>

          {/* Coins */}

          <div className="mt-4">
            {walletLoading ? (
              <p className="text-sm text-white/80">
                Loading wallet...
              </p>
            ) : (
              <>
                <p className="text-3xl font-bold">
                  {totalCoins} Coins
                </p>

                <p className="mt-1 text-sm text-white/90">
                  ₹{availableAmount.toFixed(2)} available
                </p>
              </>
            )}
          </div>

          {/* Conversion */}

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
              <Coins size={15} className="text-white" />
            </span>

            <span className="text-sm font-medium">
              100 Coins = ₹1
            </span>
          </div>

          {/* Withdraw info */}

          <div className="my-4 h-px bg-white/20" />

          <p className="text-xs font-medium text-white/90">
            You can withdraw when you have minimum 1,00,000 Coins.
          </p>

          {/* Withdraw */}

          <button
            type="button"
            onClick={() => setShowWithdrawalModal(true)}
            className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-slate-50"
          >
            Withdraw
          </button>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="col-span-5 flex flex-col gap-4">
          {/* ================= BANK ACCOUNT ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                Primary Bank Account
              </h2>

              {/* {!bankLoading && bankAccount && (
                <button
                  type="button"
                  onClick={() => setShowEditBankAccount(true)}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              )} */}

              {!bankLoading && !bankAccount && (
                <button
                  type="button"
                  onClick={() => setShowCreateBankAccount(true)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  + Add Bank
                </button>
              )}
            </div>

            {bankLoading ? (
              <div className="mt-5 text-sm text-slate-400">
                Loading bank account...
              </div>
            ) : bankAccount ? (
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <Landmark
                      size={27}
                      className="text-indigo-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">
                      {bankAccount.bankName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {bankAccount.accountNumber
                        ? `XXXX ${bankAccount.accountNumber.slice(-4)}`
                        : "XXXX"}
                    </p>

                    <p className="text-sm text-slate-500">
                      UPI: {bankAccount.upiId || "Not added"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditBankAccount(true)}
                  className="shrink-0 rounded-xl border border-indigo-200 px-5 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Manage
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-slate-500">
                  No bank account added.
                </p>
              </div>
            )}
          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-800">
              Quick Actions
            </h2>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => setShowWithdrawalHistory(true)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-3 text-left shadow-sm transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
                    <Landmark
                      size={18}
                      className="text-indigo-600"
                    />
                  </span>

                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Manage Withdrawal
                    </span>

                    <span className="block text-xs text-slate-400">
                      Request and track your withdrawal easily.
                    </span>
                  </span>
                </span>

                <ArrowRight
                  size={18}
                  className="text-indigo-600"
                />
              </button>

              <button
                type="button"
                onClick={() => setShowTransactions(true)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-3 text-left shadow-sm transition hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
                    <FileText
                      size={18}
                      className="text-indigo-600"
                    />
                  </span>

                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Transactions
                    </span>

                    <span className="block text-xs text-slate-400">
                      View your wallet transaction history.
                    </span>
                  </span>
                </span>

                <ArrowRight
                  size={18}
                  className="text-indigo-600"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT TRANSACTIONS ================= */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-800">
            Recent Transactions
          </h2>

          <button
            type="button"
            onClick={() => setShowTransactions(true)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <FileText
              size={26}
              className="text-indigo-600"
            />
          </div>

          <h3 className="mt-3 text-base font-bold text-slate-800">
            No transactions yet
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Your wallet transactions will appear here.
          </p>
        </div>
      </div>

      {/* ================= WITHDRAWAL MODAL ================= */}

      {showWithdrawalModal && (
        <WithdrawalModal
          onClose={() => setShowWithdrawalModal(false)}
        />
      )}

      {/* ================= EDIT BANK ================= */}

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

      {/* ================= CREATE BANK ================= */}

      {showCreateBankAccount && (
        <CreateBankAccount
          onClose={() => setShowCreateBankAccount(false)}
          onSuccess={async () => {
            setShowCreateBankAccount(false);
            await fetchBankAccount();
          }}
        />
      )}

      {/* ================= TRANSACTIONS ================= */}

      {showTransactions && (
        <WalletTransactions
          onClose={() => setShowTransactions(false)}
        />
      )}

      {/* ================= WITHDRAWAL HISTORY ================= */}

      {showWithdrawalHistory && (
        <WithdrawalHistory
          onClose={() => setShowWithdrawalHistory(false)}
        />
      )}
    </section>
  );
}
