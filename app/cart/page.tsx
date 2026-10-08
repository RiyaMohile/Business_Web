"use client";

import {
  ArrowLeft,
  ChevronDown,
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

  const [carts, setCarts] = useState<Cart[]>([]);
const [selectedStoreId, setSelectedStoreId] =
  useState<string | null>(null);

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

    const storedStoreIds = JSON.parse(
      localStorage.getItem("cartStoreIds") || "[]"
    );

    if (
      !Array.isArray(storedStoreIds) ||
      storedStoreIds.length === 0
    ) {
      console.log("NO CART STORE IDS FOUND");

      setCarts([]);
      setSelectedStoreId(null);

      return;
    }

    console.log(
      "CART STORE IDS:",
      storedStoreIds
    );

    const responses = await Promise.all(
      storedStoreIds.map(async (storeId: string) => {
        try {
          const response = await getMyCart(storeId);

          console.log(
            "CART RESPONSE:",
            storeId,
            response
          );

          return response?.cart || null;
        } catch (error) {
          console.error(
            "STORE CART ERROR:",
            storeId,
            error
          );

          return null;
        }
      })
    );

    // Only carts having products
    const validCarts = responses.filter(
      (cart): cart is Cart =>
        Boolean(
          cart &&
          Array.isArray(cart.posts) &&
          cart.posts.length > 0
        )
    );

    console.log(
      "ALL STORE CARTS:",
      validCarts
    );

    setCarts(validCarts);

    // Select first store initially
    if (validCarts.length > 0) {
      setSelectedStoreId(
        String(
          validCarts[0].storeId?._id ||
          validCarts[0].storeId
        )
      );
    } else {
      setSelectedStoreId(null);
    }

  } catch (error: any) {
    console.error(
      "FETCH CART ERROR:",
      error
    );

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
// SELECTED CART + TOTALS
// ==========================================

const selectedCart = carts.find(
  (cart) =>
    String(
      cart.storeId?._id ||
        cart.storeId
    ) === selectedStoreId
);

// Only selected store ke items
const totalItems = selectedCart
  ? selectedCart.posts.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    )
  : 0;

// Only selected store ka subtotal
const totalSubtotal = selectedCart
  ? Number(selectedCart.subtotal || 0)
  : 0;

// ==========================================
// UPDATE QUANTITY
// ==========================================

