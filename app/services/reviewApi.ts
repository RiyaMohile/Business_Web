// services/reviewApi.ts

import axios from "axios";

const BASE_URL = "https://api.thover.in/v1/api/vibe";

export interface ReviewUser {
  _id?: string;
  username?: string;
  name?: string;
  profileImage?: string;
}

export interface Review {
  _id: string;
  id?: string;
  rating: number;
  text: string;
  topic?: string;
  createdAt?: string;
  user?: ReviewUser | null;
  numberOfLikes?: number;
  numberOfComments?: number;
  media?: {
    mediaName?: string;
    mediaUrl?: string;
    mediaPath?: string;
    isDeleted?: boolean;
  }[];
}

export interface AddReviewPayload {
  postId: string;
  rating: number;
  text: string;
  topic: string;
}

export const addReview = async (
  payload: AddReviewPayload
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("LOGIN_REQUIRED");
    }

    const response = await axios.post(
      `${BASE_URL}/vibes`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "ADD REVIEW ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to add review."
    );
  }
};

export const getReviewsByPostId = async (
  postId: string
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}/vibes/${postId}`,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "GET REVIEWS ERROR:",
      error?.response?.data || error
    );

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to fetch reviews."
    );
  }
};