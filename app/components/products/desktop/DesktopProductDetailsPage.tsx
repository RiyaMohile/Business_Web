"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Loader2,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Ruler,
  Minus,
  Plus,
  Maximize2,
} from "lucide-react";

import {
  getProductById,
  ProductDetail,
} from "../../../services/productApi";
import {
  addReview,
  getReviewsByPostId,
  Review,
} from "../../../services/reviewApi";
import { createCart, addPostToCart } from "../../../services/cartApi";


// ======================================================
// COMPONENT
// ======================================================

export default function DesktopProductDetailsPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const postId =
    searchParams.get("postId");


  // ====================================================
  // STATES
  // ====================================================

  const [product, setProduct] =
    useState<ProductDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedSize, setSelectedSize] =
    useState("L");

  const [selectedColor, setSelectedColor] =
    useState("Yellow");

  const [quantity, setQuantity] =
    useState(1);

  const [liked, setLiked] =
    useState(false);

  const [showDescription, setShowDescription] =
    useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
const [reviewsLoading, setReviewsLoading] = useState(false);

const [showReviewModal, setShowReviewModal] =
  useState(false);

const [reviewRating, setReviewRating] = useState(0);
const [reviewText, setReviewText] = useState("");

const [reviewSubmitting, setReviewSubmitting] =
  useState(false);

