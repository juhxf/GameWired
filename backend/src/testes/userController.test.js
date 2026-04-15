import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as bcrypt from 'bcrypt'
import * as db from '../database/connection.js'
import { login } from '../controllers/userController.js'



vi.spyOn(db, 'connect').mockResolvedValue({
  request: () => ({
    input: function () { return this },
    query: async () => ({ recordset: [] })
  })
})

vi.spyOn(bcrypt, 'compare').mockResolvedValue(true)

describe('TESTES CONTROLLER LOGIN', () => {

  let req
  let res

  beforeEach(() => {
    req = { body: {} }

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  })

  it('deve retornar 400 se faltar dados', async () => {
    req.body = {}

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('deve retornar 401 se usuário não existir', async () => {

    db.connect.mockResolvedValueOnce({
      request: () => ({
        input: function () { return this },
        query: async () => ({ recordset: [] })
      })
    })

    req.body = {
      email: 'teste@email.com',
      senha: '123'
    }

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('deve retornar 401 se senha for inválida', async () => {

    db.connect.mockResolvedValueOnce({
      request: () => ({
        input: function () { return this },
        query: async () => ({
          recordset: [{ senha: 'hash' }]
        })
      })
    })

    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

    req.body = {
      email: 'teste@email.com',
      senha: '123'
    }

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('deve retornar 200 se login for válido', async () => {

    db.connect.mockResolvedValueOnce({
      request: () => ({
        input: function () { return this },
        query: async () => ({
          recordset: [{ senha: 'hash' }]
        })
      })
    })

    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

    req.body = {
      email: 'teste@email.com',
      senha: '123'
    }

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })
})