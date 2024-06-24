function prevPage() {
    window.location.href = 'exo2oriente.html'; // Changer le lien vers la page précédente si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 50, y: 100 },
    { id: "B", x: 200, y: 30 },
    { id: "C", x: 400, y: 30 },
    { id: "D", x: 300, y: 100 },
    { id: "E", x: 200, y: 200 },
    { id: "F", x: 400, y: 200 },
    { id: "G", x: 500, y: 100 },
    { id: "H", x: 650, y: 100 }
];

const links = [
    { source: "A", target: "B", weight: 7 },
    { source: "A", target: "E", weight: 14 },
    { source: "B", target: "C", weight: 8 },
    { source: "E", target: "F", weight: 19 },
    { source: "C", target: "D", weight: 6 },
    { source: "D", target: "A", weight: 18 },
    { source: "D", target: "F", weight: 11 },
    { source: "F", target: "G", weight: 4 },
    { source: "F", target: "H", weight: 13 },
    { source: "G", target: "C", weight: 5 },
    { source: "G", target: "H", weight: 8 },
    { source: "H", target: "C", weight: 9 }
];

const correctSteps = [
    { step: "Départ", distances: { A: '0A', B: 'Infini', C: 'Infini', D: 'Infini', E: 'Infini', F: 'Infini', G: 'Infini', H: 'Infini' } },
    { step: "A", distances: { A: '', B: '7A', C: 'Infini', D: 'Infini', E: '14A', F: 'Infini', G: 'Infini', H: 'Infini' } },
    { step: "B", distances: { A: '', B: '', C: '15B', D: 'Infini', E: '14A', F: 'Infini', G: 'Infini', H: 'Infini' } },
    { step: "E", distances: { A: '', B: '', C: '15B', D: 'Infini', E: '', F: '33E', G: 'Infini', H: 'Infini' } },
    { step: "C", distances: { A: '', B: '', C: '', D: '21C', E: '', F: '33E', G: 'Infini', H: 'Infini' } },
    { step: "D", distances: { A: '', B: '', C: '', D: '', E: '', F: '32D', G: 'Infini', H: 'Infini' } },
    { step: "F", distances: { A: '', B: '', C: '', D: '', E: '', F: '', G: '36F', H: '45F' } },
    { step: "G", distances: { A: '', B: '', C: '', D: '', E: '', F: '', G: '', H: '44G' } }
];

const shortestPath = "ABCDFGH";

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 800 600")
    .attr("preserveAspectRatio", "xMidYMid meet");

// Ajouter un marqueur de flèche pour les arêtes dirigées
svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class", "arrow-head");

// Créer les liens
const link = svg.append("g")
    .selectAll("path")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)");

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

// Fonction pour générer les données de chemin pour les liens en polyline
function generatePathData(source, target, isParallel) {
    if (isParallel) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const offsetX = (target.y - source.y) * 0.1; // Ajuster le décalage si nécessaire
        const offsetY = (source.x - target.x) * 0.1; // Ajuster le décalage si nécessaire
        return `M${source.x},${source.y}L${midX + offsetX},${midY + offsetY}L${target.x},${target.y}`;
    } else {
        return `M${source.x},${source.y}L${target.x},${target.y}`;
    }
}

// Fonction pour vérifier si le lien est parallèle à un autre lien
function isParallelLink(source, target) {
    return (source === "C" && target === "D") || (source === "D" && target === "C");
}

// Positionner les nœuds et les liens
function updateGraphPositions() {
    node.attr("transform", d => `translate(${d.x},${d.y})`);

    link.attr("d", d => {
        const source = nodes.find(node => node.id === d.source);
        const target = nodes.find(node => node.id === d.target);
        const parallel = isParallelLink(d.source, d.target);
        return generatePathData(source, target, parallel);
    });

    linkLabel
        .attr("x", d => {
            const source = nodes.find(node => node.id === d.source);
            const target = nodes.find(node => node.id === d.target);
            return (source.x + target.x) / 2;
        })
        .attr("y", d => {
            const source = nodes.find(node => node.id === d.source);
            const target = nodes.find(node => node.id === d.target);
            return (source.y + target.y) / 2;
        });
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
    const shortestPathInput = document.getElementById('shortest-path-input').value;
    const correct = shortestPathInput === shortestPath;

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
        { source: "B", target: "C" },
        { source: "C", target: "D" },
        { source: "D", target: "F" },
        { source: "F", target: "G" },
        { source: "G", target: "H" }
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
