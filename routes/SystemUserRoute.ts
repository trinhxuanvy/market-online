import { Router } from "express";
import * as systemUserController from "../controllers/SystemUserController";
const router = Router();

router.get("/api/v1/GetSystemUsers", systemUserController.getSystemUsers);

router.get(
  "/api/v1/GetSystemUserById/:id",
  systemUserController.getSystemUserById
);

router.post("/api/v1/RegisterAccount", systemUserController.registerAccount);

export default router;
