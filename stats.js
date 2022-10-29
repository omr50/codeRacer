suffix = ''
if (localStorage.getItem("currGame") === 'python') {
    suffix = 'Py'
}
else if (localStorage.getItem('currGame') === 'js') {
    suffix = 'js'
}
wpm = localStorage.getItem('wpm' + suffix)
mistakes = localStorage.getItem('mistakes' + suffix)
maxScore = localStorage.getItem('maxScore' + suffix)
accuracy = localStorage.getItem('accuracy' + suffix)
h2Wpm = document.querySelector('#wpm')
h2Mistakes = document.querySelector('#mistakes')
h2maxScore = document.querySelector('#maxScore')
h2Accuracy = document.querySelector('#acc')
h2Wpm.textContent = `Your WPM is ${wpm}`
h2Mistakes.textContent = `mistakes: ${mistakes}`
h2maxScore.textContent = `Highscore: ${maxScore} wpm`
h2Accuracy.textContent = `accuracy: ${accuracy}`

// current game local variable which will say if the current game is js or cpp or python
// then redirect to that one.

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 32) {
        if (suffix === '') {
            window.location.href = "cpp.html"
        }
        else if (suffix === 'Py') {
            window.location.href = "py.html"
        }
        else if (suffix === 'js') {
            window.location.href = "js.html"

        }
    }

})
