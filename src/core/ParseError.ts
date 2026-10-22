export class ParseError extends Error {
  /** The MT940 tag (e.g. '61' or '60F') the error belongs to, if there is one. */
  readonly tag?: string;

  constructor(message: string, tag?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'ParseError';
    this.tag = tag;
  }
}
