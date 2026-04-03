import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const profileRepository = {
    async readPerfilById(usuarioId) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input("usuarioId", sqltype.Int, usuarioId)
            .query(`SELECT foto_perfil, nome_usuario, bio
            FROM Users
            WHERE id = @usuarioId`)

        return recordset[0]
    },

    async updateProfile(usuarioId, foto_perfil, bio) {
        const conn = await connect()

        let query = `
        UPDATE Users SET 
        bio = @bio
    `

    if (foto_perfil) {
        query += `, foto_perfil = @foto_perfil`
    }

    query += ` WHERE id = @usuarioId;

    SELECT foto_perfil, bio
    FROM Users
    WHERE id = @usuarioId`

    const request = conn.request()
        .input("usuarioId", sqltype.Int, usuarioId)
        .input("bio", sqltype.VarChar, bio)

    if (foto_perfil) {
        request.input("foto_perfil", sqltype.VarChar, foto_perfil)
    }

    const { recordset } = await request.query(query)

    return recordset[0]
    }
}

export default profileRepository