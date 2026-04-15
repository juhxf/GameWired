import { describe, it, assert } from "poku"
import { validarLogin } from "../utils/userRules.js"

describe("TESTES DE LOGIN")

it("validarLogin - sucesso", () => {
    assert.equal(validarLogin("teste@email.com", "123"), true, "login válido")
})

it("validarLogin - erros", () => {
    assert.throws(() => validarLogin(null, "123"), "email null")
    assert.throws(() => validarLogin("teste@email.com", null), "senha null")
    assert.throws(() => validarLogin("", ""), "vazio")
})