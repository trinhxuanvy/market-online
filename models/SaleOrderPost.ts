import { OkPacket, RowDataPacket } from 'mysql2';
import { PaymentType, Region, SaleOrderType, StoreType } from '../config/enum';
import { database } from '../connection';
import { isObjEmpty, isDate, isBoolean } from '../utils';
import {
  SaleOrder,
  createOne as CreateSaleOrder,
  deleteOne as DeleteSaleOrderById,
} from './SaleOrder';
import {
  SaleOrderDetail,
  createOne as CreateSaleOrderDetail,
  deleteManyBySaleOrderId,
} from './SaleOrderDetail';

export interface SaleOrderPost {
  saleOrderId?: number | null;
  customerId?: number | null;
  statusId?: number | null;
  totalAmount?: number | null;
  shippingCost?: number | null;
  discount?: number | null;
  debt?: number | null;

  createdUser?: string | null;
  createdDate?: Date | null;
  updatedUser?: string | null;
  updatedDate?: Date | null;
  deletedUser?: string | null;
  deletedDate?: Date | null;
  isDeleted?: boolean | null;

  description?: string | null;
  payType?: number | null;
  shipperId?: number | null;

  saleOrderDetail: {
    productId?: number | null;
    quantity?: number | null;
  }[];
}

export const createOne = (entity: SaleOrderPost): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    const arrValue = [];
    const entityAdapt: SaleOrder = {
      saleOrderId: entity.saleOrderId || -1,
      customerId: entity.customerId || -1,
      statusId: entity.statusId || SaleOrderType.Unapproved,
      totalAmount: entity.totalAmount || 0,
      shippingCost: entity.shippingCost || 0,
      discount: entity.discount || 0,
      debt: entity.debt || 0,

      createdUser: entity.createdUser,
      createdDate: entity.createdDate || new Date(),
      updatedUser: entity.updatedUser,
      updatedDate: entity.updatedDate || new Date(),
      deletedUser: entity.deletedUser,
      deletedDate: entity.deletedDate,
      isDeleted: entity.isDeleted,

      description: entity.description || '',
      payType: entity.payType || PaymentType.Money,
      shipperId: entity.shipperId || -1,
    };

    const creSaleOrder = await CreateSaleOrder(entityAdapt);

    if (
      (entity.saleOrderDetail != null || entity.saleOrderDetail.length > 0) &&
      creSaleOrder != null
    ) {
      entity.saleOrderDetail.forEach(async (element) => {
        const adapt: SaleOrderDetail = {
          saleOrderDetailId: -1,
          saleOrderId: creSaleOrder,
          productId: element.productId,
          quantity: element.quantity,
        };

        const creSaleOrderDetail = await CreateSaleOrderDetail(adapt);

        if (!creSaleOrderDetail) {
          await DeleteSaleOrderById(creSaleOrder);
          await deleteManyBySaleOrderId(creSaleOrder);
        }
      });
    }
  });
};
