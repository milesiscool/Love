type SessionPayload = {
  role: 'viewer' | 'admin';
  iat: number;
  exp: number;
};

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(input: string) {
  if (input.length % 2 !== 0) {
    throw new Error('Invalid hex');
  }
  const bytes = new Uint8Array(input.length / 2);
  for (let i = 0; i < input.length; i += 2) {
    bytes[i / 2] = Number.parseInt(input.slice(i, i + 2), 16);
  }
  return bytes;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function encryptSession(payload: SessionPayload, secret: string) {
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, payloadBytes);
  return `${toHex(payloadBytes)}.${toHex(new Uint8Array(signature))}`;
}

export async function decryptSession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const [payloadHex, signatureHex] = token.split('.');
    if (!payloadHex || !signatureHex) {
      return null;
    }

    const payloadBytes = fromHex(payloadHex);
    const signatureBytes = fromHex(signatureHex);
    const key = await getHmacKey(secret);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as SessionPayload;

    if (Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildSession(role: 'viewer' | 'admin', ttlSeconds: number): SessionPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    role,
    iat: now,
    exp: now + ttlSeconds
  };
}
