import { OkPacket, RowDataPacket } from 'mysql2';
import { Region, StoreType } from '../config/enum';
import { database } from '../connection';
import { isObjEmpty, isDate } from '../utils';

export interface Store {
  storeId?: number | null;
  userId?: number | null;
  storeName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  storeType?: number | null;
  createdUser?: string | null;
  createdDate?: Date | null;
  updatedUser?: string | null;
  updatedDate?: Date | null;
  deletedUser?: string | null;
  deletedDate?: Date | null;
  isDeleted?: boolean | null;
  region?: number | null;
  ratting?: number | null;
  storeProfile?: string | null;
  longtitude?: number | null;
  latitude?: number | null;
}

export const find = (query?: Store): Promise<Store[]> => {
  return new Promise<Store[]>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `SELECT * FROM store`;

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
      const entity: Store[] = [];

      rows.forEach((row) => {
        const entityDb: Store = {
          storeId: row.storeid || '',
          userId: row.userid || '',
          storeName: row.storename || '',
          address: row.address || '',
          phoneNumber: row.phonenumber || '',
          storeType: row.storetype || StoreType.Food,
          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
          region: row.region || Region.Green,
          ratting: row.ratting || 1,
          storeProfile: row.storeprofile || '',
          longtitude: row.longtitude || 0,
          latitude: row.latitude || 0,
        };

        entity.push(entityDb);
      });

      resolve(entity);
    });
  });
};

export const findOneById = (entityId: number): Promise<Store> => {
  return new Promise<Store>((resolve, reject) => {
    var queryString = `SELECT * FROM store WHERE storeid = ? AND isdeleted = false`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);

      const row = (<RowDataPacket>result)[0];
      const entity: Store = row
        ? {
            storeId: row.storeid || '',
            userId: row.userid || '',
            storeName: row.storename || '',
            address: row.address || '',
            phoneNumber: row.phonenumber || '',
            storeType: row.storetype || StoreType.Food,
            createdUser: row.createduser,
            createdDate: row.createddate,
            updatedUser: row.updateduser,
            updatedDate: row.updateddate,
            deletedUser: row.deleteduser,
            deletedDate: row.deleteddate,
            isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
            region: row.region || Region.Green,
            ratting: row.ratting || 1,
            storeProfile: row.storeprofile || '',
            longtitude: row.longtitude || 0,
            latitude: row.latitude || 0,
          }
        : null;

      resolve(entity);
    });
  });
};

export const createOne = (entity: Store): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    const entityAdapt: Store = {
      storeId: entity.storeId || -1,
      userId: entity.userId || -1,
      storeName: entity.storeName || '',
      address: entity.address || '',
      phoneNumber: entity.phoneNumber || '',
      storeType: entity.storeType || StoreType.Food,
      createdUser: entity.createdUser || '',
      createdDate: entity.createdDate || new Date(),
      updatedUser: entity.updatedUser || '',
      updatedDate: entity.updatedDate || new Date(),
      deletedUser: entity.deletedUser || '',
      deletedDate: entity.deletedDate,
      isDeleted: entity.isDeleted || false,
      region: entity.region || Region.Green,
      ratting: entity.ratting || 1,
      storeProfile: entity.storeProfile || '',
      longtitude: entity.longtitude || 0,
      latitude: entity.latitude || 0,
    };
    const queryString = `INSERT INTO store (
        userid,
        storename,
        address,
        phonenumber,
        storetype,
        createduser,
        createddate,
        updateduser,
        updateddate,
        deleteduser,
        deleteddate,
        isdeleted,
        region,
        ratting,
        storeprofile,
        longtitude,
        latitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'storeId') continue;
        arrValue.push(entityAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const updateOne = (entity: Store): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const arrValue = [];
    const entityAdapt: Store = {
      storeId: entity.storeId || 0,
      userId: entity.userId || 0,
      storeName: entity.storeName || '',
      address: entity.address || '',
      phoneNumber: entity.phoneNumber || '',
      storeType: entity.storeType || StoreType.Food,
      createdUser: entity.createdUser || '',
      createdDate: entity.createdDate,
      updatedUser: entity.updatedUser || '',
      updatedDate: entity.updatedDate || new Date(),
      deletedUser: entity.deletedUser || '',
      deletedDate: entity.deletedDate,
      isDeleted: entity.isDeleted || false,
      region: entity.region || Region.Green,
      ratting: entity.ratting || 1,
      storeProfile: entity.storeProfile || '',
      longtitude: entity.longtitude || 0,
      latitude: entity.latitude || 0,
    };
    const queryString = `UPDATE store SET 
        userid = ?,
        storename = ?,
        address = ?,
        phonenumber = ?,
        storetype = ?,
        createduser = ?,
        createddate = ?,
        updateduser = ?,
        updateddate = CURRENT_TIME(),
        deleteduser = ?,
        deleteddate = ?,
        isdeleted = ?,
        region = ?,
        ratting = ?,
        storeprofile = ?,
        longtitude = ?,
        latitude = ? 
        where storeid = ${entityAdapt.storeId}`;

    if (!isObjEmpty(entity)) {
      for (let item in entityAdapt) {
        if (item === 'storeId') continue;
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
    const queryString = `DELETE from store
    where storeid = ?`;

    database.query(queryString, entityId, (err, result) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
