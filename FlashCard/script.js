let flashcards = [];
let currentIndex = 0;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); // Adjust path if necessary
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        flashcards = await response.json();
        if (flashcards.length === 0) {
            throw new Error("No questions found in the JSON file.");
        }
        loadFlashCard();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").innerText = "Failed to load questions.";
        document.getElementById("counter").innerText = "Check console for details.";
    }
}

function loadFlashCard() {
    if (flashcards.length === 0) return;

    const card = flashcards[currentIndex];

    // Set the question and answer content
    document.getElementById("question").innerText = card.question;
    document.getElementById("answer").innerText = card.answer;

    // Ensure the card shows the question initially
    const flashcard = document.querySelector(".flashcard");
    flashcard.classList.remove("flip");

    // Adjust card size dynamically based on content
    adjustCardSize();

    // Update the question counter
    document.getElementById("counter").innerText = `Question ${currentIndex + 1} of ${flashcards.length}`;
}

function adjustCardSize() {
    const flashcard = document.querySelector(".flashcard");
    const questionElement = document.getElementById("question");
    const answerElement = document.getElementById("answer");

    // Determine the taller content (question or answer)
    const questionHeight = questionElement.scrollHeight;
    const answerHeight = answerElement.scrollHeight;

    // Set card height based on the taller content
    flashcard.style.height = `${Math.max(questionHeight, answerHeight) + 60}px`;
    flashcard.style.margin = "0 auto"; // Center the card horizontally
}

function flipCard() {
    const flashcard = document.querySelector(".flashcard");
    flashcard.classList.toggle("flip");
}

function nextFlashCard() {
    const flashcard = document.querySelector(".flashcard");

    // Reset flip state if card is flipped
    if (flashcard.classList.contains("flip")) {
        flashcard.classList.remove("flip");
    }

    // Check if the user has completed all questions
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
    document.querySelector("button").innerText = "Restart"; // Update button text
    document.querySelector("button").onclick = restartTest; // Assign restart function
    document.getElementById("finishPage").style.display = "block"; // Show finish page
}

function restartTest() {
    currentIndex = 0;

    // Restore flashcard and counter visibility
    document.querySelector(".flashcard-container").style.display = "flex";
    document.querySelector(".counter").style.display = "block";
    document.querySelector("button").innerText = "Next Question"; // Restore button text
    document.querySelector("button").onclick = nextFlashCard; // Assign next question function
    document.getElementById("finishPage").style.display = "none"; // Hide finish page

    // Load the first question
    loadFlashCard();
}

// Add a click listener to flip the card
document.querySelector(".flashcard").addEventListener("click", flipCard);

// Load questions from the JSON file on startup
loadQuestions();
