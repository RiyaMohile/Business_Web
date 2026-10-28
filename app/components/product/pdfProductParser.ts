// Reads products out of a PDF catalog / price list.
//
// Works best with a table that has a header row (Product Name, Price, Size,
// Stock, ...). Without a header, every line that ends in a price is read as
// "<product name> <price>".

import type { TextItem } from "pdfjs-dist/types/src/display/api";

export interface PdfInventoryItem {
  size: string;
  stock: number;
}

export interface PdfProduct {
  topic: string;
  description: string;
  subCategory: string;
  priceAmount: string;
  priceType: string;
  color: string;
  customColor: string;
  idealFor: string;
  inventory: PdfInventoryItem[];
}

export interface PdfTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

type Column =
  | "topic"
  | "description"
  | "category"
  | "price"
  | "priceType"
  | "color"
  | "idealFor"
  | "size"
  | "stock";

// Order matters: the first match wins, so more specific names come first.
const HEADER_PATTERNS: [Column, RegExp][] = [
  ["priceType", /^(price\s*type|unit|per)$/i],
  ["idealFor", /^(ideal\s*for|gender|for)$/i],
  ["description", /^(desc(ription)?|details?|about)$/i],
  ["category", /^(sub\s*-?\s*category|category|type)$/i],
  ["price", /^(price|mrp|rate|amount|cost|selling\s*price|sp)(\s*\(.*\))?$/i],
  ["color", /^colou?rs?$/i],
  ["size", /^(sizes?|size\s*:\s*stock|sizes?\s*\/\s*stock)$/i],
  ["stock", /^(stock|qty|quantity|inventory|units)$/i],
  ["topic", /^(product(\s*name)?|item(\s*name)?|name|title|particulars)$/i],
];

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
];

const IDEAL_FOR = ["Everyone", "Newborn", "Boy", "Girl", "Unisex", "Women", "Men"];

const PRICE_PATTERN = /(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{2,3})+|\d+)(\.\d{1,2})?\s*\/?-?$/i;

// ==========================================
// LOAD PDF TEXT
// ==========================================

export const readPdfText = async (file: File): Promise<PdfTextItem[][]> => {
  // pdfjs touches browser-only globals on import, so load it on demand.
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;

  const pages: PdfTextItem[][] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    pages.push(
      content.items
        .filter((item): item is TextItem => "str" in item)
        .filter((item) => item.str.trim() !== "")
        .map((item) => ({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
        }))
    );
  }

  await loadingTask.destroy();

  return pages;
};

// ==========================================
// TEXT -> LINES -> CELLS
// ==========================================

interface Cell {
  text: string;
  x: number;
  right: number;
}

// Each line keeps its raw text pieces (`items`) for placing into table
// columns, and `cells` where nearby words are joined into phrases.
interface Line {
  items: Cell[];
  cells: Cell[];
}

const toLines = (items: PdfTextItem[]): Line[] => {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: PdfTextItem[][] = [];

  for (const item of sorted) {
    const line = lines[lines.length - 1];

    if (line && Math.abs(line[0].y - item.y) <= 3) {
      line.push(item);
    } else {
      lines.push([item]);
    }
  }

  const clean = (cells: Cell[]) =>
    cells
      .map((cell) => ({ ...cell, text: cell.text.replace(/\s+/g, " ").trim() }))
      .filter((cell) => cell.text !== "");

  return lines.map((line) => {
    const raw = line
      .sort((a, b) => a.x - b.x)
      .map((item) => ({ text: item.str, x: item.x, right: item.x + item.width }));

    const cells: Cell[] = [];

    for (const item of raw) {
      const last = cells[cells.length - 1];

      // Words closer than a few points belong to the same phrase.
      if (last && item.x - last.right < 6) {
        const gap = item.x - last.right > 1 ? " " : "";
        last.text += gap + item.text;
        last.right = item.right;
      } else {
        cells.push({ ...item });
      }
    }

    return { items: clean(raw), cells: clean(cells) };
  });
};

// ==========================================
// FIELD NORMALISERS
// ==========================================

const matchOption = (value: string, options: string[]) =>
  options.find((option) => option.toLowerCase() === value.trim().toLowerCase());

const parsePrice = (value: string) => {
  const match = value.replace(/\s+/g, " ").trim().match(PRICE_PATTERN);

  if (!match) return "";

  return `${match[1].replace(/,/g, "")}${match[2] || ""}`;
};

