export function validarSenha(senha, confirmarSenha) {
    if (!senha || !confirmarSenha) {
        throw new Error("Senha e confirmação são obrigatórias!")
    }

    if (senha !== confirmarSenha) {
        throw new Error("As senhas não coincidem!")
    }

    return true
}
export function validarLogin(email, senha) {
    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios!")
    }

    return true
}
export function validarDelete(key) {
    if (key !== 'EXCLUIR') {
        throw new Error("Confirmação inválida!")
    }

    return true
}