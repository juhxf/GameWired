async function loadHTML(elementId, file) {
    const response = await fetch(file)
    const html = await response.text()
    document.getElementById(elementId).innerHTML = html
}

window.addEventListener('DOMContentLoaded', () => {
    loadHTML('header', '/views/src/pages/global/header.html')
    loadHTML('footer', '/views/src/pages/global/footer.html')
})