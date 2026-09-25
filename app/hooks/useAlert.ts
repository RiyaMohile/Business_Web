"use client";

import { useState } from "react";

type AlertType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface AlertState {
  open: boolean;
  title: string;
  message: string;
  type: AlertType;
}

export const useAlert = () => {
  const [alert, setAlert] =
    useState<AlertState>({
      open: false,
      title: "",
      message: "",
      type: "info",
    });

  const showAlert = (
    message: string,
    type: AlertType = "info",
    title?: string
  ) => {
    setAlert({
      open: true,
      message,
      type,
      title:
        title ||
        (type === "success"
          ? "Success"
          : type === "error"
          ? "Error"
          : type === "warning"
          ? "Warning"
          : "Information"),
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    alert,
    showAlert,
    closeAlert,
  };
};