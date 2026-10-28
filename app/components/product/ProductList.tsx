"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Plus, Search } from "lucide-react";

interface Post {
  _id: string;
  topic: string;
  description?: string;

  media?: {
    mediaUrl?: string;
  }[];

  price?: {
    currency?: string;
    amount?: number;
  };

  category?: string;
  status?: string;
}

interface Props {
  userId: string;
}

export default function ProductList({
  userId,
}: Props) {

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      setLoadingPosts(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setPosts([]);
        return;
      }

      const response = await axios.get(
        `https://api.thover.in/v1/api/post/user/${userId}/posts`,
        {
          params: {
            page: 1,
            limit: 50,
            status: "public",
            sortBy: "createdAt",
            sortOrder: "desc",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PRODUCT API RESPONSE:",
        response.data
      );

      console.log(
        "PRODUCTS:",
        response.data?.data?.posts
      );

      if (response.data?.success) {

        const productList =
          response.data?.data?.posts || [];

        setPosts(productList);

      } else {

        setPosts([]);

      }

    } catch (error: any) {

      console.error(
        "FETCH PRODUCTS ERROR:",
        error.response?.data || error.message
      );

      setPosts([]);

    } finally {

      setLoadingPosts(false);

    }
  };

  const filteredPosts = posts.filter((post) =>
    post.topic
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mt-6">

      {/* SEARCH */}

      <div className="relative">

        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        />

        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-white
            py-4
            pl-12
            pr-4
            outline-none
            focus:border-blue-500
          "
        />

      </div>

      {/* FILTER */}

      <div className="flex gap-2 mt-4">

        <button
          type="button"
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2
            text-sm
            font-semibold
            text-white
          "
        >
          All
        </button>

        <button
          type="button"
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-5
            py-2
            text-sm
          "
        >
          Active
        </button>

        <button
          type="button"
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-5
            py-2
            text-sm
          "
        >
          Archived
        </button>

      </div>

      {/* LOADING */}

      {loadingPosts ? (

        <div className="
          mt-5
          rounded-2xl
          bg-white
          p-10
          text-center
        ">
          Loading products...
        </div>

      ) : filteredPosts.length === 0 ? (

        <div className="
          mt-5
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-10
          text-center
        ">

          <Package
            size={40}
            className="mx-auto text-gray-400"
          />

          <p className="mt-3 text-gray-500">
            No products found.
          </p>

        </div>

      ) : (

        <div className="
          mt-5
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">

          {filteredPosts.map((post) => (

            <div
              key={post._id}
              className="
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-sm
              "
            >

              {/* IMAGE */}

              {post.media?.[0]?.mediaUrl ? (

                <img
                  src={post.media[0].mediaUrl}
                  alt={post.topic}
                  className="
                    h-48
                    w-full
                    object-cover
                  "
                />

              ) : (

                <div className="
                  flex
                  h-48
                  items-center
                  justify-center
                  bg-gray-100
                ">

                  <Package
                    size={40}
                    className="text-gray-400"
                  />

                </div>

              )}

              {/* CONTENT */}

              <div className="p-5">

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-3
                ">

                  <h3 className="
                    text-lg
                    font-semibold
                  ">
                    {post.topic}
                  </h3>

                  <span className="
                    rounded-full
                    bg-green-100
                    px-2
                    py-1
                    text-xs
                    text-green-700
                  ">
                    {post.status}
                  </span>

                </div>

                <p className="
                  mt-2
                  text-sm
                  text-gray-500
                ">
                  {post.description}
                </p>

                {post.price && (

                  <p className="
                    mt-4
                    text-xl
                    font-bold
                  ">
                    {post.price.currency}{" "}
                    {post.price.amount}
                  </p>

                )}

                <p className="
                  mt-2
                  text-sm
                  text-gray-500
                ">
                  Category: {post.category}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ADD PRODUCT */}

      <button
        type="button"
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-blue-600
          py-4
          font-semibold
          text-white
        "
      >

        <Plus size={21} />

        Add Product

      </button>

    </div>
  );
}