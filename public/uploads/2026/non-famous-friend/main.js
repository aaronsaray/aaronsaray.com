document.querySelectorAll('[data-unavailable]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault()
        alert('This is not available at this time.')
    })
})
