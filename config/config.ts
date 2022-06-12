import { genSaltSync } from "bcrypt";

export const config = {
  tokenSecret: "secret-token-M@rket-Onl1ne",
  refreshTokenSecret: "secret-refreshToken-M@rket-Onl1ne",
  tokenLife: "1h",
  refreshTokenLife: "1d",
  saltRounds: genSaltSync(10),
};
