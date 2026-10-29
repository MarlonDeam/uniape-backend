import { Request, Response } from "express";

import {
    buscarFotosPorImovel,
    inserirFoto,
    excluirFoto
} from "../services/foto.service";

import { criarFotoSchema } from "../schemas/foto.schema";

import {
    buscarImovelPorId
} from "../services/imovel.service";

import { RequestAutenticado } from "../middlewares/auth.middleware";

export async function listarFotosPorImovel(
    req: Request,
    res: Response
) {
    const imovelId = Number(req.params.id);

    if (isNaN(imovelId)) {
        return res.status(400).json({
            error: "ID do imóvel inválido"
        });
    }

    const { data: imovel, error: erroImovel } =
        await buscarImovelPorId(imovelId);

    if (erroImovel || !imovel) {
        return res.status(404).json({
            error: "Imóvel não encontrado"
        });
    }

    const { data, error } =
        await buscarFotosPorImovel(imovelId);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
}

export async function criarFoto(
    req: RequestAutenticado,
    res: Response
) {
    const imovelId = Number(req.params.id);

    if (isNaN(imovelId)) {
        return res.status(400).json({
            error: "ID do imóvel inválido"
        });
    }

    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    if (req.usuario.tipo !== "proprietario") {
        return res.status(403).json({
            error: "Apenas proprietários podem cadastrar fotos"
        });
    }

    const resultado = criarFotoSchema.safeParse(req.body);

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
        data: imovel,
        error: erroImovel
    } = await buscarImovelPorId(imovelId);

    if (erroImovel || !imovel) {
        return res.status(404).json({
            error: "Imóvel não encontrado"
        });
    }

    if (imovel.proprietario_id !== req.usuario.id) {
        return res.status(403).json({
            error: "Você não pode adicionar fotos a este imóvel"
        });
    }

    const { data, error } = await inserirFoto({
        imovel_id: imovelId,
        url: resultado.data.url,
        ordem: resultado.data.ordem
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json(data);
}

export async function deletarFoto(
    req: RequestAutenticado,
    res: Response
) {
    const imovelId = Number(req.params.id);
    const fotoId = Number(req.params.fotoId);

    if (isNaN(imovelId) || isNaN(fotoId)) {
        return res.status(400).json({
            error: "ID do imóvel ou da foto inválido"
        });
    }

    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    if (req.usuario.tipo !== "proprietario") {
        return res.status(403).json({
            error: "Apenas proprietários podem excluir fotos"
        });
    }

    const {
        data: imovel,
        error: erroImovel
    } = await buscarImovelPorId(imovelId);

    if (erroImovel || !imovel) {
        return res.status(404).json({
            error: "Imóvel não encontrado"
        });
    }

    if (imovel.proprietario_id !== req.usuario.id) {
        return res.status(403).json({
            error: "Você não pode excluir fotos deste imóvel"
        });
    }

    const { data, error } = await excluirFoto(
        fotoId,
        imovelId
    );

    if (error || !data) {
        return res.status(404).json({
            error: "Foto não encontrada"
        });
    }

    res.status(204).send();
}