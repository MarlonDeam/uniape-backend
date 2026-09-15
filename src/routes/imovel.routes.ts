import { Router } from "express";
import {
    listarImoveis,
    criarImovel
} from "../controllers/imovel.controller";

const router = Router();

router.get("/", listarImoveis);
router.post("/", criarImovel);

export default router;