// Get DOM elements
const category = document.getElementById("category") as HTMLSelectElement; // Select dropdown for category
const questionsNumber = document.getElementById(
  "questionsNumber"
) as HTMLInputElement; // Input field for number of questions
const questionDifficulty = document.getElementById(
  "defcult"
) as HTMLSelectElement; // Select dropdown for question difficulty
const formSubmit = document.getElementById("submitApp") as HTMLFormElement; // Form submit button

const playAgain = document.getElementById("play-again") as HTMLButtonElement;

let gameOverOrNot: boolean = false;
// Define TriviaQuestion interface
interface TriviaQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

// Function to fetch trivia questions from API
async function fetchQuestions(
  amount: string,
  category: string,
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
    // Handle errors
    console.error("Error fetching data:", error);
    return null;
  }
}

// Define Category interface
interface Category {
  name: string;
  id: string;
}

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
    // Handle errors
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
}

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
    // Handle errors
    console.error("Error while populating categories:", error);
  }
}

// Call function to populate categories dropdown
populateCategories();

// Get random button element
const quizForm = document.getElementById("submit-answer") as HTMLButtonElement;

// Get answer options and question elements
const answerOptionsDiv = document.getElementById(
  "answerOptions"
) as HTMLDivElement;
const questionDiv = document.getElementById(
  "question-request"
) as HTMLDivElement;

const loadingGame = document.getElementsByClassName(
  "loading"
)[0] as HTMLDivElement;

// Initialize variables
let num: number = 0;
let questionsData: TriviaQuestion[] | null = null;

// Event listener for form submission
formSubmit.addEventListener("submit", async function (e) {
  num = 0;
  e.preventDefault();
  formSubmit.style.display = "none"; // Hide form after submission
  loadingGame.style.display = "block"; // Show loading

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
  questionsData = theDATA?.results ?? []; // Store fetched questions data
  if (questionsData.length > 0) {
    quizForm.style.display = "block"; // Show submission
    displayQuestion(); // Display the first question
  }
  // console.log(questionsData);
});

// Function to display a question
function displayQuestion(): void {
  if (questionsData && questionsData.length > num) {
    // Get question and answers for current question
    const getQuestion = questionsData[num].question;
    const getAnswers: string[] = [
      ...questionsData[num].incorrect_answers,
      questionsData[num].correct_answer,
    ];
    // Display question and answers
    if (answerOptionsDiv) {
      loadingGame.style.display = "none";
    }
    appendQandA(getQuestion, getAnswers);
    console.log(questionsData.length);
    console.log(num);
  } else if (questionsData.length === 0) {
    // QAContainer.textContent = `<h1>GAME IS.....O V E R</h1>`;
    questionDiv.innerHTML = "Error"; // Clear previous question
  } else {
    quizForm.style.display = "none";
    playAgain.style.display = "block";
    questionDiv.innerHTML = "GAME IS.....O V E R"; // Clear previous question
    answerOptionsDiv.innerHTML = ""; // Clear previous answers
  }
}

// Function to append question and answers to DOM
function appendQandA(question, answers) {
  questionDiv.innerHTML = ""; // Clear previous question
  answerOptionsDiv.innerHTML = ""; // Clear previous answers

  // Append question to DOM
  questionDiv.innerHTML = question;

  // Append answers to DOM
  answers.forEach((option: string, index: any) => {
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.id = `option${index + 1}`;
    radioButton.name = "sword"; // Assign name for radio button group
    radioButton.value = option;

    const label = document.createElement("label");
    label.htmlFor = `option${index + 1}`;
    label.textContent = option;

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
}

// Event listener for random button click
quizForm.onclick = (e): void => {
  e.preventDefault();
  // Get the checked radio input element
  const checkedRadio = document.querySelector('input[type="radio"]:checked');

  // Get the next sibling element with the class .input-answer
  const inputAnswer = checkedRadio.nextElementSibling;

  // Set the background of the input-answer element to transparent
  inputAnswer.style.background = "transparent";
  nextQuestion();
};
const QAContainer = document.getElementById("q-a-container") as HTMLDivElement;
function nextQuestion(): void {
  // Get selected radio button
  const radioButtons = document.querySelectorAll('input[name="sword"]:checked');

  // Get correct answer for current question
  const correctAnswer =
    questionsData && questionsData[num]
      ? questionsData[num].correct_answer
      : "";

  // Check if an option is selected
  if (radioButtons.length > 0) {
    const selectedOption = radioButtons[0] as HTMLInputElement;

    // Check if selected option is correct
    if (correctAnswer === selectedOption.value) {
      if (selectedOption.nextElementSibling) {
        selectedOption.nextElementSibling.classList.add(
          "input-correct-answer-clicked"
        );
      }
      setTimeout(() => {
        num++; // Move to next question
        displayQuestion(); // Display next question
      }, 1000);
    } else {
      console.log("no"); // Incorrect answer
      if (selectedOption.nextElementSibling) {
        selectedOption.nextElementSibling.classList.add(
          "input-wrong-answer-clicked"
        );
      }
    }
  }
}

playAgain.onclick = function () {
  formSubmit.style.display = "block";
  playAgain.style.display = "none";
  questionDiv.innerHTML = "";
};
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
