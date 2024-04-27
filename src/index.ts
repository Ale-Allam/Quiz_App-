// Get DOM elements:
// Select dropdown for category
const category = document.getElementById("category") as HTMLSelectElement;
const formSubmit = document.getElementById("submitApp") as HTMLFormElement;
const playAgain = document.getElementById("play-again") as HTMLButtonElement;
const playAgainForm = document.getElementById(
  "play-again-form"
) as HTMLFormElement;
const quizForm = document.getElementById("submit-answer") as HTMLButtonElement;
const quizFormDisplay = document.getElementById("quizForm") as HTMLFormElement;
const QAContainer = document.getElementById("q-a-container") as HTMLDivElement;
const questionsNumber = document.getElementById(
  "questionsNumber"
) as HTMLInputElement;
//
const questionDifficulty = document.getElementById(
  "defcult"
) as HTMLSelectElement;
//
const answerOptionsDiv = document.getElementById(
  "answerOptions"
) as HTMLDivElement;
//
const questionDiv = document.getElementById(
  "question-request"
) as HTMLDivElement;
//
const loadingGame = document.getElementsByClassName(
  "loading"
)[0] as HTMLDivElement;
//
const spansCorrectIncorrect = document.getElementById(
  "question-spans-container"
) as HTMLDivElement;
const spans = document.getElementById("spans") as HTMLDivElement;
//
const quizPercentage = document.getElementById(
  "quiz-percentage"
) as HTMLDivElement;

// Define TriviaQuestion interface
interface TriviaQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

// Variabels
let gameOverOrNot: boolean = false;
// Initialize variables
let num: number = 0;
let percentageNumber: number = 0;
let questionsData: TriviaQuestion[] | null = null;
const resultArray: boolean[] = [];

