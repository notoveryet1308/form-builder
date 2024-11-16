import crypto from "crypto";
import fs from "fs";
import path from "path";

export const generatePrivateKey = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519", {
    // Remove modulusLength as it's not needed for ed25519
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const envFilePath = path.join(__dirname, "../../", ".env");

  // Check if .env exists and read its content
  let envContent = fs.existsSync(envFilePath) 
    ? fs.readFileSync(envFilePath, 'utf8') + '\n'
    : '';

  // Append or update the keys
  envContent += `PRIVATE_KEY="${privateKey}"\nPUBLIC_KEY="${publicKey}"`;

  // Write the file
  fs.writeFileSync(envFilePath, envContent, { mode: 0o600 });
  return { privateKey, publicKey };
};

generatePrivateKey()