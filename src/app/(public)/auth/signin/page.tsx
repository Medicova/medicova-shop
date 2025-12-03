"use client";
import { users } from "@/constants/users";
import { useLanguage } from "@/contexts/LanguageContext";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

// Role colors (same for both languages)
const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 border-l-4 border-red-500",
  seller: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
  default: "bg-green-100 text-green-800 border-l-4 border-green-500",
};

// Role labels in both languages
const roleLabels: Record<string, { en: string; ar: string }> = {
  admin: { en: "Admin", ar: "مدير" },
  seller: { en: "Seller", ar: "بائع" },
  default: { en: "User", ar: "مستخدم" },
};

// UI text translations
const translations = {
  title: {
    en: "User Management System",
    ar: "نظام إدارة المستخدمين",
  },
  subtitle: {
    en: "Select an account to log in and experience the system with different permissions",
    ar: "اختر حسابًا لتسجيل الدخول وتجربة النظام من خلال صلاحيات مختلفة",
  },
  email: {
    en: "Email",
    ar: "البريد الإلكتروني",
  },
  phone: {
    en: "Phone",
    ar: "الهاتف",
  },
  signIn: {
    en: "Sign In",
    ar: "تسجيل الدخول",
  },
  signingIn: {
    en: "Signing in...",
    ar: "جاري تسجيل الدخول...",
  },
  loginFailed: {
    en: "Login failed. Please try again.",
    ar: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
  },
  unknownUser: {
    en: "Unknown User",
    ar: "مستخدم غير معروف",
  },
  footer: {
    en: "© 2023 User Management System. All rights reserved.",
    ar: "© 2023 نظام إدارة المستخدمين. جميع الحقوق محفوظة.",
  },
};

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  image?: string;
}

const UserCardList: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { language, direction } = useLanguage();

  const isRTL = direction === "rtl";
  const t = (key: keyof typeof translations) => translations[key][language];

  const onSubmit = async (user: AuthUser) => {
    setIsLoading(user.id);
    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: getPasswordByRole(user.role),
        redirect: false,
      });

      if (result?.error) {
        console.log(
          result.error === "CredentialsSignin"
            ? language === "en"
              ? "Invalid email or password"
              : "بريد إلكتروني أو كلمة مرور غير صحيحة"
            : language === "en"
              ? "An error occurred during sign in"
              : "حدث خطأ أثناء تسجيل الدخول",
        );
        alert(t("loginFailed"));
      } else {
        switch (user?.role) {
          case "seller":
            window.location.href = "/seller";
            break;
          case "user":
            window.location.href = "/";
            break;
          case "admin":
            window.location.href = "/admin";
            break;
          default:
            window.location.href = "/";
            break;
        }
      }
    } catch {
      console.log(language === "en" ? "Failed to sign in" : "فشل تسجيل الدخول");
      alert(t("loginFailed"));
    } finally {
      setIsLoading(null);
    }
  };

  const getPasswordByRole = (role: string): string => {
    switch (role) {
      case "admin":
        return "admin123";
      case "seller":
        return "seller123";
      case "default":
        return "user123";
      default:
        return "user123";
    }
  };

  const authUsers: AuthUser[] = users.map((user) => ({
    id: user.id,
    name: user.name ?? t("unknownUser"),
    email: user.email,
    phone: user.phone,
    role: user.role,
    image: user.image ?? undefined,
  }));

  return (
    <div dir={direction} className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {authUsers.map((user) => (
            <div
              key={user.id}
              className="transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-40 bg-primary-100">
                <div
                  className={`absolute -bottom-14 ${isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"} transform`}
                >
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-16 text-center">
                <h2 className="mb-1 text-xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="mb-4 text-sm text-gray-500">
                  @{user.name?.split(" ")[0]?.toLowerCase()}
                </p>

                <div
                  className={`my-4 rounded-lg px-4 py-2 text-sm ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}
                >
                  {roleLabels[user.role]?.[language] || user.role.toUpperCase()}
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <div
                    className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <svg
                      className={`h-4 w-4 text-primary ${isRTL ? "ml-2" : "mr-2"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{user.email}</span>
                  </div>

                  {user.phone && (
                    <div
                      className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <svg
                        className={`h-4 w-4 text-primary ${isRTL ? "ml-2" : "mr-2"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => onSubmit(user)}
                    disabled={isLoading === user.id}
                    className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-300 ${
                      isLoading === user.id
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-primary hover:shadow-lg"
                    }`}
                  >
                    {isLoading === user.id ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className={`h-5 w-5 animate-spin text-white ${isRTL ? "ml-3" : "mr-3"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("signingIn")}
                      </span>
                    ) : (
                      t("signIn")
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCardList;
