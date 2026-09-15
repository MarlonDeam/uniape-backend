import { Router } from "express";
import { listarImoveis } from "../controllers/imovel.controller";

const router = Router();

router.get("/", listarImoveis);

export default router;