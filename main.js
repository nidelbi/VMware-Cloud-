let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// Fetch questions from the JSON file
fetch("questions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch questions.");
    }
    return response.json();
  })
  .then((data) => {
    questions = data; // Assign data to questions array
    displayQuestion(currentQuestionIndex); // Start the quiz
  })
  .catch((error) => {
    console.error("Error loading questions:", error);
    alert("Failed to load questions. Please try again later.");
  });

function displayQuestion(index) {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const nextButton = document.getElementById("next-button");
  const resultElement = document.getElementById("result");

  // Reset display
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  nextButton.style.display = "block";
  resultElement.classList.add("hide");
  nextButton.disabled = false;

  const currentQuestion = questions[index];
  questionElement.innerText = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.choices.forEach((choice, i) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    const inputElement = document.createElement("input");
    inputElement.type = Array.isArray(currentQuestion.correct) ? "checkbox" : "radio";
    inputElement.name = "option";
    inputElement.value = i;
    inputElement.id = `option${i}`;

    const label = document.createElement("label");
    label.htmlFor = `option${i}`;
    label.innerText = choice;

    optionDiv.appendChild(inputElement);
    optionDiv.appendChild(label);
    optionsElement.appendChild(optionDiv);
  });

  nextButton.innerText = "Submit";
}

document.getElementById("next-button").addEventListener("click", () => {
  const selectedOptions = document.querySelectorAll('input[name="option"]:checked');
  const correctAnswer = questions[currentQuestionIndex].correct;

  if (selectedOptions.length > 0) {
    let isCorrect = false;

    if (Array.isArray(correctAnswer)) {
      // Multiple correct answers
      const selectedValues = Array.from(selectedOptions).map((option) => parseInt(option.value));
      selectedValues.sort();
      const correctAnswersSorted = [...correctAnswer].sort();

      if (
        JSON.stringify(selectedValues) === JSON.stringify(correctAnswersSorted)
      ) {
        isCorrect = true;
        score++;
      }
    } else {
      if (parseInt(selectedOptions[0].value) === correctAnswer) {
        isCorrect = true;
        score++;
      }
    }

    if (isCorrect) {
      showExplanation(true);
    } else {
      handleIncorrectAnswer(selectedOptions, correctAnswer);
    }
  } else {
    alert("Please select at least one option.");
  }
});

function handleIncorrectAnswer(selectedOptions, correctAnswer) {
  const optionsElement = document.getElementById("options");
  const resultElement = document.getElementById("result");

  // Reset styling for all options
  const allOptions = optionsElement.querySelectorAll(".option");
  allOptions.forEach((option) => option.classList.remove("highlight-wrong"));

  // Highlight the incorrect selections
  selectedOptions.forEach((option) => {
    const optionDiv = option.parentElement;
    optionDiv.classList.add("highlight-wrong");
  });

  // Display the "Incorrect" label at the bottom of the div
  resultElement.classList.remove("hide");
  resultElement.innerHTML = "<p class='incorrect'>Incorrect! Please try again.</p>";
}

function showExplanation(isCorrect) {
    const optionsElement = document.getElementById("options");
    const questionElement = document.getElementById("question");
    const nextButton = document.getElementById("next-button");
    const resultElement = document.getElementById("result");
  
    optionsElement.style.display = "none"; // Hide options
    questionElement.style.display = "none"; // Hide question text
  
    resultElement.classList.remove("hide"); // Show the result
    resultElement.innerHTML = ""; // Reset result content
  
    // Display status (Correct/Incorrect)
    const status = document.createElement("h2");
    status.innerText = isCorrect ? "Correct!" : "Incorrect!";
    status.classList.add(isCorrect ? "correct" : "incorrect");
    resultElement.appendChild(status);
  
    // Display explanation
    const explanation = document.createElement("p");
    explanation.innerText = questions[currentQuestionIndex].explanation;
    explanation.classList.add("explanation");
    resultElement.appendChild(explanation);
  
    // Update button text for navigation
    nextButton.innerText = currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results";
    nextButton.disabled = false; // Ensure button is enabled
  
    // **Do not proceed automatically**; only navigate on button click
    nextButton.addEventListener(
      "click",
      () => {
        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          displayQuestion(currentQuestionIndex);
        } else {
          showFinalResults();
        }
      },
      { once: true }
    );
  }
  

function showFinalResults() {
  const quizElement = document.getElementById("quiz");
  const resultElement = document.getElementById("result");

  quizElement.style.display = "none";
  resultElement.classList.remove("hide");
  resultElement.innerHTML = `<h2>Your Score: ${score} out of ${questions.length}</h2>`;

  questions.forEach((question, index) => {
    const questionTitle = document.createElement("h3");
    questionTitle.innerText = `Question ${index + 1}: ${question.question}`;
    resultElement.appendChild(questionTitle);

    const userAnswerData = userAnswers.find((u) => u.questionIndex === index);
    const selectedIndices = userAnswerData ? userAnswerData.selectedOptions : [];
    const selectedChoices = selectedIndices.map((i) => question.choices[i]);

    const userAnswer = document.createElement("p");
    userAnswer.innerText = `Your Answer(s): ${selectedChoices.join(", ")}`;
    userAnswer.classList.add(userAnswerData.isCorrect ? "correct" : "incorrect");
    resultElement.appendChild(userAnswer);

    const correctAnswerIndices = Array.isArray(question.correct) ? question.correct : [question.correct];
    const correctChoices = correctAnswerIndices.map((i) => question.choices[i]);

    const correctAnswer = document.createElement("p");
    correctAnswer.innerText = `Correct Answer(s): ${correctChoices.join(", ")}`;
    correctAnswer.classList.add("correct");
    resultElement.appendChild(correctAnswer);

    const explanation = document.createElement("p");
    explanation.innerText = question.explanation;
    explanation.classList.add("explanation");
    resultElement.appendChild(explanation);

    resultElement.appendChild(document.createElement("hr"));
  });
}
