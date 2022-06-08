import { RowDataPacket } from "mysql2";
import { database } from "../connection";
import { isObjEmpty, isDate } from "../utils";

export interface SystemUser {
  userId: number;
  username: string;
  fullName?: string | null;
  address?: string | null;
  gender?: number | null;
  phoneNumber?: string | null;
  userType?: number | null;
  password: string;
  createdUser?: string | null;
  createdDate?: Date | null;
  updatedUser?: string | null;
  updatedDate?: Date | null;
  deletedUser?: string | null;
  deletedDate?: Date | null;
  isDeleted: boolean;
  token: string;
  refresh_token: string;
}

export const find = (query?: any) => {
  let arrAttrStr = [];
  let arrValue = [];
  let queryString = `SELECT * FROM system_user`;

  if (!isObjEmpty(query)) {
    for (let item in query) {
      if (isDate(query[item])) {
        arrAttrStr.push(`${item} = STR_TO_DATE(?, '%m-%%d-%Y')`);
      } else {
        arrAttrStr.push(`${item} = ?`);
      }
      arrValue.push(query[item]);
    }

    queryString += " WHERE  " + arrAttrStr.join(", ");
  }

  console.log(queryString, arrValue);

  return new Promise<any>((resolve, reject) => {
    database.query(queryString, arrValue, (err, result) => {
      if (err) reject(err);

      const rows = <RowDataPacket[]>result;
      const systemUsers: SystemUser[] = [];

      rows.forEach((row) => {
        const systemUser: SystemUser = {
          userId: row.userId,
          username: row.username || "",
          fullName: row.fullname || "",
          address: row.address || "",
          gender: row.gender[0],
          phoneNumber: row.phonenumber || "",
          userType: row.usertype,
          password: row.password,
          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted[0],
          token: row.token,
          refresh_token: row.refresh_token,
        };

        systemUsers.push(systemUser);
      });
      resolve(systemUsers);
    });
  });
};

export const findOneById = (userId: number, callback: Function) => {
  const queryString = `SELECT * FROM system_user WHERE userid = ?`;

  database.query(queryString, userId, (err, result) => {
    if (err) callback(err);

    const row = (<RowDataPacket>result)[0];
    const systemUser: SystemUser = row
      ? {
          userId: row.userId,
          username: row.username || "",
          fullName: row.fullname || "",
          address: row.address || "",
          gender: row.gender[0],
          phoneNumber: row.phonenumber || "",
          userType: row.usertype,
          password: row.password,
          createdUser: row.createduser,
          createdDate: row.createddate,
          updatedUser: row.updateduser,
          updatedDate: row.updateddate,
          deletedUser: row.deleteduser,
          deletedDate: row.deleteddate,
          isDeleted: row.isdeleted[0],
          token: row.token,
          refresh_token: row.refresh_token,
        }
      : null;

    callback(null, systemUser);
  });
};
