import { useState } from "react";
import { ImageIcon, X, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ProductFormData,
  Specification,
} from "@/lib/validations/product-schema";
import Image from "next/image";

interface DetailsStepProps {
  product: ProductFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<ProductFormData>) => void;
  onValidate: () => void;
  onBack: () => void;
}

// Predefined options
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
const colorOptions = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Gray",
] as const;

const translations = {
  en: {
    productDetails: "Product Details",
    productTitle: "Product Title",
    productTitleEn: "Product Title (English)",
    productTitleAr: "Product Title (Arabic)",
    enterProductTitleEn: "Enter product title in English",
    enterProductTitleAr: "Enter product title in Arabic",
    productDescription: "Product Description",
    productDescriptionEn: "Product Description (English)",
    productDescriptionAr: "Product Description (Arabic)",
    enterDescriptionEn: "Enter detailed product description in English...",
    enterDescriptionAr: "Enter detailed product description in Arabic...",
    keyFeatures: "Key Features",
    keyFeaturesEn: "Key Features (English)",
    keyFeaturesAr: "Key Features (Arabic)",
    addFeatureEn: "Add a feature in English",
    addFeatureAr: "Add a feature in Arabic",
    add: "Add",
    deliveryInfo: "Delivery Information",
    deliveryTime: "Delivery Time",
    deliveryPlaceholder: "e.g. 3-5 business days",
    productHighlights: "Product Highlights",
    productHighlightsEn: "Product Highlights (English)",
    productHighlightsAr: "Product Highlights (Arabic)",
    addHighlightEn: "Add a highlight in English",
    addHighlightAr: "Add a highlight in Arabic",
    pricing: "Pricing",
    price: "Price ($)",
    salePrice: "Sale Price ($) (Optional)",
    saleStart: "Sale Start Date (Optional)",
    saleEnd: "Sale End Date (Optional)",
    inventoryWeight: "Inventory & Weight",
    stockQuantity: "Stock Quantity",
    weight: "Weight (kg)",
    sizes: "Sizes",
    colors: "Colors",
    specifications: "Specifications",
    specKeyPlaceholderEn: "Key (e.g., Material) - English",
    specKeyPlaceholderAr: "Key (e.g., Material) - Arabic",
    specValuePlaceholderEn: "Value (e.g., Cotton) - English",
    specValuePlaceholderAr: "Value (e.g., Cotton) - Arabic",
    productImages: "Product Images",
    clickToUpload: "Click or drag to upload",
    maxImages: "Max 10 images • JPG, PNG, WebP",
    back: "Back",
    remove: "Remove",
  },
  ar: {
    productDetails: "تفاصيل المنتج",
    productTitle: "عنوان المنتج",
    productTitleEn: "عنوان المنتج (الإنجليزية)",
    productTitleAr: "عنوان المنتج (العربية)",
    enterProductTitleEn: "أدخل عنوان المنتج باللغة الإنجليزية",
    enterProductTitleAr: "أدخل عنوان المنتج باللغة العربية",
    productDescription: "وصف المنتج",
    productDescriptionEn: "وصف المنتج (الإنجليزية)",
    productDescriptionAr: "وصف المنتج (العربية)",
    enterDescriptionEn: "أدخل وصف مفصل للمنتج باللغة الإنجليزية...",
    enterDescriptionAr: "أدخل وصف مفصل للمنتج باللغة العربية...",
    keyFeatures: "الميزات الرئيسية",
    keyFeaturesEn: "الميزات الرئيسية (الإنجليزية)",
    keyFeaturesAr: "الميزات الرئيسية (العربية)",
    addFeatureEn: "أضف ميزة باللغة الإنجليزية",
    addFeatureAr: "أضف ميزة باللغة العربية",
    add: "إضافة",
    deliveryInfo: "معلومات التوصيل",
    deliveryTime: "وقت التوصيل",
    deliveryPlaceholder: "مثال: 3-5 أيام عمل",
    productHighlights: "أبرز ميزات المنتج",
    productHighlightsEn: "أبرز ميزات المنتج (الإنجليزية)",
    productHighlightsAr: "أبرز ميزات المنتج (العربية)",
    addHighlightEn: "أضف نقطة بارزة باللغة الإنجليزية",
    addHighlightAr: "أضف نقطة بارزة باللغة العربية",
    pricing: "التسعير",
    price: "السعر ($)",
    salePrice: "سعر البيع ($) (اختياري)",
    saleStart: "تاريخ بدء البيع (اختياري)",
    saleEnd: "تاريخ انتهاء البيع (اختياري)",
    inventoryWeight: "المخزون والوزن",
    stockQuantity: "الكمية المتاحة",
    weight: "الوزن (كجم)",
    sizes: "المقاسات",
    colors: "الألوان",
    specifications: "المواصفات",
    specKeyPlaceholderEn: "المفتاح (مثال: المادة) - الإنجليزية",
    specKeyPlaceholderAr: "المفتاح (مثال: المادة) - العربية",
    specValuePlaceholderEn: "القيمة (مثال: قطن) - الإنجليزية",
    specValuePlaceholderAr: "القيمة (مثال: قطن) - العربية",
    productImages: "صور المنتج",
    clickToUpload: "انقر أو اسحب للتحميل",
    maxImages: "10 صور كحد أقصى • JPG, PNG, WebP",
    back: "رجوع",
    remove: "إزالة",
  },
};

