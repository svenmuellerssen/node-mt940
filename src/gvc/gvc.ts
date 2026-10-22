import { gvcData } from './gvcData';

const texts = new Map<number, string>(gvcData.map(entry => [entry.code, entry.text] as [number, string]));

/**
 * Get the text of a business transaction code (Geschaeftsvorfallcode).
 *
 * @returns the text (an empty string if the code is known, but has no text) or undefined for an unknown code.
 */
export function gvcText(code: number): string | undefined {
  return texts.get(code);
}
