"use client";

import { Check, Sparkles } from "lucide-react";

interface Props {
  onDashboard: () => void;
}

export default function StoreCreationSuccess({
  onDashboard,
}: Props) {
  return (
    <div
      className="
        flex
        min-h-[100dvh]
        w-full
        items-center
        justify-center
        bg-white
        px-5
        py-6

        sm:min-h-0
        sm:bg-slate-50
        sm:p-6
      "
    >
      <div
        className="
          relative
          flex
          min-h-[100dvh]
          w-full
          max-w-[390px]
          flex-col
          overflow-hidden
          bg-white
          text-center

          sm:min-h-0
          sm:max-w-[390px]
          sm:rounded-3xl
          sm:border
          sm:border-slate-200
          sm:shadow-xl
        "
      >
        

        {/* =====================================
            CONTENT
        ====================================== */}

        <div
          className="
            flex
            flex-1
            flex-col
            items-center
            px-6
            pb-8
            pt-10
          "
        >
          

          {/* =================================
              SUCCESS ICON
          ================================= */}

          <div
            className="
              relative
              mt-10
              flex
              h-36
              w-36
              items-center
              justify-center
              rounded-full
              bg-emerald-50
            "
          >
            {/* Outer ring */}

            <div
              className="
                absolute
                inset-3
                rounded-full
                border-[10px]
                border-emerald-100
              "
            />

            {/* Green circle */}

            <div
              className="
                relative
                z-10
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-emerald-600
                shadow-lg
                shadow-emerald-200
              "
            >
              <Check
                size={54}
                strokeWidth={3}
                className="text-white"
              />
            </div>

            {/* Confetti */}

            <span
              className="
                absolute
                left-0
                top-6
                h-1.5
                w-1.5
                rotate-45
                rounded-sm
                bg-red-400
              "
            />

            <span
              className="
                absolute
                right-2
                top-5
                h-1.5
                w-1.5
                rounded-full
                bg-green-400
              "
            />

            <span
              className="
                absolute
                right-[-3px]
                top-20
                h-1.5
                w-1.5
                rounded-sm
                bg-orange-400
              "
            />

            <span
              className="
                absolute
                left-[-4px]
                bottom-16
                h-1.5
                w-1.5
                rounded-full
                bg-green-500
              "
            />

            <span
              className="
                absolute
                right-5
                bottom-4
                h-1.5
                w-1.5
                rounded-sm
                bg-blue-500
              "
            />

            <span
              className="
                absolute
                left-7
                bottom-[-1px]
                h-1.5
                w-1.5
                rotate-45
                rounded-sm
                bg-red-400
              "
            />
          </div>

          {/* =================================
              SUCCESS TITLE
          ================================= */}

          <h1
            className="
              mt-9
              max-w-[280px]
              text-2xl
              font-bold
              leading-8
              text-slate-900
            "
          >
            Store Created
            <br />
            Successfully!
          </h1>

          {/* =================================
              DESCRIPTION
          ================================= */}

          <p
            className="
              mt-4
              max-w-[270px]
              text-sm
              leading-6
              text-slate-500
            "
          >
            Your store has been created and
            <br />
            is ready to manage.
          </p>

          {/* =================================
              DASHBOARD BUTTON
          ================================= */}

          <button
            type="button"
            onClick={onDashboard}
            className="
              mt-auto
              h-12
              w-full
              max-w-[310px]
              rounded-xl
              bg-blue-600
              text-sm
              font-semibold
              text-white
              transition

              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}