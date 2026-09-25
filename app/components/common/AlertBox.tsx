"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

interface AlertBoxProps {
  open: boolean;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

export default function AlertBox({
  open,
  title,
  message,
  type = "info",
  onClose,
}: AlertBoxProps) {
  if (!open) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      iconClass: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },

    error: {
      icon: AlertCircle,
      iconClass: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },

    warning: {
      icon: TriangleAlert,
      iconClass: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },

    info: {
      icon: Info,
      iconClass: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-x-4 top-5 z-[9999] flex justify-center sm:left-auto sm:right-5 sm:inset-x-auto">
      <div
        className={`
          w-full max-w-sm
          rounded-2xl
          border
          ${current.border}
          ${current.bg}
          p-4
          shadow-xl
        `}
      >
        <div className="flex items-start gap-3">

          <Icon
            className={`mt-0.5 h-5 w-5 shrink-0 ${current.iconClass}`}
          />

          <div className="min-w-0 flex-1">

            {title && (
              <p className="text-sm font-semibold text-slate-900">
                {title}
              </p>
            )}

            <p className="mt-1 text-sm leading-5 text-slate-600">
              {message}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/60 hover:text-slate-700"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>

        </div>
      </div>
    </div>
  );
}