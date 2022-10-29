let initialTime = 0
localStorage.setItem('currGame', 'python')
localStorage.setItem('wpmPy', '0')
localStorage.setItem('mistakesPy', '0')
localStorage.setItem('accuracyPy', '0 %')
if (localStorage.getItem("maxScorePy") === null) {
    localStorage.setItem("maxScorePy", '0')
}

const types = ['string', 'int', 'float', 'double', 'char']
userInput = ''
// going to use an api for random words to produce variable names
start = false
let doOnce = true
totalChar = 0
wpm = 0
mistakes = 0
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const keyWords = ['function', 'while', 'for', 'if', 'arrayGen']
presentence = ''
sentence = ''
timer = document.getElementById('timer')
function gettime() {
    if (start) {
        initialTime += 1
        timer.textContent = parseInt(initialTime)
        timer.classList.add('text-primary')
    }
    wpm = Math.floor(((totalChar / 5) / initialTime) * 60)
    if (wpm < 0 || !wpm) { wpm = 0 }
    divh2.textContent = (`${wpm} wpm`)
    divh2_2.textContent = (`${mistakes} mistakes`)
}
setInterval(gettime, 1000)


async function pyGame() {
    const wordJson = await fetch('https://random-word-api.herokuapp.com/word?number=10&length=5')
    const word = await wordJson.json();
    shuffle(keyWords)
    for (let i = 0; i < keyWords.length; i++) {
        keyWordMatch(keyWords[i], word)
    }
    sentence = presentence + sentence + ' -'
    sentenceArray = sentence.split('-')
    sentenceArray2 = []
    for (let i = 0; i < sentenceArray.length; i++) {
        if (sentenceArray[i] === '' || sentenceArray[i] === ' ') {
            continue
        }
        sentenceArray2.push(sentenceArray[i])
    }
    allSpans = createList(sentenceArray2)
    finalSentence = sentenceArray2.join('')
    div = document.createElement('div')
    divh2 = document.createElement('h2')
    divh2_2 = document.createElement('h2')
    div.appendChild(divh2)
    div.appendChild(divh2_2)
    keycodeArray = ['#', '<', '>', '{', '}', '(', ')', '=', '+', ';', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "Enter", ':', 'Tab', '.', "Enter", "'", '.', ',', '}', '-', '[', ']']
    document.addEventListener('keydown', function evlisten(event) {
        if (event.key === 'Tab') {
            // preventDefault() will stop tab from doing default behaviour of jumping around to navbar and to bookmarks
            // etc. Only want tab to be used for python tabbing
            event.preventDefault()
        }

        start = true
        if (doOnce) {
            rules = document.querySelector('#rules')
            rules.style.display = 'none'
            row = document.querySelector('#row')
            div.classList.add('col-3')
            div.classList.add('me-2')
            div.classList.add('text-white')
            row.prepend(div)
            doOnce = false
        }
        totalChar = userInput.length - 1
        // if at the end of the line and some key is clicked other than enter, do nothing.
        // if userInput is of valid length and the current parent element is not the same as the next one and the key clicked isnt enter or back space then do nothing
        if (userInput.length === allSpans.length - 1) {
            allSpans[userInput.length - 1].parentElement.style.display = "none";
            h1 = document.createElement('h1')
            h1.classList.add('text-success')
            htmlBody = document.querySelector('body')
            htmlBody.appendChild(h1)
            document.removeEventListener("keydown", evlisten);
            localStorage.setItem('wpmPy', parseInt(wpm))
            localStorage.setItem('mistakesPy', parseInt(mistakes))
            accuracy = Math.floor(((userInput.length - mistakes) / userInput.length) * 100)
            accuracyString = parseInt(accuracy) + ' %'
            localStorage.setItem('accuracyPy', accuracyString)
            if (parseInt(localStorage.getItem('maxScorePy')) < parseInt(localStorage.getItem('wpmPy'))) {
                localStorage.setItem('maxScorePy', localStorage.getItem('wpmPy'))
            }

            window.location.href = "stats.html";
            return
        }
        if (userInput.length && allSpans[userInput.length].parentElement.id != allSpans[userInput.length + 1].parentElement.id && event.key != 'Enter' && event.key != 'Backspace') {
        }
        else if (event.keyCode >= 65 && event.keyCode <= 90 || keycodeArray.includes(event.key)) {
            if (event.key === 'Enter') {
                if (userInput.length && allSpans[userInput.length].parentElement.id != allSpans[userInput.length + 1].parentElement.id) {
                    userInput += ' '
                    // some way of hiding the whole line
                    allSpans[userInput.length - 1].parentElement.style.display = "none";
                    currH4 = document.getElementById(`${parseInt(allSpans[userInput.length - 1].parentElement.id) + 7}`)
                    if (currH4) { currH4.style.display = 'block' }
                }
                // If enter is clicked when you dont need to just add any character in case
                else {
                    userInput += '%'
                }
            }
            else {
                if (event.key === 'Tab') {
                    userInput += '^'
                }
                else {
                    userInput += event.key
                }
            }
            // If input matches the current char
            if (userInput[userInput.length - 1] === allSpans[userInput.length - 1].textContent || (event.key === 'Tab' && allSpans[userInput.length - 1].textContent === '    ')) {
                if (event.key === 'Tab') {
                    allSpans[userInput.length - 1].classList.add('bg-similar')
                    allSpans[userInput.length - 1].classList.remove('bg-warning')
                }
                else {
                    allSpans[userInput.length - 1].classList.add('text-white')
                    allSpans[userInput.length - 1].classList.remove('text-warning')
                }

            }
            // input does not match current char
            else {
                // if its a space
                if (allSpans[userInput.length - 1].textContent === ' ') {
                    allSpans[userInput.length - 1].classList.add('bg-danger')
                    mistakes += 1
                }
                // if its a tab
                else if (allSpans[userInput.length - 1].textContent === '    ') {
                    allSpans[userInput.length - 1].classList.remove('bg-white')
                    allSpans[userInput.length - 1].classList.add('bg-danger')
                }
                // letters and syntax
                else {
                    allSpans[userInput.length - 1].classList.remove('text-lightgray')
                    allSpans[userInput.length - 1].classList.add('text-danger')
                    mistakes += 1
                }
            }
            allSpans[userInput.length - 1].classList.remove('text-warning')  // remove underline on current
            allSpans[userInput.length].classList.add('text-warning')  // add underline on next
        }
        else if (event.keyCode == 8) {  // backspace
            // only allow backspace when not at the first element of the parent because I don't want to go to previous line
            if (userInput.length && allSpans[userInput.length - 1].parentElement.id === allSpans[userInput.length].parentElement.id) {
                if (userInput.length)
                    userInput = userInput.substring(0, userInput.length - 1);
                // if its a space
                if (allSpans[userInput.length].textContent === ' ') {
                    allSpans[userInput.length].classList.remove('bg-danger')
                }
                // if its a tab
                else if (allSpans[userInput.length].textContent === '    ') {
                    allSpans[userInput.length].classList.remove('bg-danger')
                    allSpans[userInput.length].classList.remove('bg-similar')
                }
                // letters and syntax
                else {
                    allSpans[userInput.length].classList.remove('text-white')
                    allSpans[userInput.length].classList.remove('text-danger')
                    allSpans[userInput.length].classList.add('text-lightgray')
                }
                allSpans[userInput.length + 1].classList.remove('text-warning')  // remove underline on current
                allSpans[userInput.length].classList.add('text-warning')  // add underline on previous
            }
        }
    });
}


