import { Router } from "express";
import {
    listarUsuarios,
    criarUsuario
} from "../controllers/usuario.controller";

const router = Router();

router.get("/", listarUsuarios);

router.post("/", criarUsuario);

export default router;