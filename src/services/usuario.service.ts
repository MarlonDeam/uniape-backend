import { supabase } from "../config/supabase";

export async function buscarUsuarios() {
    return await supabase
        .from("usuario")
        .select("id, nome, email, tipo, telefone, media_estrelas, data_cadastro")
        .limit(5);
}

export async function inserirUsuario(usuario: {
    nome: string;
    email: string;
    senha_hash: string;
    tipo: string;
    telefone?: string;
}) {
    return await supabase
        .from("usuario")
        .insert(usuario)
        .select()
        .single();
}