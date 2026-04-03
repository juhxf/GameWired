import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const postRepository = {

    async readAll() {
        const conn = await connect()
        const { recordset } = await conn.query(`SELECT p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, u.nome_usuario, u.foto_perfil, g.nome
        FROM Posts p
        JOIN Users u ON p.id = u.id
        JOIN Games g ON p.games_id = g.id
        ORDER BY p.data_postagem DESC`)

        return recordset
    },

    async readById(post_id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('post_id', sqltype.Int, post_id)
            .query(`SELECT p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, u.nome_usuario, u.foto_perfil, g.nome
        FROM Posts p
        JOIN Users u ON p.id = u.id
        JOIN Games g ON p.games_id = g.id
        WHERE post_id = @post_id`)

        if (recordset.length === 0) {
            return null
        }

        return recordset[0]
    },

    async create(post) {
        const conn = await connect()

        if (!post.titulo_postagem || !post.conteudo_postagem) {
            throw new Error("Título e conteúdo são obrigatórios!")
        }

        const sql = `INSERT INTO Posts (titulo_postagem, conteudo_postagem, foto_postagem, id, games_id)
        OUTPUT INSERTED.*
        VALUES (@titulo_postagem, @conteudo_postagem, @foto_postagem, @id, @games_id)`

        const result = await conn.request()
            .input("titulo_postagem", sqltype.VarChar, post.titulo_postagem)
            .input("conteudo_postagem", sqltype.VarChar, post.conteudo_postagem)
            .input("foto_postagem", sqltype.VarChar, post.foto_postagem)
            .input("id", sqltype.Int, post.id)
            .input("games_id", sqltype.Int, post.games_id)
            .query(sql)

        return result.recordset[0]
    },

    async update(post) {
        const conn = await connect()

        const existing = await this.readById(post.post_id)
        if (!existing) throw new Error("Post não encontrado!")

        const sql = `UPDATE Posts
            SET titulo_postagem=@titulo_postagem, conteudo_postagem=@conteudo_postagem, foto_postagem=@foto_postagem, id=@id, games_id=@games_id
            WHERE post_id=@post_id`

        const result = await conn.request()
            .input('post_id', sqltype.Int, post.post_id)
            .input('titulo_postagem', sqltype.VarChar, post.titulo_postagem)
            .input('conteudo_postagem', sqltype.VarChar, post.conteudo_postagem)
            .input('foto_postagem', sqltype.VarChar, post.foto_postagem)
            .input('id', sqltype.Int, post.id)
            .input('games_id', sqltype.Int, post.games_id)
            .query(sql)

        return result.rowsAffected[0]
    },

    async delete(post_id) {
        const conn = await connect()

        const existing = await this.readById(post_id)
        if (!existing) throw new Error("Post não encontrado!")

        const sql = `DELETE FROM Posts WHERE post_id=@post_id AND id=@user_id`

        const result = await conn.request()
            .input("post_id", sqltype.Int, post_id)
            .query(sql)

        return result.rowsAffected[0]
    }
}

export default postRepository