"use client";

import {
  X,
  Headphones,
  MessageCircle,
  Mail,
  ChevronRight,
  Info,
} from "lucide-react";

interface HelpSupportProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpSupport({
  open,
  onClose,
}: HelpSupportProps) {
  if (!open) return null;

  const handleChat = () => {
  const message = encodeURIComponent(
    "Hello Thover Support Team,\n\nI need help with my Thover Business account."
  );

  window.open(
    `https://wa.me/919031574500?text=${message}`,
    "_blank",
    "noopener,noreferrer"
  );
};


  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between p-5">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              "
            >
              <Headphones
                size={22}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Help & Support
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-slate-700
              hover:bg-slate-100
            "
          >
            <X size={20} />
          </button>

        </div>


        {/* ================= CONTENT ================= */}

        <div className="px-5 pb-5">

          <p className="text-sm font-semibold text-slate-900">
            We're here to help!
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Choose a way to get in touch with us.
          </p>


          {/* ================= CHAT ================= */}

          <button
            type="button"
            onClick={handleChat}
            className="
              mt-6
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              p-4
              text-left
              transition
              hover:bg-slate-50
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-50
              "
            >
              <MessageCircle
                size={23}
                className="text-green-600"
              />
            </div>


            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-slate-900">
                Chat with Us
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Chat with our support team
                <br />
                on WhatsApp
              </p>

            </div>

            <ChevronRight
              size={19}
              className="shrink-0 text-slate-700"
            />

          </button>


          {/* ================= MAIL ================= */}

          <div
            className="
              mt-4
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              p-4
              text-left
              transition
              hover:bg-slate-50
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-50
              "
            >
              <Mail
                size={23}
                className="text-blue-600"
              />
            </div>


            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-slate-900">
                Mail Us
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Drop us an email and we'll
                <br />
                get back to you
              </p>
             <p className="mt-1 text-sm font-semibold text-blue-600">
  team@thover.in
</p>

            </div>
          </div>


          {/* ================= INFO ================= */}

          <div className="mt-6 flex items-start gap-3 px-1">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              "
            >
              <Info
                size={18}
                className="text-indigo-600"
              />
            </div>

            <p className="pt-1 text-xs leading-5 text-slate-500">
              Our support team is available to assist you
              as soon as possible.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}