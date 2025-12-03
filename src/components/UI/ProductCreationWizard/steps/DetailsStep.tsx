import { useState, useEffect, useRef } from "react";
import { ImageIcon, X, Check, Percent, DollarSign, Calendar, GripVertical, Plus, Info, Image as ImageIconType, Search, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ProductFormData,
  Specification,
} from "@/lib/validations/product-schema";
import Image from "next/image";
import { products } from "@/constants/products";
import { Product } from "@/types/product";

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
    price: "Price",
    salePrice: "Price sale",
    discountFromOriginal: "Discount {percent}% from original price.",
    chooseDiscountPeriod: "Choose Discount Period",
    saleStart: "Sale Start Date (Optional)",
    saleEnd: "Sale End Date (Optional)",
    percentage: "Percentage",
    fixedAmount: "Fixed Amount",
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
    permalink: "Permalink",
    permalinkPlaceholder: "https://medicova-shop.net/products/",
    back: "Back",
    remove: "Remove",
    variants: "Variants",
    optionName: "Option name",
    optionValues: "Option values",
    addValue: "Add a value",
    optionValueRequired: "Option value is required",
    delete: "Delete",
    done: "Done",
    addAnotherOption: "Add another option",
    shipping: "Shipping",
    weightGrams: "Weight (g)",
    lengthCm: "Length (cm)",
    wideCm: "Wide (cm)",
    heightCm: "Height (cm)",
    video: "Video",
    addNew: "Add Video",
    file: "File",
    chooseFile: "Choose file",
    orExternalVideoUrl: "Or External Video URL",
    enterVideoUrl: "Enter YouTube or Vimeo video URL",
    videoThumbnail: "Video thumbnail",
    chooseImage: "Choose image",
    orAddFromUrl: "or Add from URL",
    enterThumbnailUrl: "Enter thumbnail image URL",
    setAsFeatured: "Set as Featured",
    featuredImage: "Featured Image",
    removeFeatured: "Remove Featured",
    relatedProducts: "Related products",
    crossSellingProducts: "Cross-selling products",
    searchProducts: "Search products",
    previous: "Previous",
    next: "Next",
    priceFieldInstruction: "* Price field: Enter the amount you want to reduce from the original price. Example: If the original price is $100, enter 20 to reduce the price to $80.",
    typeFieldInstruction: "* Type field: Choose the discount type: Fixed (reduce a specific amount) or Percent (reduce by a percentage).",
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
    price: "السعر",
    salePrice: "سعر البيع",
    discountFromOriginal: "خصم {percent}% من السعر الأصلي.",
    chooseDiscountPeriod: "اختر فترة الخصم",
    saleStart: "تاريخ بدء البيع (اختياري)",
    saleEnd: "تاريخ انتهاء البيع (اختياري)",
    percentage: "النسبة المئوية",
    fixedAmount: "المبلغ الثابت",
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
    permalink: "الرابط الدائم",
    permalinkPlaceholder: "https://shofy.botble.com/products/",
    back: "رجوع",
    remove: "إزالة",
    variants: "المتغيرات",
    optionName: "اسم الخيار",
    optionValues: "قيم الخيار",
    addValue: "أضف قيمة",
    optionValueRequired: "قيمة الخيار مطلوبة",
    delete: "حذف",
    done: "تم",
    addAnotherOption: "إضافة خيار آخر",
    shipping: "الشحن",
    weightGrams: "الوزن (جم)",
    lengthCm: "الطول (سم)",
    wideCm: "العرض (سم)",
    heightCm: "الارتفاع (سم)",
    video: "الفيديو",
    addNew: "إضافة جديد",
    file: "ملف",
    chooseFile: "اختر ملف",
    orExternalVideoUrl: "أو رابط فيديو خارجي",
    enterVideoUrl: "أدخل رابط فيديو من YouTube أو Vimeo",
    videoThumbnail: "صورة مصغرة للفيديو",
    chooseImage: "اختر صورة",
    orAddFromUrl: "أو أضف من رابط",
    enterThumbnailUrl: "أدخل رابط صورة مصغرة",
    setAsFeatured: "تعيين كصورة مميزة",
    featuredImage: "الصورة المميزة",
    removeFeatured: "إزالة الصورة المميزة",
    relatedProducts: "المنتجات ذات الصلة",
    crossSellingProducts: "منتجات البيع المتقاطع",
    searchProducts: "البحث عن المنتجات",
    previous: "السابق",
    next: "التالي",
    priceFieldInstruction: "* حقل السعر: أدخل المبلغ الذي تريد تقليله من السعر الأصلي. مثال: إذا كان السعر الأصلي 100 دولار، أدخل 20 لتقليل السعر إلى 80 دولارًا.",
    typeFieldInstruction: "* حقل النوع: اختر نوع الخصم: ثابت (تقليل مبلغ محدد) أو نسبة مئوية (تقليل بنسبة مئوية).",
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
  
  // Sale price type: "fixed" or "percentage"
  const [salePriceType, setSalePriceType] = useState<"fixed" | "percentage">("fixed");
  const [showDiscountPeriod, setShowDiscountPeriod] = useState(false);
  const [salePercentage, setSalePercentage] = useState<number>(0);

  // Shipping dimensions state
  const [shippingWeight, setShippingWeight] = useState<number>(
    (product as Record<string, unknown>).shippingWeight as number || 0,
  );
  const [shippingLength, setShippingLength] = useState<number>(
    (product as Record<string, unknown>).shippingLength as number || 0,
  );
  const [shippingWide, setShippingWide] = useState<number>(
    (product as Record<string, unknown>).shippingWide as number || 0,
  );
  const [shippingHeight, setShippingHeight] = useState<number>(
    (product as Record<string, unknown>).shippingHeight as number || 0,
  );

  // Sync shipping dimensions from product updates
  const productShippingWeight = (product as Record<string, unknown>).shippingWeight as number | undefined;
  const productShippingLength = (product as Record<string, unknown>).shippingLength as number | undefined;
  const productShippingWide = (product as Record<string, unknown>).shippingWide as number | undefined;
  const productShippingHeight = (product as Record<string, unknown>).shippingHeight as number | undefined;

  useEffect(() => {
    if (productShippingWeight !== undefined) setShippingWeight(productShippingWeight || 0);
    if (productShippingLength !== undefined) setShippingLength(productShippingLength || 0);
    if (productShippingWide !== undefined) setShippingWide(productShippingWide || 0);
    if (productShippingHeight !== undefined) setShippingHeight(productShippingHeight || 0);
  }, [productShippingWeight, productShippingLength, productShippingWide, productShippingHeight]);

  // Variants state
  type VariantOption = {
    id: string;
    name: string;
    values: string[];
    newValue: string;
    error: string;
  };
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  
  // Related Products state
  const [relatedProductsSearch, setRelatedProductsSearch] = useState("");
  const [relatedProductsDropdownOpen, setRelatedProductsDropdownOpen] = useState(false);
  const [relatedProductsSelected, setRelatedProductsSelected] = useState<Product[]>([]);
  const [relatedProductsPage, setRelatedProductsPage] = useState(1);
  const relatedProductsRef = useRef<HTMLDivElement>(null);

  // Cross-selling Products state
  type CrossSellingProduct = {
    product: Product;
    price: number;
    discountType: "fixed" | "percent";
  };
  const [crossSellingSearch, setCrossSellingSearch] = useState("");
  const [crossSellingDropdownOpen, setCrossSellingDropdownOpen] = useState(false);
  const [crossSellingSelected, setCrossSellingSelected] = useState<CrossSellingProduct[]>([]);
  const [crossSellingPage, setCrossSellingPage] = useState(1);
  const crossSellingRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 6;
  
  // Video state
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [externalVideoUrl, setExternalVideoUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  
  // Base URL constant
  const PERMALINK_BASE_URL = "https://medicova-shop.net/products/";
  
  const [permalink, setPermalink] = useState<string>(
    (product as Record<string, unknown>).permalink as string || PERMALINK_BASE_URL,
  );

  // Get the slug part (everything after the base URL)
  const getSlugFromPermalink = (url: string): string => {
    if (url.startsWith(PERMALINK_BASE_URL)) {
      return url.replace(PERMALINK_BASE_URL, "");
    }
    return url;
  };

  // Sync permalink from product updates
  const productPermalink = (product as Record<string, unknown>).permalink as string | undefined;
  useEffect(() => {
    if (productPermalink !== undefined && productPermalink) {
      // Ensure it starts with base URL
      const fullPermalink = productPermalink.startsWith(PERMALINK_BASE_URL) 
        ? productPermalink 
        : PERMALINK_BASE_URL + getSlugFromPermalink(productPermalink);
      if (fullPermalink !== permalink) {
        setPermalink(fullPermalink);
      }
    } else if (!permalink || !permalink.startsWith(PERMALINK_BASE_URL)) {
      // Initialize with base URL if empty or doesn't start with base URL
      setPermalink(PERMALINK_BASE_URL);
    }
  }, [productPermalink, permalink]);

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
    // If removed image was featured, clear featured image
    const featuredIndex = (product as Record<string, unknown>).featuredImageIndex as number | undefined;
    if (featuredIndex === index) {
      onUpdate({ featuredImageIndex: undefined } as Partial<ProductFormData>);
    } else if (featuredIndex !== undefined && featuredIndex > index) {
      // Adjust featured index if it was after the removed image
      onUpdate({ featuredImageIndex: featuredIndex - 1 } as Partial<ProductFormData>);
    }
  };

  // Featured image state
  const featuredImageIndex = (product as Record<string, unknown>).featuredImageIndex as number | undefined;

  const handleSetFeaturedImage = (index: number) => {
    if (featuredImageIndex === index) {
      // Remove featured if clicking on the same image
      onUpdate({ featuredImageIndex: undefined } as Partial<ProductFormData>);
    } else {
      // Set as featured
      onUpdate({ featuredImageIndex: index } as Partial<ProductFormData>);
    }
  };

  // Video handlers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Clear external URL when file is selected
      setExternalVideoUrl("");
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Clear thumbnail URL when file is selected
      setThumbnailUrl("");
    }
  };

  const handleSaveVideo = () => {
    // Save video data to product
    const videoData = {
      videoFile: videoFile,
      externalVideoUrl: externalVideoUrl.trim() || undefined,
      thumbnailFile: thumbnailFile,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
    };
    onUpdate({ videos: [videoData] } as Partial<ProductFormData>);
    // Close modal
    setShowVideoSection(false);
    // Reset form
    setVideoFile(null);
    setExternalVideoUrl("");
    setThumbnailFile(null);
    setThumbnailUrl("");
  };

  const handleCloseVideoModal = () => {
    setShowVideoSection(false);
    // Optionally reset form on close
    setVideoFile(null);
    setExternalVideoUrl("");
    setThumbnailFile(null);
    setThumbnailUrl("");
  };

  // Related Products handlers
  const filterRelatedProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return [];
    return products.filter(
      (product) =>
        !relatedProductsSelected.some((selected) => selected.id === product.id) &&
        (product.title[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.title.en?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const relatedProductsFiltered = filterRelatedProducts(relatedProductsSearch);
  const relatedProductsPaginated = relatedProductsFiltered.slice(
    (relatedProductsPage - 1) * ITEMS_PER_PAGE,
    relatedProductsPage * ITEMS_PER_PAGE
  );

  const handleRelatedProductSelect = (product: Product) => {
    if (!relatedProductsSelected.some((p) => p.id === product.id)) {
      setRelatedProductsSelected([...relatedProductsSelected, product]);
      setRelatedProductsSearch("");
      setRelatedProductsDropdownOpen(false);
    }
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    setRelatedProductsSelected(relatedProductsSelected.filter((p) => p.id !== productId));
  };

  // Cross-selling Products handlers
  const filterCrossSellingProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return [];
    return products.filter(
      (product) =>
        !crossSellingSelected.some((selected) => selected.product.id === product.id) &&
        (product.title[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.title.en?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const crossSellingFiltered = filterCrossSellingProducts(crossSellingSearch);
  const crossSellingPaginated = crossSellingFiltered.slice(
    (crossSellingPage - 1) * ITEMS_PER_PAGE,
    crossSellingPage * ITEMS_PER_PAGE
  );

  const handleCrossSellingProductSelect = (product: Product) => {
    if (!crossSellingSelected.some((item) => item.product.id === product.id)) {
      setCrossSellingSelected([
        ...crossSellingSelected,
        { product, price: 0, discountType: "fixed" as const },
      ]);
      setCrossSellingSearch("");
      setCrossSellingDropdownOpen(false);
    }
  };

  const handleRemoveCrossSellingProduct = (productId: string) => {
    setCrossSellingSelected(crossSellingSelected.filter((item) => item.product.id !== productId));
  };

  const handleCrossSellingPriceChange = (productId: string, price: number) => {
    setCrossSellingSelected(
      crossSellingSelected.map((item) =>
        item.product.id === productId ? { ...item, price } : item
      )
    );
  };

  const handleCrossSellingTypeChange = (productId: string, discountType: "fixed" | "percent") => {
    setCrossSellingSelected(
      crossSellingSelected.map((item) =>
        item.product.id === productId ? { ...item, discountType } : item
      )
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        relatedProductsRef.current &&
        !relatedProductsRef.current.contains(event.target as Node)
      ) {
        setRelatedProductsDropdownOpen(false);
      }
      if (
        crossSellingRef.current &&
        !crossSellingRef.current.contains(event.target as Node)
      ) {
        setCrossSellingDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (product.del_price && product.price && product.del_price > 0) {
      const discount = ((product.del_price - product.price) / product.del_price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  // Handle sale price change based on type
  const handleSalePriceChange = (value: string) => {
    if (salePriceType === "percentage") {
      // Store percentage and calculate sale price
      const percentage = parseFloat(value) || 0;
      setSalePercentage(percentage);
      if (product.del_price && percentage >= 0 && percentage <= 100) {
        const salePrice = product.del_price * (1 - percentage / 100);
        onUpdate({ price: parseFloat(salePrice.toFixed(2)) });
      } else if (percentage === 0) {
        onUpdate({ price: undefined });
      }
    } else {
      // Direct price input
      onUpdate({ price: parseFloat(value) || undefined });
    }
  };

  // Get current sale price value based on type
  const getSalePriceValue = () => {
    if (salePriceType === "percentage") {
      return salePercentage > 0 ? salePercentage.toString() : "";
    }
    return product.price?.toString() || "";
  };


  // Variants handlers
  const handleAddOption = () => {
    const newOption: VariantOption = {
      id: Date.now().toString(),
      name: "",
      values: [],
      newValue: "",
      error: "",
    };
    setVariantOptions([...variantOptions, newOption]);
  };

  const handleUpdateOptionName = (optionId: string, name: string) => {
    const updated = variantOptions.map((opt) =>
      opt.id === optionId ? { ...opt, name } : opt,
    );
    setVariantOptions(updated);
  };

  const handleUpdateOptionNewValue = (optionId: string, value: string) => {
    const updated = variantOptions.map((opt) =>
      opt.id === optionId ? { ...opt, newValue: value, error: "" } : opt,
    );
    setVariantOptions(updated);
  };

  const handleAddOptionValue = (optionId: string) => {
    const option = variantOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    if (!option.newValue.trim()) {
      const updated = variantOptions.map((opt) =>
        opt.id === optionId ? { ...opt, error: t.optionValueRequired } : opt,
      );
      setVariantOptions(updated);
      return;
    }

    const updated = variantOptions.map((opt) =>
      opt.id === optionId
        ? {
            ...opt,
            values: [...opt.values, opt.newValue.trim()],
            newValue: "",
            error: "",
          }
        : opt,
    );
    setVariantOptions(updated);
  };

  const handleRemoveOptionValue = (optionId: string, valueIndex: number) => {
    const updated = variantOptions.map((opt) =>
      opt.id === optionId
        ? { ...opt, values: opt.values.filter((_, i) => i !== valueIndex) }
        : opt,
    );
    setVariantOptions(updated);
  };

  const handleDeleteOption = (optionId: string) => {
    const updated = variantOptions.filter((opt) => opt.id !== optionId);
    setVariantOptions(updated);
  };

  const handleDoneOption = (optionId: string) => {
    const option = variantOptions.find((opt) => opt.id === optionId);
    if (option && option.name && option.values.length > 0) {
      // Option is complete, can be considered "done"
      // Could add validation or state management here if needed
    }
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

      {/* Permalink */}
      <div className="mb-6" data-field="permalink">
        <label
          htmlFor="permalink"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {t.permalink}
          <span className="ml-1 text-red-500">*</span>
        </label>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            {PERMALINK_BASE_URL}
          </span>
          <input
            type="text"
            id="permalink"
            className={`flex-1 rounded-r-md border border-l-0 p-3 focus:outline-none focus:ring-2 ${getErrorClass("permalink")}`}
            placeholder="product-slug"
            value={getSlugFromPermalink(permalink)}
            onChange={(e) => {
              const slug = e.target.value;
              const fullPermalink = PERMALINK_BASE_URL + slug;
              setPermalink(fullPermalink);
              // Update parent with permalink field
              // Note: ProductFormData schema may need to be updated to include permalink
              const updatedProduct = {
                ...product,
                permalink: fullPermalink,
              };
              onUpdate(updatedProduct as Partial<ProductFormData>);
            }}
            dir="ltr"
          />
        </div>
        {errors["permalink"] && (
          <div className="mt-2 rounded-md text-xs text-red-600">
            {errors["permalink"]}
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
      <div className=" flex items-center justify-between">

      <h2 className="mb-4 text-xl font-semibold">{t.pricing}</h2>
              {/* Choose Discount Period */}
              <div className="mb-4 flex items-end">
          <button
            type="button"
            onClick={() => setShowDiscountPeriod(!showDiscountPeriod)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <Calendar size={16} className="mr-1 inline" />
            {t.chooseDiscountPeriod}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Price */}
        <div className="mb-4" data-field="del_price">
          <label htmlFor="del_price" className="mb-1 block text-sm font-medium text-gray-700">
            {t.price}
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              <DollarSign size={16} />
            </span>
            <input
              type="number"
              id="del_price"
              className={`flex-1 rounded-r-md border border-l-0 p-2 focus:outline-none focus:ring-2 ${getErrorClass("del_price")}`}
              placeholder="0"
              value={product.del_price ?? ""}
              onChange={(e) =>
                onUpdate({ del_price: parseFloat(e.target.value) || undefined })
              }
              step="0.01"
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          {errors["del_price"] && (
            <div className="mt-2 rounded-md text-xs text-red-600">
              {errors["del_price"]}
            </div>
          )}
        </div>

        {/* Sale Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            {t.salePrice}
          </label>
          <div className="flex">
            {salePriceType === "fixed" ? (
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                <DollarSign size={16} />
              </span>
            ) : (
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                <Percent size={16} />
              </span>
            )}
            <input
              type="number"
              id="price"
              className="flex-1 rounded-none border border-l-0 border-r-0 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={getSalePriceValue()}
              onChange={(e) => handleSalePriceChange(e.target.value)}
              step={salePriceType === "percentage" ? "1" : "0.01"}
              min={salePriceType === "percentage" ? "0" : "0"}
              max={salePriceType === "percentage" ? "100" : undefined}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            <button
              type="button"
              onClick={() => {
                const newType = salePriceType === "fixed" ? "percentage" : "fixed";
                setSalePriceType(newType);
                // When switching, recalculate the value
                if (newType === "percentage" && product.del_price && product.price) {
                  const discount = calculateDiscount();
                  setSalePercentage(discount);
                }
              }}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
              title={salePriceType === "fixed" ? t.percentage : t.fixedAmount}
            >
              {salePriceType === "fixed" ? <Percent size={16} /> : <DollarSign size={16} />}
            </button>
          </div>
          {product.del_price && product.price && salePriceType === "fixed" && (
            <div className="mt-1 text-xs text-gray-500">
              {t.discountFromOriginal.replace("{percent}", calculateDiscount().toString())}
            </div>
          )}
        </div>


      </div>

      {/* Sale Start and End Dates - Conditional Display */}
      {showDiscountPeriod && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="saleStart" className="mb-1 block text-sm font-medium text-gray-700">
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
            <label htmlFor="saleEnd" className="mb-1 block text-sm font-medium text-gray-700">
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
      )}

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

      {/* Shipping Section */}
      <h2 className="mb-4 text-xl font-semibold">{t.shipping}</h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Weight (g) */}
        <div>
          <label htmlFor="shippingWeight" className="mb-1 block text-sm font-medium text-gray-700">
            {t.weightGrams}
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              g
            </span>
            <input
              type="number"
              id="shippingWeight"
              className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={shippingWeight || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setShippingWeight(value);
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Length (cm) */}
        <div>
          <label htmlFor="shippingLength" className="mb-1 block text-sm font-medium text-gray-700">
            {t.lengthCm}
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              cm
            </span>
            <input
              type="number"
              id="shippingLength"
              className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={shippingLength || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setShippingLength(value);
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Wide (cm) */}
        <div>
          <label htmlFor="shippingWide" className="mb-1 block text-sm font-medium text-gray-700">
            {t.wideCm}
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              cm
            </span>
            <input
              type="number"
              id="shippingWide"
              className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={shippingWide || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setShippingWide(value);
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Height (cm) */}
        <div>
          <label htmlFor="shippingHeight" className="mb-1 block text-sm font-medium text-gray-700">
            {t.heightCm}
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              cm
            </span>
            <input
              type="number"
              id="shippingHeight"
              className="flex-1 rounded-r-md border border-l-0 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={shippingHeight || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setShippingHeight(value);
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t.productImages}</h2>
        <button
          type="button"
          onClick={() => setShowVideoSection(!showVideoSection)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {t.addNew}
        </button>
      </div>
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
        {(product.images || []).map((img, index) => {
          const isFeatured = featuredImageIndex === index;
          return (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                isFeatured
                  ? "border-green-500 ring-2 ring-green-300"
                  : "border-gray-200 cursor-pointer hover:border-green-300"
              }`}
              onClick={() => handleSetFeaturedImage(index)}
            >
              <Image
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`Product image ${index + 1}`}
                width={200}
                height={200}
                className="h-32 w-full object-cover"
              />
              {/* Featured Badge */}
              {isFeatured && (
                <div className="absolute left-1 top-1 flex items-center gap-1 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  <Star size={12} className="fill-white" />
                  <span>{t.featuredImage}</span>
                </div>
              )}
              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-80 hover:opacity-100"
                title={t.remove}
              >
                <X size={14} />
              </button>
              {/* Set as Featured Button (when not featured) */}
              {!isFeatured && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-40">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetFeaturedImage(index);
                    }}
                    className="rounded-md bg-white px-3 py-1 text-xs font-medium text-gray-700 opacity-0 transition-opacity group-hover:opacity-100"
                    title={t.setAsFeatured}
                  >
                    {t.setAsFeatured}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {showVideoSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">{t.file}</h2>
              <button
                type="button"
                onClick={handleCloseVideoModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">{t.file}</h3>
              <label
                htmlFor="videoFileUpload"
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {t.chooseFile}
              </label>
              <input
                id="videoFileUpload"
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleVideoFileChange}
              />
              {videoFile && (
                <div className="mt-2 text-sm text-gray-600">
                  {videoFile.name}
                </div>
              )}
            </div>

            {/* External Video URL Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                {t.orExternalVideoUrl}
              </h3>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={t.enterVideoUrl}
                value={externalVideoUrl}
                onChange={(e) => {
                  setExternalVideoUrl(e.target.value);
                  // Clear video file when URL is entered
                  if (e.target.value.trim()) {
                    setVideoFile(null);
                  }
                }}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>

            {/* Video Thumbnail Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                {t.videoThumbnail}
              </h3>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                {thumbnailFile || thumbnailUrl ? (
                  <div className="relative">
                    <Image
                      src={
                        thumbnailFile
                          ? URL.createObjectURL(thumbnailFile)
                          : thumbnailUrl
                      }
                      alt="Video thumbnail"
                      width={300}
                      height={200}
                      className="max-h-48 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailUrl("");
                      }}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Two overlapping image icons placeholder */}
                    <div className="relative mb-4">
                      <ImageIconType
                        className="absolute left-0 top-0 text-gray-300"
                        size={64}
                      />
                      <ImageIconType
                        className="relative left-4 top-4 text-gray-400"
                        size={64}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-sm">
                      <label
                        htmlFor="thumbnailFileUpload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {t.chooseImage}
                      </label>
                      <span className="text-gray-600">{t.orAddFromUrl}</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                id="thumbnailFileUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailFileChange}
              />
              {!thumbnailFile && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={t.enterThumbnailUrl}
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value);
                      // Clear thumbnail file when URL is entered
                      if (e.target.value.trim()) {
                        setThumbnailFile(null);
                      }
                    }}
                    dir={language === "ar" ? "rtl" : "ltr"}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseVideoModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {t.back}
              </button>
              <button
                type="button"
                onClick={handleSaveVideo}
                disabled={!videoFile && !externalVideoUrl.trim()}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {t.add}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variants Section */}
      <h2 className="mb-4 text-xl font-semibold">{t.variants}</h2>
      
      {variantOptions.map((option) => (
        <div
          key={option.id}
          className="mb-4 rounded-lg border border-gray-200 bg-white p-6"
        >
          {/* Option Name */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.optionName}
            </label>
            <div className="flex items-center gap-2">
              <GripVertical className="cursor-grab text-gray-400" size={20} />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Size, Color"
                value={option.name}
                onChange={(e) => handleUpdateOptionName(option.id, e.target.value)}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>
          </div>

          {/* Option Values */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.optionValues}
            </label>
            <div className="mb-2">
              <input
                type="text"
                className={`w-full rounded-md border p-2 focus:outline-none focus:ring-2 ${
                  option.error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder={t.addValue}
                value={option.newValue}
                onChange={(e) => handleUpdateOptionNewValue(option.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOptionValue(option.id);
                  }
                }}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              {option.error && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <Info size={14} />
                  <span>{option.error}</span>
                </div>
              )}
            </div>

            {/* Option Values List */}
            {option.values.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {option.values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1"
                  >
                    <span className="text-sm">{value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionValue(option.id, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete and Done Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleDeleteOption(option.id)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {t.delete}
            </button>
            <button
              type="button"
              onClick={() => handleDoneOption(option.id)}
              disabled={!option.name || option.values.length === 0}
              className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {t.done}
            </button>
          </div>
        </div>
      ))}

      {/* Add Another Option Button */}
      <button
        type="button"
        onClick={handleAddOption}
        className="mb-6 flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <Plus size={16} className="rounded-full border border-gray-300" />
        <span>{t.addAnotherOption}</span>
      </button>

      {/* Related Products Section */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">{t.relatedProducts}</h2>
        <div className="relative" ref={relatedProductsRef}>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t.searchProducts}
              value={relatedProductsSearch}
              onChange={(e) => {
                setRelatedProductsSearch(e.target.value);
                setRelatedProductsDropdownOpen(e.target.value.length > 0);
                setRelatedProductsPage(1);
              }}
              onFocus={() => {
                if (relatedProductsSearch.length > 0) {
                  setRelatedProductsDropdownOpen(true);
                }
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            <Search
              className={`absolute ${language === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-gray-400`}
              size={20}
            />
          </div>

          {/* Dropdown */}
          {relatedProductsDropdownOpen && relatedProductsPaginated.length > 0 && (
            <div className="absolute z-10 mt-2 max-h-96 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {relatedProductsPaginated.map((product) => (
                <div
                  key={product.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => handleRelatedProductSelect(product)}
                >
                  <div className="flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title[language] || product.title.en}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 truncate text-sm text-gray-700">
                    {product.title[language] || product.title.en}
                  </div>
                  <Check size={20} className="text-green-600" />
                </div>
              ))}
              
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 p-2">
                <button
                  type="button"
                  onClick={() => setRelatedProductsPage((p) => Math.max(1, p - 1))}
                  disabled={relatedProductsPage === 1}
                  className={`text-sm ${relatedProductsPage === 1 ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                >
                  {t.previous}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRelatedProductsPage((p) =>
                      relatedProductsPage * ITEMS_PER_PAGE < relatedProductsFiltered.length
                        ? p + 1
                        : p
                    )
                  }
                  disabled={
                    relatedProductsPage * ITEMS_PER_PAGE >= relatedProductsFiltered.length
                  }
                  className={`text-sm ${relatedProductsPage * ITEMS_PER_PAGE >= relatedProductsFiltered.length ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Products */}
        {relatedProductsSelected.length > 0 && (
          <div className="mt-4 space-y-2">
            {relatedProductsSelected.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title[language] || product.title.en}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {product.title[language] || product.title.en}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRelatedProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                  title={t.remove}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cross-selling Products Section */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">{t.crossSellingProducts}</h2>
        <div className="relative" ref={crossSellingRef}>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t.searchProducts}
              value={crossSellingSearch}
              onChange={(e) => {
                setCrossSellingSearch(e.target.value);
                setCrossSellingDropdownOpen(e.target.value.length > 0);
                setCrossSellingPage(1);
              }}
              onFocus={() => {
                if (crossSellingSearch.length > 0) {
                  setCrossSellingDropdownOpen(true);
                }
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            <Search
              className={`absolute ${language === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-gray-400`}
              size={20}
            />
          </div>

          {/* Dropdown */}
          {crossSellingDropdownOpen && crossSellingPaginated.length > 0 && (
            <div className="absolute z-10 mt-2 max-h-96 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {crossSellingPaginated.map((product) => (
                <div
                  key={product.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => handleCrossSellingProductSelect(product)}
                >
                  <div className="flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title[language] || product.title.en}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 truncate text-sm text-gray-700">
                    {product.title[language] || product.title.en}
                  </div>
                  <Check size={20} className="text-green-600" />
                </div>
              ))}
              
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 p-2">
                <button
                  type="button"
                  onClick={() => setCrossSellingPage((p) => Math.max(1, p - 1))}
                  disabled={crossSellingPage === 1}
                  className={`text-sm ${crossSellingPage === 1 ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                >
                  {t.previous}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCrossSellingPage((p) =>
                      crossSellingPage * ITEMS_PER_PAGE < crossSellingFiltered.length
                        ? p + 1
                        : p
                    )
                  }
                  disabled={
                    crossSellingPage * ITEMS_PER_PAGE >= crossSellingFiltered.length
                  }
                  className={`text-sm ${crossSellingPage * ITEMS_PER_PAGE >= crossSellingFiltered.length ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-1 text-xs text-gray-600">
          <p>{t.priceFieldInstruction}</p>
          <p>{t.typeFieldInstruction}</p>
        </div>

        {/* Selected Products with Price and Type */}
        {crossSellingSelected.length > 0 && (
          <div className="mt-4 space-y-4">
            {crossSellingSelected.map((item) => (
              <div
                key={item.product.id}
                className="rounded-md border border-gray-200 bg-white p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.product.images && item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title[language] || item.product.title.en}
                        width={50}
                        height={50}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {item.product.title[language] || item.product.title.en}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCrossSellingProduct(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                    title={t.remove}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price Field */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleCrossSellingPriceChange(
                          item.product.id,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      dir={language === "ar" ? "rtl" : "ltr"}
                    />
                  </div>

                  {/* Type Field */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={item.discountType}
                      onChange={(e) =>
                        handleCrossSellingTypeChange(
                          item.product.id,
                          e.target.value as "fixed" | "percent"
                        )
                      }
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percent</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
