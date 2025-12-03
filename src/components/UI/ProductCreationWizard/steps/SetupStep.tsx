import { useState } from "react";
import { ChevronLeft, Search, X, Clipboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductFormData } from "@/lib/validations/product-schema";
import { CategoryType } from "@/types";
import { allCategories } from "@/constants/categouries";
import { CategoryItem } from "../CategoryItem";
import { brands } from "@/constants/brands";
import { Brand } from "@/types";

interface SetupStepProps {
  product: ProductFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<ProductFormData>) => void;
  onValidate: () => void;
  onBack: () => void;
}

const translations = {
  en: {
    setup: "Setup",
    productName: "Product Name",
    productNameEn: "Product Name (English)",
    productNameAr: "Product Name (Arabic)",
    enterProductNameEn: "Enter product name in English",
    enterProductNameAr: "Enter product name in Arabic",
    selectProductCategory: "Select Product Category",
    searchCategories: "Search categories",
    searchSubcategories: "Search subcategories",
    noCategoriesFound: "No categories found",
    selected: "Selected",
    selectBrand: "Select Brand",
    searchBrand: "Search brand",
    noBrandsFound: "No brands found",
    productIdentity: "Product Identity",
    manualSkuEntry: "Manual SKU Entry",
    enterSku: "Enter your SKU",
    submit: "Submit",
    or: "or",
    generateSku: "Generate SKU Automatically",
    skuGenerated: "SKU Generated",
    nextDetails: "Next: Details",
    clearSearch: "Clear search",
  },
  ar: {
    setup: "الإعداد",
    productName: "اسم المنتج",
    productNameEn: "اسم المنتج (الإنجليزية)",
    productNameAr: "اسم المنتج (العربية)",
    enterProductNameEn: "أدخل اسم المنتج باللغة الإنجليزية",
    enterProductNameAr: "أدخل اسم المنتج باللغة العربية",
    selectProductCategory: "اختر فئة المنتج",
    searchCategories: "ابحث في الفئات",
    searchSubcategories: "ابحث في الفئات الفرعية",
    noCategoriesFound: "لا توجد فئات",
    selected: "محدد",
    selectBrand: "اختر العلامة التجارية",
    searchBrand: "ابحث عن علامة تجارية",
    noBrandsFound: "لا توجد علامات تجارية",
    productIdentity: "هوية المنتج",
    manualSkuEntry: "إدخال SKU يدويًا",
    enterSku: "أدخل SKU الخاص بك",
    submit: "إرسال",
    or: "أو",
    generateSku: "إنشاء SKU تلقائيًا",
    skuGenerated: "تم إنشاء SKU",
    nextDetails: "التالي: التفاصيل",
    clearSearch: "مسح البحث",
  },
};

