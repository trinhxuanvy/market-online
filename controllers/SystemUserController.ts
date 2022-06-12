import { Request, Response } from "express";
import * as SystemUser from "../models/SystemUser";

export const getSystemUsers = async (req: Request, res: Response) => {
  try {
    const systemUsers = await SystemUser.find();

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
  SystemUser.findOneById(req.params.id)
    .then((data) => {
      res.status(200).send({ entity: data });
    })
    .catch((err) => {
      res.status(404).send({ message: "Error" });
    });
};

export const updateSystemUser = async (req: Request, res: Response) => {
  const newSystemUser = await SystemUser.updateOne({
    userId: 1712673,
  });
  res.send(true);
};

export const createSystemUser = async (req: Request, res: Response) => {
  const systemUser: SystemUser.SystemUser = { ...req.body };

  SystemUser.createOne(systemUser)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
};
