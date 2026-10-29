import { supabase } from "../config/supabase";

export async function buscarSolicitacoesPorGrupo(grupoId: number) {
    return await supabase
        .from("solicitacao")
        .select("*")
        .eq("grupo_id", grupoId)
        .order("data_solicitacao", { ascending: false });
}

export async function buscarSolicitacao(
    grupoId: number,
    usuarioId: number
) {
    return await supabase
        .from("solicitacao")
        .select("*")
        .eq("grupo_id", grupoId)
        .eq("usuario_id", usuarioId)
        .maybeSingle();
}

export async function buscarSolicitacaoPorId(id: number) {
    return await supabase
        .from("solicitacao")
        .select("*")
        .eq("id", id)
        .single();
}

export async function inserirSolicitacao(solicitacao: {
    grupo_id: number;
    usuario_id: number;
    imovel_id: number;
    tipo_solicitante: string;
    status: string;
    mensagem?: string;
}) {
    return await supabase
        .from("solicitacao")
        .insert(solicitacao)
        .select()
        .single();
}

export async function atualizarStatusSolicitacao(
    id: number,
    status: string
) {
    return await supabase
        .from("solicitacao")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
}