
const questions = [
    {
        question: "A cloud administrator needs to create a virtual machine that requires layer 2 connectivity to an on-premises workload. Which type of network segment is required?",
        choices: ["Existing", "Outbound", "Extended", "Routed"],
        correct: 2,
        explanation: "An Extended network segment allows layer 2 connectivity to on-premises workloads."
    },
    {
        question: "A cloud administrator wants to migrate a virtual machine using VMware vSphere vMotion from their on-premises data center to their VMware Cloud on AWS software-defined data center (SDDC), using an existing private line to the cloud SDDC. Which two requirements must be met before the migration can occur? (Choose two.)",
        choices: [
            "The versions of VMware vSphere need to match between the on-premises data center and the cloud SDDC.",
            "A Layer 2 connection is configured between the on-premises data center and the cloud SDDC.",
            "AWS Direct Connect is configured between the on-premises data center and the cloud SDDC.",
            "IPsec VPN is configured between the on-premises data center and the cloud SDDC.",
            "Cluster-level Enhanced vMotion Compatibility (EVC) is configured in the on-premises data center and the cloud SDDC."
        ],
        correct: [1, 4],
        explanation: "A Layer 2 connection ensures network identity preservation during vMotion, and EVC ensures CPU compatibility."
    },
    {
        question: "A cloud administrator is developing a new Private cloud in Google VMware Engine and wants to allow for Maximum growth. What are two valid subnet sizes that meets the requirement for the VMware vSphere/vSAN subnet? (Choose two.)",
        choices: ["/21", "/24", "/22", "/23", "/20"],
        correct: [0, 4],
        explanation: "Subnet sizes /20 and /21 allow for maximum growth in Google VMware Engine."
    },
    {
        question: "A cloud administrator is responsible for managing a VMware Cloud solution and would like to ensure that I/O-intensive workloads run in the most optimum way possible. Which two steps should the administrator complete on I/O-intensive workloads to meet this requirement? (Choose two.)",
        choices: [
            "Ensure that the VMware hardware version is 7 or later.",
            "Enable the memory hot-add feature.",
            "Configure the LSI Logic Parallel SCSI controller.",
            "Configure the VMware Paravirtual SCSI (PVSCSI) adapter.",
            "Configure a maximum of two CPU cores per socket."
        ],
        correct: [0, 3],
        explanation: "Using hardware version 7 or later and configuring PVSCSI adapters optimize I/O-intensive workloads."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function displayQuestion(index) {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const nextButton = document.getElementById("next-button");
    const resultElement = document.getElementById("result");

    // Reset display
    questionElement.style.display = 'block';
    optionsElement.style.display = 'block';
    nextButton.style.display = 'block';
    resultElement.classList.add('hide');
    nextButton.disabled = false;

    questionElement.innerText = questions[index].question;
    optionsElement.innerHTML = "";

    questions[index].choices.forEach((choice, i) => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option");

        const inputElement = document.createElement("input");
        inputElement.type = Array.isArray(questions[index].correct) ? "checkbox" : "radio";
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

    const optionsElement = document.getElementById("options");
    const nextButton = document.getElementById("next-button");
    const resultElement = document.getElementById("result");

    if (selectedOptions.length > 0) {
        nextButton.disabled = true;

        let isCorrect = false;

        if (Array.isArray(correctAnswer)) {
            // Multiple correct answers
            const selectedValues = Array.from(selectedOptions).map(option => parseInt(option.value));
            selectedValues.sort();
            const correctAnswersSorted = [...correctAnswer].sort();

            if (JSON.stringify(selectedValues) === JSON.stringify(correctAnswersSorted)) {
                isCorrect = true;
                score++;
            }
        } else {
            if (parseInt(selectedOptions[0].value) === correctAnswer) {
                isCorrect = true;
                score++;
            }
        }

        userAnswers.push({
            questionIndex: currentQuestionIndex,
            selectedOptions: Array.from(selectedOptions).map(option => parseInt(option.value)),
            isCorrect: isCorrect
        });

        showExplanation(isCorrect);
    } else {
        alert("Please select at least one option.");
    }
});

function showExplanation(isCorrect) {
    const optionsElement = document.getElementById("options");
    const questionElement = document.getElementById("question");
    const nextButton = document.getElementById("next-button");
    const resultElement = document.getElementById("result");

    optionsElement.style.display = 'none';
    questionElement.style.display = 'none';

    resultElement.classList.remove('hide');
    resultElement.innerHTML = '';

    const status = document.createElement('h2');
    status.innerText = isCorrect ? "Correct!" : "Incorrect!";
    status.classList.add(isCorrect ? 'correct' : 'incorrect');
    resultElement.appendChild(status);

    const explanation = document.createElement('p');
    explanation.innerText = questions[currentQuestionIndex].explanation;
    explanation.classList.add('explanation');
    resultElement.appendChild(explanation);

    nextButton.innerText = currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results";
    nextButton.disabled = false;

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            nextButton.innerText = "Next";
            displayQuestion(currentQuestionIndex);
        } else {
            showFinalResults();
        }
    }, { once: true });
}

function showFinalResults() {
    const quizElement = document.getElementById("quiz");
    const resultElement = document.getElementById("result");

    quizElement.style.display = 'none';
    resultElement.classList.remove('hide');
    resultElement.innerHTML = `<h2>Your Score: ${score} out of ${questions.length}</h2>`;

    questions.forEach((question, index) => {
        const questionTitle = document.createElement('h3');
        questionTitle.innerText = `Question ${index + 1}: ${question.question}`;
        resultElement.appendChild(questionTitle);

        const userAnswerData = userAnswers.find(u => u.questionIndex === index);
        const selectedIndices = userAnswerData ? userAnswerData.selectedOptions : [];
        const selectedChoices = selectedIndices.map(i => question.choices[i]);

        const userAnswer = document.createElement('p');
        userAnswer.innerText = `Your Answer(s): ${selectedChoices.join(', ')}`;
        userAnswer.classList.add(userAnswerData.isCorrect ? 'correct' : 'incorrect');
        resultElement.appendChild(userAnswer);

        const correctAnswerIndices = Array.isArray(question.correct) ? question.correct : [question.correct];
        const correctChoices = correctAnswerIndices.map(i => question.choices[i]);

        const correctAnswer = document.createElement('p');
        correctAnswer.innerText = `Correct Answer(s): ${correctChoices.join(', ')}`;
        correctAnswer.classList.add('correct');
        resultElement.appendChild(correctAnswer);

        const explanation = document.createElement('p');
        explanation.innerText = question.explanation;
        explanation.classList.add('explanation');
        resultElement.appendChild(explanation);

        resultElement.appendChild(document.createElement('hr'));
    });
}

// Start the quiz by displaying the first question
displayQuestion(currentQuestionIndex);
