const category = <HTMLSelectElement>document.getElementById("category");
const questionsNumber = <HTMLInputElement>(
  document.getElementById("questionsNumber")
);
const questionDefcult = <HTMLSelectElement>document.getElementById("defcult");
const formSubmit = <HTMLFormElement>document.getElementById("submitApp");

async function fetchQuestions(
  amount: string,
  category: string,
  difficulty: string
): Promise<string | null> {
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

interface Category {
  name: string;
  id: string;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data.trivia_categories;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
}

async function populateCategories() {
  try {
    const categories: Category[] = await fetchCategories();

    categories.forEach((element) => {
      const optionElement = document.createElement("option");
      optionElement.value = element.name;
      optionElement.innerHTML = element.name;
      optionElement.setAttribute("data-categoryid", element.id);
      category.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Error while populating categories:", error);
  }
}

populateCategories();

// formSubmit.addEventListener("submit", async function (e) {
//   e.preventDefault();
//   formSubmit.style.display = "none";
//   let getCategory: string | undefined =
//     category.options[category.selectedIndex].dataset.categoryid;
//   let getNumberOfQuestions: string = questionsNumber.value;
//   let getQuestionsDefcult: string = questionDefcult.value;

//   const theDATA = fetchQuestions(
//     getNumberOfQuestions,
//     getCategory,
//     getQuestionsDefcult
//   );
//   theDATA.then((data) => console.log(data.results));
// });
// fetchQuestionsCategory();
