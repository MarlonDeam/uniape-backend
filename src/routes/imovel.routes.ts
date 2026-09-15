import { Router } from "express";

import {
    listarImoveis,
    listarImovelPorId,
    criarImovel,
    editarImovel,
    deletarImovel
} from "../controllers/imovel.controller";

const router = Router();

router.get("/", listarImoveis);
router.get("/:id", listarImovelPorId);
router.post("/", criarImovel);
router.put("/:id", editarImovel);
router.delete("/:id", deletarImovel);

export default router;