import { describe, it, assert } from "poku"
import { validarDelete } from "../utils/userRules.js"

describe("TESTES DE DELETE")

it("validarDelete - sucesso", () => {
    assert.equal(validarDelete("EXCLUIR"), true, "confirmação correta")
})

it("validarDelete - erros", () => {
    assert.throws(() => validarDelete("ERRADO"), "confirmação inválida")
    assert.throws(() => validarDelete(null), "null")
    assert.throws(() => validarDelete(""), "vazio")
})