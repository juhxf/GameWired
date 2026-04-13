// AUTENTICAÇÃO PARA PUBLICAR

function communityAuth() {
  const token = localStorage.getItem("token")

  const CommunityOff = document.getElementById("CommunityLoggedOff")
  const CommunityIn = document.getElementById("CommunityLoggedIn")

  if (token) {
    CommunityOff.classList.add("hidden")
    CommunityIn.classList.remove("hidden")
  } else {
    CommunityOff.classList.remove("hidden")
    CommunityIn.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("token")
  window.location.reload()
}

document.addEventListener("DOMContentLoaded", communityAuth)

// PEGANDO O ID DO USUÁRIO COM O JWT

function getUserIdFromToken() {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payloadBase64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const decoded = JSON.parse(atob(payloadBase64))
    return Number(decoded.id)
  } catch (e) {
    console.error("Erro ao decodificar token:", e)
    return null
  }
}

// CARREGAR PERFIL

document.addEventListener("DOMContentLoaded", () => { carregarPerfil() })

async function carregarPerfil() {
  const token = localStorage.getItem("token")
  const abrirPerfilUsuario = document.getElementById("abrirPerfil")

  if (!token) {
    abrirPerfilUsuario.style.display = "none"
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const user = await res.json()

    abrirPerfilUsuario.addEventListener("click", () => {
      window.location.href = `/frontend/views/pages/subpages/profile.html`
    })

    document.getElementById("nome_usuario").textContent = user.nome_usuario

    const foto = document.querySelector(".foto-perfil")
    foto.src = user.foto_perfil

  } catch (err) {
    console.error("Erro ao carregar perfil:", err)
  }
}

// MODAL DE POSTAGEM

let editandoId = null

document.addEventListener("DOMContentLoaded", () => {
  const openModal = document.querySelector(".openModal")
  const modal = document.querySelector(".modal")
  const closeModal = document.querySelector(".closeModal")
  const form = document.querySelector(".postForm")

  openModal.addEventListener("click", () => {
    modal.style.display = "flex"
  })

  closeModal.addEventListener("click", () => {
    modal.style.display = "none"
    form.reset()
    editandoId = null

    document.querySelector(".modal h3").textContent = "Faça sua postagem na comunidade!"
    document.querySelector(".sentPost").textContent = "Enviar"
  })

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
      form.reset()
      editandoId = null
    }
  })
})

// FORMULÁRIO DE POSTAGEM E VALIDAÇÃO

const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const token = localStorage.getItem("token")

  const titulo = document.getElementById("titulo_postagem").value.trim()
  const conteudo = document.getElementById("conteudo_postagem").value.trim()
  const categoria = document.getElementById("categoria_postagem").value
  const fileInput = document.getElementById("foto_postagem")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para criar uma postagem.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  if (!titulo || !conteudo || !categoria) {
    Swal.fire({
      icon: "warning",
      title: "Preencha todos os dados!",
      text: "Os campos de título, jogo e conteúdo são obrigatórios.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  const formData = new FormData()
  formData.append("titulo_postagem", titulo)
  formData.append("conteudo_postagem", conteudo)
  formData.append("games_id", categoria)

  if (fileInput.files.length > 0) {
    formData.append("foto_postagem", fileInput.files[0])
  }

  let url = "http://localhost:3000/posts"
  let method = "POST"

  if (editandoId) {
    url = `http://localhost:3000/posts/${editandoId}`
    method = "PATCH"
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: result.message || "Erro ao criar postagem!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Postagem feita com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "community.html"
    })
  } catch (err) {
    console.error("Erro ao criar postagem:", err)
  }
})

// SELECT COM OS JOGOS

document.addEventListener("DOMContentLoaded", () => { carregarJogos() })

async function carregarJogos() {
  try {
    const res = await fetch("http://localhost:3000/games/select")
    const games = await res.json()

    const select = document.getElementById("categoria_postagem")

    select.innerHTML = '<option value="">Selecione um jogo...</option>'

    games.forEach(game => {
      const option = document.createElement("option")
      option.value = game.games_id
      option.textContent = game.nome

      select.appendChild(option)
    })

  } catch (err) {
    console.error("Erro ao carregar jogos:", err)
  }
}

// FILTRO DE JOGOS

