import crypto from "crypto"

export default function generateRandomToken(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') 
    .slice(0, length); 
}