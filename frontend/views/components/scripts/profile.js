document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil()
    ajustarTextareas()
})

const inputFoto = document.getElementById("inputFoto")
const fotoImg = document.getElementById("foto_perfil")

fotoImg.addEventListener("click", () => {
    inputFoto.click()
})

inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    fotoImg.src = preview

    fotoImg.onload = () => URL.revokeObjectURL(preview)
})

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
}

const bioTextarea = document.getElementById("bio")

function ajustarTextareas() {
    [bioTextarea].forEach(textarea => {
        autoResizeTextarea(textarea)
        textarea.addEventListener("input", () => autoResizeTextarea(textarea))
    })
}

async function carregarPerfil() {
    const userId = localStorage.getItem("userId")

    if (!userId) {
        Swal.fire({
            icon: 'error',
            title: `Você não está logado!`,
            text: `Redirecionando para a página de login...`,
            confirmButtonColor: '#8863e7',
            confirmButtonText: 'Continuar'
        }).then(() => {
            window.location.href = "../login.html"
        })

        return
    }

    try {
        const res = await fetch(`http://localhost:3000/profile/${userId}`)
        const user = await res.json()

        if (!user || user.erro) {
            alert("Erro ao carregar perfil!")
            return
        }

        document.getElementById("nome_usuario").textContent = user.nome_usuario
        document.getElementById("bio").value = user.bio || ""

        ajustarTextareas()
        
        fotoImg.src = user.foto_perfil || "/frontend/public/assets/imgs/user-default.jpg"

    } catch (err) {
        console.error("Erro ao carregar perfil:", err)
    }
}

document.getElementById("btnSalvar").addEventListener("click", salvarPerfil)

async function salvarPerfil() {
    const userId = localStorage.getItem("userId")
    const bio = document.getElementById("bio").value

    const formData = new FormData()

    formData.append("bio", bio)

    const file = document.getElementById("inputFoto").files[0]
    if (file) {
        formData.append("foto_perfil", file)
    }

    try {
        const res = await fetch(`http://localhost:3000/profile/update/${userId}`, {
            method: "PUT",
            body: formData
        })

        const result = await res.json()
        console.log(result)

        Swal.fire({
            icon: "success",
            title: "Perfil atualizado!",
            text: "Alterações salvas com sucesso.",
            confirmButtonColor: "#8863e7"
        })

    } catch (err) {
        console.error("Erro ao salvar perfil:", err)
    }
}