// *
// *
// *
// Function to fetch trivia questions from API
async function fetchQuestions(
  amount: string,
  category: string = "9",
  difficulty: string
): Promise<{ results: TriviaQuestion[] } | null> {
  // API URL based on parameters
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
  // https://opentdb.com/api.php?amount=10&difficulty=hard&type=multiple

  try {
    // Fetch data from API
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      setTimeout(() => {
        location.reload();
      }, 5000);
      throw new Error("Parameter is not a number!");
    }
  } catch (error) {
    quizFormDisplay.innerHTML = `<h1>GAME CRASHED</h1>`;
    return null;
  }
}
// *
// *
// *
// Define Category interface
interface Category {
  name: string;
  id: string;
}
// *
// *
// *
// Function to fetch trivia categories from API
async function fetchCategories(): Promise<Category[]> {
  try {
    // Fetch data from API
    const response = await fetch("https://opentdb.com/api_category.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    formSubmit.innerHTML = "<h1>Sorry Come Later</h1>";
    return [];
  }
}
// *
// *
// *
// Function to populate categories dropdown
async function populateCategories() {
  try {
    // Fetch categories
    const categories: Category[] = await fetchCategories();

    // Populate dropdown with categories
    categories.forEach((element) => {
      const optionElement = document.createElement("option");
      optionElement.value = element.name;
      optionElement.innerHTML = element.name;
      optionElement.setAttribute("data-categoryid", element.id);
      category.appendChild(optionElement);
    });
  } catch (error) {
    formSubmit.innerHTML = "<h1>Sorry Come Later</h1>";
  }
}

// Call function to populate categories dropdown
populateCategories();
// *
// *
// *
function onStartQuizz() {
  spans.style.opacity = "1";
  formSubmit.style.display = "none"; // Hide form after submission
  loadingGame.style.display = "block"; // Show loading// Show loading
  // Show loading// Show loading
}
// *
// *
// *
// quizForm.style.display = "none"; -------------------------------------------هنااااااااااااااااااااا الغلطططططططططط
// Event listener for form submission
formSubmit.addEventListener("submit", async function (e) {
  num = 0;
  e.preventDefault();
  onStartQuizz();

  // Get selected category, number of questions, and difficulty
  let getCategory: string | undefined =
    category.options[category.selectedIndex].dataset.categoryid;
  let getNumberOfQuestions: string = questionsNumber.value;
  let getQuestionsDifficulty: string = questionDifficulty.value;

  // Fetch questions based on selected parameters
  const theDATA = await fetchQuestions(
    getNumberOfQuestions,
    getCategory || "",
    getQuestionsDifficulty
  );
  //
  questionsData = theDATA?.results ?? []; // Store fetched questions data
  //
  if (questionsData.length > 0) {
    quizForm.style.display = "block"; // Show submission
    const num = questionsData.length;
    const numArray = Array.from({ length: num });
    numArray.forEach(() => {
      const span = document.createElement("span");
      span.classList.add("sp");
      spans.appendChild(span);
    });
    setTimeout(() => {
      quizFormDisplay.style.display = "block";
      displayQuestion();
    }, 1500); // Display the first question
  }
});
// *
// *
// *
function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// *
// *
// *
function resetGame() {
  spans.classList.add("scale-spans");
  quizForm.style.display = "none";
  playAgainForm.style.display = "block";
  quizFormDisplay.style.display = "none";

  setTimeout(() => {
    spans.style.opacity = "0";
    setTimeout(() => {
      spans.classList.remove("scale-spans");
    }, 1000);
  }, 2000);
}
// *
// *
// *
// Function to display a question
function displayQuestion(): void {
  if (questionsData && questionsData.length > num) {
    const getQuestion = questionsData[num].question;
    const getAnswers: string[] = [
      ...questionsData[num].incorrect_answers,
      questionsData[num].correct_answer,
    ];

    //After shuffel
    let shuveldAnswers = shuffleArray(getAnswers);

    // If game renderd display:none Loading
    if (answerOptionsDiv) {
      loadingGame.style.display = "none";
    }

    appendQandA(getQuestion, shuveldAnswers);
  } else if (questionsData?.length === 0) {
    questionDiv.innerHTML = "Error"; // Clear previous question
  } else {
    // appendPersentage
    calculateTruePercentage(resultArray);
    resetGame();
  }
}
// *
// *
// *
function decodeHTMLEntities(text: string) {
  const element = document.createElement("div");
  element.innerHTML = text;
  return element.textContent || element.innerText;
}
// *
// *
// *
// Function to append question and answers to DOM
function appendQandA(question: string, answers: string[]) {
  questionDiv.innerHTML = ""; // Clear previous question
  answerOptionsDiv.innerHTML = ""; // Clear previous answers

  // Append question to DOM
  questionDiv.innerHTML = decodeHTMLEntities(question); // GPT---

  // Append answers to DOM
  answers.forEach((option: string, index: any) => {
    const decodedOption = decodeHTMLEntities(option); // GPT---

    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.id = `option${index + 1}`;
    radioButton.name = "sword"; // Assign name for radio button group
    radioButton.value = option; // GPT---

    const label = document.createElement("label");
    label.htmlFor = `option${index + 1}`;
    label.textContent = decodedOption; // GPT---

    // answerOptionsDiv.appendChild();

    const div = document.createElement("div");
    div.classList.add(
      "input-answer",
      "input-correct-answer",
      "input-wrong-answer"
    );
    div.append(label);
    answerOptionsDiv.append(radioButton, div);
  });

  // ---------render span for correct and incoreeect answers-------------
}
// *
// *
// *
// Event listener for random button click
quizForm.onclick = (e): void => {
  e.preventDefault();
  styleAfterAnswer();
  nextQuestion();
};

// *
// *
// *
function nextQuestion(): void {
  // Get correct answer for current question
  const correctAnswer =
    questionsData && questionsData[num]
      ? questionsData[num].correct_answer
      : "";

  // mark Correct Answer After Submit Question
  let getAllAnswersInput = document.querySelectorAll(
    'input[name="sword"]'
  ) as NodeListOf<HTMLSpanElement>;
  function markCorrectAnswerAfterSubmitQuestion() {
    for (let i = 0; i < getAllAnswersInput.length; i++) {
      const input = getAllAnswersInput[i] as HTMLInputElement;
      if (input.value === correctAnswer) {
        const inputId = getAllAnswersInput[i].id;
        const label = document.querySelector(`label[for="${inputId}"]`);
        if (label) {
          (label as HTMLLabelElement).setAttribute(
            "style",
            "color: #00fe9b;text-shadow: 0px 0px 33px #02c435; text-decoration: underline;"
          );
        }
      }
    }
  }

  // setTimeOut Function to go for Next Question and waite for animation
  let getSpans = document.querySelectorAll(
    ".sp"
  ) as NodeListOf<HTMLSpanElement>;

  function nextQuestionSetTimeOut(result: string) {
    setTimeout(() => {
      if (getSpans) {
        getSpans[num].classList.add(result);
      }

      setTimeout(() => {
        num++; // Move to next question
        displayQuestion(); // Display next question
        answerOptionsDiv.style.opacity = "1";
        questionDiv.style.transform = "translateX(0%)";
      }, 1000);

      answerOptionsDiv.style.opacity = "0";
      questionDiv.style.transform = "translateX(-200%)";
    }, 1000);
  }

  // Check if an option is selected
  // Get selected radio button
  const radioButtons = document.querySelectorAll('input[name="sword"]:checked');

  if (radioButtons.length > 0) {
    const selectedOption = radioButtons[0] as HTMLInputElement;

    // Check if selected option is correct
    if (correctAnswer === selectedOption.value) {
      if (selectedOption.nextElementSibling) {
        selectedOption.nextElementSibling.classList.add(
          "input-correct-answer-clicked"
        );
      }
      //
      evaluateAnswerAndPushToArray(true);
      nextQuestionSetTimeOut("sp-correct");
    } else {
      if (selectedOption.nextElementSibling) {
        selectedOption.nextElementSibling.classList.add(
          "input-wrong-answer-clicked"
        );
      }
      //
      evaluateAnswerAndPushToArray(false);
      nextQuestionSetTimeOut("sp-incorrect");
      markCorrectAnswerAfterSubmitQuestion();
    }
  }
}
// *
// *
// *
function styleAfterAnswer() {
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
  if (checkedRadio) {
    const inputAnswer = checkedRadio.nextElementSibling as HTMLElement;
    if (inputAnswer) {
      inputAnswer.style.background = "transparent";
    }
  }
}
// *
// *
// *
function evaluateAnswerAndPushToArray(isCorrect: boolean): boolean[] {
  // Push the boolean value into the array
  resultArray.push(isCorrect);
  // Return the array
  return resultArray;
}
// *
// *
// *
// From ChatGPT
function calculateTruePercentage(arr: boolean[]): void {
  // Count the number of true values in the array
  const trueCount = resultArray.filter((value) => value === true).length;
  // Calculate the percentage
  const truePercentage = Math.floor((trueCount / arr.length) * 100);
  const intervalID = setInterval(checkNumber, 15);

  function checkNumber() {
    if (percentageNumber >= truePercentage) {
      clearInterval(intervalID);
    }
    if (truePercentage === 0) {
      quizPercentage.innerHTML = `${0}% 👾`;
    } else {
      quizPercentage.innerHTML = `${percentageNumber}%`;
      percentageNumber++;
    }
  }

  // Return the percentage
}

// *
// *
// *
function cleanForNewGame() {
  spans.innerHTML = "";
  formSubmit.style.display = "block";
  playAgainForm.style.display = "none";
  questionDiv.innerHTML = "";
  quizPercentage.innerHTML = "";
  percentageNumber = 0;
}
// *
// *
// *

playAgainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  cleanForNewGame();
  resultArray.length = 0;
});
// *
// *
// *

// ------------------Future Idea-------------------------
// let timer = 0;
// const displayTimer = document.getElementById("timer") as HTMLHeadingElement;

// // Update the timer display

// // Interval handler function
// function intervalHandler() {
//   // Increment the timer
//   timer++;
//   // Update the timer display
//   displayTimer.innerHTML = timer.toString();
// }

// // Set interval to call the intervalHandler function every second (1000 milliseconds)
// const intervalId = setInterval(intervalHandler, 1000);

// // Example of where to stop the interval
// setTimeout(() => {
//   clearInterval(intervalId); // Stop the interval after 10 seconds
// }, 10000);
// function callInConsol() {
//   console.log("COOL");
// }
// setInterval(callInConsol, 200);