export const SetupStep = ({
  product,
  errors,
  onUpdate,
  onValidate,
}: SetupStepProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Category state
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [currentParentCategory, setCurrentParentCategory] =
    useState<CategoryType | null>(null);
  
  // Brand state
  const [brandSearchTerm, setBrandSearchTerm] = useState("");

  // Category handlers
  const filteredCategories = allCategories.filter((cat) =>
    cat.title?.[language].toLowerCase().includes(categorySearchTerm.toLowerCase()),
  );

  const handleCategorySelect = (category: CategoryType) => {
    onUpdate({ category });
    setCategorySearchTerm("");
  };

  // Brand handlers
  const filteredBrands = brands.filter((brand) =>
    brand.name[language].toLowerCase().includes(brandSearchTerm.toLowerCase()),
  );

  const handleBrandSelect = (brand: Brand) => {
    onUpdate({ brand });
    setBrandSearchTerm("");
  };

  // SKU handlers
  const generateSku = () => {
    const randomPart = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    return `PSKU_${randomPart}_${Date.now()}`;
  };

  const handleGenerateSku = () => {
    onUpdate({ sku: generateSku() });
  };

  // Helper function to get error with proper styling
  const getErrorClass = (fieldName: string) => {
    return errors[fieldName]
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Product Name Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">{t.productName}</h2>

        {/* English Name */}
        <div className="mb-4" data-field="title.en">
          <label
            htmlFor="nameEn"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {t.productNameEn}
          </label>
          <input
            type="text"
            id="nameEn"
            className={`w-full rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("title.en")}`}
            placeholder={t.enterProductNameEn}
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

        {/* Arabic Name */}
        <div className="mb-4" data-field="title.ar">
          <label
            htmlFor="nameAr"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {t.productNameAr}
          </label>
          <input
            type="text"
            id="nameAr"
            className={`w-full rounded-md border p-3 focus:outline-none focus:ring-2 ${getErrorClass("title.ar")}`}
            placeholder="أدخل اسم المنتج باللغة العربية"
            value={product.title?.ar || ""}
            onChange={(e) =>
              onUpdate({
                title: {
                  en: product.title?.en || "",
                  ar: e.target.value,
                },
              })
            }
            dir="rtl"
          />
          {errors["title.ar"] && (
            <div className="mt-2 rounded-md text-xs text-red-600">
              {errors["title.ar"]}
            </div>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center">
          {currentParentCategory && (
            <button
              type="button"
              className={`flex items-center text-gray-600 hover:text-gray-800 ${language === "ar" ? "ml-2" : "mr-2"}`}
              onClick={() => setCurrentParentCategory(null)}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-semibold">
            {currentParentCategory
              ? currentParentCategory.title[language]
              : t.selectProductCategory}
          </h2>
        </div>

        {errors.category && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
            {errors.category}
          </div>
        )}

        {/* Category Search */}
        <div className="mb-6">
          <div className="relative">
            <div
              className={`pointer-events-none absolute inset-y-0 ${
                language === "ar" ? "right-0 pr-3" : "left-0 pl-3"
              } flex items-center`}
            >
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className={`w-full rounded-md border border-gray-300 py-2 ${
                language === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"
              } focus:outline-none`}
              placeholder={
                currentParentCategory ? t.searchSubcategories : t.searchCategories
              }
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            {categorySearchTerm && (
              <button
                type="button"
                className={`absolute inset-y-0 ${
                  language === "ar" ? "left-0 pl-3" : "right-0 pr-3"
                } flex items-center text-gray-500 hover:text-gray-700`}
                onClick={() => setCategorySearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="mb-2 max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
          {(categorySearchTerm
            ? filteredCategories
            : (currentParentCategory?.subCategories ?? allCategories)
          ).map((category, index) => (
            <CategoryItem
              key={index}
              category={category}
              onSelect={handleCategorySelect}
              onNavigate={setCurrentParentCategory}
            />
          ))}

          {categorySearchTerm && filteredCategories.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              {t.noCategoriesFound}
            </div>
          )}
        </div>

        {/* Selected Category */}
        {product.category && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
            <div className="font-medium">{product.category.title[language]}</div>
            <div className="text-sm text-green-600">{t.selected}</div>
          </div>
        )}
      </div>

      {/* Brand Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">{t.selectBrand}</h2>

        {errors.brand && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
            {errors.brand}
          </div>
        )}

        {/* Brand Search */}
        <div className="mb-6">
          <div className="relative">
            <div
              className={`pointer-events-none absolute inset-y-0 ${
                language === "ar" ? "right-0 pr-3" : "left-0 pl-3"
              } flex items-center`}
            >
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className={`w-full rounded-md border border-gray-300 py-2 ${
                language === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"
              } focus:outline-none`}
              placeholder={t.searchBrand}
              value={brandSearchTerm}
              onChange={(e) => setBrandSearchTerm(e.target.value)}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            {brandSearchTerm && (
              <button
                type="button"
                className={`absolute inset-y-0 ${
                  language === "ar" ? "left-0 pl-3" : "right-0 pr-3"
                } flex items-center text-gray-500 hover:text-gray-700`}
                onClick={() => setBrandSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Brands List */}
        <div className="mb-6 max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <button
                type="button"
                key={brand.id}
                className={`w-full cursor-pointer rounded-md border p-3 text-left ${
                  product.brand?.id === brand.id
                    ? "border-green-500 bg-green-50"
                    : "border-white hover:bg-gray-100"
                }`}
                onClick={() => handleBrandSelect(brand)}
              >
                {brand.name[language]}
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">{t.noBrandsFound}</div>
          )}
        </div>

        {/* Selected Brand */}
        {product.brand && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
            <div className="font-medium">{product.brand.name[language]}</div>
            <div className="text-sm text-green-600">{t.selected}</div>
          </div>
        )}
      </div>

      {/* SKU Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">{t.productIdentity}</h2>

        {errors.sku && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
            {errors.sku}
          </div>
        )}

        {/* Manual SKU Entry */}
        <div className="mb-6">
          <h3 className="mb-2 font-medium">{t.manualSkuEntry}</h3>
          <div className="flex">
            <input
              type="text"
              className={`flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none ${
                language === "ar" ? "rounded-r-md" : "rounded-l-md"
              }`}
              placeholder={t.enterSku}
              value={product.sku || ""}
              onChange={(e) => onUpdate({ sku: e.target.value })}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            <button
              type="button"
              className={`rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 ${
                language === "ar" ? "rounded-l-md" : "rounded-r-md"
              }`}
              disabled={!product.sku}
            >
              {t.submit}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 text-center text-gray-500">{t.or}</div>

        {/* Auto Generate SKU */}
        <button
          type="button"
          className="flex w-full flex-col items-center rounded-md border-2 border-dashed border-gray-300 py-3 transition-colors hover:border-green-500 hover:bg-green-50"
          onClick={handleGenerateSku}
        >
          <Clipboard className="mb-2 text-gray-400" size={24} />
          <span className="text-sm text-gray-600">{t.generateSku}</span>
        </button>

        {/* Generated SKU Display */}
        {product.sku && (
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="font-medium">{t.skuGenerated}</div>
            <div className="mt-1 font-mono text-sm">{product.sku}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={!product.category || !product.brand || !product.sku}
          onClick={onValidate}
        >
          {t.nextDetails}
        </button>
      </div>
    </div>
  );
};

