import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const commentRepository = {
    async readAll() {
        const conn = await connect()
        const { recordset } = await conn.query(`SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, c.user_id, c.post_id, u.nome_usuario, u.foto_perfil
            FROM Comentarios c
            JOIN Users u ON c.user_id = u.user_id
            JOIN Posts p ON c.post_id = p.post_id
            ORDER BY c.comentario_data ASC`)

        return recordset
    },

    async readById(comentario_id) {
        const conn = await connect()
        const { recordset } = await conn.request()
            .input('comentario_id', sqltype.Int, comentario_id)
            .query(`SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, u.nome_usuario, u.foto_perfil, p.post_id
            FROM Comentarios c
            JOIN Users u ON c.user_id = u.user_id
            JOIN Posts p ON c.post_id = p.post_id
            WHERE c.comentario_id = @comentario_id`)

        if (recordset.length === 0) {
            return null
        }

        return recordset[0]
    },

    async create(comentario) {
        const conn = await connect()

        if (!comentario.comentario_conteudo) {
            throw new Error("Conteúdo do comentário é obrigatório!")
        }

        if (!comentario.user_id) {
            throw new Error("Usuário é obrigatório!")
        }

        if (!comentario.post_id) {
            throw new Error("Post é obrigatório!")
        }

        const sql = `INSERT INTO Comentarios (comentario_conteudo, user_id, post_id) OUTPUT INSERTED.*
        VALUES (@comentario_conteudo, @user_id, @post_id)`

        const result = await conn.request()
            .input("comentario_conteudo", sqltype.VarChar, comentario.comentario_conteudo)
            .input("user_id", sqltype.Int, comentario.user_id)
            .input("post_id", sqltype.Int, comentario.post_id)
            .query(sql)

        return result.recordset[0]
    },

    async readByIdAndUser(comentario_id, user_id) {
        const conn = await connect()
        const { recordset } = await conn.request()
            .input('comentario_id', sqltype.Int, comentario_id)
            .input('user_id', sqltype.Int, user_id)
            .query(`SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, c.post_id, u.nome_usuario, u.foto_perfil
            FROM Comentarios c
            JOIN Users u ON c.user_id = u.user_id
            WHERE c.comentario_id = @comentario_id AND c.user_id = @user_id`)

        return recordset[0] || null
    },

    async update(comentario) {
        const conn = await connect()

        const existing = await this.readByIdAndUser(comentario.comentario_id, comentario.user_id)
        if (!existing) throw new Error("Comentário não encontrado ou não pertence ao usuário!")

        if (!comentario.comentario_conteudo) {
            throw new Error("Conteúdo do comentário é obrigatório!")
        }

        const sql = `UPDATE Comentarios
        SET comentario_conteudo=@comentario_conteudo
        WHERE comentario_id=@comentario_id AND user_id=@user_id`

        const result = await conn.request()
            .input('comentario_id', sqltype.Int, comentario.comentario_id)
            .input('comentario_conteudo', sqltype.VarChar, comentario.comentario_conteudo)
            .input('user_id', sqltype.Int, comentario.user_id)
            .query(sql)

        return result.rowsAffected[0]
    },

    async delete(comentario_id, user_id) {
        const conn = await connect()

        const existing = await this.readByIdAndUser(comentario_id, user_id)
        if (!existing) throw new Error("Comentário não encontrado ou não pertence ao usuário!")

        const sql = `DELETE FROM Comentarios WHERE comentario_id=@comentario_id AND user_id=@user_id`

        const result = await conn.request()
            .input("comentario_id", sqltype.Int, comentario_id)
            .input("user_id", sqltype.Int, user_id)
            .query(sql)

        return result.rowsAffected[0]
    }
}

export default commentRepository