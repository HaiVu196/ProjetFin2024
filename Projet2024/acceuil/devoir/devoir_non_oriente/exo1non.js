function prevPage() {
    window.location.href = 'example2nonoriente.html'; // Changer le lien vers la page précédente si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 50, y: 250 },
    { id: "B", x: 150, y: 150 },
    { id: "C", x: 450, y: 250 },
    { id: "D", x: 150, y: 350 },
    { id: "E", x: 300, y: 150 },
    { id: "F", x: 300, y: 350 }
];

const links = [
    { source: "A", target: "B", weight: 2 },
    { source: "A", target: "D", weight: 8 },
    { source: "B", target: "D", weight: 5 },
    { source: "B", target: "E", weight: 6 },
    { source: "D", target: "E", weight: 3 },
    { source: "D", target: "F", weight: 2 },
    { source: "E", target: "F", weight: 1 },
    { source: "F", target: "C", weight: 3 },
    { source: "E", target: "C", weight: 9 }
];

const correctSteps = [
    { step: "Départ", distances: { A: '0A', B: 'Infini', C: 'Infini', D: 'Infini', E: 'Infini', F: 'Infini' } },
    { step: "A", distances: { A: '', B: '2A', C: 'Infini', D: '8A', E: 'Infini', F: 'Infini' } },
    { step: "B", distances: { A: '', B: '', C: 'Infini', D: '7B', E: '8B', F: 'Infini' } },
    { step: "D", distances: { A: '', B: '', C: 'Infini', D: '', E: '8B', F: '9D' } },
    { step: "E", distances: { A: '', B: '', C: '17E', D: '', E: '', F: '9E' } },
    { step: "F", distances: { A: '', B: '', C: '12F', D: '', E: '', F: '' } }
];

const shortestPath = "ABEFC";

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 600 500")
    .attr("preserveAspectRatio", "xMidYMid meet");

// Créer les liens
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", 2);

// Créer les étiquettes des liens
const linkLabel = svg.append("g")
    .selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .text(d => d.weight);

// Créer les nœuds
const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

node.append("circle")
    .attr("r", 10);

node.append("text")
    .attr("dy", -15)
    .text(d => d.id);

// Positionner les nœuds et les liens
function updateGraphPositions() {
    node.attr("transform", d => `translate(${d.x},${d.y})`);

    link.attr("x1", d => nodes.find(node => node.id === d.source).x)
        .attr("y1", d => nodes.find(node => node.id === d.source).y)
        .attr("x2", d => nodes.find(node => node.id === d.target).x)
        .attr("y2", d => nodes.find(node => node.id === d.target).y);

    linkLabel
        .attr("x", d => (nodes.find(node => node.id === d.source).x + nodes.find(node => node.id === d.target).x) / 2)
        .attr("y", d => (nodes.find(node => node.id === d.source).y + nodes.find(node => node.id === d.target).y) / 2);
}

updateGraphPositions();

// Fonction pour surligner les cellules du plus court chemin
function highlightShortestPath(path) {
    path.forEach((node, index) => {
        if (index > 0) {
            document.getElementById(`${node}-${index}`).classList.add('red-cell');
        }
    });
}

// Ajouter un écouteur d'événement pour le bouton "Vérifier"
document.getElementById('check-answer').addEventListener('click', () => {
    let correct = true;
    correctSteps.forEach((step, index) => {
        Object.entries(step.distances).forEach(([node, value]) => {
            const input = document.getElementById(`${node}-${index}`);
            if (input.value !== value) {
                input.classList.add('red-cell');
                input.classList.remove('green-cell');
                correct = false;
            } else {
                input.classList.add('green-cell');
                input.classList.remove('red-cell');
            }
        });
    });
    const shortestPathInput = document.getElementById('shortest-path-input').value;
    if (shortestPathInput !== shortestPath) {
        document.getElementById('shortest-path-input').classList.add('red-cell');
        document.getElementById('shortest-path-input').classList.remove('green-cell');
    } else {
        document.getElementById('shortest-path-input').classList.add('green-cell');
        document.getElementById('shortest-path-input').classList.remove('red-cell');
    }
    if (correct) {
        alert('Correct! Vous avez trouvé le plus court chemin.');
    } else {
        alert('Incorrect. Veuillez réessayer.');
    }
});

// Ajouter un écouteur d'événement pour le bouton "Afficher Résultat"
document.getElementById('show-result').addEventListener('click', () => {
    correctSteps.forEach((step, index) => {
        Object.entries(step.distances).forEach(([node, value]) => {
            const input = document.getElementById(`${node}-${index}`);
            input.value = value;
            input.classList.add('lightgreen-cell');
        });
    });
    document.getElementById('shortest-path-input').value = shortestPath;
    document.getElementById('shortest-path-input').classList.add('lightgreen-cell');

    // Surligner le plus court chemin sur le graphique
    const shortestPathEdges = [
        { source: "A", target: "B" },
        { source: "B", target: "E" },
        { source: "E", target: "F" },
        { source: "F", target: "C" }
    ];

    link.classed("highlight", d =>
        shortestPathEdges.some(edge =>
            (d.source === edge.source && d.target === edge.target) ||
            (d.source === edge.target && d.target === edge.source)
        )
    );

    node.select("circle").classed("highlighted-node", d => shortestPath.includes(d.id));

    // Surligner le plus court chemin dans le tableau
    highlightShortestPath(shortestPath.split(''));
});