function keyWordMatch(keyword, word) {
    // - denotes space or enter
    // ^ denotes tab
    if (keyword === 'function') {
        let rand = Math.floor(Math.random() * 5)
        presentence += 'def ' + word[0] + `(${word[1]}): -^${word[1]} = ${word[2]} -^return ${word[1]} -`
        sentence += word[0] + `(${word[1]}) -`
    }
    if (keyword === 'while') {
        if (Math.random() < 0.5) {
            sentence += 'while ' + word[3] + ` <= ${word[4]}: -^${word[3]} += ${letters[Math.floor(Math.random() * 26)]} -`
        }
        else {
            sentence += 'while ' + word[3] + ` <= ${word[4]}: -^${word[3]}.append(${letters[Math.floor(Math.random() * 26)]}) -`
        }
    }
    if (keyword === 'for') {
        sentence += `for i in range(len(${word[6]})): -^${word[7]} += ${Math.floor(Math.random() * 19)} -`
    }
    if (keyword === 'if') {
        sentence += 'if ' + word[5] + `: -^${word[5]}+=1 -`
    }
    if (keyword === 'arrayGen') {
        lett = letters[Math.floor(Math.random() * 26)]
        sentence += `arr = [${lett} for ${lett} in range(0, ${Math.floor(Math.random() * 49)})] -`
    }
}

function createList(seperateLines) {
    allSpans = []
    cardbody = document.getElementById('cb')
    for (let i = 0; i < seperateLines.length; i++) {
        p = document.createElement('p')
        if (i > 6) {
            p.style.display = "none";
        }
        p.setAttribute('id', `${i}`)
        for (let j = 0; j < seperateLines[i].length; j++) {
            span = document.createElement('span')
            if (seperateLines[i][j] === '^') {
                // this is tab so I don't actually want to print it
                // just want 4 spaces
                span.textContent = '    '
                span.classList.add('ps-5')
            }
            else {
                span.textContent = seperateLines[i][j]
            }
            span.classList.add('text-lightgray')
            span.classList.add('h4')
            p.appendChild(span)
            p.classList.add('mx-3')
            allSpans.push(span)
        }
        cardbody.appendChild(p)
    }
    allSpans[0].classList.add('text-warning')
    return allSpans
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}




pyGame()


