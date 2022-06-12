import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import { ObjectUser } from "../models/ObjectUserModel";
import * as SystemUser from "../models/SystemUser";
import { config } from "../config";
import { UserType } from "../config/enum";

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

export const updateSystemUser = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    const admin: ObjectUser = req["data"];

    await SystemUser.updateOne({
      userId: req.params.id,
      ...req.body,
      updatedUser: admin.userId.toString(),
      updatedDate: new Date(),
    })
      .then(() => {
        return res
          .status(200)
          .send({ status: 200, message: "Updated successfully." });
      })
      .catch(() => {
        return res.status(404).send({ status: 404, message: "Error." });
      });
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};

export const updateAccountClient = async (req: Request, res: Response) => {
  try {
    const client: ObjectUser = req["data"];

    if (client.userType !== UserType.Client) {
      res
        .status(404)
        .send({ status: 404, message: "This account is not an client." });
    }

    await SystemUser.updateOne({
      ...req.body,
      userId: client.userId,
      updatedUser: client.userId.toString(),
      updatedDate: new Date(Date.now()),
      userType: UserType.Client,
    })
      .then(() => {
        return res
          .status(200)
          .send({ status: 200, message: "Updated successfully." });
      })
      .catch(() => {
        return res.status(404).send({ status: 404, message: "Error." });
      });
  } catch (error) {
    return res.status(404).send({ status: 404, message: "Error." });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const admin: ObjectUser = req["data"];
    const hashPassword = hashSync(req.body.password, config.saltRounds);
    const systemUser: SystemUser.SystemUser = {
      ...req.body,
      password: hashPassword,
      userType: UserType.Admin,
      createdUser: admin.userId.toString(),
    };
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
      .catch((err) =>
        res.status(404).send({ status: 404, message: "Error.", error: err })
      );
  } catch (error) {
    console.log(error);
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
    const admin: ObjectUser = req["data"];
    SystemUser.updateOne({
      userId: req.params.id,
      isDeleted: true,
      deletedUser: admin.userId.toString(),
      deletedDate: new Date(Date.now()),
    })
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
    const admin: ObjectUser = req["data"];
    SystemUser.updateOne({
      userId: req.params.id,
      isDeleted: false,
      updatedUser: admin.userId.toString(),
      updatedDate: new Date(Date.now()),
    })
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
