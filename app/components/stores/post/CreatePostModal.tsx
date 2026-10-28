// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { X } from "lucide-react";
// import {
//   getSubcategoryInfo,
// } from "../../../services/categoryApi";
// import {getMyStore} from "../../../services/businessStoreApi"

// interface CreatePostModalProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface InventoryItem {
//   size: string;
//   stock: number;
// }

// export default function CreatePostModal({
//   onClose,
//   onSuccess,
// }: CreatePostModalProps) {
//   const [loading, setLoading] = useState(false);

//   const [topic, setTopic] = useState("");
//   const [description, setDescription] = useState("");

//   const [priceAmount, setPriceAmount] = useState("");
//   const [priceCurrency, setPriceCurrency] = useState("INR");
//   const [priceType, setPriceType] = useState("fixed");

//   const [color, setColor] = useState("");

//   const [idealFor, setIdealFor] = useState<
//     "Men" | "Women" | "Unisex" | "Kids" | ""
//   >("");

//   const [inventory, setInventory] = useState<InventoryItem[]>([
//     {
//       size: "M",
//       stock: 0,
//     },
//   ]);

//   const [discountTitle, setDiscountTitle] = useState("");
//   const [discountType, setDiscountType] = useState<
//     "percentage" | "flat"
//   >("percentage");
//   const [discountValue, setDiscountValue] = useState("");
//   const [discountExpiry, setDiscountExpiry] = useState("");
//   const [storeCategory, setStoreCategory] = useState("");
//   const [subcategories, setSubcategories] = useState<string[]>([]);
// const [selectedSubcategory, setSelectedSubcategory] = useState("");
// const [loadingSubcategories, setLoadingSubcategories] = useState(false);
// const [currentStep, setCurrentStep] = useState(1);
// const [selectedImages, setSelectedImages] = useState<File[]>([]);
// const [imagePreviews, setImagePreviews] = useState<string[]>([]);
// const [createdPostId, setCreatedPostId] = useState<string | null>(null);



//   const [tags, setTags] = useState("");

//   useEffect(() => {
//   const fetchStoreAndSubcategories = async () => {
//     try {
//       setLoadingSubcategories(true);

//       const storeResponse = await getMyStore();

//       console.log("MY STORE:", storeResponse);

//       const category =
//         storeResponse?.store?.category ||
//         storeResponse?.data?.store?.category ||
//         storeResponse?.data?.category ||
//         storeResponse?.store?.category;

//       if (!category) {
//         console.error("Store category not found");
//         return;
//       }

//       setStoreCategory(category);

//       const response = await getSubcategoryInfo(category);

//       console.log("SUBCATEGORY RESPONSE:", response);

//       const details = response?.data || [];

//       const subcategoryList = details
//         .map((item: any) => item.subCategory)
//         .filter(Boolean);

//       setSubcategories(subcategoryList);

//     } catch (error: any) {
//       console.error(
//         "GET STORE/SUBCATEGORY ERROR:",
//         error.response?.data || error.message
//       );

//       setSubcategories([]);
//     } finally {
//       setLoadingSubcategories(false);
//     }
//   };

//   fetchStoreAndSubcategories();
// }, []);

//   // ==========================================
//   // INVENTORY
//   // ==========================================

//   const addInventory = () => {
//     setInventory([
//       ...inventory,
//       {
//         size: "M",
//         stock: 0,
//       },
//     ]);
//   };

//   const removeInventory = (index: number) => {
//     setInventory(
//       inventory.filter((_, i) => i !== index)
//     );
//   };

//   const updateInventory = (
//     index: number,
//     field: keyof InventoryItem,
//     value: string
//   ) => {
//     setInventory((prev) =>
//       prev.map((item, i) =>
//         i === index
//           ? {
//               ...item,
//               [field]:
//                 field === "stock"
//                   ? Number(value)
//                   : value,
//             }
//           : item
//       )
//     );
//   };

  
  
//   const handleStep1Next = () => {
//   if (!topic.trim()) {
//     alert("Please enter topic");
//     return;
//   }

//   if (!description.trim()) {
//     alert("Please enter description");
//     return;
//   }

//   if (!priceAmount || Number(priceAmount) <= 0) {
//     alert("Please enter valid price");
//     return;
//   }

//   setCurrentStep(2);
// };
// const handleStep2Next = () => {
//   if (!selectedSubcategory) {
//     alert("Please select category");
//     return;
//   }

