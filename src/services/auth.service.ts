import { supabase } from "../config/supabase";

export async function buscarUsuarioPorEmail(email: string) {
    return await supabase
        .from("usuario")
        .select("id, nome, email, senha_hash, tipo, telefone")
        .eq("email", email)
        .single();
}