const normaliseSize = (value: string) => {
  const cleaned = value.trim();

  if (/^free\s*-?\s*size$/i.test(cleaned)) return "Free Size";

  return matchOption(cleaned, STANDARD_SIZES) || cleaned;
};

const parseInventory = (sizeCell: string, stockCell: string): PdfInventoryItem[] => {
  const split = (value: string) =>
    value
      .split(/[,/|;]/)
      .map((part) => part.trim())
      .filter(Boolean);

  const sizes = split(sizeCell);
  const stocks = split(stockCell).map((part) => Number(part.replace(/[^\d]/g, "")) || 0);

  if (sizes.length === 0) {
    return [{ size: "", stock: stocks.reduce((sum, stock) => sum + stock, 0) }];
  }

  return sizes.map((part, index) => {
    // "M:10", "M - 10", "M(10)"
    const withStock = part.match(/^(.+?)\s*[:\-(]\s*(\d+)\s*\)?$/);

    if (withStock) {
      return { size: normaliseSize(withStock[1]), stock: Number(withStock[2]) };
    }

    const stock =
      stocks.length === sizes.length ? stocks[index] : stocks.length === 1 ? stocks[0] : 0;

    return { size: normaliseSize(part), stock };
  });
};

const toProduct = (
  fields: Partial<Record<Column, string>>,
  subcategories: string[]
): PdfProduct => {
  const colorText = (fields.color || "").trim();
  const knownColor = matchOption(colorText, COLORS);
  const isMulti = /^multi(\s*-?\s*colou?r)?$/i.test(colorText);

  const priceTypeText = (fields.priceType || "").toLowerCase();

  return {
    topic: (fields.topic || "").trim(),
    description: (fields.description || "").trim(),
    subCategory: matchOption(fields.category || "", subcategories) || "",
    priceAmount: parsePrice(fields.price || ""),
    priceType: priceTypeText.includes("set")
      ? "per_set"
      : priceTypeText.includes("piece") || priceTypeText.includes("pc")
        ? "per_piece"
        : "",
    color: knownColor || (isMulti ? "multi" : colorText ? "custom" : ""),
    customColor: !knownColor && !isMulti ? colorText : "",
    idealFor: matchOption(fields.idealFor || "", IDEAL_FOR) || "",
    inventory: parseInventory(fields.size || "", fields.stock || ""),
  };
};

// ==========================================
// TABLE PARSING (HEADER ROW)
// ==========================================

const detectHeader = (cells: Cell[]) => {
  const columns: { column: Column; x: number }[] = [];

  for (const cell of cells) {
    const match = HEADER_PATTERNS.find(([, pattern]) => pattern.test(cell.text.trim()));

    if (match && !columns.some((c) => c.column === match[0])) {
      columns.push({ column: match[0], x: cell.x });
    }
  }

  const hasName = columns.some((c) => c.column === "topic");
  const hasPrice = columns.some((c) => c.column === "price");

  return hasName && hasPrice ? columns.sort((a, b) => a.x - b.x) : null;
};

const columnFor = (cell: Cell, columns: { column: Column; x: number }[]) => {
  // A cell belongs to the right-most column that starts at or before it.
  let found = columns[0].column;

  for (const { column, x } of columns) {
    if (cell.x >= x - 8) found = column;
  }

  return found;
};

// Tight tables can hand us "Free size 25" as one piece even though it spans
// the Size and Stock columns. Split it at the space nearest each column start.
const splitAtColumns = (cell: Cell, columns: { x: number }[]): Cell[] => {
  const charWidth = (cell.right - cell.x) / Math.max(cell.text.length, 1);

  for (const { x } of columns) {
    if (cell.x < x - 8 && cell.right > x + 8) {
      const target = Math.round((x - cell.x) / charWidth);
      const spaces = [...cell.text.matchAll(/ /g)].map((m) => m.index ?? 0);

      if (spaces.length === 0) continue;

      const at = spaces.reduce((best, i) =>
        Math.abs(i - target) < Math.abs(best - target) ? i : best
      );

      const left = { text: cell.text.slice(0, at), x: cell.x, right: cell.x + at * charWidth };
      const right = { text: cell.text.slice(at + 1), x: left.right + charWidth, right: cell.right };

      return [left, ...splitAtColumns(right, columns)];
    }
  }

  return [cell];
};

