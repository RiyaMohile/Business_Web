"use client";

import { useEffect } from "react";
import { registerDevice } from "../services/deviceApi";

export default function DeviceInitializer() {
  useEffect(() => {
    const initializeDevice = async () => {
      try {
        // Check if device ID already exists
        const existingDeviceId =
          localStorage.getItem("deviceId");

        if (existingDeviceId) {
          console.log(
            "DEVICE ID ALREADY EXISTS:",
            existingDeviceId
          );
          return;
        }

        // Generate device ID from backend
        const deviceResponse =
          await registerDevice();

        console.log(
          "DEVICE REGISTRATION RESPONSE:",
          deviceResponse
        );

        if (
          !deviceResponse?.status ||
          !deviceResponse?.device?.deviceId
        ) {
          console.error(
            "Unable to register device."
          );
          return;
        }

        const deviceId =
          deviceResponse.device.deviceId;

        // Save device ID
        localStorage.setItem(
          "deviceId",
          deviceId
        );

        console.log(
          "DEVICE ID GENERATED:",
          deviceId
        );
      } catch (error: any) {
        console.error(
          "DEVICE INITIALIZATION ERROR:",
          error?.response?.data ||
            error?.message ||
            error
        );
      }
    };

    initializeDevice();
  }, []);

  return null;
}