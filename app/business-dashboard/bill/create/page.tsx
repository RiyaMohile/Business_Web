"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BillSearch from "../../../components/bill/BillSearch";
import ProductSearchResult from "../../../components/bill/ProductSearchResult";
import BillCart, {
  CartItem,
} from "../../../components/bill/BillCart";
import CustomerDetails from "../../../components/bill/CustomerDetails";
import BillSummary from "../../../components/bill/BillSummary";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import Navbar from "@/app/components/BusinessNavbar";
import MobileDashboardNav from "@/app/components/dashboard/MobileDashboardNav";

import {
  updateStoreOnlineStatus,
  getMyStores,
} from "../../../services/businessStoreApi";

import {
  searchProductByNumber,
  createOfflineBill,
  BillProduct,
} from "../../../services/billApi";
import domtoimage from "dom-to-image-more";

export default function BillPage() {
  // ==========================================
  // STATES
  // ==========================================

  const [selectedProduct, setSelectedProduct] =
    useState<BillProduct | null>(null);

  const [cart, setCart] =
    useState<CartItem[]>([]);

    const [generatedBill, setGeneratedBill] = useState<{
  items: CartItem[];
  customerPhone: string;
  subtotal: number;
  grandTotal: number;
  billNo?: string;
} | null>(null);

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isSearching, setIsSearching] =
    useState(false);

  const [searchError, setSearchError] =
    useState("");

  // ==========================================
  // ONLINE / OFFLINE
  // ==========================================

  const [isOnline, setIsOnline] =
    useState(false);

  const [storeName, setStoreName] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);



  // ==========================================
  // GET SELECTED STORE STATUS
  // ==========================================

  const fetchSelectedStoreStatus =
    async () => {
      try {
        const selectedStoreId =
          localStorage.getItem(
            "selectedStoreId"
          );

        if (!selectedStoreId) {
          setIsOnline(false);
          setStoreName("");
          return;
        }

        const data =
          await getMyStores();

        if (
          !data?.success ||
          !Array.isArray(data?.stores)
        ) {
          setIsOnline(false);
          setStoreName("");
          return;
        }

        const selectedStore =
          data.stores.find(
            (store: any) =>
              String(store._id) ===
              String(selectedStoreId)
          );

        setIsOnline(
          selectedStore?.isOnline ??
            false
        );

        setStoreName(
          selectedStore?.storeName ||
            selectedStore?.name ||
            ""
        );
      } catch (error: any) {
        console.error(
          "FETCH STORE ONLINE STATUS ERROR:",
          error?.response?.data ||
            error?.message
        );

        setIsOnline(false);
      }
    };

  // ==========================================
  // ONLINE / OFFLINE UPDATE
  // ==========================================

  const handleOnlineStatusChange =
    async (
      nextStatus: boolean
    ) => {
      const selectedStoreId =
        localStorage.getItem(
          "selectedStoreId"
        );

      if (!selectedStoreId) {
        alert("Store not found");
        return;
      }

      try {
        setUpdatingStatus(true);

        const response =
          await updateStoreOnlineStatus(
            selectedStoreId,
            nextStatus
          );

        console.log(
          "ONLINE STATUS RESPONSE:",
          response
        );

        if (response?.success) {
          setIsOnline(nextStatus);
        } else {
          alert(
            response?.message ||
              "Unable to update store status"
          );
        }
      } catch (error: any) {
        console.error(
          "UPDATE ONLINE STATUS ERROR:",
          error?.response?.data ||
            error?.message
        );

        alert(
          error?.response?.data
            ?.message ||
            "Unable to update store status"
        );
      } finally {
        setUpdatingStatus(false);
      }
    };

  // ==========================================
  // INITIAL STORE STATUS
  // ==========================================

  useEffect(() => {
    fetchSelectedStoreStatus();
  }, []);

  // ==========================================
  // STORE CHANGE LISTENER
  // ==========================================

  useEffect(() => {
    const handleStoreChange = () => {
      fetchSelectedStoreStatus();

      // Previous search result clear
      setSelectedProduct(null);

      // Search error clear
      setSearchError("");
    };

    window.addEventListener(
      "selectedStoreChanged",
      handleStoreChange
    );

    return () => {
      window.removeEventListener(
        "selectedStoreChanged",
        handleStoreChange
      );
    };
  }, []);


  const handleGenerateBill = async () => {
  // ==========================================
  // VALIDATION
  // ==========================================

  if (cart.length === 0) {
    alert("Please add at least one product.");
    return false;
  }

  const selectedStoreId =
    localStorage.getItem("selectedStoreId");

  if (!selectedStoreId) {
    alert("Store not found.");
    return false;
  }

  // ==========================================
  // START LOADING
  // ==========================================

  try {
    setIsGenerating(true);

   // ========================================
// PREPARE PRODUCTS
// ========================================

const products = cart.map((item) => ({
  postId: item._id,
  quantity: item.quantity,
  size: item.size || null,
}));

    // ========================================
    // CREATE BILL
    // ========================================

    const response = await createOfflineBill({
      storeId: selectedStoreId,

      customerPhone:
        customerPhone.trim() || null,

      products,
    });

    // ========================================
    // SUCCESS
    // ========================================

 if (response?.success) {
  console.log(
    "BILL CREATED:",
    response.bill
  );

  // Save generated bill data before clearing cart
  setGeneratedBill({
    items: [...cart],
    customerPhone: customerPhone.trim(),
    subtotal,
    grandTotal,
    billNo: response.bill?.billNo,
  });

  setCart([]);
  setCustomerPhone("");

  return true;
} else {
  alert(
    response?.message ||
      "Unable to generate bill."
  );

  return false;
}

  } catch (error: any) {
    console.error(
      "GENERATE BILL ERROR:",
      error
    );

    alert(
      error?.message ||
        "Unable to generate bill."
    );
    return false;
  } finally {
    setIsGenerating(false);
  }
};
  // ==========================================
  // SEARCH PRODUCT BY PRODUCT NUMBER
  // ==========================================

  const handleProductSearch =
    async (value: string) => {
      const productNumber =
        value.trim().toUpperCase();

      if (!productNumber) {
        return;
      }

      try {
        setIsSearching(true);
        setSearchError("");
        setSelectedProduct(null);

        const storeId =
          localStorage.getItem(
            "selectedStoreId"
          );

        if (!storeId) {
          setSearchError(
            "Please select a store first."
          );
          return;
        }

        const response =
          await searchProductByNumber(
            productNumber,
            storeId
          );

        console.log(
          "SEARCH PRODUCT RESPONSE:",
          response
        );

        if (
          response?.success &&
          response?.data
        ) {
          setSelectedProduct(
            response.data
          );
        } else {
          setSearchError(
            response?.message ||
              "Product not found."
          );
        }
      } catch (error: any) {
        console.error(
          "PRODUCT SEARCH ERROR:",
          error
        );

        setSearchError(
          error?.message ||
            "Unable to search product."
        );
      } finally {
        setIsSearching(false);
      }
    };

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

