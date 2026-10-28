"use client";

import WalletRow from "./WalletRow";

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
  wallets: WalletType[];
  loading: boolean;

  onGive: (wallet: WalletType) => void;
  onTake: (wallet: WalletType) => void;
}

export default function WalletTable({
  wallets,
  loading,
  onGive,
  onTake,
}: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl bg-white shadow">

      {/* Table scroll area */}
      <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">

        <table className="min-w-[800px] w-full">

          <thead className="sticky top-0 z-10 bg-blue-50">

            <tr>

              <th className="p-4 text-left">
                Wallet
              </th>

              <th className="p-4 text-left">
                User
              </th>

              <th className="p-4 text-left">
                Coins
              </th>

              <th className="p-4 text-left">
                Professional
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center"
                >
                  Loading...
                </td>

              </tr>

            ) : wallets.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center"
                >
                  No Wallet Found
                </td>

              </tr>

            ) : (

              wallets.map((wallet) => (

                <WalletRow
                  key={wallet._id}
                  wallet={wallet}
                  onGive={onGive}
                  onTake={onTake}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}