//   if (!idealFor) {
//     alert("Please select who this product is for");
//     return;
//   }

//   setCurrentStep(3);
// };
// const handleImageChange = (
//   e: React.ChangeEvent<HTMLInputElement>
// ) => {
//   const files = Array.from(e.target.files || []);

//   if (files.length === 0) return;

//   if (files.length > 10) {
//     alert("You can upload maximum 10 images.");
//     return;
//   }

//   setSelectedImages(files);

//   const previews = files.map((file) =>
//     URL.createObjectURL(file)
//   );

//   setImagePreviews(previews);
// };

// const createPost = async () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Please login again.");
//   }

//   const payload = {
//     topic: topic.trim(),

//     description: description.trim(),

//     price: {
//       currency: priceCurrency,
//       amount: Number(priceAmount),
//       priceType,
//     },

//     category: storeCategory,

//     subCategory: selectedSubcategory,

//     color: color.trim(),

//     idealFor: idealFor || undefined,

//     inventory: inventory.map((item) => ({
//       size: item.size,
//       stock: Number(item.stock),
//     })),

//     status: "public",

//     tags: tags
//       .split(",")
//       .map((tag) => tag.trim())
//       .filter(Boolean),
//   };

//   const response = await axios.post(
//     "https://api.thover.in/v1/api/post/addPost",
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data;
// };

// const uploadPostMedia = async (
//   postId: string
// ) => {
//   const token =
//     localStorage.getItem("token");

//   if (!token) {
//     throw new Error(
//       "Please login again."
//     );
//   }

//   const formData = new FormData();

//   selectedImages.forEach((file) => {
//     formData.append("media", file);
//   });

//   const response = await axios.post(
//     `https://api.thover.in/v1/api/post/add-media/${postId}`,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   console.log(
//     "MEDIA UPLOAD RESPONSE:",
//     response.data
//   );

//   if (!response.data?.success) {
//     throw new Error(
//       response.data?.message ||
//       "Unable to upload images."
//     );
//   }

//   return response.data;
// };


// const handleStep3Next = async () => {
//   if (selectedImages.length === 0) {
//     alert("Please select at least one image.");
//     return;
//   }

//   try {
//     setLoading(true);

//     const postResponse = await createPost();

//     console.log(
//       "POST CREATED:",
//       postResponse
//     );

//     if (
//       !postResponse?.success ||
//       !postResponse?.post?._id
//     ) {
//       alert(
//         postResponse?.message ||
//         "Unable to create post."
//       );

//       return;
//     }

//     const postId =
//       postResponse.post._id;

//     setCreatedPostId(postId);

//     await uploadPostMedia(postId);

//     setCurrentStep(4);

//   } catch (error: any) {
//     console.error(
//       "CREATE POST ERROR:",
//       error.response?.data || error
//     );

//     alert(
//       error.response?.data?.message ||
//       "Unable to create product."
//     );

//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//   <main className="min-h-screen bg-gray-50 p-6">
//     <div className="mx-auto w-full max-w-3xl">

//       {/* HEADER */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Create Post
//             </h1>

//             <p className="mt-1 text-gray-500">
//               Create a new product for your store.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full p-2 hover:bg-gray-200"
//           >
//             <X size={22} />
//           </button>
//         </div>
//       </div>

//       {/* PROGRESS */}
//       <div className="mb-6 flex items-center justify-between">
//         {[1, 2, 3, 4].map((step) => (
//           <div
//             key={step}
//             className="flex flex-1 items-center"
//           >
//             <div
//               className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold ${
//                 currentStep >= step
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-500"
//               }`}
//             >
//               {step}
//             </div>

//             {step < 4 && (
//               <div
//                 className={`mx-2 h-1 flex-1 ${
//                   currentStep > step
//                     ? "bg-blue-600"
//                     : "bg-gray-200"
//                 }`}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="rounded-2xl bg-white p-6 shadow-sm">

//         {/* ================= STEP 1 ================= */}
//         {currentStep === 1 && (
//           <div className="space-y-6">

//             <div>
//               <p className="text-sm text-blue-600">
//                 Step 1 of 4
//               </p>

//               <h2 className="mt-1 text-xl font-bold">
//                 Basic Information
//               </h2>
//             </div>

//             {/* TOPIC */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Topic
//               </label>

