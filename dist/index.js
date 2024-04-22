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
const questionsNumber = (document.getElementById("questionsNumber"));
const questionDefcult = document.getElementById("defcult");
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
            console.log(data);
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
//# sourceMappingURL=index.js.map