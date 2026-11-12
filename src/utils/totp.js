// Base32 decode according to RFC 4648
export function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/[\s-]+/g, '');
  let bits = 0;
  let value = 0;
  const output = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
}

// Generate RFC 6238 TOTP 6-digit code
export async function generateTOTP(secretBase32, timeStep = 30, digits = 6) {
  try {
    const keyBytes = base32Decode(secretBase32);
    if (!keyBytes || keyBytes.length === 0) return '000000';

    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / timeStep);
    const counterBuf = new ArrayBuffer(8);
    const dataView = new DataView(counterBuf);
    dataView.setUint32(0, Math.floor(counter / 0x100000000));
    dataView.setUint32(4, counter >>> 0);

    const subtle = (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) ||
                   (typeof window !== 'undefined' && window.crypto?.subtle);
    if (!subtle) {
      console.warn('Crypto subtle not available');
      return '000000';
    }

    const cryptoKey = await subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const signature = await subtle.sign('HMAC', cryptoKey, counterBuf);
    const hmac = new Uint8Array(signature);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % (10 ** digits);
    return code.toString().padStart(digits, '0');
  } catch (err) {
    console.error('Error generating TOTP:', err);
    return '000000';
  }
}

export function getTOTPSecondsRemaining(timeStep = 30) {
  const epoch = Math.floor(Date.now() / 1000);
  return timeStep - (epoch % timeStep);
}
