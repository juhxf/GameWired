import profileRepository from "../repositories/profileRepository.js"

const profileController = {
    async getPerfilById(req, res) {
        try {
            const id = req.params.id

            const perfil = await profileRepository.readPerfilById(id)

            if (!perfil) {
                return res.status(404).json({ mensagem: "Usuário não encontrado!" })
            }

            return res.json(perfil)
        } catch (err) {
            return res.status(500).json({ erro: err.message })
        }
    },

    async updateProfile(req, res) {
        try {
            const usuarioId = req.params.id
            const { bio } = req.body

            const fotoUrl = req.file ? req.file.path : null

            const perfilAtualizado = await profileRepository.updateProfile(
                usuarioId,
                fotoUrl,
                bio
            )

            console.log("FILE:", req.file)
            console.log("BODY:", req.body)

            return res.json(perfilAtualizado)

        } catch (err) {
            return res.status(500).json({ erro: err.message })
        }
    }
}

export default profileController