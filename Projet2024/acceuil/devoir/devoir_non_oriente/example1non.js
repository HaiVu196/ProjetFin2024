function nextPage() {
    window.location.href = 'example2nonoriente.html'; // Changer le lien vers la page suivante si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 100, y: 150 }, // Gauche
    { id: "B", x: 200, y: 50 },  // Haut
    { id: "C", x: 300, y: 150 }  // Droite
];

const links = [
    { source: "A", target: "B", weight: 1 },
    { source: "A", target: "C", weight: 4 },
    { source: "B", target: "C", weight: 2 }
];

// Données pour les étapes
const steps = [
    { step: "Départ", node: 'A', distances: { A: '0A', B: 'Infini', C: 'Infini' }, highlights: ['A-B', 'A-C'], explanation: "Initialisation : Le point de départ est A avec une distance de 0. Mise à jour les distances des nœuds B,C." },
    { step: "A", node: 'B', distances: { A: '', B: '1A', C: '4A' }, highlights: ['B-C'], explanation: "Étape 2 : À partir du point B, mise à jour les distances de nœud C." },
    { step: "B", node: 'C', distances: { A: '', B: '', C: '3B' }, highlights: [], explanation: "Étape 3 : Plus court chemin : A , B , C" },
    { step: "Final", node: null, distances: { A: '', B: '', C: '' }, highlights: ['A-B', 'B-C'], explanation: "Le plus court chemin est A -> B -> C avec une distance de 3." }
];

// Dimensions
const width = 400;
const height = 300;

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

// Créer les liens
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", d => Math.sqrt(d.weight));

// Créer les étiquettes des liens
const linkLabel = svg.append("g")
    .selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .attr("dy", -5)
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
            row.append("td").attr("id", `step-${step.step}-${key}`).text(step.distances[key] === Infinity ? '∞' : step.distances[key]);
        });
    });
}

createInitialRows();

// Initialiser l'étape courante
let currentStep = 0;

function updateGraph() {
    // Effacer les surbrillances précédentes
    link.classed("highlight", false).classed("shortest", false);
    node.select("circle").classed("highlighted-node", false);

    if (currentStep < steps.length) {
        const step = steps[currentStep];

        if (step.step === "Final") {
            // Surligner le chemin le plus court
            step.highlights.forEach(h => {
                const [source, target] = h.split('-');
                link.filter(d => (d.source === source && d.target === target) || (d.source === target && d.target === source))
                    .classed("shortest", true);
            });
        } else {
            // Surligner les liens
            step.highlights.forEach(h => {
                const [source, target] = h.split('-');
                link.filter(d => (d.source === source && d.target === target) || (d.source === target && d.target === source))
                    .classed("highlight", true);
            });

            // Surligner les nœuds
            node.filter(d => d.id === step.node)
                .select("circle")
                .classed("highlighted-node", true);
        }

        // Mettre à jour le tableau avec les distances
        Object.entries(step.distances).forEach(([key, value]) => {
            const cell = d3.select(`#step-${step.step}-${key}`);
            cell.text(value === Infinity ? '∞' : value);
            if (value === "0A" || value === "1A" || value === "3B") {
                cell.classed("red-cell", true);
            }
        });

        // Mettre à jour l'explication
        d3.select("#explanation").text(step.explanation);

        currentStep++;
    }
}

// Écouteur d'événement pour le bouton "Suivant"
d3.select("#next-step").on("click", updateGraph);
