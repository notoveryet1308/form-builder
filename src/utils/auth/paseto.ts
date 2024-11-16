//PASETO: Platform-Agnostic SEcurity TOkens for Node.js with no dependencies.
import crypto from "crypto";
import { V4 } from "paseto";
import { PasetoPayloadType } from "./types";

const { sign, verify } = V4;

const privateKey = process.env.PRIVATE_KEY || "defaultPrivateKey";
const publicKey = process.env.PUBLIC_KEY || "defaultPublicKey";

const privateKeyObject = crypto.createPrivateKey(privateKey);
const publicKeyObject = crypto.createPublicKey(publicKey);

export const produceToken = async ({
  data,
  expiresIn,
}: {
  data: PasetoPayloadType;
  isRefreshToken: boolean;
  expiresIn: string;
}) => {
  const token = await sign(data, privateKeyObject, {
    expiresIn,
  });
  return token;
};

const consumeToken = async ({
  token,
}: {
  token: string;
}): Promise<PasetoPayloadType> => {
  return await verify(token, publicKeyObject);
};

export default { produceToken, consumeToken };

