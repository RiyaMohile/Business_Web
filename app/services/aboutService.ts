import api from "./api";

export interface AboutSection {
  _id?: string;
  point: number;
  title: string;
  description: string;
  content: string[];
}

export interface AboutFooter {
  text: string;
  email: string;
  phone: string;
}

export interface AboutPage {
  _id: string;
  name: string;
  heading: string;
  description: string;
  version: string;
  sections: AboutSection[];
  footerText: AboutFooter;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutPagePayload {
  name: string;
  heading: string;
  description: string;
  version: string;
  sections: {
    point: number;
    title: string;
    description: string;
    content: string[];
  }[];
  footerText: {
    text: string;
    email: string;
    phone: string;
  };
  lastUpdated?: string;
}

const BASE_URL = "https://api.thover.in/v1/api/about";

/* =========================
   GET ALL
========================= */

export const getAllAboutPages = async () => {
  const { data } = await api.get(BASE_URL);

  return data;
};

/* =========================
   GET SINGLE
========================= */

export const getAboutPageById = async (
  id: string
) => {
  const { data } = await api.get(
    `${BASE_URL}/${id}`
  );

  return data;
};

/* =========================
   CREATE
========================= */

export const createAboutPage = async (
  payload: AboutPagePayload
) => {
  const { data } = await api.post(
    `${BASE_URL}/add`,
    payload
  );

  return data;
};

/* =========================
   UPDATE
========================= */

export const updateAboutPage = async (
  id: string,
  payload: AboutPagePayload
) => {
  const { data } = await api.put(
    `${BASE_URL}/update/${id}`,
    payload
  );

  return data;
};

/* =========================
   DELETE
========================= */

export const deleteAboutPage = async (
  id: string
) => {
  const { data } = await api.delete(
    `${BASE_URL}/delete/${id}`
  );

  return data;
};