// async function fetchQuestions(
//   amount: string,
//   difficulty: string,
//   category?: string
// ): Promise<{ results: TriviaQuestion[] } | null> {
//   // API URL based if Category didn't fetch
//   const defaultApiUrl = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
//   // API URL based on parameters
//   const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
//   // https://opentdb.com/api.php?amount=10&difficulty=hard&type=multiple

//   try {
//     // Fetch default API
//     const defaultResponse = await fetch(defaultApiUrl);
//     const defaultData = await defaultResponse.json();

//     // Fetch data from API
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     if (data.response_code === 0) {
//       return data;
//     } else {
//       return defaultData;
//     }
//   } catch (error) {
//     // Handle errors
//     console.error("Error fetching data:", error);
//     return null;
//   }
// }
