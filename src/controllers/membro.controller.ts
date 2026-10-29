
import { Request, Response } from "express";

import {
    buscarMembrosPorGrupo,
    buscarMembro,
    inserirMembro,
    desativarMembro
} from "../services/membro.service";

import { entrarGrupoSchema } from "../schemas/membro.schema";
import { buscarGrupoPorId } from "../services/grupo.service";
import { RequestAutenticado } from "../middlewares/auth.middleware";

export async function listarMembrosPorGrupo(
    req: Request,
    res: Response
) {
    const grupoId = Number(req.params.id);

    if (!Number.isInteger(grupoId) || grupoId <= 0) {
        return res.status(400).json({
            error: "ID do grupo inválido"
        });
    }

    const { data: grupo, error: erroGrupo } =
        await buscarGrupoPorId(grupoId);

    if (erroGrupo || !grupo) {
        return res.status(404).json({
            error: "Grupo não encontrado"
        });
    }

    const { data, error } =
        await buscarMembrosPorGrupo(grupoId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    return res.json(data);
}

export async function entrarGrupo(
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
            error: "Apenas estudantes podem entrar em grupos"
        });
    }

    const resultado = entrarGrupoSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    const { grupo_id } = resultado.data;

    const { data: grupo, error: erroGrupo } =
        await buscarGrupoPorId(grupo_id);

    if (erroGrupo || !grupo) {
        return res.status(404).json({
            error: "Grupo não encontrado"
        });
    }

    if (grupo.lider_id === req.usuario.id) {
        return res.status(400).json({
            error: "Você já é o líder deste grupo"
        });
    }

    const { data: membroExistente, error: erroMembro } =
        await buscarMembro(grupo_id, req.usuario.id);

    if (erroMembro) {
        return res.status(500).json({
            error: erroMembro.message
        });
    }

    if (membroExistente?.ativo) {
        return res.status(409).json({
            error: "Você já faz parte deste grupo"
        });
    }

    if (membroExistente && !membroExistente.ativo) {
        return res.status(409).json({
            error: "Você já possui um cadastro inativo neste grupo"
        });
    }

    const { data, error } = await inserirMembro({
        grupo_id,
        usuario_id: req.usuario.id
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    return res.status(201).json(data);
}

export async function removerMembro(
    req: RequestAutenticado,
    res: Response
) {
    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    const grupoId = Number(req.params.grupoId);
    const usuarioId = Number(req.params.usuarioId);

    if (
        !Number.isInteger(grupoId) ||
        grupoId <= 0 ||
        !Number.isInteger(usuarioId) ||
        usuarioId <= 0
    ) {
        return res.status(400).json({
            error: "ID do grupo ou do usuário inválido"
        });
    }

    const { data: grupo, error: erroGrupo } =
        await buscarGrupoPorId(grupoId);

    if (erroGrupo || !grupo) {
        return res.status(404).json({
            error: "Grupo não encontrado"
        });
    }

    if (grupo.lider_id !== req.usuario.id) {
        return res.status(403).json({
            error: "Apenas o líder pode remover membros do grupo"
        });
    }

    if (usuarioId === grupo.lider_id) {
        return res.status(400).json({
            error: "O líder não pode remover a si mesmo"
        });
    }

    const { data: membro, error: erroBuscarMembro } =
        await buscarMembro(grupoId, usuarioId);

    if (erroBuscarMembro) {
        return res.status(500).json({
            error: erroBuscarMembro.message
        });
    }

    if (!membro || !membro.ativo) {
        return res.status(404).json({
            error: "Membro ativo não encontrado neste grupo"
        });
    }

    const { data, error } =
        await desativarMembro(grupoId, usuarioId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            error: "Não foi possível encontrar o membro ativo"
        });
    }

    return res.json({
        message: "Membro removido do grupo com sucesso",
        membro: data
    });
}
