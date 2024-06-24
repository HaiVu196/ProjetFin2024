// Définir les questions pour le quiz
var questions = [
    {
        question: "L'algorithme de Dijkstra est utilisé pour résoudre des problèmes _____________.",
        options: ["Chemin le plus court de toutes les paires", "Chemin le plus court d'une source unique", "Flux de réseau","Tri"],
        answer: 1 // L'index de la réponse correcte (commence à 0)
    },
    {
        question: "Laquelle des structures de données suivantes est la plus couramment utilisée pour implémenter l'algorithme de Dijkstra ?",
        options: ["File d'attente à priorité maximale", "Pile", "File d'attente circulaire", "File d'attente à priorité minimale"],
        answer: 3
    },
    {
        question: "L'algorithme de Dijkstra ne peut pas être appliqué sur ______________",
        options: ["Graphiques orientés et pondérés", "Graphiques ayant une fonction de poids négatif", "Graphiques non pondérés", "Graphiques non orientés et non pondérés"],
        answer: 1
    },
    {
        question: "Combien d'opérations de file d'attente prioritaires sont impliquées dans l'algorithme de Dijkstra ?",
        options: ["1", "3", "2","4"],
        answer: 1
    },
    {
        question: "Le temps d'exécution de l'algorithme de Bellmann Ford est inférieur à celui de l'algorithme de Dijkstra.",
        options: ["Vrai", "Faux"],
        answer: 1
    },
    {
        question: "L'algorithme de Dijkstra exécuté sur un graphe orienté pondéré G={V,E} avec une fonction de poids non négative w et une source s, se termine par d[u]=delta(s,u) pour tous les sommets u dans V.",
        options: ["Vrai", "Faux"],
        answer: 0
    },
    {
        question: "Lequel des algorithmes suivants peut être utilisé pour calculer efficacement les chemins les plus courts à source unique dans un graphe acyclique dirigé ?",
        options: ["Dijkstra", "Bellman-Ford","Tri topologique"],
        answer: 2
    },
    {
        question: "L'algorithme de Dijkstra est l'exemple principal pour ___________",
        options: ["Algorithme glouton", "Brancher et borné", "Retour sur trace", "Programmation dynamique"],
        answer: 0
    },
    {
        question: "Étant donné un graphe orienté où le poids de chaque arête est le même, nous pouvons trouver efficacement le chemin le plus court d'une source donnée à une destination en utilisant _______.",
        options: ["Algorithme de plus court chemin de Dijkstra", "Ni le parcours en largeur ni l'algorithme de Dijkstra ne peuvent être utilisés", "Recherche en profondeur", "Parcours en largeur"],
        answer: 3
    },
    {
        question: "La déclaration suivante est-elle valable concernant les chemins les plus courts ? Étant donné un graphique, supposons que nous ayons calculé le chemin le plus court entre une source et tous les autres sommets. Si nous modifions le graphique de telle sorte que les poids de toutes les arêtes deviennent le double du poids d'origine, alors le chemin le plus court reste le même, seul le poids total du chemin change.",
        options: ["Vrai", "Faux"],
        answer: 0
    },
    {
        question: "La déclaration suivante est-elle valable ? Étant donné un graphe où toutes les arêtes ont des poids positifs, les chemins les plus courts produits par les algorithmes de Dijkstra et de Bellman-Ford peuvent être différents mais le poids du chemin serait toujours le même.",
        options: ["Vrai", "Faux"],
        answer: 0
    }
];

var currentQuestionIndex;
var score;
var questionElement = document.getElementById("question");
var optionsElement = document.getElementById("options");
var feedbackElement = document.getElementById("feedback");
var submitButton = document.getElementById("submit-btn");

// Fonction pour démarrer le quiz
function startQuiz() {
    var randomQuestionIndices = getRandomQuestionIndices(3, questions.length); // Obtenir 3 indices aléatoires parmi les questions
    currentQuestionIndex = 0;
    score = 0;
    currentQuestionIndices = randomQuestionIndices;
    displayQuestion();
}

// Fonction pour afficher une question
function displayQuestion() {
    var currentQuestion = questions[currentQuestionIndices[currentQuestionIndex]];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(function (option, index) {
        var optionButton = document.createElement("button");
        optionButton.textContent = option;
        optionButton.onclick = function () {
            checkAnswer(index);
        };
        optionsElement.appendChild(optionButton);
    });
}

// Fonction pour vérifier la réponse
function checkAnswer(selectedIndex) {
    var currentQuestion = questions[currentQuestionIndices[currentQuestionIndex]];
    if (selectedIndex === currentQuestion.answer) {
        score++;
        feedbackElement.textContent = "Correct!";
    } else {
        feedbackElement.textContent = "Incorrect!";
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < 3) {
        displayQuestion();
    } else {
        displayScore();
    }
}

// Fonction pour afficher le score
function displayScore() {
    questionElement.textContent = "Quiz terminé!";
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "Votre score: " + score + "/3";

    var retryButton = document.createElement("button");
    retryButton.textContent = "Recommencer";
    retryButton.onclick = function () {
        startQuiz(); // Recommencer le quiz
    };
    optionsElement.appendChild(retryButton);
}

// Fonction pour obtenir des indices de questions aléatoires
function getRandomQuestionIndices(numQuestions, totalQuestions) {
    var indices = [];
    for (var i = 0; i < totalQuestions; i++) {
        indices.push(i);
    }
    // Mélanger le tableau d'indices
    for (var i = indices.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = indices[i];
        indices[i] = indices[j];
        indices[j] = temp;
    }
    return indices.slice(0, numQuestions); // Retourner les indices des questions choisies aléatoirement
}

// Démarrer le quiz lorsque la page est chargée
startQuiz();
