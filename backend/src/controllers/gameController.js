import gameRepository from "../repositories/gameRepository.js"

const gameController = {
    async getAllGames(req, res) {
        try {
            const games = await gameRepository.readAll()
            res.json(games)
        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    },

    async getGameById(req, res) {
        try {
            const games_id = req.params.id
            const games = await gameRepository.readById(games_id)

            if (!games) {
                return res.status(404).json({ mensagem: "Jogo não encontrado" })
            }

            res.json(games)

        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    },

    async getGameBySelect(req, res) {
        try {
            const games = await gameRepository.readSelect()
            res.json(games)
        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    }
}

export default gameController