const [reviewError, setReviewError] = useState("");


  // ====================================================
  // FETCH PRODUCT
  // ====================================================

  useEffect(() => {

    if (!postId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }


    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");


        // ----------------------------------------------
        // AUTH
        // ----------------------------------------------

        if (!token) {
          router.replace("/login");
          return;
        }


        // ----------------------------------------------
        // ADDRESS
        // ----------------------------------------------

        const customerAddressId =
          localStorage.getItem(
            "customerAddressId"
          ) || undefined;


        // ----------------------------------------------
        // GET PRODUCT
        // ----------------------------------------------

        const response =
          await getProductById(
            postId,
            customerAddressId
          );


        console.log(
          "DESKTOP PRODUCT DETAIL:",
          response
        );


        setProduct(
          response.data
        );

      } catch (error: any) {

        console.error(
          "GET DESKTOP PRODUCT DETAIL ERROR:",
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


  const fetchReviews = async () => {
  if (!postId) return;

  try {
    setReviewsLoading(true);

    const response =
      await getReviewsByPostId(postId);

    console.log("REVIEWS RESPONSE:", response);

    if (response?.success) {
      setReviews(response.vibes || []);
    }
  } catch (error) {
    console.error("FETCH REVIEWS ERROR:", error);
  } finally {
    setReviewsLoading(false);
  }
};
useEffect(() => {
  if (postId) {
    fetchReviews();
  }
}, [postId]);

const handleSubmitReview = async () => {
  if (!postId) return;

  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  if (reviewRating < 1 || reviewRating > 5) {
    setReviewError("Please select a rating.");
    return;
  }

  if (!reviewText.trim()) {
    setReviewError("Please write your review.");
    return;
  }

  try {
    setReviewSubmitting(true);
    setReviewError("");

    const response = await addReview({
      postId,
      rating: reviewRating,
      text: reviewText.trim(),
      topic: product?.topic || "",
    });

    console.log("ADD REVIEW RESPONSE:", response);

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


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-white">

        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={32}
            className="animate-spin text-[#6D28D9]"
          />

          <p className="text-sm text-slate-500">
            Loading product...
          </p>

        </div>

      </main>
    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (!product) {

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFBFF]">

        <h2 className="text-2xl font-bold text-[#101828]">
          Product not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || "Unable to load product."}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-5 rounded-xl bg-[#6D28D9] px-6 py-3 text-sm font-semibold text-white"
        >
          Go Back
        </button>

      </main>
    );

  }


  // ====================================================
  // PRODUCT IMAGES
  // ====================================================

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


  // ====================================================
  // PRICE
  // ====================================================

  const amount =
    Number(
      product.price?.amount || 0
    );


  const currency =
    product.price?.currency || "₹";


  const discountValue =
    Number(
      product.discount?.value || 0
    );


  let finalPrice =
    amount;


  if (
    product.discount?.type ===
    "percentage"
  ) {

    finalPrice =
      amount -
      (amount * discountValue) /
        100;

  }


  if (
    product.discount?.type ===
    "flat"
  ) {

    finalPrice =
      amount -
      discountValue;

  }


  finalPrice =
    Math.max(
      0,
      finalPrice
    );


  const totalPrice =
    finalPrice * quantity;

  // ====================================================
  // REVIEW STATS
  // ====================================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const roundedAverage =
    averageRating > 0
      ? averageRating.toFixed(1)
      : "0.0";

  const ratingCounts = {
    5: reviews.filter((review) => Number(review.rating) === 5).length,
    4: reviews.filter((review) => Number(review.rating) === 4).length,
    3: reviews.filter((review) => Number(review.rating) === 3).length,
    2: reviews.filter((review) => Number(review.rating) === 2).length,
    1: reviews.filter((review) => Number(review.rating) === 1).length,
  };


  // ====================================================
  // SHARE
  // ====================================================

  const handleShare =
    async () => {

      try {

        if (navigator.share) {

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


  // ====================================================
  // BUY NOW
  // ====================================================

  const handleBuyNow =
    () => {

      console.log(
        "BUY NOW",
        {
          postId:
            product._id,
          size:
            selectedSize,
          color:
            selectedColor,
          quantity,
        }
      );

    };

    const handleAddToCart = async () => {
  try {
    if (!product?._id) return;

    const storeId = product.store?._id;

    if (!storeId) {
      alert("Store information not found");
      return;
    }

    // Create cart OR get existing cart
    const cartResponse = await createCart(storeId);

    console.log("CREATE CART RESPONSE:", cartResponse);

    const cartId = cartResponse?.cart?._id;

    if (!cartId) {
      throw new Error("Cart ID not found");
    }

    // Add product to cart
    const addResponse = await addPostToCart({
      cartId,
      postId: product._id,
      size: selectedSize,
      quantity,
    });

    console.log("ADD TO CART RESPONSE:", addResponse);

    alert("Product added to cart successfully");

  } catch (error) {
    console.error("Add to cart error:", error);
    alert("Failed to add product to cart");
  }
};


  // ====================================================
  // MAIN UI
  // ====================================================

  return (

    <main className="min-h-screen bg-white pb-10">


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto max-w-[1420px] px-8 pt-[20px]">


        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-5 flex items-center gap-3 text-sm text-[#5F7197]">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="flex items-center gap-2 hover:text-[#6D28D9]"
          >

            <ArrowLeft
              size={18}
            />

            Home

          </button>

          
          <ChevronRight
            size={16}
          />

          <span className="font-medium text-[#475467]">
            {product.topic}
          </span>

        </div>


        {/* =================================================
            PRODUCT TOP AREA
        ================================================= */}

        <section className="grid grid-cols-[1.08fr_0.92fr] gap-12">


          {/* =================================================
              LEFT IMAGE AREA
          ================================================= */}

          <div className="grid grid-cols-[92px_1fr] gap-5">


            {/* THUMBNAILS */}

            <div className="flex flex-col gap-4">

              {productImages
                .map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`
                        relative
                        h-[82px]
                        w-[82px]
                        overflow-hidden
                        rounded-xl
                        border-2
                        bg-slate-50
                        ${
                          selectedImage ===
                          index
                            ? "border-[#6D28D9]"
                            : "border-transparent"
                        }
                      `}
                    >

                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                    </button>

                  )
                )}

            </div>


            {/* MAIN IMAGE */}

            <div className="relative h-[520px] overflow-hidden rounded-xl bg-[#F6F6F7]">

              <img
                src={
                  productImages[
                    selectedImage
                  ]
                }
                alt={
                  product.topic
                }
                className="h-full w-full object-cover"
              />


              {/* LIKE */}

              <button
                type="button"
                onClick={() =>
                  setLiked(!liked)
                }
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
              >

                <Heart
                  size={24}
                  className={
                    liked
                      ? "fill-red-500 text-red-500"
                      : "text-[#475467]"
                  }
                />

              </button>


              {/* SHARE */}

              <button
                type="button"
                onClick={
                  handleShare
                }
                className="absolute right-20 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
              >

                <Share2
                  size={22}
                  className="text-[#475467]"
                />

              </button>


              {/* FULLSCREEN */}

              <button
                type="button"
                className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
              >

                <Maximize2
                  size={20}
                />

              </button>

            </div>

          </div>


          {/* =================================================
              RIGHT PRODUCT INFO
          ================================================= */}

          <div className="pt-1">


            {/* STOCK */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EFFAF3] px-3 py-1.5 text-xs font-semibold text-[#20A35A]">

              <span className="h-2 w-2 rounded-full bg-[#20A35A]" />

              In Stock

            </div>


            {/* PRODUCT NAME */}

            <h1 className="text-[32px] font-bold leading-tight text-[#101828]">
              {product.topic}
            </h1>


            {/* RATING */}

            <div className="mt-2 flex items-center gap-2">

              <div className="flex items-center gap-1">

                <Star
                  size={18}
                  className="fill-[#F6B800] text-[#F6B800]"
                />

                <span className="font-semibold text-[#101828]">
                  {roundedAverage}
                </span>

              </div>

              <span className="text-sm text-[#7182A6]">
                ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
              </span>

            </div>


            {/* PRICE */}

            <div className="mt-5 flex items-center gap-4">

             <span className="flex items-center gap-2 text-[32px] font-bold text-[#6D28D9]">
  <span>{currency}</span>
  <span>{Math.round(finalPrice)}</span>
</span>


              {discountValue > 0 && (

                <>

                  <span className="text-lg text-[#7182A6] line-through">

                    {currency} 
                    {amount}

                  </span>


                  <span className="rounded-full bg-[#F1EAFE] px-3 py-1 text-sm font-semibold text-[#6D28D9]">

                    {product.discount?.type ===
                    "percentage"
                      ? `${discountValue}% OFF`
                      : `Save ${currency}${discountValue}`}

                  </span>

                </>

              )}

            </div>


            {/* COLOR */}

            <div className="mt-7">

              <div className="flex items-center gap-2">

                <span className="text-sm font-semibold text-[#101828]">
                  Color:
                </span>

                <span className="text-sm text-[#475467]">
                  {selectedColor}
                </span>

              </div>

            </div>


            {/* SIZE */}

            <div className="mt-7">

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-[#101828]">
                  Size:
                </span>

                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-semibold text-[#6D28D9]"
                >

                  <Ruler
                    size={17}
                  />

                  Size Guide

                </button>

              </div>


              <div className="mt-3 flex gap-3">

                {[
                  "S",
                  "M",
                  "L",
                  "XL",
                  "XXL",
                ].map(
                  (size) => (

                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      className={`
                        h-12
                        min-w-[62px]
                        rounded-xl
                        border
                        px-5
                        text-sm
                        font-medium
                        ${
                          selectedSize ===
                          size
                            ? "border-[#6D28D9] bg-[#6D28D9] text-white"
                            : "border-slate-200 bg-white text-[#101828]"
                        }
                      `}
                    >

                      {size}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* DIVIDER */}

            <div className="my-7 h-px bg-slate-100" />


            {/* FEATURES */}

            <div className="grid grid-cols-4 divide-x divide-slate-200">

              <DesktopFeature
                icon={
                  <ShieldCheck
                    size={25}
                  />
                }
                title="7 Days"
                subtitle="Easy Returns"
              />

              <DesktopFeature
                icon={
                  <ShieldCheck
                    size={25}
                  />
                }
                title="Quality"
                subtitle="Assured"
              />

              <DesktopFeature
                icon={
                  <Truck
                    size={25}
                  />
                }
                title="Free Delivery"
                subtitle="Orders above ₹499"
              />

              <DesktopFeature
                icon={
                  <ShieldCheck
                    size={25}
                  />
                }
                title="Secure"
                subtitle="Payment"
              />

            </div>


            {/* ACTIONS */}

            <div className="mt-7 flex gap-4">
  <button
    type="button"
    onClick={handleAddToCart}
    className="flex-1 rounded-xl border border-black px-6 py-4 font-semibold"
  >
    <ShoppingCart className="mr-2 inline-block h-5 w-5" />
    Add to Cart
  </button>

  <button
    type="button"
    onClick={handleBuyNow}
    className="flex-1 rounded-xl bg-black px-6 py-4 font-semibold text-white"
  >
    Buy Now
  </button>
</div>

          </div>

        </section>


        {/* =================================================
            DESCRIPTION + REVIEWS
        ================================================= */}

        <section className="mt-8">


          {/* TABS */}

          <div className="flex items-center gap-10 border-b border-slate-200">

            <button
              type="button"
              onClick={() =>
                setShowDescription(
                  true
                )
              }
              className={`
                relative
                pb-4
                text-base
                font-semibold
                ${
                  showDescription
                    ? "text-[#6D28D9]"
                    : "text-[#7182A6]"
                }
              `}
            >

              Description

              {showDescription && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#6D28D9]" />
              )}

            </button>


            <button
              type="button"
              onClick={() =>
                setShowDescription(
                  false
                )
              }
              className={`
                relative
                pb-4
                text-base
                font-semibold
                ${
                  !showDescription
                    ? "text-[#6D28D9]"
                    : "text-[#7182A6]"
                }
              `}
            >

              Reviews
              ({reviews.length})

            </button>

          </div>


          {/* DESCRIPTION / REVIEWS */}

          {showDescription ? (

            <div className="mt-5 grid grid-cols-[1.5fr_0.8fr] gap-6">

              <div className="rounded-xl border border-slate-100 bg-white p-6">

                <h2 className="text-lg font-bold text-[#101828]">
                  Product Description
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#5F7197]">
                  {product.description || "No description available."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <InfoTag text="High Quality Material" />
                  <InfoTag text="Stylish Design" />
                  <InfoTag text="Lightweight" />
                  <InfoTag text="Perfect for Gifting" />
                </div>

              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-6">

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#101828]">
                    Customer Reviews
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowDescription(false)}
                    className="text-sm font-semibold text-[#6D28D9]"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-5 flex gap-6">
                  <div className="min-w-[100px] text-center">
                    <div className="text-[40px] font-bold text-[#101828]">
                      {roundedAverage}
                    </div>

                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Star
                          key={item}
                          size={17}
                          className={
                            item <= Math.round(averageRating)
                              ? "fill-[#F6B800] text-[#F6B800]"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-1 text-xs text-[#7182A6]">
                      ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        ratingCounts[rating as keyof typeof ratingCounts];
                      const percentage =
                        reviews.length > 0
                          ? (count / reviews.length) * 100
                          : 0;

                      return (
                        <ReviewBar
                          key={rating}
                          label={String(rating)}
                          width={`${percentage}%`}
                          count={String(count)}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          ) : (

            <div className="mt-5 rounded-xl border border-slate-100 bg-white p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#101828]">
                    Customer Reviews
                  </h2>
                  <p className="mt-1 text-sm text-[#7182A6]">
                    {reviews.length} {reviews.length === 1 ? "customer review" : "customer reviews"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="rounded-lg border border-[#6D28D9] px-4 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F5F0FF]"
                >
                  Write a Review
                </button>
              </div>

              <div className="mt-6 flex gap-8 border-b border-slate-100 pb-6">
                <div className="min-w-[110px] text-center">
                  <div className="text-[40px] font-bold text-[#101828]">
                    {roundedAverage}
                  </div>

                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star
                        key={item}
                        size={17}
                        className={
                          item <= Math.round(averageRating)
                            ? "fill-[#F6B800] text-[#F6B800]"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-1 text-xs text-[#7182A6]">
                    {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                  </p>
                </div>

                <div className="max-w-[420px] flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      ratingCounts[rating as keyof typeof ratingCounts];
                    const percentage =
                      reviews.length > 0
                        ? (count / reviews.length) * 100
                        : 0;

                    return (
                      <ReviewBar
                        key={rating}
                        label={String(rating)}
                        width={`${percentage}%`}
                        count={String(count)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2
                      size={26}
                      className="animate-spin text-[#6D28D9]"
                    />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-xl bg-[#FAFBFF] p-10 text-center">
                    <p className="text-sm font-medium text-[#475467]">
                      No reviews yet
                    </p>
                    <p className="mt-1 text-xs text-[#7182A6]">
                      Be the first one to review this product.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review._id || review.id}
                        review={review}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          )}

        </section>

      </div>

    
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
        p-6
        shadow-2xl
      "
    >

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-[#101828]">
            Write a Review
          </h2>

          <p className="mt-1 text-sm text-[#7182A6]">
            Share your experience with this product
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
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-slate-500
            hover:bg-slate-200
          "
        >
          ✕
        </button>

      </div>

      {/* RATING */}

      <div className="mt-7">

        <p className="text-sm font-semibold text-[#101828]">
          How would you rate this product?
        </p>

        <div className="mt-3 flex gap-2">

          {[1, 2, 3, 4, 5].map(
            (star) => (

              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewRating(star)
                }
                className="transition hover:scale-110"
              >

                <Star
                  size={32}
                  className={
                    star <= reviewRating
                      ? "fill-[#F6B800] text-[#F6B800]"
                      : "text-slate-300"
                  }
                />

              </button>

            )
          )}

        </div>

      </div>

      {/* REVIEW */}

      <div className="mt-6">

        <label className="text-sm font-semibold text-[#101828]">
          Your Review
        </label>

        <textarea
          value={reviewText}
          onChange={(e) =>
            setReviewText(e.target.value)
          }
          placeholder="Tell us about your experience..."
          rows={5}
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
            transition
            focus:border-[#6D28D9]
            focus:ring-2
            focus:ring-[#6D28D9]/10
          "
        />

      </div>

      {/* ERROR */}

      {reviewError && (

        <p className="mt-3 text-sm text-red-500">
          {reviewError}
        </p>

      )}

      {/* SUBMIT */}

      <button
        type="button"
        onClick={handleSubmitReview}
        disabled={reviewSubmitting}
        className="
          mt-5
          flex
          h-12
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
              size={18}
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
)}</main>
  );
}


// ======================================================
// REVIEW CARD
// ======================================================

function ReviewCard({
  review,
}: {
  review: Review;
}) {
  const userName =
    review.user?.name ||
    review.user?.username ||
    "Customer";

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="border-b border-slate-100 pb-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* {review.user?.profileImage ? (
            <img
              src={review.user.profileImage}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EAFE] text-sm font-bold text-[#6D28D9]">
              {userName.charAt(0).toUpperCase()}
            </div>
          )} */}

          <div>
            <p className="text-sm font-semibold text-[#101828]">
              {userName}
            </p>

            <div className="mt-1 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Number(review.rating)
                      ? "fill-[#F6B800] text-[#F6B800]"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {formattedDate && (
          <span className="text-xs text-[#98A2B3]">
            {formattedDate}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-[#475467]">
        {review.text}
      </p>

      {review.media && review.media.length > 0 && (
        <div className="mt-3 flex gap-3">
          {review.media
            .filter((media) => !media.isDeleted && media.mediaUrl)
            .map((media, index) => (
              <img
                key={index}
                src={media.mediaUrl}
                alt="Review"
                className="h-20 w-20 rounded-lg object-cover"
              />
            ))}
        </div>
      )}
    </div>
  );
}


// ======================================================
// FEATURE
// ======================================================

function DesktopFeature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {

  return (

    <div className="flex items-center gap-3 px-4 first:pl-0">

      <div className="text-[#6D28D9]">
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-[#101828]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-[#7182A6]">
          {subtitle}
        </p>

      </div>

    </div>

  );
}


// ======================================================
// INFO TAG
// ======================================================

function InfoTag({
  text,
}: {
  text: string;
}) {

  return (

    <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm text-[#475467]">

      <ShieldCheck
        size={16}
        className="text-[#6D28D9]"
      />

      {text}

    </div>

  );

}


// ======================================================
// REVIEW BAR
// ======================================================

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

    <div className="flex items-center gap-2 text-xs">

      <span className="w-5 text-[#475467]">
        {label} ★
      </span>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-[#6D28D9]"
          style={{
            width,
          }}
        />

      </div>

      <span className="w-5 text-right text-[#7182A6]">
        {count}
      </span>

    </div>

  );
}