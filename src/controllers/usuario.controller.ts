import { Request, Response } from "express";
import bcrypt from "bcrypt";

import {
    buscarUsuarios,
    inserirUsuario
} from "../services/usuario.service";

import { criarUsuarioSchema } from "../schemas/usuario.schema";

export async function listarUsuarios(req: Request, res: Response) {
    const { data, error } = await buscarUsuarios();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
}

export async function criarUsuario(req: Request, res: Response) {
    const resultado = criarUsuarioSchema.safeParse(req.body);

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
        nome,
        email,
        senha,
        tipo,
        telefone
    } = resultado.data;

    const senha_hash = await bcrypt.hash(senha, 10);

    const { data, error } = await inserirUsuario({
        nome,
        email,
        senha_hash,
        tipo,
        telefone
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json({
        id: data.id,
        nome: data.nome,
        email: data.email,
        tipo: data.tipo,
        telefone: data.telefone
    });
}