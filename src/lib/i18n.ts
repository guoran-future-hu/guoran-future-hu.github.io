import chinese from "./zh.json";

export type Language = "en" | "zh";

// Inspect translated display text, not the page URL: untranslated English
// (including identical dictionary values) keeps English typography.
export function textLanguage(...text: string[]): "en" | "zh-CN" {
  return text.some((value) => /\p{Script=Han}/u.test(value)) ? "zh-CN" : "en";
}
export function languageFromPath(path: string): Language {
  return path === "/zh" || path.startsWith("/zh/") ? "zh" : "en";
}

export function localizedPath(path: string, language: Language): string {
  if (path === "/404.html" || path === "/zh/404/") {
    return language === "zh" ? "/zh/404/" : "/404.html";
  }
  const englishPath = path.replace(/^\/zh(?=\/|$)/, "") || "/";
  return language === "zh" ? `/zh${englishPath}` : englishPath;
}

// English copy stays beside the markup. Only Chinese translations live here.
// Normalize line wrapping so formatting a paragraph does not break its translation.
export function translator(path: string) {
  const language = languageFromPath(path);
  const translations: Record<string, string> = chinese;
  return (english: string): string =>
    language === "zh"
      ? (translations[english.replace(/\s+/g, " ").trim()] ?? english)
      : english;
}
