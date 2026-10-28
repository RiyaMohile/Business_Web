"use client";

interface Props {
  withdrawal: any;
}

export default function WithdrawalDetailsCard({
  withdrawal,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <div className="grid grid-cols-2 gap-10">

        {/* User */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            User Information
          </h2>

          <div className="space-y-3">

            <p>
              <b>Name :</b> {withdrawal.userId?.name}
            </p>

            <p>
              <b>Username :</b> @{withdrawal.userId?.username}
            </p>

            <p>
              <b>Email :</b> {withdrawal.userId?.email}
            </p>

            <p>
              <b>Phone :</b> {withdrawal.userId?.phoneNumber}
            </p>

          </div>

        </div>

        {/* Bank */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Bank Details
          </h2>

          <div className="space-y-3">

            <p>
              <b>Holder :</b>{" "}
              {withdrawal.bankAccountId?.accountHolderName}
            </p>

            <p>
              <b>Bank :</b>{" "}
              {withdrawal.bankAccountId?.bankName}
            </p>

            <p>
              <b>Account :</b>{" "}
              {withdrawal.bankAccountId?.accountNumber}
            </p>

            <p>
              <b>IFSC :</b>{" "}
              {withdrawal.bankAccountId?.ifscCode}
            </p>

          </div>

        </div>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-semibold mb-5">
          Withdrawal Details
        </h2>

        <div className="space-y-3">

          <p>
            <b>Transaction ID :</b>{" "}
            {withdrawal.transactionId}
          </p>

          <p>
            <b>Coins :</b> {withdrawal.totalCoins}
          </p>

          <p>
            <b>Amount :</b> ₹{withdrawal.amount}
          </p>

          <p>
            <b>Status :</b>{" "}
            <span className="font-semibold">
              {withdrawal.status}
            </span>
          </p>

          <p>
            <b>Requested :</b>{" "}
            {new Date(
              withdrawal.createdAt
            ).toLocaleString()}
          </p>

          {withdrawal.completedAt && (
            <p>
              <b>Completed :</b>{" "}
              {new Date(
                withdrawal.completedAt
              ).toLocaleString()}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}