const parseTable = (lines: Line[], subcategories: string[]) => {
  const products: PdfProduct[] = [];
  let columns: { column: Column; x: number }[] | null = null;
  let current: Partial<Record<Column, string>> | null = null;

  const flush = () => {
    if (current?.topic && parsePrice(current.price || "")) {
      products.push(toProduct(current, subcategories));
    }
    current = null;
  };

  for (const line of lines) {
    const header = detectHeader(line.cells);

    // Header row (also repeated at the top of later pages).
    if (header) {
      flush();
      columns = header;
      continue;
    }

    if (!columns) continue;

    const row: Partial<Record<Column, string>> = {};

    for (const cell of line.items.flatMap((item) => splitAtColumns(item, columns!))) {
      const column = columnFor(cell, columns);
      row[column] = row[column] ? `${row[column]} ${cell.text}` : cell.text;
    }

    if (row.topic && parsePrice(row.price || "")) {
      flush();
      current = row;
    } else if (current) {
      // Wrapped text from the row above (long names / descriptions).
      for (const [column, text] of Object.entries(row) as [Column, string][]) {
        current[column] = current[column] ? `${current[column]} ${text}` : text;
      }
    }
  }

  flush();

  return { products, foundHeader: columns !== null };
};

// ==========================================
// FALLBACK: "NAME .... PRICE" LINES
// ==========================================

const parseLines = (lines: Line[], subcategories: string[]) => {
  const products: PdfProduct[] = [];

  for (const { cells } of lines) {
    const text = cells.map((cell) => cell.text).join(" ");
    const priceMatch = text.match(PRICE_PATTERN);

    if (!priceMatch || priceMatch.index === undefined) continue;

    const name = text
      .slice(0, priceMatch.index)
      .replace(/^\s*\d+[.)]\s*/, "") // "1. ", "2) " serial numbers
      .replace(/[\s.\-–:]+$/, "")
      .trim();

    // Needs real words, not just a total / page number line.
    if (!/[a-z]{2,}/i.test(name) || /^(sub\s*)?total|grand total|page\b/i.test(name)) {
      continue;
    }

    products.push(toProduct({ topic: name, price: priceMatch[0] }, subcategories));
  }

  return products;
};

// ==========================================
// ENTRY POINT
// ==========================================

export const parseProductsFromText = (
  pages: PdfTextItem[][],
  subcategories: string[]
): PdfProduct[] => {
  const lines = pages.flatMap(toLines);

  const table = parseTable(lines, subcategories);

  if (table.foundHeader) return table.products;

  return parseLines(lines, subcategories);
};

export const parseProductsFromPdf = async (
  file: File,
  subcategories: string[]
) => {
  const pages = await readPdfText(file);
  const hasText = pages.some((items) => items.length > 0);

  return {
    hasText,
    products: hasText ? parseProductsFromText(pages, subcategories) : [],
  };
};

// ==========================================
// SAMPLE PDF
// ==========================================

export const SAMPLE_COLUMNS = [
  { title: "Product Name", width: 52 },
  { title: "Description", width: 66 },
  { title: "Category", width: 30 },
  { title: "Price", width: 20 },
  { title: "Price Type", width: 22 },
  { title: "Color", width: 22 },
  { title: "Ideal For", width: 20 },
  { title: "Size", width: 35 },
];

const SAMPLE_ROWS = [
  ["Cotton T-Shirt", "Soft round-neck tee", "T-Shirts", "499", "Per Piece", "Black", "Men", "S:10, M:15, L:8"],
  ["Floral Kurti", "Rayon kurti with print", "Kurtis", "899", "Per Piece", "Pink", "Women", "M:5, L:5"],
  ["Kids Socks Pack", "Pack of 3 pairs", "Accessories", "249", "Per Set", "Multi Color", "Unisex", "Free Size:20"],
];

export const buildSamplePdf = async () => {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Thover - Product Upload Sheet", 14, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(
    "Keep the header row. Size column: SIZE:STOCK separated by commas. Price in INR, numbers only.",
    14,
    22
  );
  doc.setTextColor(0);

  const drawRow = (values: string[], y: number, bold: boolean) => {
    let x = 14;

    doc.setFont("helvetica", bold ? "bold" : "normal");

    values.forEach((value, index) => {
      doc.text(value, x + 2, y);
      x += SAMPLE_COLUMNS[index].width;
    });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 3, x, y + 3);
  };

  drawRow(SAMPLE_COLUMNS.map((column) => column.title), 32, true);

  SAMPLE_ROWS.forEach((row, index) => drawRow(row, 42 + index * 10, false));

  return doc;
};

export const downloadSamplePdf = async () => {
  const doc = await buildSamplePdf();

  doc.save("thover-product-upload-sample.pdf");
};
