"use client";

import { Plus, Store } from "lucide-react";

interface EmptyStoreProps {
  onCreateStore: () => void;
}

export default function EmptyStore({
  onCreateStore,
}: EmptyStoreProps) {
  return (
    <section
      className="
        flex
        min-h-[calc(100dvh-72px)]
        w-full
        items-center
        justify-center
        bg-white
        px-5
        py-8

        sm:bg-slate-50
        sm:px-6
        sm:py-10
      "
    >
      <div
        className="
          flex
          w-full
          max-w-[390px]
          flex-col
          items-center
          justify-center
          text-center

          sm:rounded-3xl
          sm:bg-white
          sm:px-8
          sm:py-12
          sm:shadow-sm
        "
      >

        {/* Store Icon */}
        <div
          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-blue-50
          "
        >
          <Store
            size={48}
            strokeWidth={1.8}
            className="text-blue-600"
          />
        </div>

        {/* Heading */}
        <h1
          className="
            mt-7
            text-[20px]
            font-bold
            leading-7
            text-slate-900
          "
        >
          You don't have any store yet!
        </h1>

        {/* Description */}
        <p
          className="
            mt-3
            max-w-[280px]
            text-sm
            leading-6
            text-slate-500
          "
        >
          Create your store and start
          <br />
          selling to your customers.
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={onCreateStore}
          className="
            mt-9
            flex
            h-12
            w-full
            max-w-[300px]
            items-center
            justify-center
            gap-2
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
          <Plus
            size={19}
            strokeWidth={2.5}
          />

          Create Store
        </button>
      </div>
    </section>
  );
}