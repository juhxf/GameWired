const newsList = document.querySelector("#news-list")

const modal = document.querySelector("#delete-modal")
const btnCancel = document.querySelector("#cancel-delete")
const btnConfirm = document.querySelector("#confirm-delete")

let selectedId = null

const noticias = [
  {
    id: 1,
    titulo: "Nova atualização do jogo",
    data: "2026-04-10",
    imagem: "/frontend/public/assets/imgs/exemplo.jpg"
  }
]

function renderNoticias() {
  newsList.innerHTML = ""

  noticias.forEach(noticia => {
    const card = document.createElement("div")
    card.classList.add("news-card")

    card.innerHTML = `
      <img src="${noticia.imagem}" alt="Capa">

      <div class="news-content">
        <h3>${noticia.titulo}</h3>
        <span class="date">${noticia.data}</span>

        <div class="actions">
          <button class="btn-edit" data-id="${noticia.id}">
            <i class="bi bi-pencil"></i> Editar
          </button>

          <button class="btn-delete" data-id="${noticia.id}">
            <i class="bi bi-trash"></i> Excluir
          </button>
        </div>
      </div>
    `

    newsList.appendChild(card)
  })
}

newsList.addEventListener("click", (e) => {
  const button = e.target.closest("button")
  const id = button?.dataset.id

  if (!button) return

  if (button.classList.contains("btn-delete")) {
    selectedId = id
    modal.classList.remove("hidden")
  }

  if (button.classList.contains("btn-edit")) {
    window.location.href = `/edit-news.html?id=${id}`
  }
})

btnCancel.addEventListener("click", () => {
  modal.classList.add("hidden")
  selectedId = null
})

btnConfirm.addEventListener("click", () => {
  console.log("Excluir notícia:", selectedId)

  // await fetch(`/api/news/${selectedId}`, { method: "DELETE" })

  modal.classList.add("hidden")
  selectedId = null
})

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden")
    selectedId = null
  }
})

renderNoticias()