import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const profileRepository = {
    async readPerfilById(usuarioId) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input("user_id", sqltype.Int, usuarioId)
            .query(`SELECT foto_perfil, nome_usuario, bio
            FROM Users
            WHERE user_id = @user_id`)

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

    query += ` WHERE user_id = @user_id;

    SELECT foto_perfil, bio
    FROM Users
    WHERE user_id = @user_id`

    const request = conn.request()
        .input("user_id", sqltype.Int, usuarioId)
        .input("bio", sqltype.VarChar, bio)

    if (foto_perfil) {
        request.input("foto_perfil", sqltype.VarChar, foto_perfil)
    }

    const { recordset } = await request.query(query)

    return recordset[0]
    }
}

export default profileRepository