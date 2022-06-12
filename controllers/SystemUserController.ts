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
  try {
    const systemUser: SystemUser.SystemUser = { ...req.body };
    const user = await SystemUser.find({ username: systemUser.username });

    if (user.length !== 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Account already exists." });
    }

    SystemUser.createOne(systemUser)
      .then((data) =>
        res.status(200).send({ status: 200, message: "A user was created." })
      )
      .catch((err) => res.status(404).send({ status: 404, message: "Error." }));
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};

export const deleteForeverSystemUser = (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    SystemUser.deleteOne(req.params.id)
      .then((data) =>
        res.status(200).send({ status: 200, message: "This user was deleted." })
      )
      .catch((err) => res.status(404).send({ status: 404, message: "Error." }));
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};

export const deleteSystemUser = (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    SystemUser.updateOne({ userId: req.params.id, isDeleted: true })
      .then((data) =>
        res.status(200).send({ status: 200, message: "This user was deleted." })
      )
      .catch((err) => res.status(404).send({ status: 404, message: "Error." }));
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};

export const unDeleteSystemUser = (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    SystemUser.updateOne({ userId: req.params.id, isDeleted: false })
      .then((data) =>
        res
          .status(200)
          .send({ status: 200, message: "This user was undeleted." })
      )
      .catch((err) => res.status(404).send({ status: 404, message: "Error." }));
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};
