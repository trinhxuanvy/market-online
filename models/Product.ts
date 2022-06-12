import { OkPacket, RowDataPacket } from 'mysql2';
import { database } from '../connection';
import { isObjEmpty, isDate, isBoolean } from '../utils';

export interface Product {
  productId?: number | null;
  productName?: string | null;
  productType?: number | null;
  storeId?: number | null;
  quantity?: number | null;
  vat?: number | null;
  salePrice?: number | null;

  createdUser?: string | null;
  createdDate?: Date | null;
  updatedUser?: string | null;
  updatedDate?: Date | null;
  deletedUser?: string | null;
  deletedDate?: Date | null;
  isDeleted?: boolean | null;
}

export const find = (query?: Product): Promise<Product[]> => {
  return new Promise<Product[]>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `SELECT * FROM product`;

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
      queryString += ' AND isdeleted = false ';
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const rows = <RowDataPacket[]>result || [];
      const entity: Product[] = [];

      rows.forEach((row) => {
        const entityDb: Product = {
          productId: row.productid || '',
          productName: row.productname || '',
          productType: row.producttype || '',
          storeId: row.storeid || -1,
          quantity: row.quantity || 0,
          vat: row.vat || -1,
          salePrice: row.saleprice || 0,

          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
        };

        entity.push(entityDb);
      });

      resolve(entity);
    });
  });
};

export const findOneById = (entityId: number): Promise<Product> => {
  return new Promise<Product>((resolve, reject) => {
    var queryString = `SELECT * FROM product WHERE productid = ? AND isdeleted = false`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);

      const row =
        <RowDataPacket>result == null ? null : (<RowDataPacket>result)[0];
      const entity: Product = row
        ? {
            productId: row.productid || '',
            productName: row.productname || '',
            productType: row.producttype || '',
            storeId: row.storeid || -1,
            quantity: row.quantity || 0,
            vat: row.vat || -1,
            salePrice: row.saleprice || 0,

            createdUser: row.createduser,
            createdDate: row.createddate,
            updatedUser: row.updateduser,
            updatedDate: row.updateddate,
            deletedUser: row.deleteduser,
            deletedDate: row.deleteddate,
            isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
          }
        : null;

      resolve(entity);
    });
  });
};

export const createOne = (entity: Product): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    const entityAdapt: Product = {
      productId: entity.productId || -1,
      productName: entity.productName || '',
      productType: entity.productType || 0,
      storeId: entity.storeId || -1,
      quantity: entity.quantity || 0,
      vat: entity.vat || -1,
      salePrice: entity.salePrice || 0,

      createdUser: entity.createdUser || '',
      createdDate: entity.createdDate || new Date(),
      updatedUser: entity.updatedUser || '',
      updatedDate: entity.updatedDate || new Date(),
      deletedUser: entity.deletedUser || '',
      deletedDate: entity.deletedDate,
      isDeleted: entity.isDeleted || false,
    };
    const queryString = `INSERT INTO product (
        productname,
        producttype,
        storeid,
        quantity,
        vat,
        saleprice,

        createduser,
        createddate,
        updateduser,
        updateddate,
        deleteduser,
        deleteddate,
        isdeleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'productId') continue;
        arrValue.push(entityAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const updateOne = (entity: Product): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    let queryString = `UPDATE product SET `;

    let arrAttrStr = [];
    if (!isObjEmpty(entity)) {
      for (let item in entity) {
        if (isDate(entity[item])) {
          arrAttrStr.push(
            `${item.toLowerCase()} = STR_TO_DATE(?, '%m/%%d/%Y')`,
          );
        } else if (item !== 'productId') {
          arrAttrStr.push(`${item.toLowerCase()} = ?`);
        }

        if (!isBoolean(entity[item])) {
          arrValue.push(entity[item]);
        } else {
          arrValue.push(Number(entity[item]));
        }

        if (item === 'productId') {
          arrValue.pop();
        }
      }

      queryString +=
        arrAttrStr.join(', ') + ` WHERE productid = ${entity.productId}`;
    }
    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
export const deleteOne = (entityId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const queryString = `DELETE from product
    where productid = ?`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
