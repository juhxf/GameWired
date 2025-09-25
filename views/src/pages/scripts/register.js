const form = document.querySelector('#form')

form.addEventListener('submit', function(e){
    e.preventDefault() //impede que o forumulário recarregue antes de ser enviado

    const fields = [
        {
            id: 'name',
            validator: nameIsValid
        },
        {
            id: 'date',
            validator: dateIsValid
        },
        {
            id: 'email',
            validator: emailIsValid
        },
        {
            id: 'password',
            validator: passwordIsSecure
        },
        {
            id: 'confirm',
            validator: confirmIsMach
        }
    ]

    const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

    fields.forEach(function(field){
        const input = document.getElementById(field.id)
        const inputBox = input.closest('.input-box')
        const inputValue = input.value

        const errorSpan = inputBox.querySelector('.error')
        errorSpan.innerHTML = ''

        inputBox.classList.remove('invalid')
        inputBox.classList.add('valid')

        const fieldValidator = field.validator(inputValue)

        if(!fieldValidator.isValid){
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`
            inputBox.classList.add('invalid')
            inputBox.classList.remove('valid')
            return
        }
    })
})

function isEmpty(value){
    return value === ''
}

function nameIsValid(value){
    const validator = {
        isValid: true,
        errorMessage: null      
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'O nome é obrigatório'
        return validator
    }

    const min = 3

    if(value.length < min){                             
        validator.isValid = false
        validator.errorMessage = `O campo deve ter no mínimo ${min} caracteres`
        return validator
    }

    const regex = /^[A-Z][a-z].* [A-Z][a-z].*/
    
    if(!regex.test(value)){
        validator.isValid = false
        validator.errorMessage = 'Preencha o nome completo corretamente'
    }

    return validator
}

function dateIsValid(value){
    const validator = {
        isValid: true,
        errorMenssage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'A data de nascimento é obrigatória'
        return validator
    }

    const year = new Date(value).getFullYear()

    if(year < 1920 || year > new Date().getFullYear()){
        validator.isValid = false
        validator.errorMessage = 'Coloque uma data válida'
        return validator
    }

    return validator
}

function emailIsValid(value){
    const validator = {
        isValid: true,
        errorMenssage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'O e-mail é obrigatório'
        return validator
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(!regex.test(value)){
        validator.isValid = false
        validator.errorMessage = 'O e-mail é precisa ser válido'
        return validator
    }

    return validator
}


function passwordIsSecure(value){
    const validator = {
        isValid: true,
        errorMenssage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'A senha é obrigatória'
        return validator
    }

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/

    if(!regex.test(value)){
        validator.isValid = false
        validator.errorMessage = `
            Sua senha deve conter as menos: <br/>
            8 dígitos <br/>
            1 letra minúscula <br/>
            1 letra maiúscula <br/>
            1 número <br/>
            1 caractere especial
        `
        return validator
    }

    return validator
}

function confirmIsMach(value){
    const validator = {
        isValid: true,
        errorMenssage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'Crie uma senha forte primeiro'
        return validator
    }

    const passwordValue = document.getElementById('password').value
    console.log(passwordValue)

    // parte do código não funcionando
    if (passwordValue !== value){
        validator.isValid = false
        validator.errorMessage = 'Senhas não condizem'
        return validator
    }

    return validator
}
