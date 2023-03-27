import * as crypto from "crypto";
import "./env.js"

const password = process.env.ENCRYPTION_PASSWORD;
const salt = process.env.ENCRYPTION_SALT;

function createKeyFromPassword(password, salt) {
	const keyLength = 32; // AES-256 için 32 baytlık anahtar
	const iterations = 100000; // İterasyon sayısı, daha yüksek değerler daha güvenlidir, ancak daha fazla zaman alır
	return crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
}

const key = createKeyFromPassword(password, salt);

export function encrypt(plaintext) {
	const iv = crypto.randomBytes(16); // GCM için rastgele 16 baytlık IV oluştur
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
	let encrypted = cipher.update(plaintext, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	const authTag = cipher.getAuthTag(); // GCM için kimlik doğrulama etiketini alın

	// Şifreli veriyi, IV'yi ve kimlik doğrulama etiketini bir araya getirin
	return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')]).toString('base64');
}

export function decrypt(ciphertext) {
	const data = Buffer.from(ciphertext, 'base64');

	// IV, kimlik doğrulama etiketi ve şifreli veriyi ayırın
	const iv = data.slice(0, 16);
	const authTag = data.slice(16, 32);
	const encrypted = data.slice(32);

	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(authTag); // GCM için kimlik doğrulama etiketini ayarlayın

	let decrypted = decipher.update(encrypted, 'binary', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}
