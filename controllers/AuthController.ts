import { NextFunction, Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { ObjectUser } from "../models/ObjectUserModel";
import * as SystemUser from "../models/SystemUser";
import { UserType } from "../config/enum";
import { config } from "../config";
import { checkExpiredDate5Minutes } from "../utils";

export const verifyTokenClient = async (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers["bearer"] as unknown as string;
  const refresh_token = req.headers["refresh_token"] as unknown as string;
  const userid = req.headers["userid"] as unknown as number;

  if (bearer !== "undefined" && refresh_token !== "undefined") {
    const splitBearer = bearer?.split(" ");
    const token = splitBearer[1];

    SystemUser.find({ userId: userid })
      .then(async (result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Account does not exists." });
        }

        if (
          result[0].token === token &&
          result[0].refresh_token === refresh_token &&
          result[0].userType === UserType.Client
        ) {
          const vReToken = verify(
            refresh_token,
            config.refreshTokenSecret,
            (reTokenErr, reTokenData) => {
              if (reTokenErr) return null;

              return reTokenData;
            }
          );

          if (vReToken === null) {
            return res
              .status(404)
              .send({ status: 404, message: "Your account has expired." });
          }

          const vToken: any = verify(
            token,
            config.tokenSecret,
            (tokenErr, tokenData) => {
              return tokenData;
            }
          );

          const clientObj: ObjectUser = {
            userId: result[0].userId,
            username: result[0].username,
            userType: result[0].userType,
          };

          if (!checkExpiredDate5Minutes(vToken.exp)) {
            const newToken = sign(clientObj, config.tokenSecret, {
              algorithm: "HS256",
              expiresIn: config.tokenLife,
            });

            await SystemUser.updateOne({
              userId: result[0].userId,
              token: newToken,
            });
          }

          req["data"] = clientObj;
          next();
        } else {
          return res
            .status(401)
            .send({ status: 401, message: "Unauthorized access." });
        }
      })
      .catch((err) => {
        return res
          .status(401)
          .send({ status: 401, message: "Unauthorized access." });
      });
  } else {
    res.status(403).send({ status: 403, message: "No token provided." });
  }
};

export const verifyTokenAdmin = async (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers["bearer"] as unknown as string;
  const refresh_token = req.headers["refresh_token"] as unknown as string;
  const userid = req.headers["userid"] as unknown as number;

  if (bearer !== "undefined" && refresh_token !== "undefined") {
    const splitBearer = bearer?.split(" ");
    const token = splitBearer[1];

    SystemUser.find({ userId: userid })
      .then(async (result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Account does not exists." });
        }

        if (
          result[0].token === token &&
          result[0].refresh_token === refresh_token &&
          result[0].userType === UserType.Admin
        ) {
          const vReToken = verify(
            refresh_token,
            config.refreshTokenSecret,
            (reTokenErr, reTokenData) => {
              if (reTokenErr) return null;

              return reTokenData;
            }
          );

          if (vReToken === null) {
            return res
              .status(404)
              .send({ status: 404, message: "Your account has expired." });
          }

          const vToken: any = verify(
            token,
            config.tokenSecret,
            (tokenErr, tokenData) => {
              return tokenData;
            }
          );

          const adminObj: ObjectUser = {
            userId: result[0].userId,
            username: result[0].username,
            userType: result[0].userType,
          };

          if (!checkExpiredDate5Minutes(vToken.exp)) {
            const newToken = sign(adminObj, config.tokenSecret, {
              algorithm: "HS256",
              expiresIn: config.tokenLife,
            });

            await SystemUser.updateOne({
              userId: result[0].userId,
              token: newToken,
            });
          }

          console.log(adminObj);
          req["data"] = adminObj;
          console.log(req["data"]);
          next();
        } else {
          return res
            .status(401)
            .send({ status: 401, message: "Unauthorized access." });
        }
      })
      .catch((err) => {
        return res
          .status(401)
          .send({ status: 401, message: "Unauthorized access." });
      });
  } else {
    res.status(403).send({ status: 403, message: "No token provided." });
  }
};

export const loginClient = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const client = await SystemUser.find({ username });

    if (client.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Account is not exist." });
    }

    if (client[0].userType !== UserType.Client || client[0].isDeleted == true) {
      return res.status(404).send({ status: 404, message: "Cannot access." });
    }

    if (!compareSync(password, client[0].password)) {
      return res
        .status(404)
        .send({ status: 404, message: "Incorrect password" });
    }

    const clientObj: ObjectUser = {
      userId: client[0].userId,
      username: client[0].username,
      userType: client[0].userType,
    };
    let token = sign(clientObj, config.tokenSecret, {
      algorithm: "HS256",
      expiresIn: config.tokenLife,
    });
    const refreshToken = sign(clientObj, config.refreshTokenSecret, {
      algorithm: "HS256",
      expiresIn: config.refreshTokenLife,
    });

    await SystemUser.updateOne({
      userId: client[0].userId,
      token,
      refresh_token: refreshToken,
    });

    token = "Bearer " + token;

    res.status(200).send({
      status: 200,
      message: "Logged in successfully",
      token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    res.status(404).send({ status: 404, message: "Error" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const admin = await SystemUser.find({ username });

    if (admin.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Account is not exist." });
    }

    if (admin[0].userType !== UserType.Admin) {
      return res.status(404).send({ status: 404, message: "Cannot access." });
    }

    if (!compareSync(password, admin[0].password)) {
      return res
        .status(404)
        .send({ status: 404, message: "Incorrect password" });
    }

    const adminObj: ObjectUser = {
      userId: admin[0].userId,
      username: admin[0].username,
      userType: admin[0].userType,
    };
    let token = sign(adminObj, config.tokenSecret, {
      algorithm: "HS256",
      expiresIn: config.tokenLife,
    });
    const refreshToken = sign(adminObj, config.refreshTokenSecret, {
      algorithm: "HS256",
      expiresIn: config.refreshTokenLife,
    });

    await SystemUser.updateOne({
      userId: admin[0].userId,
      token,
      refresh_token: refreshToken,
    });

    token = "Bearer " + token;

    res.status(200).send({
      status: 200,
      message: "Logged in successfully",
      token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    res.status(404).send({ status: 404, message: "Error" });
  }
};

export const registerClient = async (req: Request, res: Response) => {
  try {
    const client = await SystemUser.find({ username: req.body?.username });

    if (client.length !== 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Account already exists." });
    }

    const hashPassword = hashSync(req.body?.password, config.saltRounds);

    await SystemUser.createOnlyUser({
      ...req.body,
      isDeleted: false,
      userType: UserType.Client,
      password: hashPassword,
    });

    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({ status: 404, message: "Error" });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await SystemUser.find({ username: req.body?.username });

    if (admin.length !== 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Account already exists." });
    }

    const hashPassword = hashSync(req.body?.password, config.saltRounds);

    await SystemUser.createOnlyUser({
      ...req.body,
      isDeleted: false,
      userType: UserType.Admin,
      password: hashPassword,
    });

    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({ status: 404, message: "Error" });
  }
};

export const logoutAccount = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    SystemUser.updateOne({
      userId: req.params.id,
      token: null,
      refresh_token: null,
    })
      .then(() => {
        return res.status(200).send({ status: 200, message: "Logged out." });
      })
      .catch(() => {
        return res.status(404).send({ status: 404, message: "Error." });
      });
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};
