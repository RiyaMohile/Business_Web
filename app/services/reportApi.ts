import api from "./api";

export interface StoreOnboardingReportParams {
  from: string;
  to: string;
}

export const getStoreOnboardingReport = async ({
  from,
  to,
}: StoreOnboardingReportParams) => {
  const response = await api.get(
    "/admin/reports/store-onboarding",
    {
      params: {
        from,
        to,
      },
    }
  );

  return response.data;
};