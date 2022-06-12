import { query, Request, Response } from 'express';
import {
  Store,
  findOneById,
  find,
  createOne,
  updateOne,
  deleteOne,
} from '../models/Store';

export const get = async (req: Request, res: Response) => {
  try {
    const entity = await find();

    res.status(200).send({ total: entity.length, entities: entity });
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const getById = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const entity = await findOneById(req.params.id);

    res.status(200).send({ entity });
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const getByUserId = async (req: Request<Store>, res: Response) => {
  try {
    const entities = await find(req.params);

    res.status(200).send({ total: entities.length, entities });
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const post = async (req: Request<Store>, res: Response) => {
  try {
    const entities = await createOne(req.body);
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const put = async (req: Request<Store>, res: Response) => {
  try {
    const entities = await updateOne(req.body);
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const deleteById = async (
  req: Request<{ id: number }>,
  res: Response,
) => {
  try {
    const entities = await deleteOne(req.params.id);
    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