const handleQuantityChange = async (
  item: CartPost,
  newQuantity: number
) => {
  if (!selectedCart || newQuantity < 1) return;

  const postId =
    item.postId?._id ||
    item.postId;

  try {
    setActionLoading(postId);

    const response = await updateCartPost({
      cartId: selectedCart._id,
      postId,
      quantity: newQuantity,
      size: item.size,
    });

    if (response?.success) {
      setCarts((prev) =>
        prev.map((cart) => {
          if (cart._id !== selectedCart._id) {
            return cart;
          }

          return {
            ...cart,

            // Backend se updated subtotal lo
            subtotal: response.cart?.subtotal ?? cart.subtotal,

            // Existing populated post data ko preserve karo
            posts: cart.posts.map((cartItem) => {
              const currentPostId =
                cartItem.postId?._id ||
                cartItem.postId;

              if (String(currentPostId) !== String(postId)) {
                return cartItem;
              }

              return {
                ...cartItem,
                quantity: newQuantity,
              };
            }),
          };
        })
      );
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

  const handleRemove = async (postId: string) => {
  if (!selectedCart) return;

  try {
    setActionLoading(postId);

    const response = await removePostFromCart({
      cartId: selectedCart._id,
      postId,
    });

    if (response?.success) {
      setCarts((prev) => {
        return prev
          .map((cart) => {
            if (cart._id !== selectedCart._id) {
              return cart;
            }

            // Existing populated product data ko preserve karo
            const updatedPosts = cart.posts.filter((cartItem) => {
              const currentPostId =
                cartItem.postId?._id ||
                cartItem.postId;

              return (
                String(currentPostId) !== String(postId)
              );
            });

            return {
              ...cart,

              // Sirf selected product remove hoga
              posts: updatedPosts,

              // Backend se updated subtotal
              subtotal:
                response.cart?.subtotal ??
                cart.subtotal,
            };
          })
          // Agar selected store ka cart empty ho gaya
          // to store ko store list se hata do
          .filter((cart) => cart.posts.length > 0);
      });

      // Agar selected store empty ho gaya hai
      // to next available store select karo
      setCarts((currentCarts) => {
        if (currentCarts.length === 0) {
          setSelectedStoreId(null);
        } else {
          const currentStoreStillExists =
            currentCarts.some(
              (cart) =>
                String(
                  cart.storeId?._id ||
                    cart.storeId
                ) === selectedStoreId
            );

          if (!currentStoreStillExists) {
            setSelectedStoreId(
              String(
                currentCarts[0].storeId?._id ||
                  currentCarts[0].storeId
              )
            );
          }
        }

        return currentCarts;
      });
    }
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);
  } finally {
    setActionLoading(null);
  }
};

const handleBuyAll = () => {
  if (!selectedCart) {
    alert("Please select a store.");
    return;
  }

  if (!selectedCart.posts || selectedCart.posts.length === 0) {
    alert("No products available in this store cart.");
    return;
  }

  const storeId = String(
    selectedCart.storeId?._id ||
    selectedCart.storeId
  );

  const checkoutProducts = selectedCart.posts.map((item) => {
    const post =
      typeof item.postId === "object"
        ? item.postId
        : null;

    const postId =
      post?._id ||
      item.postId;

    return {
      postId: String(postId),

      topic:
        post?.topic ||
        post?.title ||
        "Product",

      image:
        post?.media?.[0]?.mediaUrl ||
        post?.image ||
        post?.imageUrl ||
        "",

      quantity: Number(item.quantity || 1),

      size: item.size || "",

      price: Number(
        post?.price?.amount || 0
      ),

      storeId,
    };
  });

  if (checkoutProducts.length === 0) {
    alert("No products available in cart.");
    return;
  }

  const checkoutData = {
    // IMPORTANT: selected store ka Mongo Cart _id
    cartId: selectedCart._id,

    // Sirf selected store ke products
    products: checkoutProducts,

    address: null,

    deliveryCharge: 150,

    storeId,
  };

  localStorage.setItem(
    "checkoutData",
    JSON.stringify(checkoutData)
  );

  console.log(
    "STORE CHECKOUT DATA:",
    checkoutData
  );

  router.push("/checkout");
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

  if (carts.length === 0) {
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
  <main
  className="
    min-h-screen
    bg-white
    px-3
    pb-[90px]
    pt-5
    sm:px-6
    sm:pb-8
    sm:pt-7
    lg:px-10
  "
>
    <div className="mx-auto max-w-[1100px]">

      {/* ================= HEADER ================= */}

<div className="mb-6 flex items-center gap-2 sm:mb-7 sm:gap-3">
  <button
    type="button"
    onClick={() => router.back()}
    className="
      flex h-8 w-8 shrink-0
      items-center justify-center
      text-[#32106A]
      transition hover:opacity-70
      sm:h-9 sm:w-9
    "
  >
    <ArrowLeft
      size={24}
      strokeWidth={2.5}
      className="sm:h-6 sm:w-6"
    />
  </button>

  <h1
    className="
      text-[28px]
      font-bold
      tracking-tight
      text-[#32106A]
      sm:text-[32px]
    "
  >
    Thover
  </h1>
</div>

      {/* ================= SELECT STORE ================= */}

<div className="mb-6 sm:mb-7">

  <div className="mb-3 flex items-center gap-2">
    <ShoppingBag
      size={22}
      strokeWidth={2}
      className="text-[#32106A] sm:h-6 sm:w-6"
    />

    <h2 className="text-[18px] font-bold text-[#32106A] sm:text-[20px]">
      Select Store
    </h2>
  </div>

  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
    {carts.map((cart) => {
      const storeId = String(
        cart.storeId?._id ||
          cart.storeId
      );

      const storeName =
        cart.storeId?.storeName ||
        "Store";

      const isSelected =
        selectedStoreId === storeId;

      return (
        <button
          key={storeId}
          type="button"
          onClick={() =>
            setSelectedStoreId(storeId)
          }
          className={`
  flex
  min-w-[168px]
  max-w-[190px]
  items-center
  justify-between
  gap-2
  rounded-lg
  px-3
  py-2.5
  transition
  sm:min-w-[180px]
  sm:px-4
  sm:py-3
  ${
    isSelected
      ? "bg-gradient-to-r from-[#7135E8] to-[#6D28D9] text-white shadow-sm"
      : "border border-[#DED7F5] bg-white text-[#32106A]"
  }
`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <ShoppingBag
              size={22}
              strokeWidth={2}
              className="shrink-0 sm:h-6 sm:w-6"
            />

            <span className="truncate text-[12px] font-semibold sm:text-[14px]">
  {storeName}
</span>
          </div>

          {isSelected && (
            <span className="shrink-0 text-lg sm:text-xl">
              →
            </span>
          )}
        </button>
      );
    })}
  </div>
</div>

      {/* ================= CART TITLE ================= */}

      <div className="mb-4 sm:mb-5">
  <h2 className="text-[20px] font-bold text-[#32106A] sm:text-[20px]">
    Your Cart{" "}
    <span className="text-[#32106A]">
      ({totalItems} Items)
    </span>
  </h2>
</div>
      {/* ================= PRODUCTS ================= */}

      <div className="space-y-2.5 sm:space-y-3">

       {selectedCart?.posts.map((item, index) => {
  const post =
    typeof item.postId === "object"
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
        relative
        flex
        gap-3
        rounded-xl
        border
        border-[#DDD7F5]
        bg-white
        p-2.5
        sm:gap-4
        sm:p-3
      "
    >
      {/* ================= IMAGE ================= */}

      <div
        className="
          flex
          h-[86px]
          w-[86px]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-lg
          bg-[#F4F2F8]
          sm:h-[100px]
          sm:w-[100px]
        "
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <ShoppingBag
            size={30}
            className="text-[#A69ABF]"
          />
        )}
      </div>

      {/* ================= PRODUCT INFO ================= */}

      <div
        className="
          min-w-0
          flex-1
          pr-6
          sm:pr-8
        "
      >
        {/* PRODUCT NAME */}

        <h3
          className="
            truncate
            text-[14px]
            font-bold
            text-[#32106A]
            sm:text-[16px]
          "
        >
          {title}
        </h3>

        {/* SIZE */}

        <p
          className="
            mt-0.5
            text-[11px]
            text-[#8B82A6]
            sm:mt-1
            sm:text-[12px]
          "
        >
          Size:{" "}
          <span className="text-[#71669A]">
            {item.size || "-"}
          </span>
        </p>

        {/* ================= BOTTOM ROW ================= */}

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-2
            sm:mt-3
          "
        >
          {/* QUANTITY */}

          <select
            value={item.quantity}
            disabled={isLoading}
            onChange={(e) =>
              handleQuantityChange(
                item,
                Number(e.target.value)
              )
            }
            className="
              h-8
              min-w-[78px]
              cursor-pointer
              rounded-md
              border
              border-[#CFC8E2]
              bg-white
              px-2
              text-[11px]
              font-medium
              text-[#32106A]
              outline-none
              sm:h-9
              sm:min-w-[88px]
              sm:text-[12px]
            "
          >
            {Array.from(
              { length: 10 },
              (_, index) => index + 1
            ).map((qty) => (
              <option
                key={qty}
                value={qty}
              >
                Qty: {qty}
              </option>
            ))}
          </select>

          {/* PRICE */}

          <p
            className="
              whitespace-nowrap
              text-[14px]
              font-bold
              text-[#32106A]
              sm:text-[17px]
            "
          >
            ₹ {itemTotal.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ================= REMOVE ================= */}

      <button
        type="button"
        disabled={isLoading}
        onClick={() =>
          handleRemove(postId)
        }
        className="
          absolute
          right-2
          top-2
          flex
          h-6
          w-6
          items-center
          justify-center
          text-[#8B82A6]
          transition
          hover:text-[#32106A]
          disabled:opacity-40
          sm:right-2.5
          sm:top-2.5
        "
      >
        {isLoading ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <span
            className="
              text-[22px]
              font-light
              leading-none
            "
          >
            ×
          </span>
        )}
      </button>
    </div>
  );
})}
      </div>

      {/* ================= SUBTOTAL ================= */}

      <div
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-50
    flex
    items-center
    justify-between
    gap-3
    border-t
    border-[#E6E0F5]
    bg-[#F5F2FF]
    px-4
    py-2.5
    shadow-[0_-4px_15px_rgba(50,16,106,0.08)]
    sm:static
    sm:mt-5
    sm:rounded-xl
    sm:border-0
    sm:px-6
    sm:py-4
    sm:shadow-none
  "
>
       <div>
  <p
    className="
      text-[11px]
      font-medium
      text-[#8B82A6]
      sm:text-[14px]
    "
  >
    Subtotal
  </p>

  <p
    className="
      mt-0.5
      text-[20px]
      font-bold
      text-[#32106A]
      sm:text-[26px]
    "
  >
    ₹{" "}
    {Number(
      totalSubtotal || 0
    ).toLocaleString("en-IN")}
  </p>
</div>

        <button
  type="button"
  onClick={handleBuyAll}
  className="
    flex
    min-w-[175px]
    items-center
    justify-center
    gap-2
    rounded-lg
    bg-gradient-to-r
    from-[#7135E8]
    to-[#6D28D9]
    px-5
    py-2.5
    text-[14px]
    font-bold
    text-white
    shadow-sm
    transition
    hover:from-[#6428D8]
    hover:to-[#5B21B6]
    sm:min-w-[210px]
    sm:py-3.5
    sm:text-[16px]
  "
>
  Buy All

  <span className="text-[20px]">
    →
  </span>
</button>
      </div>

    </div>
  </main>
);
}