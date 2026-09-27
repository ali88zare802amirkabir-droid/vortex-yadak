const CATEGORY_EMOJI: Record<string, string> = {
  "موتور": "⚙️",
  "ترمز": "🛞",
  "برق": "🔋",
  "بدنه": "🚗",
  "جلوبندی": "🔧",
  "مصرفی": "🧴",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "📦";
}
