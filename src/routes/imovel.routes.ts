import { Router } from "express";

import {
    listarImoveis,
    listarImovelPorId,
    criarImovel
} from "../controllers/imovel.controller";

const router = Router();

router.get("/", listarImoveis);
router.get("/:id", listarImovelPorId);
router.post("/", criarImovel);

export default router;