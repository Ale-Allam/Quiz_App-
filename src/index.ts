// Get DOM elements
const category = document.getElementById("category") as HTMLSelectElement; // Select dropdown for category
const questionsNumber = document.getElementById(
  "questionsNumber"
) as HTMLInputElement; // Input field for number of questions
const questionDifficulty = document.getElementById(
  "defcult"
) as HTMLSelectElement; // Select dropdown for question difficulty
const formSubmit = document.getElementById("submitApp") as HTMLFormElement; // Form submit button

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

  try {
    // Fetch data from API
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
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
const randomBTN = document.getElementById("random") as HTMLButtonElement;

// Get answer options and question elements
const answerOptionsDiv = document.getElementById(
  "answerOptions"
) as HTMLDivElement;
const questionDiv = document.getElementById(
  "question-request"
) as HTMLDivElement;

// Initialize variables
let num: number = 0;
let questionsData: TriviaQuestion[] | null = null;

// Event listener for form submission
formSubmit.addEventListener("submit", async function (e) {
  e.preventDefault();
  formSubmit.style.display = "none"; // Hide form after submission

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
  displayQuestion(); // Display the first question
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
    appendQandA(getQuestion, getAnswers);
  } else {
    console.log("No more questions available.");
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

    div.append(radioButton, label);
    answerOptionsDiv.appendChild(div);
  });
}

// Event listener for random button click
randomBTN.onclick = (): void => {
  // Get selected radio button
  const radioButtons = document.querySelectorAll('input[name="sword"]:checked');

  // Get correct answer for current question
  const correctAnswer =
    questionsData && questionsData[num]
      ? questionsData[num].correct_answer
      : "";

  // Check if an option is selected
  if (radioButtons.length > 0) {
    const selectedValue = (radioButtons[0] as HTMLInputElement).value;
    // Check if selected option is correct
    if (correctAnswer === selectedValue) {
      num++; // Move to next question
      displayQuestion(); // Display next question
    } else {
      console.log("no"); // Incorrect answer
    }
  }
};

// const quizForm = document.getElementById("quizForm") as HTMLFormElement;
