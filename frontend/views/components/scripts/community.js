// AUTENTICAÇÃO PARA PUBLICAR

function communityAuth() {
  const userId = localStorage.getItem("userId")

  const CommunityOff = document.getElementById("CommunityLoggedOff")
  const CommunityIn = document.getElementById("CommunityLoggedIn")

  if (userId) {
    CommunityOff.classList.add("hidden")
    CommunityIn.classList.remove("hidden")
  } else {
    CommunityOff.classList.remove("hidden")
    CommunityIn.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("userId")
  window.location.reload()
}

document.addEventListener("DOMContentLoaded", communityAuth)

// CARREGAR PERFIL

document.addEventListener("DOMContentLoaded", () => { carregarPerfil() })

async function carregarPerfil() {
  const userId = localStorage.getItem("userId")
  const abrirPerfilUsuario = document.getElementById("abrirPerfil")

  if (!userId) {
    abrirPerfilUsuario.style.display = "none"
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/profile/${userId}`)
    const user = await res.json()

    abrirPerfilUsuario.addEventListener("click", () => {
      window.location.href = `/frontend/views/pages/subpages/profile.html?id=${userId}`
    })

    document.getElementById("nome_usuario").textContent = user.nome_usuario

    const foto = document.querySelector(".foto-perfil")
    foto.src = user.foto_perfil

  } catch (err) {
    console.error("Erro ao carregar perfil:", err)
  }
}

// MODAL DE POSTAGEM

document.addEventListener("DOMContentLoaded", () => {
  const openModal = document.querySelector(".openModal")
  const modal = document.querySelector(".modal")
  const closeModal = document.querySelector(".closeModal")
  const form = document.querySelector(".postForm")
  let editandoId = null

  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  })

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    editandoId = null;
  })

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      form.reset();
      editandoId = null;
    }
  })
})

// FORMULÁRIO DE POSTAGEM E VALIDAÇÃO

const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const data = {
    titulo_postagem: document.getElementById("titulo_postagem").value,
    conteudo_postagem: document.getElementById("conteudo_postagem").value,
    foto_postagem: document.getElementById("foto_postagem").value,
    id: localStorage.getItem("userId"),
    games_id: document.getElementById("categoria_postagem").value
  }

  if (!data.titulo_postagem || !data.conteudo_postagem || !data.games_id) {
    alert("Preencha todos os campos!")
    return
  }

  const url = "http://localhost:3000/posts/create";

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {

      Swal.fire({
        icon: 'error',
        title: `Erro!`,
        text: result.message || `Erro ao criar postagem!`,
        confirmButtonColor: '#8863e7',
        confirmButtonText: 'Continuar'
      })

      Swal.fire({
        icon: 'success',
        title: `Sucesso!`,
        text: `Postagem feita com sucesso!`,
        confirmButtonColor: '#8863e7',
        confirmButtonText: 'Continuar'
      }).then(() => {
        window.location.href = "community.html"
      })
    }
  } catch (err) {
    console.error(err)
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

/*  async function carregarPosts() {
    const response = await fetch("/api/posts");
    const posts = await response.json();

    postsContainer.innerHTML = "<h2>Publicações Recentes</h2>";

    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");
      const dataFormatada = new Date(post.dataPublicacao).toLocaleString("pt-BR");

      postDiv.innerHTML = `
        <h3>${post.titulo}</h3>
        <small><strong>Jogo:</strong> ${post.categoria}</small><br>
        <small><strong>Publicado em:</strong> ${dataFormatada}</small>
        <p>${post.conteudo}</p>
        ${post.imagem ? `<img src="${post.imagem}" alt="Imagem do post">` : ""}
        <div class="botoes">
          <button onclick="editarPost(${post.id})">✏️ Editar</button>
          <button onclick="deletarPost(${post.id})">🗑️ Deletar</button>
        </div>
      `;
      postsContainer.appendChild(postDiv);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const conteudo = document.getElementById("conteudo").value;
    const imagemInput = document.getElementById("imagem");

    let imagemBase64 = "";
    if (imagemInput.files && imagemInput.files[0]) {
      imagemBase64 = await toBase64(imagemInput.files[0]);
    }

    const novoPost = { titulo, categoria, conteudo, imagem: imagemBase64 };

    if (editandoId) {
      await fetch(`/api/posts/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPost),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPost),
      });
    }

    modal.style.display = "none";
    form.reset();
    editandoId = null;
    carregarPosts();
  });

  // Editar e Deletar posts
  window.editarPost = async function (id) {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    const post = posts.find((p) => p.id === id);

    if (post) {
      document.getElementById("titulo").value = post.titulo;
      document.getElementById("categoria").value = post.categoria;
      document.getElementById("conteudo").value = post.conteudo;
      editandoId = id;
      modal.style.display = "block";
    }
  };

  window.deletarPost = async function (id) {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      carregarPosts();
    }
  };

  // Inicialização
  carregarCategorias();
  carregarPosts();
});*/