async function carregarJogosFiltro() {
  try {
    const res = await fetch('http://localhost:3000/games/select')
    const games = await res.json()

    const select = document.getElementById('select-button')

    select.innerHTML = '<option value="">Selecione...</option>'

    games.forEach(game => {
      const option = document.createElement('option')
      option.value = game.games_id
      option.textContent = game.nome

      select.appendChild(option)
    })

  } catch (err) {
    console.error('Erro ao carregar jogos:', err)
  }
}

// CARREGAR POSTAGENS

async function carregarPosts(gameId = null) {
  try {
    let url = 'http://localhost:3000/posts'

    if (gameId) {
      url += `?game_id=${gameId}`
    }

    const response = await fetch(url)
    const posts = await response.json()

    const container = document.getElementById('postsContainer')
    container.innerHTML = ''

    const userIdLogado = getUserIdFromToken()
console.log("userIdLogado:", userIdLogado)

    let html = ''

    posts.forEach(post => {
      console.log("post.user_id:", post.user_id, "post_id:", post.post_id)

      html += `
        <div class="post">
        <div class="post_origem">
          <div class="user_photo">
            <img src="${post.foto_perfil}" alt="Foto de Perfil">
          </div>
          <div class="infos_post">
            <p id="username">${post.nome_usuario}</p>
            <p id="dataCatg">Publicado em: ${new Date(post.data_postagem).toLocaleDateString()} - ${post.categoria}</p>
          </div>
          ${Number(post.user_id) === Number(userIdLogado) ? `
  <div class="post_menu">
    <button onclick="toggleMenu(${post.post_id})">⋮</button>

    <div class="menu_options" id="menu-${post.post_id}">
      <button onclick="editarPost(${post.post_id})">Editar</button>
      <button onclick="deletarPost(${post.post_id})">Deletar</button>
    </div>
  </div>
` : ''}
        </div>

          <div class="content_post">
            <h3>${post.titulo_postagem}</h3>
            <p>${post.conteudo_postagem}</p>
            ${post.foto_postagem ? `<img src="${post.foto_postagem}" alt="Imagem do post">` : ''}
          </div>

          <div class="comments">
            <textarea name="" id="comentarioPost" class="conteudoComentario" placeholder="Escreva seu comentário..."></textarea>
            <button class="commentBtn">Comentar</button>
          </div>
        </div>
      `
    })

    container.innerHTML = html

  } catch (error) {
    console.error('Erro ao carregar posts:', error)
  }
}

function toggleMenu(postId) {
  const menu = document.getElementById(`menu-${postId}`)

  document.querySelectorAll('.menu_options').forEach(m => {
    if (m !== menu) m.style.display = 'none'
  })

  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex'
}

// EDITAR POSTAGEM

async function editarPost(post_id) {
  const token = localStorage.getItem("token")

  const res = await fetch(`http://localhost:3000/posts/${post_id}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  try {
    const result = await res.json()

    if (!res.ok) {
      alert(result.message || "Erro ao carregar post!")
      return
    }

    const post = result.data

    editandoId = post.post_id

    document.getElementById("titulo_postagem").value = post.titulo_postagem
    document.getElementById("conteudo_postagem").value = post.conteudo_postagem
    document.getElementById("categoria_postagem").value = post.games_id

    document.querySelector(".modal h3").textContent = "Editar postagem"
    document.querySelector(".sentPost").textContent = "Salvar alterações"

    document.querySelector(".modal").style.display = "flex"

  } catch (err) {
    console.error("Erro ao carregar post:", err)
    alert("Erro de conexão ao carregar post.")
  }
}

// DELETAR POSTAGEM

async function deletarPost(post_id) {
  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para deletar uma postagem.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  const confirmacao = await Swal.fire({
    icon: "warning",
    title: "Deseja apagar esta postagem?",
    text: "Essa ação não poderá ser desfeita.",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#8863e7",
    confirmButtonText: "Deletar",
    cancelButtonText: "Cancelar"
  })

  if (!confirmacao.isConfirmed) return

  try {
    const res = await fetch(`http://localhost:3000/posts/${post_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        key: "EXCLUIR"
      })
    })

    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: result.message || "Erro ao deletar post!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Post deletado com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    await carregarPosts()

  } catch (err) {
    console.error("Erro ao deletar post:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao deletar o post.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

// CARREGAR FUNÇÕES

window.onload = () => {
  carregarPosts()
  carregarJogos()
  carregarJogosFiltro()

  document.getElementById('filtrar').addEventListener('click', () => {
    const gameId = document.getElementById('select-button').value
    carregarPosts(gameId)
  })
}