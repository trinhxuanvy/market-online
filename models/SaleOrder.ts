import { OkPacket, RowDataPacket } from 'mysql2';
import { PaymentType, Region, SaleOrderType, StoreType } from '../config/enum';
import { database } from '../connection';
import { isObjEmpty, isDate } from '../utils';

export interface SaleOrder {
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
}

export const find = (query?: SaleOrder): Promise<SaleOrder[]> => {
  return new Promise<SaleOrder[]>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `SELECT * FROM saleorder`;

    if (!isObjEmpty(query)) {
      for (let item in query) {
        if (isDate(query[item])) {
          arrAttrStr.push(`DATE(${item}) = DATE(?)`);
        } else {
          arrAttrStr.push(`${item} = ?`);
        }
        arrValue.push(query[item]);
      }

      queryString += ' WHERE ' + arrAttrStr.join(' and ');
    }

    queryString += ' AND isdeleted = false ';

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const rows = <RowDataPacket[]>result || [];
      const entity: SaleOrder[] = [];

      rows.forEach((row) => {
        const entityDb: SaleOrder = {
          saleOrderId: row.saleorderid || '',
          customerId: row.customerid || '',
          statusId: row.statusId || SaleOrderType.Unapproved,
          totalAmount: row.totalamount || '',
          shippingCost: row.shippingcost || '',
          discount: row.discount || 0,
          debt: row.debt || 0,

          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],

          description: row.description || '',
          payType: row.paytype || PaymentType.Money,
          shipperId: row.shipperid || '',
        };

        entity.push(entityDb);
      });

      resolve(entity);
    });
  });
};

export const findOneById = (entityId: number): Promise<SaleOrder> => {
  return new Promise<SaleOrder>((resolve, reject) => {
    var queryString = `SELECT * FROM saleorder WHERE saleorderid = ? AND isdeleted = false`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);

      const row = (<RowDataPacket>result)[0];
      const entity: SaleOrder = row
        ? {
            saleOrderId: row.saleorderid || '',
            customerId: row.customerid || '',
            statusId: row.statusid || SaleOrderType.Unapproved,
            totalAmount: row.totalamount || '',
            shippingCost: row.shippingcost || '',
            discount: row.discount || 0,
            debt: row.debt || 0,

            createdUser: row.createduser,
            createdDate: row.createddate,
            updatedUser: row.updateduser,
            updatedDate: row.updateddate,
            deletedUser: row.deleteduser,
            deletedDate: row.deleteddate,
            isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],

            description: row.description || '',
            payType: row.paytype || PaymentType.Money,
            shipperId: row.shipperid || '',
          }
        : null;

      resolve(entity);
    });
  });
};

export const createOne = (entity: SaleOrder): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
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
    const queryString = `INSERT INTO saleorder (
        customerid,
        statusid,
        totalamount,
        shippingcost,
        discount,
        debt,
        createduser,
        createddate,
        updateduser,
        updateddate,
        deleteduser,
        deleteddate,
        isdeleted,
        description,
        paytype,
        shipperid
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'saleOrderId') continue;
        arrValue.push(entityAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const updateOne = (entity: SaleOrder): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
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
      createdDate: entity.createdDate,
      updatedUser: entity.updatedUser,
      updatedDate: entity.updatedDate || new Date(),
      deletedUser: entity.deletedUser,
      deletedDate: entity.deletedDate,
      isDeleted: entity.isDeleted,

      description: entity.description || '',
      payType: entity.payType || PaymentType.Money,
      shipperId: entity.shipperId || -1,
    };
    const queryString = `UPDATE saleorder SET 
        customerid = ?,
        statusid = ?,
        totalamount = ?,
        shippingcost = ?,
        discount = ?,
        debt = ?,

        createduser = ?,
        createddate = ?,
        updateduser = ?,
        updateddate = CURRENT_TIME(),
        deleteduser = ?,
        deleteddate = ?,
        isdeleted = ?,

        description = ?,
        paytype = ?,
        shipperid = ?
        where saleorderid = ${entityAdapt.saleOrderId}`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'saleOrderId') continue;
        arrValue.push(entityAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
export const deleteOne = (entityId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const queryString = `DELETE from saleorder
    where saleorderid = ?`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
