import express from "express";
import cors from "cors";

import usuarioRoutes from "./routes/usuario.routes";
import imovelRoutes from "./routes/imovel.routes";
import authRoutes from "./routes/auth.routes";
import fotoRoutes from "./routes/foto.routes";
import grupoRoutes from "./routes/grupo.routes";
import membroRoutes from "./routes/membro.routes";
import solicitacaoRoutes from "./routes/solicitacao.routes";

import { autenticar, RequestAutenticado } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend do Uniape funcionando!"
    });
});

app.use("/usuarios", usuarioRoutes);
app.use("/imoveis", imovelRoutes);
app.use("/auth", authRoutes);
app.use("/grupos", grupoRoutes);
app.use("/", membroRoutes);
app.use("/", fotoRoutes);
app.use("/", solicitacaoRoutes);

app.get(
    "/teste-auth",
    autenticar,
    (req: RequestAutenticado, res) => {
        res.json({
            message: "Você está autenticado!",
            usuario: req.usuario
        });
    }
);

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});