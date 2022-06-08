import { Request, Response } from "express";
import { SystemUser, findOneById, find } from "../models/SystemUser";

export const getSystemUsers = async (req: Request, res: Response) => {
  try {
    const systemUsers: SystemUser[] = await find({
      //userId: 1712526,
      //updatedDate: "1899-11-29",
    });

    res.status(200).send({
      total: systemUsers.length,
      entities: systemUsers,
    });
  } catch (error) {
    res.status(200).send({
      message: "Error",
    });
  }
};

export const getSystemUserById = (
  req: Request<{ id: number }>,
  res: Response
) => {
  findOneById(req.params.id, (err: Error, systemUser: SystemUser) => {
    if (err) return res.status(404).send({ status: 404, message: "Error" });

    return res.status(200).send({ status: 200, entity: systemUser });
  });
};