export const DetailsStep = ({
  product,
  errors,
  onUpdate,
  onBack,
}: DetailsStepProps) => {
  const { language } = useLanguage();
  const [newFeatureEn, setNewFeatureEn] = useState("");
  const [newFeatureAr, setNewFeatureAr] = useState("");
  const [newHighlightEn, setNewHighlightEn] = useState("");
  const [newHighlightAr, setNewHighlightAr] = useState("");
  const [newSpec, setNewSpec] = useState<Specification>({
    key: { en: "", ar: "" },
    value: { en: "", ar: "" },
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);

    // limit max images = 10
    const updated = [...(product.images || []), ...newFiles].slice(0, 10);

    // Update parent form state
    onUpdate({ images: updated });
  };

  const handleRemoveImage = (index: number) => {
    const updated = (product.images || []).filter((_, i) => i !== index);
    onUpdate({ images: updated });
  };

  const t = translations[language];

  // Handlers for bilingual features
  const handleAddFeature = (lang: "en" | "ar") => {
    const newFeature = lang === "en" ? newFeatureEn : newFeatureAr;
    if (newFeature.trim()) {
      const currentFeatures = product.features || { en: [], ar: [] };
      onUpdate({
        features: {
          ...currentFeatures,
          [lang]: [...(currentFeatures[lang] || []), newFeature.trim()],
        },
      });
      if (lang === "en") setNewFeatureEn("");
      if (lang === "ar") setNewFeatureAr("");
    }
  };

  const handleRemoveFeature = (index: number, lang: "en" | "ar") => {
    const currentFeatures = product.features || { en: [], ar: [] };
    onUpdate({
      features: {
        ...currentFeatures,
        [lang]: currentFeatures[lang]?.filter((_, i) => i !== index) || [],
      },
    });
  };

  // Handlers for bilingual highlights
  const handleAddHighlight = (lang: "en" | "ar") => {
    const newHighlight = lang === "en" ? newHighlightEn : newHighlightAr;
    if (newHighlight.trim()) {
      const currentHighlights = product.highlights || { en: [], ar: [] };
      onUpdate({
        highlights: {
          ...currentHighlights,
          [lang]: [...(currentHighlights[lang] || []), newHighlight.trim()],
        },
      });
      if (lang === "en") setNewHighlightEn("");
      if (lang === "ar") setNewHighlightAr("");
    }
  };

  const handleRemoveHighlight = (index: number, lang: "en" | "ar") => {
    const currentHighlights = product.highlights || { en: [], ar: [] };
    onUpdate({
      highlights: {
        ...currentHighlights,
        [lang]: currentHighlights[lang]?.filter((_, i) => i !== index) || [],
      },
    });
  };

  // Handlers for bilingual specifications
  const handleAddSpecification = () => {
    if (
      newSpec.key.en &&
      newSpec.value.en &&
      newSpec.key.ar &&
      newSpec.value.ar
    ) {
      onUpdate({
        specifications: [...(product.specifications || []), newSpec],
      });
      setNewSpec({ key: { en: "", ar: "" }, value: { en: "", ar: "" } });
    }
  };

  const handleRemoveSpecification = (index: number) => {
    onUpdate({
      specifications: product.specifications?.filter((_, i) => i !== index),
    });
  };

  const toggleSize = (size: string) => {
    const newSizes = product.sizes?.includes(size)
      ? product.sizes?.filter((s) => s !== size)
      : [...(product.sizes || []), size];
    onUpdate({ sizes: newSizes });
  };

  const toggleColor = (color: string) => {
    const newColors = product.colors?.includes(color)
      ? product.colors?.filter((c) => c !== color)
      : [...(product.colors || []), color];
    onUpdate({ colors: newColors });
  };

  // Helper function to get error with proper styling
  const getErrorClass = (fieldName: string) => {
    return errors[fieldName]
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-green-500";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">{t.productDetails}</h1>

      {/* SKU Display */}
      <div className="mb-6 rounded-md border border-gray-200 p-3">
        <div className="font-mono text-sm font-medium">{product.sku}</div>
      </div>

      {/* Product Title - Bilingual Fields */}
      <h2 className="mb-4 text-xl font-semibold">{t.productTitle}</h2>

      {/* English Title */}
      <div className="mb-4" data-field="title.en">
        <label
          htmlFor="titleEn"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {t.productTitleEn}
        </label>

        <input
          type="text"
          id="titleEn"
          className={`w-full rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("title.en")}`}
          placeholder={t.enterProductTitleEn}
          value={product.title?.en || ""}
          onChange={(e) =>
            onUpdate({
              title: {
                en: e.target.value,
                ar: product.title?.ar || "",
              },
            })
          }
          dir="ltr"
        />

        {errors["title.en"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["title.en"]}
          </div>
        )}
      </div>

      {/* Arabic Title */}
      <div className="mb-6" data-field="title.ar">
        <label
          htmlFor="titleAr"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {t.productTitleAr}
        </label>
        <input
          type="text"
          id="titleAr"
          className={`w-full rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("title.ar")}`}
          placeholder={t.enterProductTitleAr}
          value={product.title?.ar || ""}
          onChange={(e) =>
            onUpdate({
              title: {
                en: product.title?.en || "",
                ar: e.target.value,
              },
            })
          }
        />
        {errors["title.ar"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["title.ar"]}
          </div>
        )}
      </div>

      {/* Product Description - Bilingual Fields */}
      <h2 className="mb-4 text-xl font-semibold">{t.productDescription}</h2>

      {/* English Description */}
      <div className="mb-4" data-field="description.en">
        <label
          htmlFor="descriptionEn"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {t.productDescriptionEn}
        </label>

        <textarea
          id="descriptionEn"
          className={`w-full resize-none rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("description.en")}`}
          rows={4}
          placeholder={t.enterDescriptionEn}
          value={product.description?.en || ""}
          onChange={(e) =>
            onUpdate({
              description: {
                en: e.target.value,
                ar: product.description?.ar || "",
              },
            })
          }
        />
        {errors["description.en"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["description.en"]}
          </div>
        )}
      </div>

      {/* Arabic Description */}
      <div className="mb-6" data-field="description.ar">
        <label
          htmlFor="descriptionAr"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {t.productDescriptionAr}
        </label>

        <textarea
          id="descriptionAr"
          className={`w-full resize-none rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("description.ar")}`}
          rows={4}
          placeholder={t.enterDescriptionAr}
          value={product.description?.ar || ""}
          onChange={(e) =>
            onUpdate({
              description: {
                en: product.description?.en || "",
                ar: e.target.value,
              },
            })
          }
        />
        {errors["description.ar"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["description.ar"]}
          </div>
        )}
      </div>

      {/* Key Features - Bilingual */}
      <h2 className="mb-4 text-xl font-semibold">{t.keyFeatures}</h2>

      {/* English Features */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-gray-700">
          {t.keyFeaturesEn}
        </h3>
        <div className="mb-4 flex">
          <input
            type="text"
            className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={t.addFeatureEn}
            value={newFeatureEn}
            onChange={(e) => setNewFeatureEn(e.target.value)}
            dir="ltr"
          />
          <button
            type="button"
            className="rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => handleAddFeature("en")}
            disabled={!newFeatureEn.trim()}
          >
            {t.add}
          </button>
        </div>
        {(product.features?.en || []).map((feature, index) => (
          <div
            key={`en-${index}`}
            className="mb-2 flex items-center rounded-md border border-gray-200 p-2"
          >
            <div className="flex-grow" dir="ltr">
              {feature}
            </div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleRemoveFeature(index, "en")}
              title={t.remove}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Arabic Features */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-gray-700">
          {t.keyFeaturesAr}
        </h3>
        <div className="mb-4 flex">
          <input
            type="text"
            className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={t.addFeatureAr}
            value={newFeatureAr}
            onChange={(e) => setNewFeatureAr(e.target.value)}
          />
          <button
            type="button"
            className="rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => handleAddFeature("ar")}
            disabled={!newFeatureAr.trim()}
          >
            {t.add}
          </button>
        </div>
        {(product.features?.ar || []).map((feature, index) => (
          <div
            key={`ar-${index}`}
            className="mb-2 flex items-center rounded-md border border-gray-200 p-2"
          >
            <div className="flex-grow">{feature}</div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleRemoveFeature(index, "ar")}
              title={t.remove}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Delivery Information */}
      <h2 className="mb-4 text-xl font-semibold">{t.deliveryInfo}</h2>
      <div className="mb-6">
        <label htmlFor="deliveryTime" className="mb-1 block text-gray-700">
          {t.deliveryTime}
        </label>
        <input
          type="text"
          id="deliveryTime"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={t.deliveryPlaceholder}
          value={product.deliveryTime || ""}
          onChange={(e) => onUpdate({ deliveryTime: e.target.value })}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>

      {/* Product Highlights - Bilingual */}
      <h2 className="mb-4 text-xl font-semibold">{t.productHighlights}</h2>

      {/* English Highlights */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-gray-700">
          {t.productHighlightsEn}
        </h3>
        <div className="mb-4 flex">
          <input
            type="text"
            className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={t.addHighlightEn}
            value={newHighlightEn}
            onChange={(e) => setNewHighlightEn(e.target.value)}
            dir="ltr"
          />
          <button
            type="button"
            className="rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => handleAddHighlight("en")}
            disabled={!newHighlightEn.trim()}
          >
            {t.add}
          </button>
        </div>
        {(product.highlights?.en || []).map((highlight, index) => (
          <div
            key={`en-${index}`}
            className="mb-2 flex items-center rounded-md border border-gray-200 p-2"
          >
            <div className="flex-grow" dir="ltr">
              {highlight}
            </div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleRemoveHighlight(index, "en")}
              title={t.remove}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Arabic Highlights */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-gray-700">
          {t.productHighlightsAr}
        </h3>
        <div className="mb-4 flex">
          <input
            type="text"
            className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={t.addHighlightAr}
            value={newHighlightAr}
            onChange={(e) => setNewHighlightAr(e.target.value)}
          />
          <button
            type="button"
            className="rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => handleAddHighlight("ar")}
            disabled={!newHighlightAr.trim()}
          >
            {t.add}
          </button>
        </div>
        {(product.highlights?.ar || []).map((highlight, index) => (
          <div
            key={`ar-${index}`}
            className="mb-2 flex items-center rounded-md border border-gray-200 p-2"
          >
            <div className="flex-grow" dir="rtl">
              {highlight}
            </div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleRemoveHighlight(index, "ar")}
              title={t.remove}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <h2 className="mb-4 text-xl font-semibold">{t.pricing}</h2>

      <div className="mb-4" data-field="del_price">
        <label htmlFor="del_price" className="mb-1 block text-gray-700">
          {t.price}
        </label>
        <input
          type="number"
          id="del_price"
          className={`w-full rounded-md border p-2 focus:outline-none focus:ring-2 ${getErrorClass("del_price")}`}
          placeholder="e.g. 99.99"
          value={product.del_price ?? ""}
          onChange={(e) =>
            onUpdate({ del_price: parseFloat(e.target.value) || undefined })
          }
          step="0.01"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        {errors["del_price"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["del_price"]}
          </div>
        )}
      </div>

      {/* Sale Price and Dates */}
      <div className="mb-4">
        <label htmlFor="price" className="mb-1 block text-gray-700">
          {t.salePrice}
        </label>
        <input
          type="number"
          id="price"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g. 79.99"
          value={product.price ?? ""}
          onChange={(e) =>
            onUpdate({ price: parseFloat(e.target.value) || undefined })
          }
          step="0.01"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="saleStart" className="mb-1 block text-gray-700">
            {t.saleStart}
          </label>
          <input
            type="date"
            id="saleStart"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={product.saleStart || ""}
            onChange={(e) => onUpdate({ saleStart: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="saleEnd" className="mb-1 block text-gray-700">
            {t.saleEnd}
          </label>
          <input
            type="date"
            id="saleEnd"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={product.saleEnd || ""}
            onChange={(e) => onUpdate({ saleEnd: e.target.value })}
          />
        </div>
      </div>

      {/* Inventory & Weight */}
      <h2 className="mb-4 text-xl font-semibold">{t.inventoryWeight}</h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="stock" className="mb-1 block text-gray-700">
            {t.stockQuantity}
          </label>
          <input
            type="number"
            id="stock"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. 100"
            value={product.stock ?? ""}
            onChange={(e) =>
              onUpdate({ stock: parseInt(e.target.value, 10) || undefined })
            }
            dir={language === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <div>
          <label htmlFor="weightKg" className="mb-1 block text-gray-700">
            {t.weight}
          </label>
          <input
            type="number"
            id="weightKg"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. 1.5"
            value={product.weightKg ?? ""}
            onChange={(e) =>
              onUpdate({ weightKg: parseFloat(e.target.value) || undefined })
            }
            step="0.01"
            dir={language === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>

      {/* Sizes */}
      <h2 className="mb-4 text-xl font-semibold">{t.sizes}</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        {sizeOptions.map((size) => (
          <button
            type="button"
            key={size}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
              product.sizes?.includes(size)
                ? "bg-green-600 text-white"
                : "border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => toggleSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Colors */}
      <h2 className="mb-4 text-xl font-semibold">{t.colors}</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            type="button"
            key={color}
            style={{ backgroundColor: color }}
            className={`relative h-8 w-8 overflow-hidden rounded-full border border-gray-300 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 sm:h-10 sm:w-10 ${
              product.colors?.includes(color) ? "scale-110" : ""
            }`}
            onClick={() => toggleColor(color)}
          >
            {product.colors?.includes(color) && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <Check size={15} className="text-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Specifications - Bilingual */}
      <h2 className="mb-4 text-xl font-semibold">{t.specifications}</h2>
      <div className="mb-6">
        <div className="mb-4 grid gap-4">
          {/* English Specification */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">English</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t.specKeyPlaceholderEn}
                value={newSpec.key.en || ""}
                onChange={(e) =>
                  setNewSpec({
                    ...newSpec,
                    key: { ...newSpec.key, en: e.target.value },
                  })
                }
                dir="ltr"
              />
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t.specValuePlaceholderEn}
                value={newSpec.value.en || ""}
                onChange={(e) =>
                  setNewSpec({
                    ...newSpec,
                    value: { ...newSpec.value, en: e.target.value },
                  })
                }
                dir="ltr"
              />
            </div>
          </div>

          {/* Arabic Specification */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">العربية</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t.specKeyPlaceholderAr}
                value={newSpec.key.ar || ""}
                onChange={(e) =>
                  setNewSpec({
                    ...newSpec,
                    key: { ...newSpec.key, ar: e.target.value },
                  })
                }
              />
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t.specValuePlaceholderAr}
                value={newSpec.value.ar || ""}
                onChange={(e) =>
                  setNewSpec({
                    ...newSpec,
                    value: { ...newSpec.value, ar: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleAddSpecification}
          disabled={
            !newSpec.key.en ||
            !newSpec.value.en ||
            !newSpec.key.ar ||
            !newSpec.value.ar
          }
        >
          {t.add} Specification
        </button>

        {product.specifications?.map((spec, index) => (
          <div
            key={index}
            className="mt-4 rounded-md border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2">
                  <strong className="text-gray-700">English:</strong>
                  <div className="mt-1" dir="ltr">
                    <span className="font-medium">{spec.key.en}:</span>{" "}
                    {spec.value.en}
                  </div>
                </div>
                <div>
                  <strong className="text-gray-700">العربية:</strong>
                  <div className="mt-1" dir="rtl">
                    <span className="font-medium">{spec.key.ar}:</span>{" "}
                    {spec.value.ar}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => handleRemoveSpecification(index)}
                title={t.remove}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Images */}
      <h2 className="mb-4 text-xl font-semibold">{t.productImages}</h2>
      <div className="mb-6">
        <label
          htmlFor="imageUpload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-8 text-center transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ImageIcon
            className="mb-3 text-gray-400 transition-transform group-hover:scale-110"
            size={32}
          />
          <p className="text-base font-medium text-gray-600 group-hover:text-green-600">
            {t.clickToUpload}
          </p>
          <span className="mt-1 text-sm text-gray-400">{t.maxImages}</span>
          <input
            id="imageUpload"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </label>
      </div>
      {errors["images"] && (
        <div className="mt-2 rounded-md text-xs text-red-600">
          {errors["images"]}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {(product.images || []).map((img, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border"
          >
            <Image
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`Product image ${index + 1}`}
              width={200}
              height={200}
              className="h-32 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-80 hover:opacity-100"
              title={t.remove}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onBack}
        >
          {t.back}
        </button>
      </div>
    </div>
  );
};
