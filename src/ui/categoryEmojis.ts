/** Friendly labels — UI only; curriculum IDs stay stable */
export const categoryEmoji: Record<string, string> = {
  'stock-foundations': '📚',
  'chart-literacy': '📊',
  'wizard-playbook': '🧙‍♂️',
  options: '⚡️',
}

export function emojiForCategory(id: string): string {
  return categoryEmoji[id] ?? '📌'
}
