import { query, Request, Response } from 'express';
import {
  SaleOrderDetail,
  findOneById,
  find,
  createOne,
  updateOne,
  deleteOne,
} from '../models/SaleOrderDetail';
import {
  findOneById as FindProductById,
  updateOne as UpdateProductQuantity,
} from '../models/Product';

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
export const getBySaleOrderId = async (
  req: Request<SaleOrderDetail>,
  res: Response,
) => {
  try {
    const entities = await find(req.params);

    res.status(200).send({ total: entities.length, entities });
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const post = async (req: Request<SaleOrderDetail>, res: Response) => {
  try {
    const getPro = await FindProductById(req.body.productId);

    if (req.body.quantity > getPro.quantity) {
      res.status(404).send({
        message: 'Error',
      });

      return;
    }

    const entities = await createOne(req.body);

    const updateProd = await UpdateProductQuantity({
      productId: req.body.productId,
      quantity: getPro.quantity - req.body.quantity,
    });

    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
export const put = async (req: Request<SaleOrderDetail>, res: Response) => {
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
    const saleorderdetail = await findOneById(req.params.id);
    const getPro = await FindProductById(saleorderdetail.productId);

    const entities = await deleteOne(req.params.id);

    const updateProd = await UpdateProductQuantity({
      productId: getPro.productId,
      quantity: getPro.quantity + saleorderdetail.quantity,
    });

    res.status(200).send(true);
  } catch (error) {
    res.status(404).send({
      message: 'Error',
    });
  }
};
