import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioAutenticado {
    id: number;
    tipo: string;
}

export interface RequestAutenticado extends Request {
    usuario?: UsuarioAutenticado;
}

export function autenticar(
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: "Token de autenticação não informado"
        });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            error: "Formato do token inválido"
        });
    }

    const token = partes[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({
            error: "JWT_SECRET não configurada"
        });
    }

    try {
        const payload = jwt.verify(token, jwtSecret);

        if (
            typeof payload === "string" ||
            typeof payload.id !== "number" ||
            typeof payload.tipo !== "string"
        ) {
            return res.status(401).json({
                error: "Token inválido"
            });
        }

        req.usuario = {
            id: payload.id,
            tipo: payload.tipo
        };

        next();
    } catch {
        return res.status(401).json({
            error: "Token inválido ou expirado"
        });
    }
}