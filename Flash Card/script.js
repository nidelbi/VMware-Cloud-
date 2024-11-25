const flashcards = [
    { question: "What is 2 + 2?", answer: "4" },
    {
      question:
        "This is a very long text that needs to fit dynamically within the card. It will adjust the card size accordingly so that the content is displayed properly.",
      answer: "The answer is dynamically displayed."
    },
    { question: "What is the square root of 16?", answer: "4" },
  ];
  let currentIndex = 0;
  
  function loadFlashCard() {
    const card = flashcards[currentIndex];
  
    // Load question and answer
    document.getElementById("question").innerText = card.question;
    document.getElementById("answer").innerText = card.answer;
  
    // Ensure the card is showing the question initially
    const flashcard = document.querySelector(".flashcard");
    flashcard.classList.remove("flip");
  
    // Adjust card size dynamically based on content
    adjustCardSize();
  
    // Update counter
    document.getElementById("counter").innerText = `Question ${currentIndex + 1} of ${flashcards.length}`;
  }
  
  function adjustCardSize() {
    const flashcard = document.querySelector(".flashcard");
    const questionElement = document.getElementById("question");
    const answerElement = document.getElementById("answer");
  
    // Dynamically set height based on the taller of the two (question or answer)
    const questionHeight = questionElement.scrollHeight;
    const answerHeight = answerElement.scrollHeight;
  
    // Set the height dynamically
    flashcard.style.height = `${Math.max(questionHeight, answerHeight) + 60}px`; // Add extra padding
    flashcard.style.margin = "0 auto"; // Center the card horizontally
  }
  
  function flipCard() {
    const flashcard = document.querySelector(".flashcard");
    flashcard.classList.toggle("flip");
  }
  
  function nextFlashCard() {
    const flashcard = document.querySelector(".flashcard");
  
    // If the card is flipped, reset it before loading the next question
    if (flashcard.classList.contains("flip")) {
      flashcard.classList.remove("flip");
    }
  
    // Check if all questions are completed
    if (currentIndex === flashcards.length - 1) {
      showFinishPage();
      return;
    }
  
    // Move to the next question
    currentIndex++;
    loadFlashCard();
  }
  
  function showFinishPage() {
    document.querySelector(".flashcard-container").style.display = "none";
    document.querySelector(".counter").style.display = "none";
    document.querySelector("button").innerText = "Restart"; // Change button text to "Restart"
    document.querySelector("button").onclick = restartTest; // Assign restartTest function to button
  }
  
  function restartTest() {
    currentIndex = 0;
  
    // Restore the flashcard and counter
    const flashcardContainer = document.querySelector(".flashcard-container");
    flashcardContainer.style.display = "flex"; // Ensure container remains centered
    document.querySelector(".counter").style.display = "block";
    document.querySelector("button").innerText = "Next Question"; // Restore button text to "Next Question"
    document.querySelector("button").onclick = nextFlashCard; // Restore nextFlashCard function to button
    document.getElementById("finishPage").style.display = "none";
  
    // Load the first question and adjust the card size
    loadFlashCard();
  }
  
  // Initialize the first card
  loadFlashCard();
  
  // Add a click listener to flip the card
  document.querySelector(".flashcard").addEventListener("click", flipCard);
  