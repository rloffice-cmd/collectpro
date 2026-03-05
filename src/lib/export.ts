import type { Card } from '../types/card'

export function exportCardsToCSV(cards: Card[]) {
  const headers = [
    'Name', 'Game', 'Set', 'Card Number', 'Rarity', 'Condition',
    'Language', 'Foil', 'First Edition', 'Quantity',
    'Purchase Price', 'Estimated Value', 'Notes'
  ]

  const rows = cards.map(c => [
    c.name,
    c.game,
    c.set_name ?? '',
    c.card_number ?? '',
    c.rarity ?? '',
    c.condition,
    c.language,
    c.is_foil ? 'Yes' : 'No',
    c.is_first_edition ? 'Yes' : 'No',
    c.quantity.toString(),
    c.purchase_price?.toString() ?? '',
    c.estimated_value?.toString() ?? '',
    c.notes ?? '',
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `collectpro-cards-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
