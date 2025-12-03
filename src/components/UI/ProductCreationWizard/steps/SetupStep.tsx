import { useState, useEffect } from "react";
import { ChevronLeft, Search, X, Clipboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductFormData } from "@/lib/validations/product-schema";
import { CategoryType } from "@/types";
import { allCategories } from "@/constants/categouries";
import { CategoryItem } from "../CategoryItem";
import { brands } from "@/constants/brands";
import { Brand } from "@/types";
import { Sellers } from "@/constants/sellers";
import { Seller } from "@/types/product";

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
    selectProductSubcategory: "Select Product Subcategory",
    searchCategories: "Search categories",
    searchSubcategories: "Search subcategories",
    noCategoriesFound: "No categories found",
    selected: "Selected",
    selectBrand: "Select Brand",
    searchBrand: "Search brand",
    noBrandsFound: "No brands found",
    selectStore: "Select Store",
    searchStore: "Search store",
    noStoresFound: "No stores found",
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
    selectProductSubcategory: "اختر فئة المنتج الفرعية",
    searchCategories: "ابحث في الفئات",
    searchSubcategories: "ابحث في الفئات الفرعية",
    noCategoriesFound: "لا توجد فئات",
    selected: "محدد",
    selectBrand: "اختر العلامة التجارية",
    searchBrand: "ابحث عن علامة تجارية",
    noBrandsFound: "لا توجد علامات تجارية",
    selectStore: "اختر المتجر",
    searchStore: "ابحث عن متجر",
    noStoresFound: "لا توجد متاجر",
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
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<CategoryType | null>(null);
  const [currentParentCategory, setCurrentParentCategory] =
    useState<CategoryType | null>(null);

  // Brand state
  const [brandSearchTerm, setBrandSearchTerm] = useState("");

  // Store state
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Seller | null>(null);

  // Category handlers
  const filteredCategories = allCategories.filter((cat) =>
    cat.title?.[language]
      .toLowerCase()
      .includes(categorySearchTerm.toLowerCase()),
  );

  // Subcategory handlers - use selectedParentCategory to filter subcategories
  const filteredSubcategories = selectedParentCategory?.subCategories
    ? selectedParentCategory.subCategories.filter((subcat: CategoryType) =>
        subcat.title?.[language]
          .toLowerCase()
          .includes(subcategorySearchTerm.toLowerCase()),
      )
    : [];

  // Check if the selected category is actually a subcategory (has a parent in the hierarchy)
  const isSubcategory = product.category
    ? allCategories.some((cat) =>
        cat.subCategories?.some((subcat) => subcat.id === product.category?.id),
      )
    : false;

  const handleCategorySelect = (category: CategoryType) => {
    // Only set the parent category for subcategory filtering, don't update product.category
    setSelectedParentCategory(category);
    setCategorySearchTerm("");
  };

  const handleSubcategorySelect = (subcategory: CategoryType) => {
    // Update product.category when a subcategory is selected
    onUpdate({ category: subcategory });
    setSubcategorySearchTerm("");
  };

  // Initialize parent category if product.category is already set and is a subcategory
  useEffect(() => {
    if (product.category && !selectedParentCategory) {
      // Check if the selected category is a subcategory
      const parent = allCategories.find((cat) =>
        cat.subCategories?.some((subcat) => subcat.id === product.category?.id),
      );
      if (parent) {
        setSelectedParentCategory(parent);
      }
    }
  }, [product.category, selectedParentCategory]);

  // Brand handlers
  const filteredBrands = brands.filter((brand) =>
    brand.name[language].toLowerCase().includes(brandSearchTerm.toLowerCase()),
  );

  const handleBrandSelect = (brand: Brand) => {
    onUpdate({ brand });
    setBrandSearchTerm("");
  };

  // Store handlers
  const filteredStores = Sellers.filter((store) =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()),
  );

  const handleStoreSelect = (store: Seller) => {
    setSelectedStore(store);
    setStoreSearchTerm("");
    // Note: ProductFormData doesn't have a store field yet
    // You can add onUpdate({ store }) when the schema is updated
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

        <div className="flex gap-4">
          {/* English Name */}
          <div className="mb-4 w-1/2" data-field="title.en">
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
          <div className="mb-4 w-1/2" data-field="title.ar">
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

        <div className="flex gap-4">
          <div className="mb-4 w-1/2">
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
                    currentParentCategory
                      ? t.searchSubcategories
                      : t.searchCategories
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
            {categorySearchTerm && (
              <div className="mb-2 max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
                {filteredCategories.map((category, index) => (
                  <CategoryItem
                    key={index}
                    category={category}
                    onSelect={handleCategorySelect}
                    onNavigate={setCurrentParentCategory}
                  />
                ))}

                {filteredCategories.length === 0 && (
                  <div className="p-3 text-center text-gray-500">
                    {t.noCategoriesFound}
                  </div>
                )}
              </div>
            )}

            {/* Selected Parent Category */}
            {selectedParentCategory && !isSubcategory && (
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {selectedParentCategory.title[language]}
                    </div>
                    <div className="text-sm text-blue-600">{t.selected}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParentCategory(null);
                      setCategorySearchTerm("");
                      setSubcategorySearchTerm("");
                      // Clear product.category if it's a subcategory of the selected parent
                      if (product.category && selectedParentCategory) {
                        const isSubcategoryOfParent =
                          selectedParentCategory.subCategories?.some(
                            (subcat) => subcat.id === product.category?.id,
                          );
                        if (isSubcategoryOfParent) {
                          onUpdate({ category: undefined });
                        }
                      }
                    }}
                    className="flex items-center justify-center rounded-full p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove category"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4 w-1/2">
            <div className="mb-4 flex items-center">
              <h2 className="text-xl font-semibold">
                {t.selectProductSubcategory}
              </h2>
            </div>

            {errors.category && (
              <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
                {errors.category}
              </div>
            )}

            {/* Subcategory Search */}
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
                  placeholder={t.searchSubcategories}
                  value={subcategorySearchTerm}
                  onChange={(e) => setSubcategorySearchTerm(e.target.value)}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  disabled={!selectedParentCategory}
                />
                {subcategorySearchTerm && (
                  <button
                    type="button"
                    className={`absolute inset-y-0 ${
                      language === "ar" ? "left-0 pl-3" : "right-0 pr-3"
                    } flex items-center text-gray-500 hover:text-gray-700`}
                    onClick={() => setSubcategorySearchTerm("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Subcategory List */}
            {subcategorySearchTerm && selectedParentCategory && (
              <div className="mb-2 max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
                {filteredSubcategories.map((subcategory, index) => (
                  <CategoryItem
                    key={index}
                    category={subcategory}
                    onSelect={handleSubcategorySelect}
                    onNavigate={setCurrentParentCategory}
                  />
                ))}

                {filteredSubcategories.length === 0 && (
                  <div className="p-3 text-center text-gray-500">
                    {t.noCategoriesFound}
                  </div>
                )}
              </div>
            )}

            {/* Selected Subcategory */}
            {product.category && isSubcategory && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {product.category.title[language]}
                    </div>
                    <div className="text-sm text-green-600">{t.selected}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate({ category: undefined });
                      setSubcategorySearchTerm("");
                    }}
                    className="flex items-center justify-center rounded-full p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove subcategory"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mb-4 w-1/2">
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
            {brandSearchTerm && (
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
                  <div className="p-3 text-center text-gray-500">
                    {t.noBrandsFound}
                  </div>
                )}
              </div>
            )}

            {/* Selected Brand */}
            {product.brand && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {product.brand.name[language]}
                    </div>
                    <div className="text-sm text-green-600">{t.selected}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate({ brand: undefined });
                      setBrandSearchTerm("");
                    }}
                    className="flex items-center justify-center rounded-full p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove brand"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4 w-1/2">
            <h2 className="mb-4 text-xl font-semibold">{t.selectStore}</h2>

            {errors.store && (
              <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
                {errors.store}
              </div>
            )}

            {/* Store Search */}
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
                  placeholder={t.searchStore}
                  value={storeSearchTerm}
                  onChange={(e) => setStoreSearchTerm(e.target.value)}
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
                {storeSearchTerm && (
                  <button
                    type="button"
                    className={`absolute inset-y-0 ${
                      language === "ar" ? "left-0 pl-3" : "right-0 pr-3"
                    } flex items-center text-gray-500 hover:text-gray-700`}
                    onClick={() => setStoreSearchTerm("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Stores List */}
            {storeSearchTerm && (
              <div className="mb-6 max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <button
                      type="button"
                      key={store.id}
                      className="w-full cursor-pointer rounded-md border border-white p-3 text-left hover:bg-gray-100"
                      onClick={() => handleStoreSelect(store)}
                    >
                      {store.name}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    {t.noStoresFound}
                  </div>
                )}
              </div>
            )}

            {/* Selected Store */}
            {selectedStore && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedStore.name}</div>
                    <div className="text-sm text-green-600">{t.selected}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStore(null);
                      setStoreSearchTerm("");
                    }}
                    className="flex items-center justify-center rounded-full p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove store"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* SKU Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 w-[50%]">
        <h2 className="mb-4 text-xl font-semibold">{t.productIdentity}</h2>

        {errors.sku && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-600">
            {errors.sku}
          </div>
        )}

<div className="flex gap-4 flex-col">
          {/* Manual SKU Entry */}
          <div className="mb-6 w-full">
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
        {/* <div className="my-4 text-center text-gray-500">{t.or}</div> */}

        {/* Auto Generate SKU */}
        <button
          type="button"
          className="flex w-full flex-col items-center rounded-md border-2 border-dashed border-gray-300 py-3 transition-colors hover:border-green-500 hover:bg-green-50"
          onClick={handleGenerateSku}
        >
          <Clipboard className="mb-2 text-gray-400" size={24} />
          <span className="text-sm text-gray-600">{t.generateSku}</span>
        </button>
</div>

        {/* Generated SKU Display */}
        {product.sku && (
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="font-medium">{t.skuGenerated}</div>
            <div className="mt-1 font-mono text-sm">{product.sku}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-start">
        <button
          type="button"
          className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          // disabled={!product.category || !product.brand || !product.sku}
          onClick={onValidate}
        >
          {t.nextDetails}
        </button>
      </div>
    </div>
  );
};
