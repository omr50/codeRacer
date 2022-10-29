const text = "Practice Your Typing Skills"
const h1 = document.getElementById('head')
let i = 0
let cursor = true
interval = setInterval(titleEffect, 120)
function titleEffect() {
    if (i < text.length) {
        h1.textContent += text[i]
        i += 1
    }

    if (i >= text.length) {
        clearInterval(interval)
        interval = setInterval(cursorEffect, 350)
    }
}

function cursorEffect() {
    if (cursor) {
        h1.textContent = text + '|'
    }
    else {
        h1.textContent = text + "."
    }
    cursor = !cursor
}