//               <input
//                 type="text"
//                 value={topic}
//                 onChange={(e) =>
//                   setTopic(e.target.value)
//                 }
//                 placeholder="e.g. Premium Cotton T-Shirt"
//                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* DESCRIPTION */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Description
//               </label>

//               <textarea
//                 value={description}
//                 onChange={(e) =>
//                   setDescription(e.target.value)
//                 }
//                 placeholder="Describe your product..."
//                 rows={5}
//                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
//               />
//             </div>

//             {/* PRICE */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Price
//               </label>

//               <div className="grid grid-cols-3 gap-3">

//                 <select
//                   value={priceCurrency}
//                   onChange={(e) =>
//                     setPriceCurrency(e.target.value)
//                   }
//                   className="rounded-xl border px-4 py-3"
//                 >
//                   <option value="INR">INR</option>
//                   <option value="USD">USD</option>
//                 </select>

//                 <input
//                   type="number"
//                   value={priceAmount}
//                   onChange={(e) =>
//                     setPriceAmount(e.target.value)
//                   }
//                   placeholder="Amount"
//                   className="rounded-xl border px-4 py-3"
//                 />

//                 <input
//                   type="text"
//                   value={priceType}
//                   onChange={(e) =>
//                     setPriceType(e.target.value)
//                   }
//                   placeholder="Fixed"
//                   className="rounded-xl border px-4 py-3"
//                 />

//               </div>
//             </div>

//             <div className="flex justify-end border-t pt-5">
//               <button
//                 type="button"
//                 onClick={handleStep1Next}
//                 className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             </div>

//           </div>
//         )}

//         {/* ================= STEP 2 ================= */}
//         {currentStep === 2 && (
//           <div className="space-y-6">

//             <div>
//               <p className="text-sm text-blue-600">
//                 Step 2 of 4
//               </p>

//               <h2 className="mt-1 text-xl font-bold">
//                 Product Details
//               </h2>
//             </div>

//             {/* CATEGORY */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Category
//               </label>

//               <select
//                 value={selectedSubcategory}
//                 onChange={(e) =>
//                   setSelectedSubcategory(e.target.value)
//                 }
//                 disabled={
//                   loadingSubcategories ||
//                   !storeCategory
//                 }
//                 className="w-full rounded-xl border px-4 py-3 bg-white"
//               >
//                 <option value="">
//                   {loadingSubcategories
//                     ? "Loading categories..."
//                     : "Select Category"}
//                 </option>

//                 {subcategories.map(
//                   (subcategory) => (
//                     <option
//                       key={subcategory}
//                       value={subcategory}
//                     >
//                       {subcategory}
//                     </option>
//                   )
//                 )}
//               </select>

//               {storeCategory && (
//                 <p className="mt-2 text-xs text-gray-500">
//                   Store Category: {storeCategory}
//                 </p>
//               )}
//             </div>

//             {/* COLOR */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Color
//               </label>

//               <input
//                 type="text"
//                 value={color}
//                 onChange={(e) =>
//                   setColor(e.target.value)
//                 }
//                 placeholder="e.g. Black"
//                 className="w-full rounded-xl border px-4 py-3"
//               />
//             </div>

//             {/* IDEAL FOR */}
//             <div>
//               <label className="mb-2 block font-medium">
//                 Ideal For
//               </label>

//               <select
//                 value={idealFor}
//                 onChange={(e) =>
//                   setIdealFor(
//                     e.target.value as
//                       | "Men"
//                       | "Women"
//                       | "Unisex"
//                       | "Kids"
//                       | ""
//                   )
//                 }
//                 className="w-full rounded-xl border px-4 py-3"
//               >
//                 <option value="">Select</option>
//                 <option value="Men">Men</option>
//                 <option value="Women">Women</option>
//                 <option value="Unisex">Unisex</option>
//                 <option value="Kids">Kids</option>
//               </select>
//             </div>

//             {/* INVENTORY */}
//             <div>
//               <div className="mb-3 flex items-center justify-between">
//                 <label className="font-medium">
//                   Inventory
//                 </label>