const handleAddToCart = (
  product: BillProduct,
  selectedSize: string
) => {
  // Selected size ka inventory
  const selectedInventory = product.inventory?.find(
    (item) => item.size === selectedSize
  );

  const stock = selectedInventory?.stock ?? 0;

  // Size required hai agar multiple sizes hain
  if (
    product.inventory &&
    product.inventory.length > 1 &&
    !selectedSize
  ) {
    alert("Please select a size.");
    return;
  }

  if (stock <= 0) {
    alert("Selected size is out of stock.");
    return;
  }

  setCart((previousCart) => {
    // Same product + same size
    const existingItem = previousCart.find(
      (item) =>
        item._id === product._id &&
        item.size === selectedSize
    );

    // Already in cart
    if (existingItem) {
      if (existingItem.quantity >= stock) {
        alert(
          "You cannot add more than available inventory."
        );

        return previousCart;
      }

      return previousCart.map((item) =>
        item._id === product._id &&
        item.size === selectedSize
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    }

    // New product
    return [
      ...previousCart,
      {
        ...product,
        quantity: 1,
        size: selectedSize || null,
      },
    ];
  });

  // Hide product result after adding
  setSelectedProduct(null);
};

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const handleUpdateQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      setCart((previousCart) =>
        previousCart.filter(
          (item) =>
            item._id !== productId
        )
      );

      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) => {
        if (
          item._id !== productId
        ) {
          return item;
        }

        const maxStock =
          item.totalStock ?? 0;

        if (
          quantity > maxStock
        ) {
          alert(
            `Only ${maxStock} units available.`
          );

          return item;
        }

        return {
          ...item,
          quantity,
        };
      })
    );
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const handleRemoveProduct = (
    productId: string
  ) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          item._id !== productId
      )
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const handleClearCart = () => {
    setCart([]);
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => {
        const price =
          item.price?.amount ?? 0;

        return (
          total +
          price * item.quantity
        );
      },
      0
    );
  }, [cart]);

  const grandTotal = subtotal;

