import { Request, Response } from "express";
import {
buscarGrupos,
buscarGrupoPorId,
inserirGrupo
} from "../services/grupo.service";

import { criarGrupoSchema } from "../schemas/grupo.schema";
import { RequestAutenticado } from "../middlewares/auth.middleware";

export async function listarGrupos(
req: Request,
res: Response
) {
const { data, error } = await buscarGrupos();


if (error) {
    console.error("Erro ao listar grupos:", error.message);

    return res.status(500).json({
        error: error.message
    });
}

return res.json(data);


}

export async function listarGrupoPorId(
req: Request,
res: Response
) {
const id = Number(req.params.id);


if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        error: "ID do grupo inválido"
    });
}

const { data, error } = await buscarGrupoPorId(id);

if (error || !data) {
    return res.status(404).json({
        error: "Grupo não encontrado"
    });
}

return res.json(data);


}

export async function criarGrupo(
req: RequestAutenticado,
res: Response
) {
if (!req.usuario) {
return res.status(401).json({
error: "Usuário não autenticado"
});
}


if (req.usuario.tipo !== "estudante") {
    return res.status(403).json({
        error: "Apenas estudantes podem criar grupos"
    });
}

const resultado = criarGrupoSchema.safeParse(req.body);

if (!resultado.success) {
    return res.status(400).json({
        error: "Dados inválidos",
        detalhes: resultado.error.issues.map((erro) => ({
            campo: erro.path[0],
            mensagem: erro.message
        }))
    });
}

const { nome_grupo, imovel_id } = resultado.data;

const { data, error } = await inserirGrupo({
    nome_grupo,
    imovel_id,
    lider_id: req.usuario.id
});

if (error) {
    return res.status(400).json({
        error: error.message
    });
}

return res.status(201).json(data);


}
