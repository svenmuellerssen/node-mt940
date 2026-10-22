/** An amount in cent as written in MT940 and CSV: a comma and two decimals, no thousands separator (1000,00). */
export function formatAmount(amountCents: number): string {
  return Math.floor(amountCents / 100) + ',' + String(amountCents % 100).padStart(2, '0');
}
