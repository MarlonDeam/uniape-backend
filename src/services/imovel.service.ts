import { supabase } from "../config/supabase";

export async function buscarImoveis() {
    return await supabase
        .from("imovel")
        .select("*")
        .limit(20);
}