import { query, Request, Response } from "express";
import { ObjectUser } from "../models/ObjectUserModel";
import {
  Product,
  findOneById,
  find,
  createOne,
  updateOne,
  deleteOne,
} from "../models/Product";

export const get = async (req: Request, res: Response) => {
  try {
    const entity = await find();

    res.status(200).send({ total: entity.length, entities: entity });
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
export const getById = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const entity = await findOneById(req.params.id);

    res.status(200).send({ entity });
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
export const getByStoreId = async (req: Request<Product>, res: Response) => {
  try {
    const entities = await find(req.params);

    res.status(200).send({ total: entities.length, entities });
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
export const post = async (req: Request<Product>, res: Response) => {
  try {
    const entities = await createOne(req.body);
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
export const put = async (req: Request<Product>, res: Response) => {
  try {
    const client: ObjectUser = req["data"];

    const entities = await updateOne({
      ...req.body,
      updatedUser: client.userId,
      updatedDate: new Date(Date.now()),
    });
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
export const deleteById = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    const entities = await deleteOne(req.params.id);
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};

export const updateProduct = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    const client: ObjectUser = req["data"];

    const entities = await updateOne({
      ...req.body,
      productId: req.params.id,
      updatedUser: client.userId.toString(),
      updatedDate: new Date(Date.now()),
    });
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};

export const deleteProduct = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    const client: ObjectUser = req["data"];

    const entities = await updateOne({
      productId: req.params.id,
      deletedUser: client.userId.toString(),
      deletedDate: new Date(Date.now()),
      isDeleted: true,
    });
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};

export const unDeleteProduct = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  try {
    const client: ObjectUser = req["data"];

    const entities = await updateOne({
      productId: req.params.id,
      updatedUser: client.userId.toString(),
      updatedDate: new Date(Date.now()),
      isDeleted: false,
    });
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: "Error",
    });
  }
};
