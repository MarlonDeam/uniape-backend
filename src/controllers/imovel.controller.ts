import { Request, Response } from "express";
import { buscarImoveis } from "../services/imovel.service";

export async function listarImoveis(req: Request, res: Response) {
    const { data, error } = await buscarImoveis();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
}