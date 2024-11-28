let flashcards = [];
let currentIndex = 0;

async function loadFlashcardsFromFile() {
    try {
        const response = await fetch('flashcards.json'); // Load the JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        flashcards = await response.json(); // Parse JSON
        loadFlashCard(); // Load the first flashcard
    } catch (error) {
        console.error("Error loading flashcards:", error);
        alert("Could not load flashcards. Please check the file and try again.");
    }
}

function loadFlashCard() {
    if (!flashcards.length) return; // Prevent loading if no data is available

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

// Other functions remain unchanged...

// Call the function to fetch and initialize flashcards
loadFlashcardsFromFile();
