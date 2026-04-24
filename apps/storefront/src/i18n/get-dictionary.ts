// This module should only be used in Server Components

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  sk: () => import("./dictionaries/sk.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) =>
  dictionaries[locale as keyof typeof dictionaries]
    ? dictionaries[locale as keyof typeof dictionaries]()
    : dictionaries.sk();
