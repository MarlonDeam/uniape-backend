import { supabase } from "../config/supabase";

export async function buscarImoveis() {
    return await supabase
        .from("imovel")
        .select("*")
        .limit(20);
}

export async function inserirImovel(imovel: {
    proprietario_id: number;
    titulo: string;
    localizacao: string;
    preco_mensal: number;
    tipo: string;
    vagas_disponiveis?: number;
    mobiliado?: boolean;
    disponivel?: boolean;
}) {
    return await supabase
        .from("imovel")
        .insert(imovel)
        .select()
        .single();
}