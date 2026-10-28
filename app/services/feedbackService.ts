import api from "./api";

export interface FeedbackUser {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
}

export interface Feedback {
  _id: string;
  user_id: FeedbackUser | null;
  text: string;
  timestamp: string;
  createdAt?: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbacks: Feedback[];
}

export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const response = await api.get<FeedbackResponse>(
    "/feedbackuser/all-feedback"
  );

  return response.data.feedbacks;
};