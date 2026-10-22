export type Direction = 'credit' | 'debit';

export type TransactionType = 'credit' | 'debit' | 'reverseCredit' | 'reverseDebit';

export interface Balance {
  readonly direction: Direction;
  /** Amount in minor units (cent), always positive. The sign is given by the direction. */
  readonly amountCents: number;
  readonly currency: string;
  /** ISO date: YYYY-MM-DD */
  readonly date: string;
  /**
   * True for an intermediate balance (:60M:, :62M:): the statement goes on with further transactions
   * on the next page. False for an absolute one (:60F: first balance, :62F: closing balance).
   */
  readonly intermediate: boolean;
}

/** The structured payment information of a transaction (tag :86:). */
export interface Payment {
  /** Business transaction code (Geschaeftsvorfallcode), null if the text is not structured. */
  readonly gvc: number | null;
  readonly bookingText: string;
  readonly primanotaNumber: string;
  /** Purpose of payment: the joined sub fields ?20 to ?29 and ?60 to ?63. */
  readonly text: string;
  readonly purchaserBic: string;
  readonly purchaserAccountNumber: string;
  readonly accountOwnerName: string;
  readonly textKeyAddition: string;
}

export interface Transaction {
  /** ISO date: YYYY-MM-DD */
  readonly valueDate: string;
  /** ISO date: YYYY-MM-DD */
  readonly bookingDate: string;
  readonly type: TransactionType;
  /** Amount in minor units (cent), always positive. The sign is given by the type. */
  readonly amountCents: number;
  readonly currencyLastChar: string;
  readonly bookingKey: string;
  readonly reference: string;
  readonly payment: Payment;
}

export interface Extract {
  readonly bankCode: string;
  readonly accountNumber: string;
  readonly number: string;
  readonly sheetNumber: string;
  readonly openingBalance: Balance;
  readonly closingBalance: Balance;
  readonly transactions: ReadonlyArray<Transaction>;
}

export type WarningCode =
  | 'UNSTRUCTURED_PAYMENT'
  | 'UNKNOWN_SUBFIELD'
  | 'TRANSACTION_WITHOUT_PAYMENT'
  | 'PAYMENT_WITHOUT_TRANSACTION'
  | 'ACCOUNT_WITHOUT_BANK_CODE'
  | 'UNSUPPORTED_TAG'
  | 'IGNORED_LINE';

/** A case that was parsed, but lost or guessed information. */
export interface ParseWarning {
  readonly code: WarningCode;
  readonly message: string;
  /** The MT940 tag the warning belongs to, if there is one. */
  readonly tag?: string;
  /** Line in the parsed text, starting with 1. */
  readonly line: number;
}

export interface ParseOptions {
  /** Turn the first warning into a ParseError. */
  readonly strict?: boolean;
}

export interface Statement {
  readonly referenceNumber: string;
  readonly extracts: ReadonlyArray<Extract>;
  /** Everything that was ignored or guessed while parsing, ordered by line. Empty for a clean statement. */
  readonly warnings: ReadonlyArray<ParseWarning>;
}
