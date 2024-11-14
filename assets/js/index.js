import quizData from './data.js';

const quizContainer = document.getElementById('quiz');
const startButton = document.getElementById('start');
const submitButton = document.getElementById('submit');
const stopButton = document.getElementById('stop');
const homeButton = document.getElementById('home');
const resultContainer = document.getElementById('result');
const feedbackContainer = document.getElementById('feedback');
const globalTimerContainer = document.getElementById('global-timer');
const questionTimerContainer = document.getElementById('question-timer');

let score = 0;
let userAnswers = [];
const totalTime = 120; // time pour finir tous les quiz
const questionTimeLimit = 30; // time pour chaque question
let remainingTime = totalTime;
let questionTime = questionTimeLimit;
let globalTimer;
let questionTimer;
let currentQuiz = 0;
let isPaused = false;

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    submitButton.style.display = 'inline-block';
    stopButton.style.display = 'inline-block';
    homeButton.style.display = 'inline-block';
    globalTimerContainer.style.display = 'flex';
    questionTimerContainer.style.display = 'flex';
    globalTimer = setInterval(updateGlobalTimer, 1000);
    updateGlobalTimer();
    updateQuestionTimer();
    loadQuiz();
});
function getSelected() {
    //cible les reonses des utlisateurs
    const answers = document.querySelectorAll('input[name="answer"]');
    let selectedAnswer = null;
    
    answers.forEach(answer => {
        if (answer.checked) {
            selectedAnswer = answer.value;
        }
    });
    return selectedAnswer;
}


stopButton.addEventListener('click', () => {
    if (isPaused) {
        //lancer appli
        isPaused = false;
        stopButton.textContent = 'Arrêter';
        //relancement de minuterie des quiz
        globalTimer = setInterval(updateGlobalTimer, 1000);
        //relancement de minuterie de chaque question
        updateQuestionTimer();
    } else {
        //pause
        isPaused = true;
        stopButton.textContent = 'Reprendre';
        clearInterval(globalTimer);
        clearTimeout(questionTimer);
    }
});

homeButton.addEventListener('click', () => {
    //recharge de la page
    location.reload();
});

submitButton.addEventListener('click', () => {

    const selectedAnswer = getSelected();
    
    if (selectedAnswer) {
        userAnswers[currentQuiz] = selectedAnswer;
        if (selectedAnswer === quizData[currentQuiz].correct) {
            score++;
            feedbackContainer.innerHTML = '<p class="text-success">Bonne réponse!</p>';
            
        } else {
            const correctAnswerText = quizData[currentQuiz][quizData[currentQuiz].correct];
            feedbackContainer.innerHTML = `<p class="text-danger">Faux! La bonne réponse est: ${correctAnswerText}</p>`;
           
        }
        currentQuiz++;
        clearTimeout(questionTimer); //supprime le timer de la question
       
        if (currentQuiz < quizData.length) {
            setTimeout(loadQuiz, 1000);  // Delai pour montrer aux utlisateurs que c est vrai ou faux
        } else {
            globalTimerContainer.style.display = 'none';
            questionTimerContainer.style.display = 'none';
            setTimeout(showResults, 2000);  // Resultats finals
        }
    }
});

//Fonction qui lance le quiz
function loadQuiz() {
    if (isPaused) return;
    clearTimeout(questionTimer);
    feedbackContainer.innerHTML = '';  // vider le container qui montre aux utlisateurs que c'est vrai ou faux
    const currentQuizData = quizData[currentQuiz];
    const quizHtml = `
        <div class="question mini-title">${currentQuizData.question}</div>
        <ul class="options list-group">
            <li class="form-check list-group-item flex jcsb gap-20">
                <input type="checkbox" class="check" id="a" name="answer" value="a">
                <label for="a" class="label_check">${currentQuizData.a}</label>
            </li>
            <li class="form-check list-group-item flex jcsb gap-20">
                <input type="checkbox" class="check" id="b" name="answer" value="b">
                <label for="b" class="label_check">${currentQuizData.b}</label>
            </li>
            <li class="form-check list-group-item flex jcsb gap-20">
                <input type="checkbox" class="check" id="c" name="answer" value="c">
                <label for="c" class="label_check">${currentQuizData.c}</label>
            </li>
            <li class="form-check list-group-item flex jcsb gap-20">
                <input type="checkbox" class="check" id="d" name="answer" value="d">
                <label for="d" class="label_check">${currentQuizData.d}</label>
            </li>
        </ul>
    `;
    quizContainer.innerHTML = quizHtml;
    startQuestionTimer();
}

function updateGlobalTimer() {
    if (isPaused) return;
    if (remainingTime <= 0) {
        clearInterval(globalTimer);
        showResults();
    } else {
        remainingTime--;
        globalTimerContainer.textContent = `${remainingTime}s`;
    }
}

function startQuestionTimer() {
    if (isPaused) return;
    questionTime = questionTimeLimit;
    updateQuestionTimer();
}

function updateQuestionTimer() {
    if (isPaused) return;
    if (questionTime <= 0) {
        loadNextQuestion();
    } else {
        questionTime--;
        questionTimerContainer.textContent = `${questionTime}s`;
        questionTimer = setTimeout(updateQuestionTimer, 1000);
    }
}

function loadNextQuestion() {
    //vider le time
    clearTimeout(questionTimer);
    currentQuiz++;
    if (currentQuiz < quizData.length) {
        loadQuiz();
    } else {
        showResults();
    }
}

function showResults() {
    submitButton.style.display = 'none';
    stopButton.style.display = 'none';
    
    let resultsHtml = `<h2>Vous avez répondu correctement à ${score} sur ${quizData.length} questions.</h2>`;
    resultsHtml += '<ul class="list-group">';

    //Parcourir tous les réponses des utlisateurs
    quizData.forEach((q, index) => {
        const correctAnswerText = q[q.correct];
        const userAnswerText = userAnswers[index] || 'Pas de réponse';
        const isCorrect = userAnswers[index] === q.correct ? 'correct' : 'incorrect';
        
        resultsHtml += `
            <li class="list-group-item ${isCorrect}">
                Question: ${q.question}<br>
                Votre réponse: ${userAnswerText}<br>
                Bonne réponse: ${correctAnswerText}
            </li>
        `;
    });
    
    resultsHtml += '</ul>';
    resultContainer.innerHTML = resultsHtml;
}
