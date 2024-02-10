async function fetchQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const shuffledQuestions = data.sort(() => Math.random() - 0.5);

    const question = document.getElementById("question");
    const options = document.getElementById("options");

    question.textContent = shuffledQuestions[12].question;
    shuffledQuestions[12].options.forEach((e) => {
      console.log(e);
      let optionsLI = document.createElement("li");
      optionsLI.innerText = e;
      options.append(optionsLI);
    });

    return shuffledQuestions;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
fetchQuestions();
