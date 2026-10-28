import api from "./api";

export interface Category {
  _id: string;
  category: string;
  subCategory: string;
  examples?: string[];
  media?: {
    mediaUrl?: string;
    mediaPath?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/*
|--------------------------------------------------------------------------
| GET ALL CATEGORIES
|--------------------------------------------------------------------------
*/

export const getAllCategories = async () => {
  const { data } = await api.get(
    "https://api.thover.in/v1/api/category/all"
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| ADD CATEGORY
|--------------------------------------------------------------------------
*/

export const addCategory = async (payload: {
  category: string;
  subCategory: string;
  examples?: string[];
}) => {
  const { data } = await api.post(
    "https://api.thover.in/v1/api/category/add",
    payload
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| DELETE CATEGORY
|--------------------------------------------------------------------------
*/

export const deleteCategory = async (
  category: string,
  subCategory: string
) => {
  const { data } = await api.delete(
    "https://api.thover.in/v1/api/category/delete",
    {
      data: {
        category,
        subCategory,
      },
    }
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| UPDATE CATEGORY MEDIA
|--------------------------------------------------------------------------
*/

export const updateCategoryMedia = async (
  category: string,
  subCategory: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("category", category);
  formData.append("subCategory", subCategory);
  formData.append("media", file);

  const { data } = await api.put(
    "https://api.thover.in/v1/api/category/update-media",
    formData
  );

  return data;
};