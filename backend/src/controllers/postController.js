import postRepository from "../repositories/postRepository.js"

const postController = {
    async getAllPosts(req, res) {
        try {
            const posts = await postRepository.readAll()
            res.json(posts)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar posts!"
            })
        }
    },

    async getPostById(req, res) {
        try {
            const post_id = Number(req.params.post_id)

            if (isNaN(post_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            const post = await postRepository.readById(post_id)

            if (!post) {
                return res.status(404).json({
                    ok: false,
                    message: "Post não encontrado!"
                })
            }

            res.json({
                ok: true,
                data: post
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar post!"
            })
        }
    },

    async insertPost(req, res) {
        try {
            const model = req.body

            if (!model.titulo_postagem || !model.conteudo_postagem) {
                return res.status(400).json({
                    ok: false,
                    message: "Título e conteúdo da postagem são obrigatórios!"
                })
            }

            const postCreated = await postRepository.create(model)

            res.status(201).json({
                ok: true,
                message: 'Postagem inserida com sucesso!',
                data: postCreated
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!'
            })
        }
    },

    async updatePost(req, res) {
        try {
            const model = req.body
            const post_id = Number(req.params.post_id)

            if (isNaN(post_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            model.post_id = post_id

            if (!model.titulo_postagem || !model.conteudo_postagem) {
                return res.status(400).json({
                    ok: false,
                    message: "Título e conteúdo são obrigatórios!"
                })
            }

            const rowsAffected = await postRepository.update(model)

            if (rowsAffected > 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'Post alterado com sucesso!'
                })
            }

            return res.status(404).json({
                ok: false,
                message: 'Post não encontrado!'
            })

        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    },

    async deletePost(req, res) {
        try {
            const post_id = Number(req.params.post_id)
            const confirma = req.body.key

            if (confirma !== 'EXCLUIR') {
                return res.status(400).json({
                    ok: false,
                    message: 'Confirmação inválida!',
                })
            }

            const rowsAffected = await postRepository.delete(post_id)

            if (rowsAffected === 0) {
                return res.status(404).json({
                    ok: false,
                    message: 'Post não encontrado!',
                })
            }

            return res.status(200).json({
                ok: true,
                message: 'Post deletado com sucesso!',
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    }
}

export default postController