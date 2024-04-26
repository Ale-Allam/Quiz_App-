"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const category = document.getElementById("category");
const formSubmit = document.getElementById("submitApp");
const playAgain = document.getElementById("play-again");
const quizForm = document.getElementById("submit-answer");
const quizFormDisplay = document.getElementById("quizForm");
const QAContainer = document.getElementById("q-a-container");
const questionsNumber = document.getElementById("questionsNumber");
const questionDifficulty = document.getElementById("defcult");
const answerOptionsDiv = document.getElementById("answerOptions");
const questionDiv = document.getElementById("question-request");
const loadingGame = document.getElementsByClassName("loading")[0];
const spansCorrectIncorrect = document.getElementById("question-spans-container");
const spans = document.getElementById("spans");
let gameOverOrNot = false;
let num = 0;
let questionsData = null;
function fetchQuestions(amount, category = "9", difficulty) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        try {
            const response = yield fetch(apiUrl);
            if (response.ok) {
                const data = yield response.json();
                return data;
            }
            else {
                setTimeout(() => {
                    location.reload();
                }, 5000);
                throw new Error("Parameter is not a number!");
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    });
}
function fetchCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://opentdb.com/api_category.php");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = yield response.json();
            return data.trivia_categories;
        }
        catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            return [];
        }
    });
}
function populateCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield fetchCategories();
            categories.forEach((element) => {
                const optionElement = document.createElement("option");
                optionElement.value = element.name;
                optionElement.innerHTML = element.name;
                optionElement.setAttribute("data-categoryid", element.id);
                category.appendChild(optionElement);
            });
        }
        catch (error) {
            console.error("Error while populating categories:", error);
        }
    });
}
populateCategories();
function onStartQuizz() {
    spans.style.opacity = "1";
    formSubmit.style.display = "none";
    loadingGame.style.display = "block";
}
formSubmit.addEventListener("submit", function (e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        num = 0;
        e.preventDefault();
        onStartQuizz();
        let getCategory = category.options[category.selectedIndex].dataset.categoryid;
        let getNumberOfQuestions = questionsNumber.value;
        let getQuestionsDifficulty = questionDifficulty.value;
        const theDATA = yield fetchQuestions(getNumberOfQuestions, getCategory || "", getQuestionsDifficulty);
        questionsData = (_a = theDATA === null || theDATA === void 0 ? void 0 : theDATA.results) !== null && _a !== void 0 ? _a : [];
        console.log(questionsData);
        if (questionsData.length > 0) {
            quizForm.style.display = "block";
            const num = questionsData.length;
            const numArray = Array.from({ length: num });
            numArray.forEach(() => {
                const span = document.createElement("span");
                span.classList.add("sp");
                spans.appendChild(span);
            });
            displayQuestion();
        }
    });
});
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function resetGame() {
    spans.classList.add("scale-spans");
    quizForm.style.display = "none";
    playAgain.style.display = "block";
    questionDiv.innerHTML = "GAME IS.....O V E R";
    answerOptionsDiv.innerHTML = "";
    setTimeout(() => {
        spans.style.opacity = "0";
        setTimeout(() => {
            spans.classList.remove("scale-spans");
        }, 1000);
    }, 2000);
}
function displayQuestion() {
    if (questionsData && questionsData.length > num) {
        const getQuestion = questionsData[num].question;
        const getAnswers = [
            ...questionsData[num].incorrect_answers,
            questionsData[num].correct_answer,
        ];
        let shuveldAnswers = shuffleArray(getAnswers);
        if (answerOptionsDiv) {
            loadingGame.style.display = "none";
        }
        appendQandA(getQuestion, shuveldAnswers);
    }
    else if ((questionsData === null || questionsData === void 0 ? void 0 : questionsData.length) === 0) {
        questionDiv.innerHTML = "Error";
    }
    else {
        resetGame();
    }
}
function decodeHTMLEntities(text) {
    const element = document.createElement("div");
    element.innerHTML = text;
    return element.textContent || element.innerText;
}
function appendQandA(question, answers) {
    questionDiv.innerHTML = "";
    answerOptionsDiv.innerHTML = "";
    questionDiv.innerHTML = decodeHTMLEntities(question);
    answers.forEach((option, index) => {
        const decodedOption = decodeHTMLEntities(option);
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.id = `option${index + 1}`;
        radioButton.name = "sword";
        radioButton.value = option;
        const label = document.createElement("label");
        label.htmlFor = `option${index + 1}`;
        label.textContent = decodedOption;
        const div = document.createElement("div");
        div.classList.add("input-answer", "input-correct-answer", "input-wrong-answer");
        div.append(label);
        answerOptionsDiv.append(radioButton, div);
    });
}
quizForm.onclick = (e) => {
    e.preventDefault();
    styleAfterAnswer();
    nextQuestion();
};
function nextQuestion() {
    const correctAnswer = questionsData && questionsData[num]
        ? questionsData[num].correct_answer
        : "";
    let getAllAnswersInput = document.querySelectorAll('input[name="sword"]');
    function markCorrectAnswerAfterSubmitQuestion() {
        for (let i = 0; i < getAllAnswersInput.length; i++) {
            const input = getAllAnswersInput[i];
            if (input.value === correctAnswer) {
                const inputId = getAllAnswersInput[i].id;
                const label = document.querySelector(`label[for="${inputId}"]`);
                if (label) {
                    label.setAttribute("style", "color: #00fe9b;text-shadow: 0px 0px 33px #02c435; text-decoration: underline;");
                }
            }
        }
    }
    let getSpans = document.querySelectorAll(".sp");
    function nextQuestionSetTimeOut(result) {
        setTimeout(() => {
            if (getSpans) {
                getSpans[num].classList.add(result);
            }
            setTimeout(() => {
                num++;
                displayQuestion();
                answerOptionsDiv.style.opacity = "1";
                questionDiv.style.transform = "translateX(0%)";
            }, 1000);
            answerOptionsDiv.style.opacity = "0";
            questionDiv.style.transform = "translateX(-200%)";
        }, 1000);
    }
    const radioButtons = document.querySelectorAll('input[name="sword"]:checked');
    if (radioButtons.length > 0) {
        const selectedOption = radioButtons[0];
        if (correctAnswer === selectedOption.value) {
            if (selectedOption.nextElementSibling) {
                selectedOption.nextElementSibling.classList.add("input-correct-answer-clicked");
            }
            nextQuestionSetTimeOut("sp-correct");
        }
        else {
            if (selectedOption.nextElementSibling) {
                selectedOption.nextElementSibling.classList.add("input-wrong-answer-clicked");
            }
            nextQuestionSetTimeOut("sp-incorrect");
            markCorrectAnswerAfterSubmitQuestion();
        }
    }
}
function styleAfterAnswer() {
    const checkedRadio = document.querySelector('input[type="radio"]:checked');
    if (checkedRadio) {
        const inputAnswer = checkedRadio.nextElementSibling;
        if (inputAnswer) {
            inputAnswer.style.background = "transparent";
        }
    }
}
function cleanForNewGame() {
    spans.innerHTML = "";
    formSubmit.style.display = "block";
    playAgain.style.display = "none";
    questionDiv.innerHTML = "";
}
playAgain.onclick = function () {
    cleanForNewGame();
};
//# sourceMappingURL=index.js.map