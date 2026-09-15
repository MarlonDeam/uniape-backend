import express from "express";
import usuarioRoutes from "./routes/usuario.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend do Uniape funcionando!"
    });
});

app.use("/usuarios", usuarioRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});