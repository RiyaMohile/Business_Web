"use client";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getMyCart,
  updateCartPost,
  removePostFromCart,
} from "../services/cartApi";

interface CartPost {
  postId: any;
  size: string;
  quantity: number;
  addedAt?: string;
}

interface Cart {
  _id: string;
  cartId: string;
  subtotal: number;
  posts: CartPost[];
  storeId?: any;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] =
    useState<Cart | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  // ==========================================
  // FETCH CART
  // ==========================================

  const fetchCart = async () => {
  try {
    setLoading(true);

    const response = await getMyCart();

    console.log("FULL CART RESPONSE:", response);
    console.log("CART:", response?.cart);
    console.log("CART POSTS:", response?.cart?.posts);
    console.log(
      "CART POSTS LENGTH:",
      response?.cart?.posts?.length
    );

    if (response?.success && response?.cart) {
      setCart({
        ...response.cart,
        posts: Array.isArray(response.cart.posts)
          ? response.cart.posts
          : [],
      });
    } else {
      setCart(null);
    }
  } catch (error: any) {
    console.error("FETCH CART ERROR:", error);

    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      router.push("/login");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const handleQuantityChange = async (
    item: CartPost,
    newQuantity: number
  ) => {
    if (!cart || newQuantity < 1) return;

    const postId =
      item.postId?._id ||
      item.postId;

    try {
      setActionLoading(postId);

      const response =
        await updateCartPost({
          cartId: cart._id,
          postId,
          quantity: newQuantity,
          size: item.size,
        });

      if (response?.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const handleRemove = async (
    postId: string
  ) => {
    if (!cart) return;

    try {
      setActionLoading(postId);

      const response =
        await removePostFromCart({
          cartId: cart._id,
          postId,
        });

      if (response?.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error(
        "REMOVE CART ERROR:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9FF] pt-[130px]">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-[#6D28D9]"
          />
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cart || cart.posts.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF9FF] px-5 pb-10 pt-[140px] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F2ECFF]">
            <ShoppingBag
              size={42}
              className="text-[#6D28D9]"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#101828] sm:text-3xl">
            Your cart is empty
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#7182A6]">
            Add products from your favourite local
            stores and they will appear here.
          </p>

          <button
            onClick={() =>
              router.push("/products")
            }
            className="
              mt-7
              rounded-xl
              bg-[#6D28D9]
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(109,40,217,0.2)]
              transition
              hover:bg-[#5B21B6]
            "
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // CART
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-5 pb-12 pt-[140px] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              transition
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#101828] sm:text-3xl">
              My Cart
            </h1>

            <p className="mt-1 text-sm text-[#7182A6]">
              {cart.posts.length}{" "}
              {cart.posts.length === 1
                ? "product"
                : "products"}{" "}
              in your cart
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* PRODUCTS */}

          <div className="space-y-4">

            {cart.posts.map((item, index) => {
              const post =
                typeof item.postId ===
                "object"
                  ? item.postId
                  : null;

              const postId =
                post?._id ||
                item.postId;

              const image =
                post?.media?.[0]?.mediaUrl ||
                post?.image ||
                post?.imageUrl ||
                null;

              const title =
                post?.topic ||
                post?.title ||
                "Product";

              const price = Number(
                post?.price?.amount || 0
              );

              const itemTotal =
                price * item.quantity;

              const isLoading =
                actionLoading === postId;

              return (
                <div
                  key={`${postId}-${item.size}-${index}`}
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-5
                  "
                >
                  <div className="flex gap-4">

                    {/* IMAGE */}

                    <div
                      className="
                        flex
                        h-28
                        w-28
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        bg-[#F5F3FA]
                        sm:h-32
                        sm:w-32
                      "
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag
                          size={32}
                          className="text-[#98A2B3]"
                        />
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex justify-between gap-3">

                        <div>
                          <h2 className="truncate text-base font-semibold text-[#101828] sm:text-lg">
                            {title}
                          </h2>

                          <p className="mt-1 text-xs text-[#7182A6]">
                            Size:{" "}
                            <span className="font-medium text-[#101828]">
                              {item.size}
                            </span>
                          </p>
                        </div>

                        <button
                          disabled={isLoading}
                          onClick={() =>
                            handleRemove(
                              postId
                            )
                          }
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                          "
                        >
                          {isLoading ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>

                      </div>

                      <div className="mt-6 flex items-center justify-between">

                        {/* QUANTITY */}

                        <div className="flex items-center rounded-xl border border-slate-200 bg-white">

                          <button
                            disabled={
                              isLoading ||
                              item.quantity <= 1
                            }
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity - 1
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              text-slate-600
                              disabled:opacity-40
                            "
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-8 text-center text-sm font-semibold text-[#101828]">
                            {item.quantity}
                          </span>

                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity + 1
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              text-slate-600
                            "
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        {/* PRICE */}

                        <div className="text-right">
                          <p className="text-lg font-bold text-[#101828]">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="text-xs text-[#7182A6]">
                            ₹{price} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}

          <div className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="text-lg font-bold text-[#101828]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-[#7182A6]">
                  Subtotal
                </span>

                <span className="font-semibold text-[#101828]">
                  ₹
                  {Number(
                    cart.subtotal || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#7182A6]">
                  Delivery
                </span>

                <span className="font-semibold text-[#101828]">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#101828]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#6D28D9]">
                    ₹
                    {Number(
                      cart.subtotal || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

            </div>

            <button
              onClick={() =>
                router.push("/checkout")
              }
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#6D28D9]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_20px_rgba(109,40,217,0.2)]
                transition
                hover:bg-[#5B21B6]
              "
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() =>
                router.push("/products")
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-3.5
                text-sm
                font-semibold
                text-[#475467]
                transition
                hover:bg-slate-50
              "
            >
              Continue Shopping
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}