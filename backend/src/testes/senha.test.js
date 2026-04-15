import { describe, it, assert } from "poku"
import { validarSenha } from "../utils/userRules.js"

describe("TESTES DE SENHA")

it("validarSenha - sucesso", () => {
    assert.equal(validarSenha("123", "123"), true, "Senhas iguais devem passar")
})

it("validarSenha - erros", () => {
    assert.throws(() => validarSenha(null, "123"), "senha null")
    assert.throws(() => validarSenha("123", null), "confirmar null")
    assert.throws(() => validarSenha("", ""), "ambos vazios")
    assert.throws(() => validarSenha("123", "456"), "senhas diferentes")
})