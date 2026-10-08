

import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Loader2,
  Share2,
  ShoppingCart,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import Image from "next/image";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  getProductById,
  ProductDetail,
} from "../../services/productApi";
import {
  addReview,
  getReviewsByPostId,
  Review,
} from "../../services/reviewApi";
import { createCart, addPostToCart } from "../../services/cartApi";

export default function ProductDetailsPage() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const postId =
    searchParams.get("postId");

  const [product, setProduct] =
    useState<ProductDetail | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedSize, setSelectedSize] =
  useState("");

const [quantity, setQuantity] =
  useState(1);

const [addingToCart, setAddingToCart] =
  useState(false);

  const [liked, setLiked] =
    useState(false);

  const [showDescription, setShowDescription] =
    useState(true);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [reviewsLoading, setReviewsLoading] =
    useState(false);

  const [showReviewModal, setShowReviewModal] =
    useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

  const [reviewRating, setReviewRating] =
    useState(0);

  const [reviewText, setReviewText] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewError, setReviewError] =
    useState("");

  const [showAllReviews, setShowAllReviews] =
    useState(false);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {

    if (!postId) {

      setError(
        "Product ID is missing."
      );

      setLoading(false);

      return;
    }

    const fetchProduct =
      async () => {

        try {

          setLoading(true);

          setError("");

          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {

            router.replace(
              "/login"
            );

            return;
          }

          const customerAddressId =
            localStorage.getItem(
              "customerAddressId"
            ) || undefined;

          console.log(
            "PRODUCT ID:",
            postId
          );

          const response =
            await getProductById(
              postId,
              customerAddressId
            );

          console.log(
            "PRODUCT DETAIL RESPONSE:",
            response
          );

          console.log(
            "PRODUCT DETAIL:",
            response.data
          );

          console.log(
            "PRODUCT NAME:",
            response.data?.topic
          );

          console.log(
            "PRODUCT PRICE:",
            response.data?.price
          );

          setProduct(
            response.data
          );
          if (response.data?.inventory?.length) {
  const availableSize = response.data.inventory.find(
    (item: any) => item.stock > 0
  );

  if (availableSize) {
    setSelectedSize(availableSize.size);
  }
}

        } catch (error: any) {

          console.error(
            "GET PRODUCT DETAIL ERROR:",
            error
          );

          setError(
            error?.response?.data?.message ||
            error?.message ||
            "Unable to load product."
          );

        } finally {

          setLoading(false);

        }

      };

    fetchProduct();

  }, [postId, router]);


  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    if (!postId) return;

    try {
      setReviewsLoading(true);

      const response =
        await getReviewsByPostId(postId);

      console.log(
        "REVIEWS RESPONSE:",
        response
      );

      if (response?.success) {
        setReviews(
          response.vibes || []
        );
      }
    } catch (error) {
      console.error(
        "FETCH REVIEWS ERROR:",
        error
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReviews();
    }
  }, [postId]);


  // ==========================================
  // ADD REVIEW
  // ==========================================

  const handleSubmitReview = async () => {
    if (!postId) return;

    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!product) {
      setReviewError(
        "Product details are not available."
      );
      return;
    }

    if (
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      setReviewError(
        "Please select a rating."
      );
      return;
    }

    if (!reviewText.trim()) {
      setReviewError(
        "Please write your review."
      );
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      const response = await addReview({
        postId,
        rating: reviewRating,
        text: reviewText.trim(),
        topic: product.topic,
      });

      console.log(
        "ADD REVIEW RESPONSE:",
        response
      );

      if (response?.success) {
        setShowReviewModal(false);
        setReviewRating(0);
        setReviewText("");

        await fetchReviews();
      }
    } catch (error: any) {
      setReviewError(
        error?.message ||
          "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-white
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
        >

          <Loader2
            size={20}
            className="
              animate-spin
              text-[#6D28D9]
            "
          />

          Loading product...

        </div>

      </main>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (!product) {

    return (
      <main
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          bg-[#faf9ff]
          px-6
          text-center
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-slate-900
          "
        >
          Product not found
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {error ||
            "Unable to load product."}
        </p>

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
            mt-5
            rounded-xl
            bg-[#6D28D9]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
          "
        >
          Go Back
        </button>

      </main>
    );

  }


  // ==========================================
  // IMAGES
  // ==========================================

  const images =
    product.media
      ?.map(
        (item) =>
          item.mediaUrl
      )
      .filter(Boolean) || [];

  const productImages =
    images.length > 0
      ? images
      : ["/file.svg"];


  // ==========================================
  // PRICE
  // ==========================================

  // ==========================================
// PRICE
// ==========================================

const amount = Number(
  product.price?.amount || 0
);

const currency =
  product.price?.currency || "₹";

const discountValue = Number(
  product.discount?.value || 0
);

let finalPrice = amount;

// Percentage discount
if (
  product.discount?.type === "percentage"
) {
  finalPrice =
    amount -
    (amount * discountValue) / 100;
}

// Flat discount
if (
  product.discount?.type === "flat"
) {
  finalPrice =
    amount - discountValue;
}

// Prevent negative price
finalPrice = Math.max(
  0,
  finalPrice
);


  // ==========================================
  // REVIEW STATS
  // ==========================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(
              review.rating || 0
            ),
          0
        ) / reviews.length
      : 0;

  const roundedAverage =
    averageRating > 0
      ? averageRating.toFixed(1)
      : "0.0";

  const ratingCounts = {
    5: reviews.filter(
      (review) =>
        Number(review.rating) === 5
    ).length,
    4: reviews.filter(
      (review) =>
        Number(review.rating) === 4
    ).length,
    3: reviews.filter(
      (review) =>
        Number(review.rating) === 3
    ).length,
    2: reviews.filter(
      (review) =>
        Number(review.rating) === 2
    ).length,
    1: reviews.filter(
      (review) =>
        Number(review.rating) === 1
    ).length,
  };


  // ==========================================
  // SHARE
  // ==========================================

  const handleShare =
    async () => {

      try {

        if (
          navigator.share
        ) {

          await navigator.share({
            title:
              product.topic,
            text:
              product.description ||
              "Check this product on Thover.",
            url:
              window.location.href,
          });

        } else {

          await navigator.clipboard.writeText(
            window.location.href
          );

          alert(
            "Product link copied."
          );

        }

      } catch {

        console.log(
          "Share cancelled."
        );

      }

    };


  // ==========================================
  // BUY NOW
  // ==========================================

 const handleBuyNow = () => {
  if (!product?._id) return;

  const storeId =
    product.store?._id;

  if (!storeId) {
    alert("Store information not found");
    return;
  }

  const checkoutData = {
    products: [
      {
        postId: product._id,
        topic: product.topic,
        image:
          product.media?.[0]?.mediaUrl ||
          "",
        quantity: 1,
        size: selectedSize,
        price:
          Number(
            product.price?.amount || 0
          ),
      },
    ],

    address: null,

    deliveryCharge: 150,
  };

  localStorage.setItem(
    "checkoutData",
    JSON.stringify(checkoutData)
  );

  router.push("/checkout");
};

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async () => {
  if (addingToCart) return;

  try {
    if (!product?._id) return;

    const storeId = product.store?._id;

    if (!storeId) {
      alert("Store information not found");
      return;
    }

    setAddingToCart(true);

    // ==========================================
    // SAVE STORE ID
    // ==========================================

    const existingStoreIds = JSON.parse(
      localStorage.getItem("cartStoreIds") || "[]"
    );

    if (!existingStoreIds.includes(storeId)) {
      existingStoreIds.push(storeId);

      localStorage.setItem(
        "cartStoreIds",
        JSON.stringify(existingStoreIds)
      );
    }

    localStorage.setItem(
      "cartStoreId",
      storeId
    );

    // ==========================================
    // CREATE CART OR GET EXISTING CART
    // ==========================================

    const cartResponse =
      await createCart(storeId);

    console.log(
      "CREATE CART RESPONSE:",
      cartResponse
    );

    const cart =
      cartResponse?.cart;

    const cartId =
      cart?._id;

    if (!cartId) {
      throw new Error(
        "Cart ID not found"
      );
    }

    // ==========================================
    // CHECK IF PRODUCT ALREADY EXISTS
    // ==========================================

    const alreadyAdded =
      Array.isArray(cart?.posts)
        ? cart.posts.some(
            (item: any) => {
              const existingPostId =
                item.postId?._id ||
                item.postId;

              return (
                String(existingPostId) ===
                String(product._id)
              );
            }
          )
        : false;

    if (alreadyAdded) {
      alert(
        "This product is already in your cart. You can increase the quantity from the cart."
      );
      return;
    }

    // ==========================================
    // ADD PRODUCT
    // ==========================================

    const addResponse =
      await addPostToCart({
        cartId,
        postId: product._id,
        size: selectedSize,
        quantity,
      });

    console.log(
      "ADD TO CART RESPONSE:",
      addResponse
    );

    alert(
      "Product added to cart successfully"
    );

  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    alert(
      "Failed to add product to cart"
    );
  } finally {
    setAddingToCart(false);
  }
};


  return (
    <main
      className="
        min-h-screen
        bg-white
        pb-24
      "
    >

      {/* =====================================
          IMAGE
      ===================================== */}

      <section
        className="
          relative
          w-full
          bg-slate-100
        "
      >

        <div
          className="
            relative
            aspect-square
            w-full
            overflow-hidden
          "
        >

          <Image
            src={
              productImages[
                selectedImage
              ]
            }
            alt={
              product.topic
            }
            fill
            priority
            sizes="100vw"
            className="
              object-cover
            "
          />

        </div>


        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
  absolute
  left-4
  top-4
  flex
  h-10
  w-10
  items-center
  justify-center
  rounded-full
  bg-gradient-to-r
  from-[#7C3AED]
  to-[#5B21B6]
  text-white
  shadow-md
">

          <ArrowLeft
            size={21}
          />

        </button>


        {/* RIGHT BUTTONS */}

        <div
          className="
            absolute
            right-4
            top-4
            flex
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              setLiked(
                !liked
              )
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
            "
          >

            <Heart
              size={21}
              className={
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-slate-700"
              }
            />

          </button>


          <button
            type="button"
            onClick={
              handleShare
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
            "
          >

            <Share2
              size={20}
            />

          </button>

        </div>

      </section>


      {/* =====================================
          IMAGE DOTS
      ===================================== */}

      <div
        className="
          flex
          justify-center
          gap-3
          py-3
        "
      >

        {productImages.map(
          (_, index) => (

            <button
              key={index}
              type="button"
              onClick={() =>
                setSelectedImage(
                  index
                )
              }
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${
                  selectedImage ===
                  index
                    ? "bg-black"
                    : "bg-slate-300"
                }
              `}
            />

          )
        )}

      </div>


      {/* =====================================
          PRODUCT DETAILS
      ===================================== */}

      <section
        className="
          px-5
        "
      >

        {/* STOCK + IDEAL FOR */}

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFFAF3] px-3 py-1.5 text-xs font-semibold text-[#20A35A]">
            <span className="h-2 w-2 rounded-full bg-[#20A35A]" />
            In Stock
          </div>

          {product.idealFor && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#475467]">
              Ideal For: {product.idealFor}
            </div>
          )}
        </div>


        {/* TITLE */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <h1
            className="
              text-[21px]
              font-bold
              leading-tight
              text-slate-900
            "
          >
            {product.topic}
          </h1>


          <div
            className="
              shrink-0
              text-right
            "
          >

            <div
              className="
                flex
                items-center
                justify-end
                gap-1
              "
            >

              <Star
                size={16}
                className="
                  fill-slate-900
                "
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                {roundedAverage}
              </span>

            </div>

            <p
              className="
                text-[10px]
                text-slate-500
              "
            >
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "Review"
                : "Reviews"})
            </p>

          </div>

        </div>


        {/* COLOR */}

        {product.color && (

          <p
            className="
              mt-1
              text-sm
              text-slate-700
            "
          >
            Color{" "}
            <span
              className="
                font-medium
              "
            >
              {product.color}
            </span>
          </p>

        )}


        {/* SIZES */}

        <div
          className="
            mt-3
            flex
            gap-2
          "
        >

          {product.inventory?.map((item) => (
  <button
    key={item.size}
    type="button"
    disabled={item.stock <= 0}
    onClick={() => setSelectedSize(item.size)}
    className={`
      h-7
      min-w-7
      rounded-md
      border
      px-2
      text-xs
      ${
        selectedSize === item.size
          ? "border-black bg-black text-white"
          : item.stock <= 0
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "border-slate-300 bg-white"
      }
    `}
  >
    {item.size}
  </button>
))}

        </div>


        <div
          className="
            my-4
            h-px
            bg-slate-100
          "
        />


        {/* FEATURES */}

        <div
          className="
            grid
            grid-cols-4
            gap-2
          "
        >

          <Feature
            icon={
              <ShieldCheck
                size={18}
              />
            }
            title="7 Days"
            subtitle="Easy Returns"
          />

          <Feature
            icon={
              <ShieldCheck
                size={18}
              />
            }
            title="Availability"
            subtitle={product.store?.address?.city || "N/A"}
          />

          <Feature
            icon={
              <ShieldCheck
                size={18}
              />
            }
            title="Quality"
            subtitle="Assured"
          />

          

          <Feature
            icon={
              <ShieldCheck
                size={18}
              />
            }
            title="Secure"
            subtitle="Payment"
          />

        </div>


        {/* DESCRIPTION */}

        <div
          className="
            mt-5
            border-t
            border-slate-100
          "
        >

          <button
            type="button"
            onClick={() =>
              setShowDescription(
                !showDescription
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              py-4
            "
          >

            <span
              className="
                text-sm
                font-bold
              "
            >
              Description
            </span>

            <ChevronDown
              size={18}
              className={
                showDescription
                  ? "rotate-180"
                  : ""
              }
            />

          </button>


          {showDescription && (

           <div className="pb-4">

  {/* DESCRIPTION */}
  <p
    className="
      text-xs
      leading-relaxed
      text-slate-600
    "
  >
    {product.description ||
      "No description available."}
  </p>

  {/* CATEGORY + TAGS */}
  <div className="mt-4 flex flex-wrap items-center gap-2">

    {/* CATEGORY */}
    {product.category && (
      <div
        className="
          flex
          items-center
          gap-1.5
          rounded-full
          border
          border-slate-200
          px-3
          py-1.5
          text-[10px]
          text-slate-600
        "
      >
        <ShieldCheck
          size={14}
          className="text-[#6D28D9]"
        />

        <span>
          {product.category}
        </span>
      </div>
    )}

    {/* TAGS */}
    {product.tags &&
      product.tags.length > 0 &&
      product.tags.map(
        (tag: string, index: number) => (
          <div
            key={`${tag}-${index}`}
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-slate-200
              px-3
              py-1.5
              text-[10px]
              text-slate-600
            "
          >
            <ShieldCheck
              size={14}
              className="text-[#6D28D9]"
            />

            <span>
              {tag}
            </span>
          </div>
        )
      )}

  </div>

</div>

          )}

        </div>


        {/* REVIEWS */}

        <div
          className="
            border-t
            border-slate-100
            py-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <h3
              className="
                text-sm
                font-bold
              "
            >
              Customer Reviews
              <span
                className="
                  ml-1
                  text-slate-400
                "
              >
                ({reviews.length})
              </span>
            </h3>

            <button
              type="button"
              onClick={() =>
                setShowAllReviews(
                  !showAllReviews
                )
              }
              className="
                text-xs
                font-semibold
                text-blue-600
              "
            >
              {showAllReviews
                ? "Hide"
                : "View All"}
            </button>

          </div>


          {showAllReviews && (

            <div className="mt-5">

              {/* REVIEW SUMMARY */}

              <div
                className="
                  rounded-xl
                  bg-[#FAFBFF]
                  p-4
                "
              >

                <div
                  className="
                    flex
                    gap-5
                  "
                >

                  <div
                    className="
                      min-w-[75px]
                      text-center
                    "
                  >

                    <div
                      className="
                        text-[32px]
                        font-bold
                        text-[#101828]
                      "
                    >
                      {roundedAverage}
                    </div>

                    <div
                      className="
                        flex
                        justify-center
                      "
                    >
                      {[1, 2, 3, 4, 5].map(
                        (item) => (
                          <Star
                            key={item}
                            size={14}
                            className={
                              item <=
                              Math.round(
                                averageRating
                              )
                                ? "fill-[#F6B800] text-[#F6B800]"
                                : "text-slate-300"
                            }
                          />
                        )
                      )}
                    </div>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-[#7182A6]
                      "
                    >
                      {reviews.length}{" "}
                      {reviews.length === 1
                        ? "Review"
                        : "Reviews"}
                    </p>

                  </div>


                  <div
                    className="
                      flex-1
                      space-y-1.5
                    "
                  >
                    {[5, 4, 3, 2, 1].map(
                      (rating) => {
                        const count =
                          ratingCounts[
                            rating as keyof typeof ratingCounts
                          ];

                        const percentage =
                          reviews.length > 0
                            ? (count /
                                reviews.length) *
                              100
                            : 0;

                        return (
                          <ReviewBar
                            key={rating}
                            label={String(
                              rating
                            )}
                            width={`${percentage}%`}
                            count={String(
                              count
                            )}
                          />
                        );
                      }
                    )}
                  </div>

                </div>

              </div>


              {/* WRITE REVIEW */}

              <button
                type="button"
                onClick={() => {
                  const token =
                    localStorage.getItem(
                      "token"
                    );

                  if (!token) {
                    router.push("/login");
                    return;
                  }

                  setReviewError("");
                  setShowReviewModal(true);
                }}
                className="
                  mt-4
                  w-full
                  rounded-xl
                  border
                  border-[#6D28D9]
                  px-4
                  py-3
                  text-xs
                  font-semibold
                  text-[#6D28D9]
                "
              >
                Write a Review
              </button>


              {/* REVIEWS LIST */}

              <div className="mt-5">

                {reviewsLoading ? (

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      py-8
                    "
                  >
                    <Loader2
                      size={24}
                      className="
                        animate-spin
                        text-[#6D28D9]
                      "
                    />
                  </div>

                ) : reviews.length === 0 ? (

                  <div
                    className="
                      rounded-xl
                      bg-[#FAFBFF]
                      p-8
                      text-center
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-medium
                        text-[#475467]
                      "
                    >
                      No reviews yet
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#7182A6]
                      "
                    >
                      Be the first one to
                      review this product.
                    </p>
                  </div>

                ) : (

                  <div className="space-y-5">

                    {reviews.map(
                      (review) => (
                        <ReviewCard
                          key={
                            review._id ||
                            review.id
                          }
                          review={review}
                        />
                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          BUY BAR
      ===================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-slate-100
          bg-white
          px-5
          py-3
          shadow-[0_-5px_20px_rgba(0,0,0,0.06)]
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-3xl
            items-center
            gap-4
          "
        >

          <div
            className="
              flex-1
            "
          >

            <p
              className="
                text-lg
                font-bold
                text-[#6D28D9]
              "
            >
              {currency} {" "}
              {Math.round(
                finalPrice
              )}
            </p>

            {discountValue >
              0 && (

              <p
                className="
                  text-[10px]
                  text-slate-400
                "
              >
                <span
                  className="
                    line-through
                  "
                >
                  {currency} {" "}
                  {amount}
                </span>

                <span
                  className="
                    ml-2
                    text-green-600
                  "
                >
                  Save{" "}
                  {currency}{" "}
                  {Math.round(
                    amount -
                      finalPrice
                  )}
                </span>
              </p>

            )}

          </div>


          <button
  type="button"
  onClick={handleAddToCart}
  disabled={addingToCart}
  className="
    h-12
    flex-1
    rounded-xl
    border
    border-[#6D28D9]
    bg-white
    px-3
    text-sm
    font-semibold
    text-[#6D28D9]
    transition
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
  <ShoppingCart className="mr-1 inline-block h-4 w-4" />

  {addingToCart
    ? "Adding..."
    : "Add to Cart"}
</button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="
              h-12
              flex-1
              rounded-xl
              bg-gradient-to-r
              from-[#7C3AED]
              to-[#5B21B6]
              text-sm
              font-semibold
              text-white
              shadow-md
              transition
              hover:from-[#6D28D9]
              hover:to-[#4C1D95]
            "
          >
            Buy Now
          </button>

        </div>

      </div>


      {/* =====================================
          REVIEW MODAL
      ===================================== */}

      {showReviewModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-[520px]
              rounded-2xl
              bg-white
              p-5
              shadow-2xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#101828]
                  "
                >
                  Write a Review
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#7182A6]
                  "
                >
                  Share your experience
                  with this product
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewError("");
                }}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                "
              >
                ✕
              </button>

            </div>


            <div className="mt-6">

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#101828]
                "
              >
                How would you rate this
                product?
              </p>

              <div className="mt-3 flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating(
                          star
                        )
                      }
                      className="
                        transition
                        hover:scale-110
                      "
                    >
                      <Star
                        size={30}
                        className={
                          star <=
                          reviewRating
                            ? "fill-[#F6B800] text-[#F6B800]"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  )
                )}

              </div>

            </div>


            <div className="mt-5">

              <label
                className="
                  text-sm
                  font-semibold
                  text-[#101828]
                "
              >
                Your Review
              </label>

              <textarea
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
                placeholder="Tell us about your experience..."
                rows={4}
                className="
                  mt-2
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  text-sm
                  text-[#101828]
                  outline-none
                  focus:border-[#6D28D9]
                  focus:ring-2
                  focus:ring-[#6D28D9]/10
                "
              />

            </div>


            {reviewError && (
              <p
                className="
                  mt-3
                  text-sm
                  text-red-500
                "
              >
                {reviewError}
              </p>
            )}


            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={reviewSubmitting}
              className="
                mt-5
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#6D28D9]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#5B21B6]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {reviewSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>

          </div>

        </div>
      )}

      {/* =====================================
    COMING SOON MODAL
===================================== */}

{showComingSoon && (
  <div
    className="
      fixed
      inset-0
      z-[200]
      flex
      items-center
      justify-center
      bg-black/40
      px-4
    "
    onClick={() => setShowComingSoon(false)}
  >
    <div
      className="
        w-full
        max-w-[380px]
        rounded-2xl
        bg-white
        p-6
        text-center
        shadow-2xl
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <div
        className="
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#F3E8FF]
        "
      >
        <span className="text-3xl">🚀</span>
      </div>

      {/* Title */}
      <h2
        className="
          mt-4
          text-xl
          font-bold
          text-[#101828]
        "
      >
        Thover Coming Soon
      </h2>

      {/* Description */}
      <p
        className="
          mt-2
          text-sm
          leading-6
          text-[#7182A6]
        "
      >
        We are working hard to bring Thover to you.
        Stay tuned!
      </p>

      {/* Button */}
      <button
        type="button"
        onClick={() => setShowComingSoon(false)}
        className="
          mt-6
          h-11
          w-full
          rounded-xl
          bg-gradient-to-r
          from-[#7C3AED]
          to-[#5B21B6]
          text-sm
          font-semibold
          text-white
          shadow-md
        "
      >
        Okay
      </button>
    </div>
  </div>
)}

    </main>
  );
}


// ==========================================
// REVIEW CARD
// ==========================================

function ReviewCard({
  review,
}: {
  review: Review;
}) {
  const userName =
    review.user?.name ||
    review.user?.username ||
    "Customer";

  const formattedDate =
    review.createdAt
      ? new Date(
          review.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : "";

  return (
    <div
      className="
        border-b
        border-slate-100
        pb-5
        last:border-b-0
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div>

          <p
            className="
              text-sm
              font-semibold
              text-[#101828]
            "
          >
            {userName}
          </p>

          <div
            className="
              mt-1
              flex
              items-center
              gap-0.5
            "
          >
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <=
                    Number(
                      review.rating
                    )
                      ? "fill-[#F6B800] text-[#F6B800]"
                      : "text-slate-300"
                  }
                />
              )
            )}
          </div>

        </div>

        {formattedDate && (
          <span
            className="
              text-[10px]
              text-[#98A2B3]
            "
          >
            {formattedDate}
          </span>
        )}

      </div>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-[#475467]
        "
      >
        {review.text}
      </p>

      {review.media &&
        review.media.length > 0 && (
          <div className="mt-3 flex gap-3">
            {review.media
              .filter(
                (media) =>
                  !media.isDeleted &&
                  media.mediaUrl
              )
              .map(
                (media, index) => (
                  <img
                    key={index}
                    src={
                      media.mediaUrl
                    }
                    alt="Review"
                    className="
                      h-20
                      w-20
                      rounded-lg
                      object-cover
                    "
                  />
                )
              )}
          </div>
        )}

    </div>
  );
}


// ==========================================
// REVIEW BAR
// ==========================================

function ReviewBar({
  label,
  width,
  count,
}: {
  label: string;
  width: string;
  count: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <span
        className="
          w-5
          text-[10px]
          text-slate-500
        "
      >
        {label}★
      </span>

      <div
        className="
          h-2
          flex-1
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[#6D28D9]
          "
          style={{
            width,
          }}
        />
      </div>

      <span
        className="
          w-4
          text-right
          text-[10px]
          text-slate-400
        "
      >
        {count}
      </span>

    </div>
  );
}


// ==========================================
// FEATURE
// ==========================================

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {

  return (
    <div
      className="
        text-center
      "
    >

      <div
        className="
          mx-auto
          flex
          h-8
          w-8
          items-center
          justify-center
          text-blue-500
        "
      >
        {icon}
      </div>

      <p
        className="
          text-[9px]
          font-semibold
          text-slate-700
        "
      >
        {title}
      </p>

      <p
        className="
          text-[8px]
          text-slate-400
        "
      >
        {subtitle}
      </p>

    </div>
  );
}