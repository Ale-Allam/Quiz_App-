// async function fetchQuestions() {
//   try {
//     const response = await fetch(
//       "https://opentdb.com/api_count.php?category=9"
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     console.log(data);
//     const shuffledQuestions = data.sort(() => Math.random() - 0.5);

//     const question = document.getElementById("question");
//     const options = document.getElementById("options");

//     question.textContent = shuffledQuestions[12].question;
//     shuffledQuestions[12].options.forEach((e) => {
//       console.log(e);
//       let optionsLI = document.createElement("li");
//       optionsLI.innerText = e;
//       options.append(optionsLI);
//     });

//     return shuffledQuestions;
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return null;
//   }
// }
// fetchQuestions();

// Function to fetch questions from the API

async function fetchQuestions(amount, category, difficulty) {
  // const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=&difficulty=`;
  const apiUrl = `https://opentdb.com/api_category.php`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Example usage
// const amount = 10; // Number of questions to fetch
// const category = 27; // Category ID (Replace with the desired category ID)
// const difficulty = "easy"; // Difficulty level (easy, medium, hard)
// console.log(fetchQuestions().then((data) => console.log(data.results)));
// // fetchQuestions(amount, category, difficulty).then((data) => {
// //   if (data && data.response_code === 0) {
// //     console.log("Questions:", data.results);
// //     document.write(data.results);
// //     // Handle the retrieved questions here
// //   } else {
// //     console.error(
// //       "Error fetching questions:",
// //       data ? data.response_message : "Unknown error"
// //     );
// //   }
// // });

// // https://opentdb.com/api.php?amount=11&category=27&difficulty=easy&type=multiple
// // https://opentdb.com/api.php?amount=11&category=27&difficulty=easy&type=boolean
const category = document.getElementById("category");
async function fetchQuestionsCategory() {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    data.trivia_categories.forEach((element) => {
      const optionElement = document.createElement("option");
      optionElement.value = element.name;
      optionElement.innerHTML = element.name;
      category.appendChild(optionElement);
    });
  } catch {
    return null;
  }
}
fetchQuestionsCategory();
category.onclick = function () {
  console.log(category.value);
};
