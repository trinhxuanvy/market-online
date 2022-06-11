import { Request, Response } from "express";
import { genSaltSync, hashSync } from "bcrypt";
import { ObjectUser } from "../models/ObjectUserModel";
import {
  SystemUser,
  findOneById,
  find,
  createOne,
  createOnlyUser,
} from "../models/SystemUser";

const saltRounds = genSaltSync(10);

export const getSystemUsers = async (req: Request, res: Response) => {
  try {
    const systemUsers = await find();

    res.status(200).send({
      total: systemUsers.length,
      entities: systemUsers,
    });
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};

export const getSystemUserById = (
  req: Request<{ id: number }>,
  res: Response
) => {
  findOneById(req.params.id)
    .then((data) => {
      res.status(200).send({ entity: data });
    })
    .catch((err) => {
      res.status(404).send({ message: "Error" });
    });
};

export const registerAccount = async (
  req: Request<ObjectUser>,
  res: Response
) => {
  const hashPassword = hashSync(req.body?.password, saltRounds);
  createOnlyUser({
    ...req.body,
    isDeleted: false,
    userType: 1,
    password: hashPassword,
  })
    .then((data) => {
      res.status(200).send({ id: data });
    })
    .catch((err) => {
      res.status(404).send({ message: "Error" });
    });
};
