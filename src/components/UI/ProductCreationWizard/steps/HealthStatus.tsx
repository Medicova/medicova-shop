import { Check, X, AlertCircle, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductFormData } from "@/lib/validations/product-schema";

interface HealthStatusProps {
  product: ProductFormData;
}

export const HealthStatus = ({ product }: HealthStatusProps) => {
  const { language } = useLanguage();

  const t = {
    health: { en: "Health", ar: "حالة المنتج" },
    allChecksPassed: { en: "All checks passed", ar: "تم اجتياز جميع الفحوصات" },
    fixToGoOnline: {
      en: "Fix the following to go online",
      ar: "قم بإصلاح التالي للنشر",
    },
    invoicing: { en: "Invoicing", ar: "الفوترة" },
    invalidInvoicing: { en: "Invalid invoicing", ar: "الفوترة غير صالحة" },
    price: { en: "Price", ar: "السعر" },
    invalidPrice: { en: "Price is invalid", ar: "السعر غير صالح" },
    psku: { en: "PSKU Active", ar: "رمز المنتج نشط" },
    invalidPsku: { en: "PSKU not active", ar: "رمز المنتج غير نشط" },
    stock: { en: "Stock Check", ar: "فحص المخزون" },
    noStock: { en: "Stock not available", ar: "المخزون غير متوفر" },
    product: { en: "Product Active", ar: "المنتج نشط" },
    notProduct: { en: "Product not active", ar: "المنتج غير نشط" },
    learnMore: { en: "Learn more", ar: "اعرف المزيد" },
  };

  const checks = {
    invoicing: true, // Assuming this comes from external validation
    price: !!product.del_price && product.del_price >= 0,
    psku: !!product.sku && product.sku.length >= 3,
    stock: !!product.stock && product.stock > 0,
    product: !!product.title && !!product.description,
  };

  const allValid = Object.values(checks).every(Boolean);

  return (
    <div>
      <h2 className="text-xl font-semibold">{t.health[language]}</h2>

      <div className="my-4">
        <div
          className={`mb-2 rounded-md p-3 ${
            allValid
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {allValid ? <Check size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm font-medium">
              {allValid
                ? t.allChecksPassed[language]
                : t.fixToGoOnline[language]}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(checks).map(([key, isValid]) => (
            <CheckItem
              key={key}
              valid={isValid}
              label={t[key as keyof typeof t][language]}
              error={
                t[
                  `invalid${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof t
                ]?.[language]
              }
              showLearnMore
              learnMoreLabel={t.learnMore[language]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckItem = ({
  valid,
  label,
  error,
  showLearnMore = false,
  learnMoreLabel,
}: {
  valid: boolean;
  label: string;
  error?: string;
  showLearnMore?: boolean;
  learnMoreLabel?: string;
}) => (
  <div className={`rounded-md p-3 ${valid ? "bg-gray-50" : "bg-red-50"}`}>
    <div className="flex items-center gap-2">
      {valid ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span className="font-medium">{label}</span>
    </div>
    {!valid && error && (
      <div className="mt-1 flex items-center gap-3 text-xs">
        <span>{error}</span>
        {showLearnMore && learnMoreLabel && (
          <button
            type="button"
            className="flex items-center gap-1 text-primary"
          >
            <Info className="h-3 w-3" />
            {learnMoreLabel}
          </button>
        )}
      </div>
    )}
  </div>
);
