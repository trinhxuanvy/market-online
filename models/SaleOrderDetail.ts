import { OkPacket, RowDataPacket } from 'mysql2';
import { PaymentType, Region, SaleOrderType, StoreType } from '../config/enum';
import { database } from '../connection';
import { isObjEmpty, isDate, isBoolean } from '../utils';

export interface SaleOrderDetail {
  saleOrderDetailId?: number | null;
  saleOrderId?: number | null;
  productId?: number | null;
  quantity?: number | null;
}

export const find = (query?: SaleOrderDetail): Promise<SaleOrderDetail[]> => {
  return new Promise<SaleOrderDetail[]>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `SELECT * FROM saleorderdetail`;

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

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const rows = <RowDataPacket[]>result || [];
      const entity: SaleOrderDetail[] = [];

      rows.forEach((row) => {
        const entityDb: SaleOrderDetail = {
          saleOrderDetailId: row.saleorderdetailid || 0,
          saleOrderId: row.saleorderid || 0,
          productId: row.productid || 0,
          quantity: row.quantity || 0,
        };

        entity.push(entityDb);
      });

      resolve(entity);
    });
  });
};

export const findOneById = (entityId: number): Promise<SaleOrderDetail> => {
  return new Promise<SaleOrderDetail>((resolve, reject) => {
    var queryString = `SELECT * FROM saleorderdetail WHERE saleorderdetailid = ? `;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      const row =
        <RowDataPacket>result == null ? null : (<RowDataPacket>result)[0];
      const entity: SaleOrderDetail = row
        ? {
            saleOrderDetailId: row.saleorderdetailid || 0,
            saleOrderId: row.saleorderid || 0,
            productId: row.productid || 0,
            quantity: row.quantity || 0,
          }
        : null;

      resolve(entity);
    });
  });
};

export const createOne = (entity: SaleOrderDetail): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    const entityAdapt: SaleOrderDetail = {
      saleOrderDetailId: entity.saleOrderDetailId || 0,
      saleOrderId: entity.saleOrderId || -1,
      productId: entity.productId || -1,
      quantity: entity.quantity || 0,
    };
    const queryString = `INSERT INTO saleorderdetail (
          saleorderid,
          productid,
          quantity
        ) VALUES (?, ?, ?)`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'saleOrderDetailId') continue;
        arrValue.push(entityAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const updateOne = (entity: SaleOrderDetail): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    let queryString = `UPDATE saleorderdetail SET `;

    let arrAttrStr = [];
    if (!isObjEmpty(entity)) {
      for (let item in entity) {
        if (isDate(entity[item])) {
          arrAttrStr.push(
            `${item.toLowerCase()} = STR_TO_DATE(?, '%m/%%d/%Y')`,
          );
        } else if (item !== 'saleOrderDetailId') {
          arrAttrStr.push(`${item.toLowerCase()} = ?`);
        }

        if (!isBoolean(entity[item])) {
          arrValue.push(entity[item]);
        } else {
          arrValue.push(Number(entity[item]));
        }

        if (item === 'saleOrderDetailId') {
          arrValue.pop();
        }
      }

      queryString +=
        arrAttrStr.join(', ') +
        ` WHERE saleorderdetailid = ${entity.saleOrderDetailId}`;
    }
    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
export const deleteOne = (entityId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const queryString = `DELETE from saleorderdetail
    where saleorderdetailid = ?`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
export const deleteManyBySaleOrderId = (entityId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const queryString = `DELETE from saleorderdetail
    where saleorderid = ?`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
