document.addEventListener('DOMContentLoaded', () => {
    drawGraph();
    loadQuestions();
});

function nextPage() {
    window.location.href = 'qcm2.html'; // Thay đổi đường dẫn trang kế tiếp nếu cần
}

function drawGraph() {
    const width = 300;
    const height = 300;
    const svg = d3.select("#dijkstra-graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = [
        { id: 'A', x: 50, y: 50 },
        { id: 'B', x: 250, y: 50 },
        { id: 'C', x: 50, y: 250 },
        { id: 'D', x: 250, y: 250 }
    ];

    const links = [
        { source: 'A', target: 'B', weight: 1 },
        { source: 'A', target: 'C', weight: 4 },
        { source: 'C', target: 'D', weight: 2 },
        { source: 'B', target: 'D', weight: 3 }
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
        question: "Quelle est la distance la plus courte de A à D ?",
        options: ["4", "5", "6", "7"],
        answer: "4" // Chỉnh sửa câu trả lời đúng theo logic của thuật toán Dijkstra
    },
    {
        question: "Quel sommet est visité en premier lorsqu'on commence par le sommet A ?",
        options: ["A", "B", "C", "D"],
        answer: "A"
    },
    {
        question: "Quelle est la distance la plus courte de A à C ?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    },
    {
        question: "Quel sommet est visité en dernier lorsqu'on commence par le sommet A ?",
        options: ["A", "B", "C", "D"],
        answer: "D"
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
