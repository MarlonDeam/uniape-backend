import { supabase } from "../config/supabase";

export async function buscarFotosPorImovel(imovelId: number) {
    return await supabase
        .from("foto")
        .select("*")
        .eq("imovel_id", imovelId)
        .order("ordem", { ascending: true });
}

export async function inserirFoto(foto: {
    imovel_id: number;
    url: string;
    ordem?: number;
}) {
    return await supabase
        .from("foto")
        .insert(foto)
        .select()
        .single();
}

export async function excluirFoto(
    fotoId: number,
    imovelId: number
) {
    return await supabase
        .from("foto")
        .delete()
        .eq("id", fotoId)
        .eq("imovel_id", imovelId)
        .select()
        .single();
}