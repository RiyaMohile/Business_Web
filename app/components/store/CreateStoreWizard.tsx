"use client";

import { useState } from "react";

import EmailStep from "./steps/EmailStep";
import AddressStep from "./steps/AddressStep";
import StoreDetailsStep from "./steps/StoreDetailsStep";
import DocumentsStep from "./steps/DocumentsStep";

import { StoreForm } from "./types";

interface CreateStoreWizardProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateStoreWizard({
  onClose,
  onCreated,
}: CreateStoreWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<StoreForm>({
    email: "",
    emailId: "",
    mailContactId: "",

    storeName: "",
    category: "",
    gstNumber: "",

    address: {
      addressId: "",
      area: "",
      city: "",
    },

    workingDays: {
      from: "",
      to: "",
    },

    openingHours: {
      from: "",
      to: "",
    },

    document1: null,
    document2: null,
  });

  const updateForm = (data: Partial<StoreForm>) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };
  

  // =====================================================
  // CREATE STORE WIZARD
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-3
        sm:p-6 z-[9999]
      "
    >
      <div
        className="
          flex
          max-h-[95dvh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-3xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            p-5
            sm:p-8
          "
        >
          <div>
            <h2 className="text-xl font-bold sm:text-3xl">
              Create Your Store
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
              Complete the following steps to create your store.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              ml-3
              text-2xl
              leading-none
              text-gray-500
              hover:text-gray-900
            "
          >
            ×
          </button>
        </div>

        {/* STEP INDICATOR */}

        <div className="shrink-0 px-5 pb-5 sm:px-8 sm:pb-6">
          <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-start">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="contents"
              >
                <div className="flex w-9 flex-col items-center sm:w-10">
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-sm
                      font-semibold
                      sm:h-10
                      sm:w-10
                      ${
                        step >= item
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {item}
                  </div>

                  <span className="mt-2 text-center text-[9px] leading-3 text-gray-500 sm:text-xs sm:leading-4">
                    {item === 1 && "Email"}
                    {item === 2 && "Address"}
                    {item === 3 && "Store Details"}
                    {item === 4 && "Documents"}
                  </span>
                </div>

                {item < 4 && (
                  <div
                    className={`
                      mx-2
                      mt-[17px]
                      h-[2px]
                      rounded-full
                      sm:mt-[18px]
                      ${
                        step > item
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>
            ))}

          </div>
        </div>

        {/* CONTENT */}

        <div className="min-h-0 overflow-y-auto p-5 sm:p-8">
          {step === 1 && (
            <EmailStep
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
            />
          )}

          {step === 2 && (
            <AddressStep
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {step === 3 && (
            <StoreDetailsStep
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {step === 4 && (
            <DocumentsStep
  form={form}
  updateForm={updateForm}
  onBack={previousStep}
  loading={loading}
  setLoading={setLoading}
  onComplete={() => {
    console.log("STORE CREATED SUCCESSFULLY");

    onCreated();
  }}
/>
          )}
        </div>
      </div>
    </div>
  );
}