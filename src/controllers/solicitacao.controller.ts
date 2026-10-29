import { Request, Response } from "express";

import {
    buscarSolicitacoesPorGrupo,
    buscarSolicitacao,
    buscarSolicitacaoPorId,
    inserirSolicitacao,
    atualizarStatusSolicitacao
} from "../services/solicitacao.service";

import { criarSolicitacaoSchema } from "../schemas/solicitacao.schema";

import { buscarGrupoPorId } from "../services/grupo.service";

import {
    inserirMembro,
    buscarMembro
} from "../services/membro.service";

import { RequestAutenticado } from "../middlewares/auth.middleware";

export async function listarSolicitacoesPorGrupo(
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
        await buscarSolicitacoesPorGrupo(grupoId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    return res.json(data);
}

export async function criarSolicitacao(
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
            error: "Apenas estudantes podem enviar solicitações"
        });
    }

    const resultado = criarSolicitacaoSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    const {
        grupo_id,
        imovel_id,
        tipo_solicitante,
        status,
        mensagem
    } = resultado.data;

    const { data: grupo, error: erroGrupo } =
        await buscarGrupoPorId(grupo_id);

    if (erroGrupo || !grupo) {
        return res.status(404).json({
            error: "Grupo não encontrado"
        });
    }

    if (grupo.lider_id === req.usuario.id) {
        return res.status(400).json({
            error: "O líder não precisa enviar uma solicitação"
        });
    }

    const {
        data: solicitacaoExistente,
        error: erroSolicitacao
    } = await buscarSolicitacao(grupo_id, req.usuario.id);

    if (erroSolicitacao) {
        return res.status(500).json({
            error: erroSolicitacao.message
        });
    }

    if (solicitacaoExistente) {
        return res.status(409).json({
            error: "Você já possui uma solicitação para este grupo"
        });
    }

    const { data, error } = await inserirSolicitacao({
        grupo_id,
        usuario_id: req.usuario.id,
        imovel_id,
        tipo_solicitante,
        status,
        mensagem
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    return res.status(201).json(data);
}

export async function atualizarStatusSolicitacaoController(
    req: RequestAutenticado,
    res: Response
) {
    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    const solicitacaoId = Number(req.params.id);

    if (!Number.isInteger(solicitacaoId) || solicitacaoId <= 0) {
        return res.status(400).json({
            error: "ID da solicitação inválido"
        });
    }

    const { status } = req.body;

    if (
        typeof status !== "string" ||
        !["aprovada", "rejeitada"].includes(status)
    ) {
        return res.status(400).json({
            error: "O status deve ser 'aprovada' ou 'rejeitada'"
        });
    }

    const {
        data: solicitacao,
        error: erroSolicitacao
    } = await buscarSolicitacaoPorId(solicitacaoId);

    if (erroSolicitacao || !solicitacao) {
        return res.status(404).json({
            error: "Solicitação não encontrada"
        });
    }

    const {
        data: grupo,
        error: erroGrupo
    } = await buscarGrupoPorId(solicitacao.grupo_id);

    if (erroGrupo || !grupo) {
        return res.status(404).json({
            error: "Grupo não encontrado"
        });
    }

    if (grupo.lider_id !== req.usuario.id) {
        return res.status(403).json({
            error: "Apenas o líder do grupo pode alterar solicitações"
        });
    }

    if (solicitacao.status !== "pendente") {
        return res.status(400).json({
            error: "Esta solicitação já foi processada"
        });
    }

    if (status === "aprovada") {
        const {
            data: membroExistente,
            error: erroMembro
        } = await buscarMembro(
            solicitacao.grupo_id,
            solicitacao.usuario_id
        );

        if (erroMembro) {
            return res.status(500).json({
                error: erroMembro.message
            });
        }

        if (!membroExistente) {
            const {
                error: erroInserirMembro
            } = await inserirMembro({
                grupo_id: solicitacao.grupo_id,
                usuario_id: solicitacao.usuario_id
            });

            if (erroInserirMembro) {
                return res.status(400).json({
                    error: erroInserirMembro.message
                });
            }
        } else if (!membroExistente.ativo) {
            return res.status(400).json({
                error: "O usuário possui um cadastro inativo neste grupo"
            });
        }
    }

    const {
        data,
        error
    } = await atualizarStatusSolicitacao(
        solicitacaoId,
        status
    );

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    return res.status(200).json(data);
}