import { Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { ObjectUser } from "../models/ObjectUserModel";
import * as SystemUser from "../models/SystemUser";
import { UserType } from "../config/enum";

const saltRounds = genSaltSync(10);

export const verifyTokenClient = (req: Request, res: Response) => {
  const bearer = req.headers.authorization;

  if (bearer !== "undefined") {
    const splitBearer = bearer.split(" ");
    const token = splitBearer[1];

    verify(token, "vychuoi123", (err, data: ObjectUser) => {
      if (err) {
        return res
          .status(403)
          .send({ status: 403, message: "Your account has expired." });
      }

      if (data.userType !== UserType.Client) {
        return res
          .status(403)
          .send({ status: 403, message: "Please login again." });
      }

      return (res["data"] = data);
    });
  } else {
    res.status(403).send({ status: 403, message: "Please login again." });
  }
};

export const verifyTokenAdmin = (req: Request, res: Response) => {
  const bearer = req.headers.authorization;

  if (bearer !== "undefined") {
    const splitBearer = bearer.split(" ");
    const token = splitBearer[1];

    verify(token, "vychuoi123", (err, data: ObjectUser) => {
      if (err) {
        return res
          .status(403)
          .send({ status: 403, message: "Your account has expired." });
      }

      if (data.userType !== UserType.Admin) {
        return res
          .status(403)
          .send({ status: 403, message: "Please login again." });
      }

      return (res["data"] = data);
    });
  } else {
    res.status(403).send({ status: 403, message: "Please login again." });
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

    if (!compareSync(password, client[0].password)) {
      return res
        .status(404)
        .send({ status: 404, message: "Incorrect password" });
    }

    const clientObj: ObjectUser = {
      userId: client[0].userId,
      username: client[0].username,
      password: client[0].password,
      userType: client[0].userType,
      deletedDate: new Date(Date.now()),
      isDeleted: false,
    };
    const token = sign(clientObj, "vychuoi123", {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    const bearer = "Bearer " + token;

    res
      .status(200)
      .send({ status: 200, message: "Logged in successfully", bearer });
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

    if (!compareSync(password, admin[0].password)) {
      return res
        .status(404)
        .send({ status: 404, message: "Incorrect password" });
    }

    const adminObj: ObjectUser = {
      userId: admin[0].userId,
      username: admin[0].username,
      password: admin[0].password,
      userType: admin[0].userType,
    };
    const token = sign(adminObj, "vychuoi123", {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    const bearer = "Bearer " + token;

    res
      .status(200)
      .send({ status: 200, message: "Logged in successfully", bearer });
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

    const hashPassword = hashSync(req.body?.password, saltRounds);

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

    const hashPassword = hashSync(req.body?.password, saltRounds);

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
