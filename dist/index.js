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
function fetchQuestions(amount, category, difficulty) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        try {
            const response = yield fetch(apiUrl);
            const data = yield response.json();
            return data;
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
const randomBTN = document.getElementById("random");
const answerOptionsDiv = document.getElementById("answerOptions");
const questionDiv = document.getElementById("question-request");
let num = 0;
let questionsData = null;
formSubmit.addEventListener("submit", function (e) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        formSubmit.style.display = "none";
        let getCategory = category.options[category.selectedIndex].dataset.categoryid;
        let getNumberOfQuestions = questionsNumber.value;
        let getQuestionsDifficulty = questionDifficulty.value;
        const theDATA = yield fetchQuestions(getNumberOfQuestions, getCategory || "", getQuestionsDifficulty);
        questionsData = (_a = theDATA === null || theDATA === void 0 ? void 0 : theDATA.results) !== null && _a !== void 0 ? _a : [];
        displayQuestion();
    });
});
function displayQuestion() {
    if (questionsData && questionsData.length > num) {
        const getQuestion = questionsData[num].question;
        const getAnswers = [
            ...questionsData[num].incorrect_answers,
            questionsData[num].correct_answer,
        ];
        appendQandA(getQuestion, getAnswers);
    }
    else {
        console.log("No more questions available.");
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
        div.append(radioButton, label);
        answerOptionsDiv.appendChild(div);
    });
}
randomBTN.onclick = () => {
    const radioButtons = document.querySelectorAll('input[name="sword"]:checked');
    const correctAnswer = questionsData && questionsData[num]
        ? questionsData[num].correct_answer
        : "";
    if (radioButtons.length > 0) {
        const selectedValue = radioButtons[0].value;
        if (correctAnswer === selectedValue) {
            num++;
            displayQuestion();
        }
        else {
            console.log("no");
        }
    }
};
//# sourceMappingURL=index.js.map