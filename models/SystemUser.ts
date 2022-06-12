import { OkPacket, RowDataPacket } from "mysql2";
import { Gender, UserType } from "../config/enum";
import { database } from "../connection";
import { isObjEmpty, isDate, isBoolean } from "../utils";
import { ObjectUser } from "./ObjectUserModel";

export interface SystemUser {
  userId?: number | null;
  username?: string | null;
  fullName?: string | null;
  address?: string | null;
  region?: number | null;
  gender?: number | null;
  phoneNumber?: string | null;
  userType?: number | null;
  password?: string | null;
  createdUser?: string | null;
  createdDate?: Date | null;
  updatedUser?: string | null;
  updatedDate?: Date | null;
  deletedUser?: string | null;
  deletedDate?: Date | null;
  isDeleted?: boolean | null;
  token?: string | null;
  refresh_token?: string | null;
}

export const find = (query?: SystemUser): Promise<SystemUser[]> => {
  return new Promise<SystemUser[]>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `SELECT * FROM system_user`;

    if (!isObjEmpty(query)) {
      for (let item in query) {
        if (isDate(query[item])) {
          arrAttrStr.push(`DATE(${item}) = DATE(?)`);
        } else {
          arrAttrStr.push(`${item} = ?`);
        }
        arrValue.push(query[item]);
      }

      queryString += " WHERE " + arrAttrStr.join(" and ");
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const rows = <RowDataPacket[]>result || [];
      const systemUsers: SystemUser[] = [];

      rows.forEach((row) => {
        const systemUser: SystemUser = {
          userId: row.userid,
          username: row.username,
          fullName: row.fullname,
          address: row.address,
          gender: row.gender[0],
          phoneNumber: row.phonenumber,
          userType: row.usertype,
          password: row.password,
          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
          token: row.token,
          refresh_token: row.refresh_token,
        };

        systemUsers.push(systemUser);
      });

      resolve(systemUsers);
    });
  });
};

export const findOneById = (userId: number): Promise<SystemUser> => {
  return new Promise<SystemUser>((resolve, reject) => {
    const queryString = `SELECT * FROM system_user WHERE userid = ?`;

    database.query(queryString, userId, (err, result) => {
      if (err) reject(err);

      const row = (<RowDataPacket>result)[0];
      const systemUser: SystemUser = row
        ? {
            userId: row.userId,
            username: row.username || "",
            fullName: row.fullname || "",
            address: row.address || "",
            gender: row.gender === null ? 0 : row.gender[0],
            phoneNumber: row.phonenumber || "",
            userType: row.usertype,
            password: row.password,
            createdUser: row.createduser,
            createdDate: row.createddate,
            updatedUser: row.updateduser,
            updatedDate: row.updateddate,
            deletedUser: row.deleteduser,
            deletedDate: row.deleteddate,
            isDeleted: row.isdeleted === null ? 0 : row.isdeleted[0],
            token: row.token,
            refresh_token: row.refresh_token,
          }
        : null;

      resolve(systemUser);
    });
  });
};

export const createOne = (systemUser: SystemUser): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    const arrValue = [];
    const systemUserAdapt: SystemUser = {
      username: systemUser.username,
      fullName: systemUser.fullName,
      address: systemUser.address,
      gender: systemUser.gender || Gender.Male,
      phoneNumber: systemUser.phoneNumber,
      userType: systemUser.userType,
      password: systemUser.password,
      createdUser: systemUser.createdUser,
      createdDate: systemUser.createdDate || new Date(Date.now()),
      updatedUser: systemUser.updatedUser,
      updatedDate: systemUser.updatedDate,
      deletedUser: systemUser.deletedUser,
      deletedDate: systemUser.deletedDate,
      isDeleted: systemUser.isDeleted || false,
    };

    const queryString = `INSERT INTO system_user (
        username,
        fullname,
        address,
        gender,
        phonenumber,
        userType,
        password,
        createdUser,
        createdDate,
        updatedUser,
        updatedDate,
        deletedUser,
        deletedDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (!isObjEmpty(systemUser)) {
      for (let item in systemUserAdapt) {
        arrValue.push(systemUserAdapt[item]);
      }
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const insertId = (<OkPacket>result)?.insertId;
      resolve(insertId);
    });
  });
};

export const createOnlyUser = (userInfo: ObjectUser): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    const queryString = `INSERT INTO system_user (username, usertype, password) VALUES (?, ?, ?)`;

    database.query(
      queryString,
      [userInfo.username, userInfo.userType, userInfo.password],
      (err, result) => {
        if (err) reject(err);
        const insertId = (<OkPacket>result).insertId;
        resolve(insertId);
      }
    );
  });
};

export const updateOne = (systemUser: SystemUser): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    let arrAttrStr = [];
    let arrValue = [];
    let queryString = `UPDATE system_user SET `;

    if (!isObjEmpty(systemUser)) {
      for (let item in systemUser) {
        if (isDate(systemUser[item])) {
          arrAttrStr.push(
            `${item.toLowerCase()} = STR_TO_DATE(?, '%m/%%d/%Y')`
          );
        } else if (item !== "userId") {
          arrAttrStr.push(`${item.toLowerCase()} = ?`);
        }

        if (!isBoolean(systemUser[item])) {
          arrValue.push(systemUser[item]);
        } else {
          arrValue.push(Number(systemUser[item]));
        }

        if (item === "userId") {
          arrValue.pop();
        }
      }

      queryString +=
        arrAttrStr.join(", ") + ` WHERE userid = ${systemUser.userId}`;
    }

    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const updateRow = <OkPacket>result;
      resolve(updateRow.changedRows);
    });
  });
};

export const deleteOne = (userId: number): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    const queryString = `DELETE FROM system_user WHERE userId = ?`;

    database.query(queryString, userId, (err, result) => {
      if (err) reject(err);

      const deleteRow = <OkPacket>result;
      console.log(deleteRow);
      resolve(deleteRow.changedRows);
    });
  });
};
