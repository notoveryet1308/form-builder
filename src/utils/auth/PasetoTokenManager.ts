import { randomBytes } from "crypto";
import { V4 } from "paseto";
import {
  GeneratePayloadArgs,
  TokenPayloadType,
  TokenType,
  UserPayloadType,
} from "./types";
import { HttpError } from "../../middleware/error/withTryCatch";

const { sign, verify } = V4;

const privateKey = process.env.PRIVATE_KEY || "defaultPrivateKey";
const publicKey = process.env.PUBLIC_KEY || "defaultPublicKey";

class PasetoTokenManager {
  #accessTokenExpiration;
  #refreshTokenExpiration;

  constructor() {
    this.#accessTokenExpiration = "15m";
    this.#refreshTokenExpiration = "7d";
  }

  async generateToken({ payload, expiration }: GeneratePayloadArgs) {
    const now = new Date();
    const exp = this.#calculateExpiration({ now, expiration });

    const tokenPayload = {
      ...payload,
      iat: now.toISOString(), // issued at
      exp: exp.toISOString(), // expiration
      jti: randomBytes(16).toString("hex"),
    };

    return await sign(tokenPayload, privateKey);
  }

  async generateTokenPair(userData: UserPayloadType) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken({
        payload: { ...userData, type: "access" },
        expiration: this.#accessTokenExpiration,
      }),
      this.generateToken({
        payload: { ...userData, type: "refresh" },
        expiration: this.#refreshTokenExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: "PASETO",
      expiresIn: this.#getExpirationSeconds(this.#accessTokenExpiration),
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = (await verify(token, publicKey)) as UserPayloadType &
        TokenType &
        TokenPayloadType;

      // Check expiration
      const exp = new Date(decoded?.exp);
      if (exp <= new Date()) {
        throw new HttpError(403, "ACCESS_DENIED");
      }

      return decoded;
    } catch (error: any) {
      throw new HttpError(403, "ACCESS_DENIED");
    }
  }

  async refreshAccessToken({
    previousRefreshToken,
  }: {
    previousRefreshToken: string;
  }) {
    try {
      const decoded = await this.verifyToken(previousRefreshToken);

      // Verify it's a refresh token
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // Generate new token pair
      const { userId, email } = decoded;

      const { refreshToken, accessToken } = await this.generateTokenPair({
        userId,
        email,
      });

      return { refreshToken, accessToken, userId, email };
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  #calculateExpiration({ now, expiration }: { now: Date; expiration: string }) {
    const exp = new Date(now);
    const match = expiration.match(/^(\d+)([mhd])$/);

    if (!match) {
      throw new Error("Invalid expiration format");
    }

    const [, amount, unit] = match;
    switch (unit) {
      case "m":
        exp.setMinutes(exp.getMinutes() + parseInt(amount));
        break;
      case "h":
        exp.setHours(exp.getHours() + parseInt(amount));
        break;
      case "d":
        exp.setDate(exp.getDate() + parseInt(amount));
        break;
    }
    return exp;
  }

  #getExpirationSeconds(expiration: string) {
    const match = expiration.match(/^(\d+)([mhd])$/);
    if (!match) return 0;

    const [, amount, unit] = match;
    switch (unit) {
      case "m":
        return parseInt(amount) * 60;
      case "h":
        return parseInt(amount) * 3600;
      case "d":
        return parseInt(amount) * 86400;
      default:
        return 0;
    }
  }
}

const tokenManager = new PasetoTokenManager();

export default tokenManager;
