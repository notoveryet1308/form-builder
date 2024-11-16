export type PasetoPayloadType = {
  userId: string;
};

export interface TokenPayloadType {
  iat: string;
  exp: string;
  jti: string;
}

export interface UserPayloadType {
  email: string;
  userId: number;
}

export type TokenType = {
  type: "refresh" | "access";
};

export interface GeneratePayloadArgs {
  payload: UserPayloadType & TokenType;
  expiration: string;
}
