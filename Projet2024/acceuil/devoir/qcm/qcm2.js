document.addEventListener('DOMContentLoaded', () => {
    drawGraph();
    loadQuestions();
});
function nextPage() {
    window.location.href = 'qcm3.html'; // Thay đổi đường dẫn trang kế tiếp nếu cần
}
function drawGraph() {
    const width = 500;
    const height = 500;
    const svg = d3.select("#dijkstra-graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = [
        { id: 'A', x: 50, y: 50 },
        { id: 'B', x: 250, y: 50 },
        { id: 'C', x: 450, y: 250 },
        { id: 'D', x: 250, y: 450 },
        { id: 'E', x: 50, y: 250 },
        { id: 'F', x: 250, y: 250 }
    ];

    const links = [
        { source: 'A', target: 'B', weight: 1 },
        { source: 'A', target: 'E', weight: 3 },
        { source: 'B', target: 'C', weight: 1 },
        { source: 'B', target: 'E', weight: 4 },
        { source: 'B', target: 'F', weight: 4 },
        { source: 'C', target: 'D', weight: 4 },
        { source: 'C', target: 'F', weight: 2 },
        { source: 'D', target: 'E', weight: 3 },
        { source: 'D', target: 'F', weight: 1 },
        { source: 'E', target: 'F', weight: 2 }
    ];

    svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", "black");

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 20)
        .attr("fill", "lightblue");

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x - 10)
        .attr("y", d => d.y + 5)
        .text(d => d.id);

    svg.selectAll("text.weight")
        .data(links)
        .enter()
        .append("text")
        .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
        .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)
        .text(d => d.weight)
        .attr("class", "weight");
}

const questions = [
    {
        question: "Quel itinéraire cet automobiliste doit-il emprunter pour aller de A à D ?",
        options: ["A-B-C-D", "A-E-D", "A-B-C-F-D", "A-E-F-D"],
        answer: "A-B-C-F-D"
    }
];

function loadQuestions() {
    const quizContainer = document.getElementById('dijkstra-quiz-container');
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            ${q.options.map((option, i) => `
                <input type="radio" id="q${index}o${i}" name="q${index}" value="${option}">
                <label for="q${index}o${i}">${option}</label>
            `).join('<br>')}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function checkAnswers() {
    let score = 0;
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.answer) {
            score++;
        }
    });
    document.getElementById('dijkstra-result').textContent = `Vous avez répondu correctement à ${score} sur ${questions.length} questions.`;
}
