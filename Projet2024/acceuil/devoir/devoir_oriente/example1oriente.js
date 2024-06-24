function nextPage() {
    window.location.href = 'exo1oriente.html'; // Changer le lien vers la page suivante si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 300, y: 50 },
    { id: "C", x: 300, y: 250 },
    { id: "D", x: 500, y: 150 }
];

const links = [
    { source: "A", target: "B", weight: 1 },
    { source: "A", target: "D", weight: 5 },
    { source: "B", target: "C", weight: 2 },
    { source: "C", target: "D", weight: 1 },
    { source: "C", target: "A", weight: 1 }
];

// Données pour les étapes
const steps = [
    { step: "Départ", node: 'A', distances: { A: '0A', B: '∞', C: '∞', D: '∞' }, highlights: ['A-B', 'A-D'], explanation: "Initialisation : Le point de départ est A avec une distance de 0." },
    { step: "A", node: 'B', distances: { A: '', B: '1A', C: '∞', D: '5A' }, highlights: ['B-C'], explanation: "Étape 2 : À partir du point B, mettez à jour les distances des nœuds voisins C." },
    { step: "B", node: 'C', distances: { A: '', B: '', C: '3B', D: '5A' }, highlights: ['C-D'], explanation: "Étape 3 : À partir du point C, mettez à jour les distances des nœuds voisins D." },
    { step: "C", node: 'D', distances: { A: '', B: '', C: '', D: '4C' }, highlights: [], explanation: "Étape 4 : Arrivée au point D, le chemin le plus court est déterminé." }
];

// Liens du chemin le plus court
const shortestPathLinks = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "C", target: "D" }
];

// Dimensions
const width = 600;
const height = 400;

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

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
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)");

// Créer les étiquettes des liens
const linkLabel = svg.append("g")
    .selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .attr("dy", d => {
        if (d.source === "B" && d.target === "C") return 10;
        if (d.source === "A" && d.target === "D") return -10;
        return -5;
    })
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

// Initialiser le tableau des étapes
const tableBody = d3.select("#steps-table-body");

function createInitialRows() {
    steps.forEach(step => {
        const row = tableBody.append("tr").attr("id", `step-row-${step.step}`);
        row.append("td").text(step.step);
        Object.keys(step.distances).forEach(key => {
            const cell = row.append("td")
                .attr("id", `step-${step.step}-${key}`)
                .text(step.distances[key] === Infinity ? '∞' : step.distances[key]);

            const cleanedValue = step.distances[key].replace(/[^a-zA-Z0-9]/g, '');
            if (cleanedValue === "0A" || cleanedValue === "1A" || cleanedValue === "3B" || cleanedValue === "4C") {
                cell.classed("red-text", true);
            }
        });
    });
}

createInitialRows();

// Initialiser l'étape courante
let currentStep = 0;

function updateGraph() {
    // Effacer les surbrillances précédentes
    link.classed("highlight", false);
    node.select("circle").classed("highlighted-node", false);

    if (currentStep < steps.length) {
        const step = steps[currentStep];

        // Surligner les liens
        step.highlights.forEach(h => {
            const [source, target] = h.split('-');
            link.filter(d => (d.source === source && d.target === target))
                .classed("highlight", true);
        });

        // Surligner les nœuds
        node.filter(d => d.id === step.node)
            .select("circle")
            .classed("highlighted-node", true)
            .classed("visited-node", true);

        // Mettre à jour l'explication
        d3.select("#explanation").text(step.explanation);

        currentStep++;

        // Surligner le chemin le plus court après la dernière étape
        if (currentStep === steps.length) {
            shortestPathLinks.forEach(path => {
                link.filter(d => (d.source === path.source && d.target === path.target))
                    .classed("shortest", true);
            });
        }
    }
}

// Écouteur d'événement pour le bouton "Suivant"
d3.select("#next-step").on("click", updateGraph);
