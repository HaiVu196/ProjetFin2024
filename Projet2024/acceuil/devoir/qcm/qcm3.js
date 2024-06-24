document.addEventListener('DOMContentLoaded', () => {
    drawGraph();
    loadQuestions();
});

function drawGraph() {
    const width = 600;
    const height = 600;
    const svg = d3.select("#dijkstra-graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 300, y: 100 },
        { id: 'C', x: 500, y: 100 },
        { id: 'D', x: 100, y: 300 },
        { id: 'E', x: 300, y: 300 },
        { id: 'F', x: 500, y: 300 },
        { id: 'G', x: 100, y: 500 },
        { id: 'H', x: 300, y: 500 }
    ];

    const links = [
        { source: 'A', target: 'B', weight: 1 },
        { source: 'B', target: 'C', weight: 2 },
        { source: 'C', target: 'F', weight: 2 },
        { source: 'F', target: 'H', weight: 5 },
        { source: 'H', target: 'G', weight: 3 },
        { source: 'G', target: 'D', weight: 2 },
        { source: 'D', target: 'A', weight: 3 },
        { source: 'E', target: 'B', weight: 2 },
        { source: 'E', target: 'D', weight: 3 },
        { source: 'E', target: 'F', weight: 6 },
        { source: 'E', target: 'C', weight: 3 },
        { source: 'E', target: 'G', weight: 1 },
        { source: 'A', target: 'E', weight: 5 },
        { source: 'E', target: 'H', weight: 6 }
    ];

    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");

    svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrow)");

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
        question: "Quel est le plus court chemin de A à H ?",
        options: ["A-D-G-H","A-B-C-F-H","A-B-C-E-H", "A-D-E-F-H", "A-B-E-F-H", "A-D-E-G-H","A-B-E-G-F-H","A-B-E-G-H"],
        answer: "A-B-E-G-H"
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
    document.getElementById('result').textContent = `Vous avez répondu correctement à ${score} sur ${questions.length} questions.`;
}
