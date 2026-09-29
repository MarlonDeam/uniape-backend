import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { buscarUsuarioPorEmail } from "../services/auth.service";
import { loginSchema } from "../schemas/login.schema";

export async function login(req: Request, res: Response) {
    const resultado = loginSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: resultado.error.issues.map((erro) => ({
                campo: erro.path[0],
                mensagem: erro.message
            }))
        });
    }

    const { email, senha } = resultado.data;

    const { data: usuario, error } = await buscarUsuarioPorEmail(email);

    if (error || !usuario) {
        return res.status(401).json({
            error: "E-mail ou senha inválidos"
        });
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaValida) {
        return res.status(401).json({
            error: "E-mail ou senha inválidos"
        });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({
            error: "JWT_SECRET não configurada"
        });
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            tipo: usuario.tipo
        },
        jwtSecret,
        {
            expiresIn: "2h"
        }
    );

    res.json({
        message: "Login realizado com sucesso",
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            telefone: usuario.telefone
        }
    });
}