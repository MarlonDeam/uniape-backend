import { Request, Response } from "express";
import {
    buscarImoveis,
    inserirImovel
} from "../services/imovel.service";

export async function listarImoveis(req: Request, res: Response) {
    const { data, error } = await buscarImoveis();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
}

export async function criarImovel(req: Request, res: Response) {
    const {
        proprietario_id,
        titulo,
        localizacao,
        preco_mensal,
        tipo,
        vagas_disponiveis,
        mobiliado,
        disponivel
    } = req.body;

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