//                 <button
//                   type="button"
//                   onClick={addInventory}
//                   className="text-sm font-semibold text-blue-600"
//                 >
//                   + Add Size
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {inventory.map(
//                   (item, index) => (
//                     <div
//                       key={index}
//                       className="flex gap-3"
//                     >
//                       <select
//                         value={item.size}
//                         onChange={(e) =>
//                           updateInventory(
//                             index,
//                             "size",
//                             e.target.value
//                           )
//                         }
//                         className="rounded-xl border px-3 py-3"
//                       >
//                         {[
//                           "XS",
//                           "S",
//                           "M",
//                           "L",
//                           "XL",
//                           "XXL",
//                           "XXXL",
//                         ].map((size) => (
//                           <option
//                             key={size}
//                             value={size}
//                           >
//                             {size}
//                           </option>
//                         ))}
//                       </select>

//                       <input
//                         type="number"
//                         min="0"
//                         value={item.stock}
//                         onChange={(e) =>
//                           updateInventory(
//                             index,
//                             "stock",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Stock"
//                         className="flex-1 rounded-xl border px-3 py-3"
//                       />

//                       {inventory.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             removeInventory(index)
//                           }
//                           className="text-red-500"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-between border-t pt-5">
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(1)}
//                 className="rounded-xl border px-6 py-3"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={handleStep2Next}
//                 className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white"
//               >
//                 Next
//               </button>
//             </div>

//           </div>
//         )}

//         {/* ================= STEP 3 ================= */}
//         {currentStep === 3 && (
//           <div className="space-y-6">

//             <div>
//               <p className="text-sm text-blue-600">
//                 Step 3 of 4
//               </p>

//               <h2 className="mt-1 text-xl font-bold">
//                 Add Product Images
//               </h2>
//             </div>

//             <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-10 text-center hover:bg-blue-100">

//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 hidden
//                 onChange={handleImageChange}
//               />

//               <p className="font-semibold text-blue-700">
//                 Click to upload images
//               </p>

//               <p className="mt-1 text-sm text-gray-500">
//                 Maximum 10 images
//               </p>

//             </label>

//             {imagePreviews.length > 0 && (
//               <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                 {imagePreviews.map(
//                   (image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Preview ${index + 1}`}
//                       className="h-32 w-full rounded-xl object-cover"
//                     />
//                   )
//                 )}
//               </div>
//             )}

//             <div className="flex justify-between border-t pt-5">

//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(2)}
//                 disabled={loading}
//                 className="rounded-xl border px-6 py-3"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={handleStep3Next}
//                 disabled={
//                   loading ||
//                   selectedImages.length === 0
//                 }
//                 className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white disabled:bg-gray-300"
//               >
//                 {loading
//                   ? "Creating..."
//                   : "Continue"}
//               </button>

//             </div>

//           </div>
//         )}

//         {/* ================= STEP 4 ================= */}
//         {currentStep === 4 && (
//           <div className="space-y-6">

//             <div>
//               <p className="text-sm text-green-600">
//                 Step 4 of 4
//               </p>

//               <h2 className="mt-1 text-xl font-bold">
//                 Review Product
//               </h2>
//             </div>

//             {/* IMAGES */}
//             <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//               {imagePreviews.map(
//                 (image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt=""
//                     className="h-32 w-full rounded-xl object-cover"
//                   />
//                 )
//               )}
//             </div>

//             {/* DETAILS */}
//             <div className="space-y-4">

//               <div>
//                 <p className="text-sm text-gray-500">
//                   Topic
//                 </p>
//                 <p className="font-semibold">
//                   {topic}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500">
//                   Description
//                 </p>
//                 <p>
//                   {description}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500">
//                   Price
//                 </p>
//                 <p className="font-semibold">
//                   {priceCurrency} {priceAmount}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Category
//                   </p>
//                   <p className="font-medium">
//                     {selectedSubcategory}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Color
//                   </p>
//                   <p className="font-medium">
//                     {color || "—"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Ideal For
//                   </p>
//                   <p className="font-medium">
//                     {idealFor || "—"}
//                   </p>
//                 </div>

//               </div>

//               {/* INVENTORY */}
//               <div>
//                 <p className="mb-2 text-sm text-gray-500">
//                   Inventory
//                 </p>

//                 <div className="space-y-2">
//                   {inventory.map(
//                     (item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between rounded-xl border p-3"
//                       >
//                         <span>
//                           Size {item.size}
//                         </span>

//                         <span className="font-semibold">
//                           {item.stock} units
//                         </span>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>

//             </div>

//             <div className="flex justify-between border-t pt-5">

//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(3)}
//                 className="rounded-xl border px-6 py-3"
//               >
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={onSuccess}
//                 className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white"
//               >
//                 Done
//               </button>

//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   </main>
// );
// }