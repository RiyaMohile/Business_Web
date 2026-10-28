"use client";

import { Wallet, Coins, User } from "lucide-react";

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

interface Props {
  wallet: WalletType;
  onGive: (wallet: WalletType) => void;
  onTake: (wallet: WalletType) => void;
}

export default function WalletRow({
  wallet,
  onGive,
  onTake,
}: Props) {
  return (
    <tr className="hover:bg-gray-50">

      <td className="p-4">

        <div className="flex items-center gap-3">

          <Wallet className="text-blue-700" />

          <div>

            <p className="font-medium">
              {wallet.walletName}
            </p>

            <p className="text-sm text-gray-500">
              {wallet.walletId}
            </p>

          </div>

        </div>

      </td>

      <td className="p-4">

        <div className="flex items-center gap-2">

          <User size={18} />

          {wallet.userId?.username}

        </div>

      </td>

      <td className="p-4">

        <div className="flex items-center gap-2">

          <Coins
            size={18}
            className="text-yellow-500"
          />

          {wallet.totalCoin}

        </div>

      </td>

      <td className="p-4">

        {wallet.professionalWallet ? (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            Yes

          </span>

        ) : (

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

            No

          </span>

        )}

      </td>

      <td className="p-4 text-center">

        <button
          onClick={() => onGive(wallet)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2"
        >
          Give Coins
        </button>

        <button
          onClick={() => onTake(wallet)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Take Coins
        </button>

      </td>

    </tr>
  );
}