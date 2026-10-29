import { supabase } from "../config/supabase";

export async function buscarGrupos() {
    return await supabase
        .from("grupo")
        .select("*")
        .order("data_criacao", { ascending: false });
}

export async function buscarGrupoPorId(id: number) {
    return await supabase
        .from("grupo")
        .select("*")
        .eq("id", id)
        .single();
}

export async function inserirGrupo(grupo: {
    nome_grupo: string;
    imovel_id?: number;
    lider_id: number;
}) {
    return await supabase
        .from("grupo")
        .insert(grupo)
        .select()
        .single();
}