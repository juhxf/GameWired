const titulo = document.querySelector("#titulo")
const data = document.querySelector("#data")
const resumo = document.querySelector("#resumo")
const conteudo = document.querySelector("#conteudo")
const link = document.querySelector("#link")
const imagem = document.querySelector("#imagem")
const preview = document.querySelector("#preview-img")
const btnSave = document.querySelector("#btn-save")


const params = new URLSearchParams(window.location.search)
const id = params.get("id")

function carregarNoticia() {
  const noticia = {
    id: id,
    titulo: "Título exemplo",
    data: "2026-04-10",
    resumo: "Resumo exemplo",
    conteudo: "Conteúdo da notícia...",
    link: "https://exemplo.com",
    imagem: "/frontend/public/assets/imgs/exemplo.jpg"
  }

  titulo.value = noticia.titulo
  data.value = noticia.data
  resumo.value = noticia.resumo
  conteudo.value = noticia.conteudo
  link.value = noticia.link
  preview.src = noticia.imagem
}

imagem.addEventListener("change", () => {
  const file = imagem.files[0]
  if (file) {
    preview.src = URL.createObjectURL(file)
  }
})

btnSave.addEventListener("click", () => {
  const noticiaAtualizada = {
    id,
    titulo: titulo.value,
    data: data.value,
    resumo: resumo.value,
    conteudo: conteudo.value,
    link: link.value
  }

  console.log("Notícia atualizada:", noticiaAtualizada)

  alert("Notícia atualizada com sucesso!")
})

carregarNoticia()