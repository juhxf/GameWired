const form = document.querySelector('#form')

const users = [
    { 
        id: 'adm',
        email: 'admin@gmail.com', 
        password: 'Admin123!'
    },
    { 
        id: 'teste',
        email: 'teste@gmail.com', 
        password: 'Teste123!', 
    }
]

form.addEventListener('submit', function(e){
    e.preventDefault()

    const fields = [
        {
            id: 'email',
            validator: emailIsValid
        },
        {
            id: 'password',
            validator: passwordIsSecure
        },
    ]

    const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

    let formIsValid = true

    fields.forEach(function(field){
        const input = document.getElementById(field.id)
        const inputBox = input.closest('.input-box')
        const inputValue = input.value.trim()

        const errorSpan = inputBox.querySelector('.error')
        errorSpan.innerHTML = ''

        inputBox.classList.remove('invalid')
        inputBox.classList.add('valid')

        const fieldValidator = field.validator(inputValue)

        if(!fieldValidator.isValid){
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`
            inputBox.classList.add('invalid')
            inputBox.classList.remove('valid')
            formIsValid = false
        }
    })

    if(!formIsValid) return

    // Aqui faz a validação no banco de dados, procurando email e senha exatos
    const emailInput = document.getElementById('email').value.trim()
    const passwordInput = document.getElementById('password').value.trim()

    const user = users.find(u => u.email === emailInput && u.password === passwordInput)
    if(!user){
        // Email e/ou senha não encontrados no banco
        const emailInputBox = document.getElementById('email').closest('.input-box')
        const passwordInputBox = document.getElementById('password').closest('.input-box')

        emailInputBox.querySelector('.error').innerHTML = `${errorIcon} Email ou senha incorretos`
        passwordInputBox.querySelector('.error').innerHTML = `${errorIcon} Email ou senha incorretos`

        emailInputBox.classList.add('invalid')
        passwordInputBox.classList.add('invalid')

        return
    }

    alert(`Login realizado com sucesso! Bem-vindo(a), ${user.id}.`)
})

function isEmpty(value){
    return value === ''
}

function emailIsValid(value){
    const validator = {
        isValid: true,
        errorMessage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'O e-mail é obrigatório'
        return validator
    }

    return validator
}

function passwordIsSecure(value){
    const validator = {
        isValid: true,
        errorMessage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'A senha é obrigatória'
        return validator
    }

    return validator
}