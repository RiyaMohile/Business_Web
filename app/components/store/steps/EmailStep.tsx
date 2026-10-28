"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, CheckCircle2 } from "lucide-react";

import { StoreForm } from "../types";

interface ExistingEmail {
  _id: string;
  email: string;
  name?: string;
  isPrimary?: boolean;
  isVerified?: boolean;
  isAccountCreated?: boolean;
  designation?: string;
}

interface Props {
  form: StoreForm;
  updateForm: (data: Partial<StoreForm>) => void;
  onNext: () => void;
}

export default function EmailStep({
  form,
  updateForm,
  onNext,
}: Props) {
  const [existingEmails, setExistingEmails] = useState<ExistingEmail[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // FETCH EXISTING EMAILS
  // ==========================================

  useEffect(() => {
    fetchExistingEmails();
  }, []);

  const fetchExistingEmails = async () => {
    try {
      setLoadingEmails(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingEmails(false);
        return;
      }

      const userData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const userId = userData?._id;

      if (!userId) {
        console.log("USER ID NOT FOUND");
        setLoadingEmails(false);
        return;
      }

      const { data } = await axios.get(
        `https://api.thover.in/v1/api/email/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("EXISTING EMAILS:", data);

      if (data?.success) {
        const emails = data?.data || [];

        // Only verified emails
        const verifiedEmails = emails.filter(
          (email: ExistingEmail) =>
            email.isVerified === true
        );

        setExistingEmails(verifiedEmails);
        if (verifiedEmails.length === 0) {
  setShowNewEmail(true);
}
      }
    } catch (error: any) {
      console.error(
        "GET EXISTING EMAILS ERROR:",
        error?.response?.data || error?.message
      );
    } finally {
      setLoadingEmails(false);
    }
  };

  // ==========================================
  // SELECT EXISTING EMAIL
  // ==========================================

  const selectExistingEmail = (
  email: ExistingEmail
) => {
  updateForm({
    email: email.email,
    emailId: email._id,
    mailContactId: email._id,
  });

  setShowNewEmail(false);
  setOtp("");
  setOtpSent(false);
};

  // ==========================================
  // CONTINUE WITH EXISTING EMAIL
  // ==========================================

  const continueWithExistingEmail = () => {
    if (!form.emailId) {
      alert("Please select an email.");
      return;
    }

    onNext();
  };

  // ==========================================
  // SEND OTP
  // ==========================================

  const sendOTP = async () => {
    if (!form.email.trim()) {
      alert("Enter email address");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "https://api.thover.in/v1/api/email/request-otp",
        {
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOtpSent(true);

      alert("OTP sent successfully");
    } catch (error: any) {
      console.error(
        "SEND EMAIL OTP ERROR:",
        error?.response?.data || error?.message
      );

      alert(
        error?.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY EMAIL
  // ==========================================

  const verifyEmail = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data: response } = await axios.post(
        "https://api.thover.in/v1/api/email",
        {
          email: form.email,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "EMAIL RESPONSE:",
        response
      );

      const emailId =
        response?.data?._id;

      if (!emailId) {
        alert(
          "Email created but email ID was not returned."
        );
        return;
      }

      updateForm({
        emailId,
        mailContactId: emailId,
      });

      alert(
        "Email verified successfully"
      );

      onNext();
    } catch (error: any) {
      console.error(
        "VERIFY EMAIL ERROR:",
        error?.response?.data ||
          error?.message
      );

      alert(
        error?.response?.data?.message ||
          "Email verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-[520px]">

      {/* TITLE */}

      <div>
        <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Business Email
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select your existing business email or add a new one.
        </p>
      </div>

      {/* ======================================
          EXISTING EMAILS
      ======================================= */}

     {/* EXISTING EMAILS */}
{!loadingEmails && existingEmails.length > 0 && (
  <div className="mt-7">

    <p className="mb-3 text-sm font-semibold text-slate-900">
      Your Existing Emails
    </p>

    <div className="space-y-3">
      {existingEmails.map((email) => {
        const selected = form.emailId === email._id;

        return (
          <button
            key={email._id}
            type="button"
            onClick={() => selectExistingEmail(email)}
            className={`
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              border
              px-4
              py-4
              text-left
              transition
              ${
                selected
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Mail size={18} className="text-slate-500" />
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {email.email}
              </p>
            </div>

            {selected && (
              <CheckCircle2
                size={22}
                className="text-blue-600"
              />
            )}
          </button>
        );
      })}
    </div>

    <button
      type="button"
      onClick={continueWithExistingEmail}
      disabled={!form.emailId}
      className="
        mt-5
        flex
        h-12
        w-full
        items-center
        justify-center
        rounded-xl
        bg-blue-600
        text-sm
        font-semibold
        text-white
        disabled:cursor-not-allowed
        disabled:bg-slate-300
        disabled:text-slate-500
      "
    >
      Continue
    </button>

    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />

      <span className="text-xs text-slate-400">
        OR
      </span>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
<button
  type="button"
  onClick={() => {
    setShowNewEmail(true);

    updateForm({
      email: "",
      emailId: "",
      mailContactId: "",
    });

    setOtp("");
    setOtpSent(false);
  }}
  className="
    mt-5
    flex
    w-full
    items-center
    justify-center
    rounded-xl
    border-2
    border-dashed
    border-blue-300
    bg-blue-50/50
    px-4
    py-4
    text-sm
    font-semibold
    text-blue-600
    transition
    hover:border-blue-500
    hover:bg-blue-50
  "
>
  + Add New Email
</button>

  </div>
)}

      {/* ======================================
          NEW EMAIL
      ======================================= */}

      {showNewEmail && (
  <>
    {/* NEW EMAIL FIELD */}

    <div className="mt-7">

      <label
        htmlFor="business-email"
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-slate-900
        "
      >
        Business Email
      </label>

      <input
        id="business-email"
        type="email"
        value={form.email}
        disabled={otpSent || loading}
        onChange={(e) =>
          updateForm({
            email: e.target.value,
            emailId: "",
            mailContactId: "",
          })
        }
        placeholder="Enter your business email"
        className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          text-sm
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
          sm:h-[52px]
        "
      />

    </div>

    {/* SEND OTP */}

    {!otpSent && (
      <button
        type="button"
        onClick={sendOTP}
        disabled={
          loading ||
          !form.email.trim()
        }
        className="
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-sm
          font-semibold
          text-white
          disabled:cursor-not-allowed
          disabled:bg-slate-300
          disabled:text-slate-500
          sm:h-[52px]
        "
      >
        {loading
          ? "Sending OTP..."
          : "Send OTP"}
      </button>
    )}

    {/* OTP */}

    {otpSent && (
      <>
        <div className="mt-6">

          <label
            htmlFor="email-otp"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-900
            "
          >
            Enter OTP
          </label>

          <input
            id="email-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="Enter OTP"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              text-center
              text-base
              font-semibold
              tracking-[8px]
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              sm:h-[52px]
            "
          />

        </div>

        <button
          type="button"
          onClick={verifyEmail}
          disabled={
            loading ||
            otp.length === 0
          }
          className="
            mt-6
            flex
            h-12
            w-full
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-sm
            font-semibold
            text-white
            disabled:cursor-not-allowed
            disabled:bg-slate-300
            disabled:text-slate-500
            sm:h-[52px]
          "
        >
          {loading
            ? "Verifying..."
            : "Verify Email & Continue"}
        </button>
      </>
    )}

  </>
)}

     

    </div>
  );
}