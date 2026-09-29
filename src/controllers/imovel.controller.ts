import { Request, Response } from "express";

import {
    buscarImoveis,
    buscarImovelPorId,
    inserirImovel,
    atualizarImovel,
    excluirImovel
} from "../services/imovel.service";

import { criarImovelSchema } from "../schemas/imovel.schema";
import { RequestAutenticado } from "../middlewares/auth.middleware";

export async function listarImoveis(req: Request, res: Response) {
    const { data, error } = await buscarImoveis();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
}

export async function listarImovelPorId(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID do imóvel inválido"
        });
    }

    const { data, error } = await buscarImovelPorId(id);

    if (error) {
        return res.status(404).json({
            error: "Imóvel não encontrado"
        });
    }

    res.json(data);
}

export async function criarImovel(
    req: RequestAutenticado,
    res: Response
) {
    const resultado = criarImovelSchema
        .omit({ proprietario_id: true })
        .safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    if (req.usuario.tipo !== "proprietario") {
        return res.status(403).json({
            error: "Apenas proprietários podem cadastrar imóveis"
        });
    }

    const {
        titulo,
        localizacao,
        preco_mensal,
        tipo,
        vagas_disponiveis,
        mobiliado,
        disponivel
    } = resultado.data;

    const { data, error } = await inserirImovel({
        proprietario_id: req.usuario.id,
        titulo,
        localizacao,
        preco_mensal,
        tipo,
        vagas_disponiveis,
        mobiliado,
        disponivel
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json(data);
}

export async function editarImovel(
    req: RequestAutenticado,
    res: Response
) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
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
            error: "Apenas proprietários podem editar imóveis"
        });
    }

    const resultado = criarImovelSchema
        .omit({ proprietario_id: true })
        .partial()
        .safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    const { data, error } = await atualizarImovel(
        id,
        req.usuario.id,
        resultado.data
    );

    if (error || !data) {
        return res.status(404).json({
            error: "Imóvel não encontrado ou não pertence ao usuário"
        });
    }

    res.json(data);
}

export async function deletarImovel(
    req: RequestAutenticado,
    res: Response
) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
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
            error: "Apenas proprietários podem excluir imóveis"
        });
    }

    const { data, error } = await excluirImovel(
        id,
        req.usuario.id
    );

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            error: "Imóvel não encontrado ou não pertence ao usuário"
        });
    }

    res.status(204).send();
}