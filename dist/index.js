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
const questionsNumber = document.getElementById("questionsNumber");
const questionDifficulty = document.getElementById("defcult");
const formSubmit = document.getElementById("submitApp");
const playAgain = document.getElementById("play-again");
let gameOverOrNot = false;
function fetchQuestions(amount, category, difficulty) {
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
const quizForm = document.getElementById("submit-answer");
const answerOptionsDiv = document.getElementById("answerOptions");
const questionDiv = document.getElementById("question-request");
const loadingGame = document.getElementsByClassName("loading")[0];
let num = 0;
let questionsData = null;
formSubmit.addEventListener("submit", function (e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        num = 0;
        e.preventDefault();
        formSubmit.style.display = "none";
        loadingGame.style.display = "block";
        let getCategory = category.options[category.selectedIndex].dataset.categoryid;
        let getNumberOfQuestions = questionsNumber.value;
        let getQuestionsDifficulty = questionDifficulty.value;
        const theDATA = yield fetchQuestions(getNumberOfQuestions, getCategory || "", getQuestionsDifficulty);
        questionsData = (_a = theDATA === null || theDATA === void 0 ? void 0 : theDATA.results) !== null && _a !== void 0 ? _a : [];
        if (questionsData.length > 0) {
            quizForm.style.display = "block";
            displayQuestion();
        }
    });
});
function displayQuestion() {
    if (questionsData && questionsData.length > num) {
        const getQuestion = questionsData[num].question;
        const getAnswers = [
            ...questionsData[num].incorrect_answers,
            questionsData[num].correct_answer,
        ];
        if (answerOptionsDiv) {
            loadingGame.style.display = "none";
        }
        appendQandA(getQuestion, getAnswers);
        console.log(questionsData.length);
        console.log(num);
    }
    else if (questionsData.length === 0) {
        questionDiv.innerHTML = "Error";
    }
    else {
        quizForm.style.display = "none";
        playAgain.style.display = "block";
        questionDiv.innerHTML = "GAME IS.....O V E R";
        answerOptionsDiv.innerHTML = "";
    }
}
function appendQandA(question, answers) {
    questionDiv.innerHTML = "";
    answerOptionsDiv.innerHTML = "";
    questionDiv.innerHTML = question;
    answers.forEach((option, index) => {
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.id = `option${index + 1}`;
        radioButton.name = "sword";
        radioButton.value = option;
        const label = document.createElement("label");
        label.htmlFor = `option${index + 1}`;
        label.textContent = option;
        const div = document.createElement("div");
        div.classList.add("input-answer", "input-correct-answer", "input-wrong-answer");
        div.append(label);
        answerOptionsDiv.append(radioButton, div);
    });
}
quizForm.onclick = (e) => {
    e.preventDefault();
    const checkedRadio = document.querySelector('input[type="radio"]:checked');
    const inputAnswer = checkedRadio.nextElementSibling;
    inputAnswer.style.background = "transparent";
    nextQuestion();
};
const QAContainer = document.getElementById("q-a-container");
function nextQuestion() {
    const radioButtons = document.querySelectorAll('input[name="sword"]:checked');
    const correctAnswer = questionsData && questionsData[num]
        ? questionsData[num].correct_answer
        : "";
    if (radioButtons.length > 0) {
        const selectedOption = radioButtons[0];
        if (correctAnswer === selectedOption.value) {
            if (selectedOption.nextElementSibling) {
                selectedOption.nextElementSibling.classList.add("input-correct-answer-clicked");
            }
            setTimeout(() => {
                num++;
                displayQuestion();
            }, 1000);
        }
        else {
            console.log("no");
            if (selectedOption.nextElementSibling) {
                selectedOption.nextElementSibling.classList.add("input-wrong-answer-clicked");
            }
        }
    }
}
playAgain.onclick = function () {
    formSubmit.style.display = "block";
    playAgain.style.display = "none";
    questionDiv.innerHTML = "";
};
//# sourceMappingURL=index.js.map