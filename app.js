const API = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple";
const startBtn = document.querySelector("#start-btn");
const container = document.querySelector("#question-container");
const inner = document.querySelector(".inner")
const question = document.querySelectorAll("#question");
const score = document.querySelector(".score");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const questionCounter = document.querySelector(".question-counter");
const smallScale = document.querySelector(".small-scale");

questionCounter.innerHTML = `Question 0/10`;

let start = 0;
let scale = 0;
const increment = 30;
let length = 0;

startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
    let questions = await getQuestions(API);
    let shuffledQuestions = questions.map((question) => {
        return {
            ...question,
            shuffledAnswers: shuffle([
                question.correct_answer,
                ...question.incorrect_answers,
            ]),
        };
    });
    createQuestionCard(shuffledQuestions);
});

//Get question
async function getQuestions(api) {
    let response = await fetch(api);
    let result = await response.json();
    return result.results;
}

// Game score
function increaseScore() {
    score.textContent = start;
}

//Create question Card
function createQuestionCard(arr) {
    arr.map((question) => {
        questionCounter.innerHTML = `Question ${start + 1}/10`;

        let questionCard = document.createElement("div");
        questionCard.id = "question";

        let questionText = document.createElement("h3");
        questionText.textContent = question.question;

        let buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");

        question.shuffledAnswers.map((answer) => {
            let button = document.createElement("button");
            button.className = 'answer-button';
            button.textContent = answer;
            button.addEventListener("click", function () {

                length++;

                const p = button.parentElement.children
                for (let i = 0; i < p.length; i++) {
                    console.log(p[i]);
                    p[i].disabled = true;
                }

                if (answer === question.correct_answer) {
                    alert("true");
                    start++;
                    // scale = scale + increment
                    increaseScore();
                    this.style.background = 'green';
                    this.style.color = 'white';
                    scale += increment;
                    smallScale.style.width = scale + "px";

                } else {
                    this.style.background = 'red';
                    this.style.color = 'white';
                }

                if (length >= 10) {
                    console.log(length)
                    alert(`your score is ${score}`)
                }
            });

            buttonGroup.appendChild(button);
        });
        questionCard.appendChild(questionText);
        questionCard.appendChild(buttonGroup);
        inner.appendChild(questionCard);
    });
}

//Shuffle array function
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

const height = parseInt(window.getComputedStyle(container).height);

let offset = 0;
nextBtn.addEventListener("click", () => {
    if (offset === height * (question.length - 1)) {
        offset = 0;
    } else {
        offset = offset + height;
    }

    inner.style.transform = `translateY(-${offset}px)`
})

prevBtn.addEventListener("click", () => {
    if (offset === 0) {
        offset = height * (question.length - 1);
    } else {
        offset = offset - height;
    }

    inner.style.transform = `translateY(-${offset}px)`
})

