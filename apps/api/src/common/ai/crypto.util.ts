import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(
    (process.env.ENCRYPTION_KEY || 'default_32_char_dev_key_change_me!').padEnd(32).slice(0, 32),
    'utf8',
);

export function encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(':');
}

export function decrypt(encryptedData: string): string {
    const [ivB64, authTagB64, encryptedB64] = encryptedData.split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted) + decipher.final('utf8');
}