const handlePrintBill = () => {
  if (!generatedBill) {
    alert("Please generate a bill first.");
    return;
  }

  window.print();
};

// ==========================================
// SEND BILL IMAGE TO WHATSAPP
// ==========================================

const handleSendWhatsApp = async () => {
  if (!generatedBill) {
    alert("Please generate a bill first.");
    return;
  }

  const phone = generatedBill.customerPhone;

  if (!phone) {
    alert("Please enter customer phone number.");
    return;
  }

  const digits = phone.replace(/\D/g, "");

  const whatsappPhone =
    digits.length === 10
      ? `91${digits}`
      : digits;

  const billElement =
  document.querySelector(
    ".print-bill"
  ) as HTMLElement | null;

if (!billElement) {
  alert("Bill not found.");
  return;
}

try {
  billElement.style.display = "block";

  // ==========================================
  // CREATE BILL IMAGE
  // ==========================================

  const dataUrl =
    await domtoimage.toPng(
      billElement,
      {
        bgcolor: "#ffffff",
        quality: 1,
        cacheBust: true,
        width: 700,
        height: billElement.scrollHeight,
        style: {
          background: "#ffffff",
        },
      }
    );
    // ==========================================
    // CONVERT DATA URL TO FILE
    // ==========================================

    const response =
      await fetch(dataUrl);

    const blob =
      await response.blob();

    const file = new File(
      [
        blob,
      ],
      `Bill-${
        generatedBill.billNo || "Bill"
      }.png`,
      {
        type: "image/png",
      }
    );

    // ==========================================
    // SHARE IMAGE
    // ==========================================

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      await navigator.share({
        title: "Bill",
        text: "Your bill",
        files: [file],
      });

      return;
    }

    // ==========================================
    // DESKTOP FALLBACK
    // ==========================================

    const imageUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = imageUrl;

    link.download =
      `Bill-${
        generatedBill.billNo || "Bill"
      }.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(imageUrl);

    window.open(
      `https://wa.me/${whatsappPhone}`,
      "_blank"
    );

    alert(
      "Bill image downloaded. Please attach it in WhatsApp."
    );

  } catch (error) {
    console.error(
      "WHATSAPP BILL IMAGE ERROR:",
      error
    );

    alert(
      "Unable to create bill image."
    );
  }
};

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-[100dvh] bg-slate-50">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <Navbar
        onAccountModalChange={() => {}}
        isOnline={isOnline}
        onOnlineStatusChange={
          handleOnlineStatusChange
        }
        updatingStatus={
          updatingStatus
        }
      />

      {/* ========================================
          DESKTOP SIDEBAR
      ======================================== */}

      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* ========================================
          MAIN
      ======================================== */}

      <main
        className="
          min-h-[100dvh]
          bg-slate-50
          px-3
          pb-24
          pt-20
          md:ml-[248px]
          md:min-h-[calc(100dvh-80px)]
          md:w-[calc(100%-248px)]
          md:px-10
          md:pb-10
          md:pt-28
        "
      >

        {/* MOBILE NAV */}

        <div className="md:hidden">
          <MobileDashboardNav />
        </div>

        <div className="mx-auto w-full max-w-7xl">

          {/* HEADER */}

          <div className="mb-5 mt-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Create Bill
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Search products, add them to
              the cart, and generate a bill
              for your customer.
            </p>
          </div>

          {/* MAIN GRID */}

          <div
            className="
              grid
              grid-cols-1
              gap-5
              xl:grid-cols-[1.4fr_1fr]
            "
          >

            {/* ==================================
                LEFT SIDE
            ================================== */}

            <section className="min-w-0">

              {/* SEARCH */}

              <BillSearch
                onSearch={
                  handleProductSearch
                }
                loading={
                  isSearching
                }
              />

              {/* ERROR */}

              {searchError && (
                <div
                  className="
                    mt-4 rounded-xl
                    border border-red-200
                    bg-red-50
                    px-4 py-3
                    text-sm text-red-600
                  "
                >
                  {searchError}
                </div>
              )}

              {/* PRODUCT RESULT */}

              {selectedProduct && (
                <div className="mt-4">
                  <ProductSearchResult
                    product={
                      selectedProduct
                    }
                    onAddToCart={
                      handleAddToCart
                    }
                  />
                </div>
              )}

              {/* EMPTY SEARCH */}

              {!selectedProduct &&
                !searchError && (
                  <div
                    className="
                      mt-4
                      flex min-h-[220px]
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-300
                      bg-white
                      px-6 py-12
                      text-center
                    "
                  >
                    <div
                      className="
                        flex h-14 w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-50
                        text-xl
                      "
                    >
                      🔍
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-700">
                      Search for a product
                    </h3>

                    <p className="mt-1 max-w-md text-xs text-slate-400">
                      Enter the product number
                      above to find the product
                      and add it to the bill.
                    </p>
                  </div>
                )}

              {/* CART */}

              <div className="mt-4">
                <BillCart
                  cart={cart}
                  onUpdateQuantity={
                    handleUpdateQuantity
                  }
                  onRemove={
                    handleRemoveProduct
                  }
                  onClear={
                    handleClearCart
                  }
                />
              </div>
            </section>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <section className="min-w-0">

              {/* CUSTOMER */}

              <CustomerDetails
                phone={customerPhone}
                onPhoneChange={
                  setCustomerPhone
                }
              />

              {/* SUMMARY */}

              <div className="mt-4">
                <BillSummary
                  totalItems={
                    totalItems
                  }
                  subtotal={
                    subtotal
                  }
                  isGenerating={
                    isGenerating
                  }
                  disabled={
                    cart.length === 0
                  }
                  onGenerateBill={
                    handleGenerateBill
                  }
                  onPrintBill={
                    handlePrintBill
                  }
                  onSendWhatsApp={
                    handleSendWhatsApp
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="print-bill">
  <div className="print-bill__store">
    {storeName || "Store"}
  </div>

  <div className="print-bill__title">
    BILL
  </div>

  <div className="print-bill__divider" />

  <table className="print-bill__table">
    <thead>
      <tr>
        <th>#</th>
        <th>Product Name</th>
        <th>Size</th>
        <th>Qty</th>
      </tr>
    </thead>

    <tbody>
      {generatedBill?.items.map((item, index) => (
        <tr key={`${item._id}-${index}`}>
          <td>{index + 1}</td>

          <td>{item.topic}</td>

          <td>{item.size || "-"}</td>

          <td>{item.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="print-bill__total">
  <div className="print-bill__grand-total">
    <span>Grand Total</span>

    <strong>
      ₹{generatedBill?.grandTotal.toFixed(2) ?? "0.00"}
    </strong>
  </div>
</div>
</div>


    </div>
  );
}
