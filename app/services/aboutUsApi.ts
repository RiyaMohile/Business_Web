import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api";

export interface PrivacySection {
  _id: string;
  point: number;
  title: string;
  description: string;
  content: string[];
}

export interface AboutUsPage {
  _id: string;
  name: string;
  heading: string;
  description: string;
  version: string;

  sections: PrivacySection[];

  footerText: {
    text: string;
    email: string;
    phone: string;
  };

  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export const getPageByName = async (
  name: string
): Promise<AboutUsPage> => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/about/page/${name}`
    );

    if (!data?.success || !data?.data) {
      throw new Error(
        data?.message || "Page not found"
      );
    }

    return data.data;
  } catch (error: any) {
    console.error(
      "GET PAGE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};