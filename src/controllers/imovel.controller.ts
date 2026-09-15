import { Request, Response } from "express";

import {
    buscarImoveis,
    buscarImovelPorId,
    inserirImovel,
    atualizarImovel,
    excluirImovel
} from "../services/imovel.service";

import { criarImovelSchema } from "../schemas/imovel.schema";

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

export async function criarImovel(req: Request, res: Response) {
    const resultado = criarImovelSchema.safeParse(req.body);

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
        proprietario_id,
        titulo,
        localizacao,
        preco_mensal,
        tipo,
        vagas_disponiveis,
        mobiliado,
        disponivel
    } = resultado.data;

    const { data, error } = await inserirImovel({
        proprietario_id,
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

export async function editarImovel(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID do imóvel inválido"
        });
    }

    const resultado = criarImovelSchema.partial().safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    const { data, error } = await atualizarImovel(id, resultado.data);

    if (error) {
        return res.status(404).json({
            error: "Imóvel não encontrado"
        });
    }

    res.json(data);
}

export async function deletarImovel(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID do imóvel inválido"
        });
    }

    const { error } = await excluirImovel(id);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.status(204).send();
}