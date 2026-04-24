"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "sk", label: "SK" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Replace the first segment of the path with the new locale
    const segments = pathname.split("/");
    // segments[0] is empty if path starts with /
    // segments[1] should be the current locale
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    
    router.push(newPath);
  };

  return (
    <div className="flex gap-2 text-sm font-medium">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-1.5 py-0.5 rounded transition-colors ${
            currentLocale === lang.code
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
