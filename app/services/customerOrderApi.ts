import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.thover.in/v1/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export type OrderFilter =
  | "All"
  | "Active"
  | "Completed"
  | "Cancelled";

// ==========================================
// GET MY ORDERS
// ==========================================

export const getMyOrders = async (
  status?: OrderFilter
): Promise<any[]> => {
  const response = await axios.get(
    `${API_URL}/order/my-orders`,
    {
      params:
        status && status !== "All"
          ? { status: status.toLowerCase() }
          : undefined,
      headers: getAuthHeaders(),
    }
  );

  const data = response.data;

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data)) return data;

  return [];
};

// ==========================================
// CANCEL ORDER (by customer)
// ==========================================

export const cancelOrder = async (
  orderId: string,
  reason = "Customer cancelled order"
) => {
  const cleanId = orderId.replace("#", "").trim();

  const response = await axios.patch(
    `${API_URL}/order/cancel-by-customer/${cleanId}`,
    { reason },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// ==========================================
// NORMALIZED ORDER (mirrors the mobile app)
// ==========================================

export type StatusTone =
  | "active"
  | "pending"
  | "done"
  | "cancelled";

export interface ParsedOrder {
  id: string;
  rawId: string;
  title: string;
  storeName: string;
  date: string;
  status: string;
  rawStatus: string;
  tone: StatusTone;
  orderType: string;
  price: string;
  unitPrice: string;
  deliveryCharge: string;
  itemCount: string;
  size: string;
  color: string;
  image: string;
  otp: string;
  paymentStatus: string;
  paymentMethod: string;
  address: string;
  cancelledBy: string;
  cancelReason: string;
  cancellable: boolean;
  isCancelled: boolean;
  isCompleted: boolean;
}

const API_ORIGIN = "https://api.thover.in";

const isObj = (v: any): v is Record<string, any> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const str = (v: any) =>
  v === undefined || v === null ? "" : String(v).trim();

const firstFilled = (
  sources: any[],
  keys: string[]
): any => {
  for (const key of keys) {
    for (const src of sources) {
      if (
        isObj(src) &&
        src[key] !== undefined &&
        src[key] !== null &&
        str(src[key]) !== "" &&
        str(src[key]) !== "0"
      ) {
        return src[key];
      }
    }
  }

  return undefined;
};

const formatStatus = (s: string) =>
  s
    .replace(/[_-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (w) =>
        w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(" ") || "Active";

export const formatPrice = (
  val: any,
  fallback = "₹0"
): string => {
  if (val === undefined || val === null) return fallback;

  if (isObj(val)) {
    const amount = firstFilled(
      [val],
      ["grandTotal", "totalPrice", "amount", "value", "price", "cost"]
    );

    return amount !== undefined
      ? formatPrice(amount, fallback)
      : fallback;
  }

  if (typeof val === "number") {
    return `₹${Number.isInteger(val) ? val : val.toFixed(2)}`;
  }

  const s = String(val).trim();

  if (!s || s === "0" || s === "₹0") return fallback;
  if (s.startsWith("₹")) return s;

  const n = parseFloat(s.replace(/[₹,]/g, ""));

  if (!isNaN(n)) {
    return `₹${Number.isInteger(n) ? n : n.toFixed(2)}`;
  }

  return `₹${s}`;
};

const formatDate = (raw: any): string => {
  if (raw === undefined || raw === null || raw === "") {
    return "Recently";
  }

  let d: Date;

  if (typeof raw === "number" || /^\d+$/.test(String(raw))) {
    const n = Number(raw);
    d = new Date(n < 10000000000 ? n * 1000 : n);
  } else {
    d = new Date(raw);
  }

  if (isNaN(d.getTime())) return String(raw);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const extractImage = (sources: any[]): string => {
  const media = firstFilled(sources, [
    "media",
    "mediaUrls",
    "images",
    "image",
    "photo",
    "thumbnail",
    "imageUrl",
    "mediaUrl",
    "productImage",
    "itemImage",
  ]);

  let url = "";

  const fromItem = (item: any) =>
    typeof item === "string"
      ? item
      : isObj(item)
      ? str(
          item.mediaUrl ??
            item.url ??
            item.path ??
            item.secure_url ??
            item.src ??
            item.link
        )
      : "";

  if (Array.isArray(media)) {
    url = media.map(fromItem).find(Boolean) || "";
  } else {
    url = fromItem(media);
  }

  if (url.startsWith("/")) url = API_ORIGIN + url;

  return url;
};

export const parseOrder = (raw: any): ParsedOrder | null => {
  if (!isObj(raw)) return null;

  const ord = isObj(raw.order) ? raw.order : {};
  const firstItem =
    Array.isArray(raw.items) && isObj(raw.items[0])
      ? raw.items[0]
      : {};

  const mongoId = str(raw._id ?? ord._id);
  const orderNumber = str(raw.orderNumber ?? ord.orderNumber);
  const displayId =
    orderNumber ||
    mongoId ||
    str(raw.orderId ?? raw.order_id ?? raw.id) ||
    "THV1000";

  // product / post details
  const pdRaw = isObj(raw.postDetails) ? raw.postDetails : {};
  const pickMap = (...vals: any[]) =>
    vals.find((v) => isObj(v)) || {};

  const post: Record<string, any> = isObj(raw.postDetails)
    ? pickMap(
        pdRaw.postId,
        pdRaw.post,
        pdRaw.product,
        pdRaw.productId,
        pdRaw
      )
    : pickMap(
        isObj(raw.productDetails)
          ? raw.productDetails.productId ??
              raw.productDetails.postId ??
              raw.productDetails
          : null,
        raw.post,
        raw.postId,
        raw.product,
        raw.productId,
        raw.item?.post,
        raw.item?.product,
        firstItem.postDetails?.postId,
        firstItem.postDetails,
        firstItem.post,
        firstItem.product,
        firstItem.postId,
        firstItem.productId,
        firstItem,
        ord.postDetails?.postId,
        ord.post,
        ord.product
      );

  const sources = [post, raw, firstItem, ord];

  const title =
    str(
      firstFilled(sources, [
        "topic",
        "title",
        "name",
        "productName",
        "orderName",
        "itemName",
        "subCategory",
        "category",
      ])
    ) || "Order Item";

  // store
  const storeMap = pickMap(raw.storeId, raw.store);
  const storeName =
    str(
      storeMap.storeName ??
        storeMap.businessName ??
        storeMap.name ??
        storeMap.shopName
    ) ||
    str(
      firstFilled(
        [
          raw,
          raw.store,
          raw.seller,
          raw.vendor,
          raw.storeDetails,
          raw.storeDetail,
          post,
        ],
        [
          "storeName",
          "store_name",
          "businessName",
          "business_name",
          "shopName",
          "vendorName",
        ]
      )
    ) ||
    "Thover Store";

  // status
  const rawStatus = str(
    raw.status ?? raw.orderStatus ?? ord.status ?? "Processing"
  );
  const sLower = rawStatus.toLowerCase();

  const cancellation = isObj(raw.cancellation)
    ? raw.cancellation
    : {};

  const isCancelled =
    sLower.includes("cancel") ||
    cancellation.isCancelledByCustomer === true ||
    cancellation.isCancelledByStore === true;

  const isCompleted =
    sLower.includes("deliver") || sLower.includes("complete");

  let tone: StatusTone = "active";

  if (isCompleted) tone = "done";
  else if (
    isCancelled ||
    sLower.includes("failed") ||
    sLower.includes("reject")
  )
    tone = "cancelled";
  else if (
    ["rider", "prepar", "pending", "process", "out_for_delivery", "pickup"].some(
      (k) => sLower.includes(k)
    )
  )
    tone = "pending";

  const cancellable =
    !isCancelled &&
    !["deliver", "complete", "reject", "failed"].some((k) =>
      sLower.includes(k)
    );

  // pricing
  const payment = isObj(raw.paymentDetails)
    ? raw.paymentDetails
    : {};

  const priceRaw =
    firstFilled(
      [raw],
      [
        "grandTotal",
        "totalPrice",
        "totalAmount",
        "orderTotal",
        "finalPrice",
        "finalAmount",
        "paidAmount",
        "amount",
        "price",
      ]
    ) ??
    firstFilled(
      [payment],
      ["grandTotal", "totalAmount", "orderAmount", "amount", "price"]
    ) ??
    firstFilled(
      [firstItem],
      ["totalPrice", "grandTotal", "finalPrice", "discountedPrice", "amount", "price"]
    ) ??
    post.discountedPrice ??
    post.finalPrice ??
    post.sellingPrice ??
    post.price ??
    post.mrp;

  const price = formatPrice(priceRaw);

  const unitRaw =
    pdRaw.currentPricePerQuantity ??
    (isObj(post.price) ? post.price.amount : post.price);

  // quantity
  const qty =
    pdRaw.quantity ??
    raw.quantity ??
    raw.itemCount ??
    raw.itemsCount ??
    (Array.isArray(raw.items) ? raw.items.length : 1);

  // OTP
  const delivery = pickMap(
    raw.deliveryDetail,
    raw.deliveryDetails,
    raw.delivery_detail,
    raw.delivery_details,
    raw.delivery,
    ord.deliveryDetail,
    ord.deliveryDetails
  );

  const otp = str(
    firstFilled(
      [delivery, raw, ord],
      ["otp", "deliveryOtp", "delivery_otp", "orderOtp", "order_otp"]
    )
  );

  // address
  const addr = pickMap(
    raw.customerUserAddress,
    raw.customerAddress,
    raw.deliveryAddress,
    raw.userAddress
  );

  const address = [
    addr.addressLine1 ?? addr.line1 ?? addr.street ?? addr.address,
    addr.addressLine2 ?? addr.line2,
    addr.landmark,
    addr.city,
    addr.state,
    addr.pincode ?? addr.postalCode ?? addr.zipCode,
  ]
    .map(str)
    .filter(Boolean)
    .join(", ");

  // order type
  let orderType = "Standard Delivery";

  if (isObj(raw.homeTrail) && raw.homeTrail.isHomeTrail === true) {
    orderType = "Home Trial";
  } else {
    const t = str(
      raw.orderType ??
        raw.order_type ??
        raw.deliveryType ??
        raw.delivery_type ??
        raw.orderMode ??
        raw.type ??
        ord.orderType ??
        ord.type
    ).replace(/_/g, " ");

    if (t) orderType = t[0].toUpperCase() + t.slice(1);
  }

  return {
    id: displayId.startsWith("#") ? displayId : `#${displayId}`,
    rawId: mongoId || displayId.replace("#", "").trim(),
    title,
    storeName,
    date: formatDate(
      raw.createdAt ?? raw.date ?? raw.orderDate ?? raw.updatedAt
    ),
    status: formatStatus(rawStatus),
    rawStatus,
    tone,
    orderType,
    price,
    unitPrice:
      unitRaw !== undefined && unitRaw !== null
        ? formatPrice(unitRaw, price)
        : price,
    deliveryCharge:
      payment.deliveryCharge !== undefined &&
      payment.deliveryCharge !== null
        ? formatPrice(payment.deliveryCharge, "Free")
        : "Free",
    itemCount: `${qty} ${Number(qty) === 1 ? "Item" : "Items"}`,
    size: str(pdRaw.size ?? raw.size ?? raw.selectedSize ?? post.size),
    color: str(pdRaw.color ?? raw.color ?? raw.selectedColor ?? post.color),
    image: extractImage(sources),
    otp: otp === "null" ? "" : otp,
    paymentStatus: str(
      payment.paymentStatus ?? raw.paymentStatus ?? "pending"
    ),
    paymentMethod: str(
      payment.paymentMethod ?? raw.paymentMethod ?? "Online"
    ),
    address,
    cancelledBy: cancellation.isCancelledByStore === true
      ? "Store"
      : "Customer",
    cancelReason: str(cancellation.reason),
    cancellable,
    isCancelled,
    isCompleted,
  };
};
