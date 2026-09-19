import crypto from 'node:crypto';

/** Cryptographically random secret for generated app JWT signing (dev default). */
export function generateJwtSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}
