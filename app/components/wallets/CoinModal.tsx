"use client";

interface WalletType {
  _id: string;
  walletName: string;
  walletId: string;
  totalCoin: number;
}

interface Props {
  open: boolean;
  wallet: WalletType | null;
  action: "give" | "take" | null;
  coinAmount: string;
  setCoinAmount: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CoinModal({
  open,
  wallet,
  action,
  coinAmount,
  setCoinAmount,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !wallet) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">

        <h2 className="text-2xl font-bold mb-2">

          {action === "give"
            ? "Give Coins"
            : "Take Coins"}

        </h2>

        <p className="text-gray-500">

          Wallet :

          <span className="font-semibold ml-2">
            {wallet.walletName}
          </span>

        </p>

        <p className="text-gray-500 mt-2">

          Current Balance :

          <span className="font-semibold ml-2">
            {wallet.totalCoin}
          </span>

        </p>

        <input
          type="number"
          placeholder="Enter Coins"
          value={coinAmount}
          onChange={(e) =>
            setCoinAmount(e.target.value)
          }
          className="w-full border rounded-xl mt-6 p-3 outline-none"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className={`px-5 py-2 rounded-lg text-white ${
              action === "give"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {action === "give"
              ? "Give Coins"
              : "Take Coins"}
          </button>

        </div>

      </div>

    </div>
  );
}