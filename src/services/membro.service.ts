
import { supabase } from "../config/supabase";

export async function buscarMembrosPorGrupo(grupoId: number) {
    return await supabase
        .from("membro")
        .select("*")
        .eq("grupo_id", grupoId)
        .eq("ativo", true);
}

export async function buscarMembro(
    grupoId: number,
    usuarioId: number
) {
    return await supabase
        .from("membro")
        .select("*")
        .eq("grupo_id", grupoId)
        .eq("usuario_id", usuarioId)
        .maybeSingle();
}

export async function inserirMembro(membro: {
    grupo_id: number;
    usuario_id: number;
}) {
    return await supabase
        .from("membro")
        .insert(membro)
        .select()
        .single();
}

export async function desativarMembro(
    grupoId: number,
    usuarioId: number
) {
    return await supabase
        .from("membro")
        .update({ ativo: false })
        .eq("grupo_id", grupoId)
        .eq("usuario_id", usuarioId)
        .eq("ativo", true)
        .select()
        .maybeSingle();
}