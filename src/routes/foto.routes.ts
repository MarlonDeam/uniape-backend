import { Router } from "express";

import {
    listarFotosPorImovel,
    criarFoto,
    deletarFoto
} from "../controllers/foto.controller";

import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.get("/imoveis/:id/fotos", listarFotosPorImovel);

router.post(
    "/imoveis/:id/fotos",
    autenticar,
    criarFoto
);

router.delete(
    "/imoveis/:id/fotos/:fotoId",
    autenticar,
    deletarFoto
);

export default router;