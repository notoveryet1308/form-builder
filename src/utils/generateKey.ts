import crypto from "crypto";
import fs from "fs";
import path from "path";

export const generatePrivateKey = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2024,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const envFilePath = path.join(__dirname, ".env");

  // Save the private key to the .env file
  const envContent = `PRIVATE_KEY="${privateKey.replace(
    /\n/g,
    "\\n"
  )}"\nPUBLIC_KEY="${publicKey.replace(/\n/g, "\\n")}"\n`;

  fs.writeFileSync(envFilePath, envContent, { mode: "0600" });
  return { privateKey, publicKey };
};
