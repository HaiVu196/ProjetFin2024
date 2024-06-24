function prevPage() {
    window.location.href = 'example1nonoriente.html'; // Changer le lien vers la page précédente si nécessaire
}

function nextPage() {
    window.location.href = 'exo1nonoriente.html'; // Changer le lien vers la page suivante si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 50, y: 200 },  // Haut-gauche
    { id: "B", x: 150, y: 100 }, // Haut
    { id: "C", x: 150, y: 300 }, // Bas
    { id: "D", x: 250, y: 200 }, // Milieu
    { id: "E", x: 350, y: 100 }, // Haut-droite
    { id: "F", x: 350, y: 300 }, // Bas-droite
    { id: "G", x: 450, y: 200 }  // Très à droite
];

const links = [
    { source: "A", target: "B", weight: 1 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 2 },
    { source: "B", target: "F", weight: 3 },
    { source: "B", target: "E", weight: 3 },
    { source: "C", target: "D", weight: 3 },
    { source: "C", target: "F", weight: 4 },
    { source: "D", target: "E", weight: 3 },
    { source: "D", target: "F", weight: 2 },
    { source: "D", target: "G", weight: 3 },
    { source: "E", target: "G", weight: 4 },
    { source: "F", target: "G", weight: 5 }
];

// Données pour les étapes
const steps = [
    { step: 1, node: 'Départ', distances: { A: '0A', B: 'Infini', C: 'Infini', D: 'Infini', E: 'Infini', F: 'Infini', G: 'Infini' }, highlights: [], explanation: "Point de départ avec la valeur 0A." },
    { step: 2, node: 'A', distances: { A: '', B: '1B', C: '2A', D: 'Infini', E: 'Infini', F: 'Infini', G: 'Infini' }, highlights: ['A-B', 'A-C'], explanation: "Mise à jour des distances à partir de A." },
    { step: 3, node: 'B', distances: { A: '', B: '', C: '2A', D: '3B', E: '4B', F: 'Infini', G: 'Infini' }, highlights: ['B-D', 'B-E'], explanation: "Mise à jour des distances à partir de B." },
    { step: 4, node: 'C', distances: { A: '', B: '', C: '', D: '3B', E: '4B', F: '6C', G: 'Infini' }, highlights: ['C-D', 'C-F'], explanation: "Mise à jour des distances à partir de C." },
    { step: 5, node: 'D', distances: { A: '', B: '', C: '', D: '', E: '4B', F: '6C', G: '6D' }, highlights: ['D-E', 'D-F', 'D-G'], explanation: "Mise à jour des distances à partir de D." },
    { step: 6, node: 'E', distances: { A: '', B: '', C: '', D: '', E: '', F: '6C', G: '6D' }, highlights: ['E-G'], explanation: "Mise à jour des distances à partir de E." },
    { step: 7, node: 'F', distances: { A: '', B: '', C: '', D: '', E: '', F: '', G: '6D' }, highlights: ['F-G'], explanation: "Mise à jour des distances à partir de F." },
    { step: 8, highlights: ['A-B', 'B-D', 'D-G'], shortestPath: true, explanation: "Le plus court chemin de A à G est ABDG." }
];

// Dimensions
const width = 500;
const height = 400;

const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", d => Math.sqrt(d.weight));

const linkLabel = svg.append("g")
    .selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .attr("dy", -5)
    .text(d => d.weight);

const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

node.append("circle")
    .attr("r", 10)
    .attr("fill", "lightblue");

node.append("text")
    .attr("x", 15)
    .attr("y", 5)
    .text(d => d.id);

node.attr("transform", d => `translate(${d.x},${d.y})`);

link
    .attr("x1", d => nodes.find(node => node.id === d.source).x)
    .attr("y1", d => nodes.find(node => node.id === d.source).y)
    .attr("x2", d => nodes.find(node => node.id === d.target).x)
    .attr("y2", d => nodes.find(node => node.id === d.target).y);

linkLabel
    .attr("x", d => (nodes.find(node => node.id === d.source).x + nodes.find(node => node.id === d.target).x) / 2)
    .attr("y", d => (nodes.find(node => node.id === d.source).y + nodes.find(node => node.id === d.target).y) / 2);

let currentStep = 0;

// Créer le tableau initial
function createInitialTable() {
    const tableBody = d3.select("#steps-table-body");
    tableBody.selectAll("*").remove();  // Supprimer toute donnée existante

    // Initialiser 8 lignes correspondant à 8 étapes, chaque ligne ayant 8 cellules (Étapes, A, B, C, D, E, F, G)
    const stepsHeader = ["Départ", "A", "B", "C", "D", "E", "F", "G"];
    for (let i = 0; i < 8; i++) {
        const row = tableBody.append("tr");
        row.append("td").text(stepsHeader[i]); // Nommer la première ligne comme Départ, les lignes suivantes comme A, B, C...
        for (let j = 0; j < 7; j++) {
            row.append("td").attr("id", `step-${i + 1}-${String.fromCharCode(65 + j)}`).text(''); // Cellules de A à G
        }
    }
}

createInitialTable();

function updateGraph() {
    if (currentStep < steps.length) {
        const step = steps[currentStep];

        // Mettre à jour les données du tableau pour l'étape actuelle
        Object.entries(step.distances || {}).forEach(([key, value]) => {
            d3.select(`#step-${currentStep + 1}-${key}`).text(value === Infinity ? 'Infini' : value);
        });

        // Mettre à jour la logique d'affichage et d'explication pour chaque étape
        updateGraphVisuals(step);

        currentStep++;
    }
}

function updateGraphVisuals(step) {
    // Supprimer les surbrillances précédentes
    d3.selectAll(".link").classed("highlight", false);
    d3.selectAll(".node circle").classed("highlighted-node", false);
    d3.selectAll(".node circle").classed("shortest-path-node", false);

    // Surligner les liens
    if (step.highlights) {
        step.highlights.forEach(h => {
            const [source, target] = h.split('-');
            d3.selectAll(".link").filter(d => (d.source === source && d.target === target) || (d.source === target && d.target === source))
                .classed("highlight", true);
        });
    }

    // Surligner les nœuds
    if (step.shortestPath) {
        step.highlights.forEach(h => {
            const [source, target] = h.split('-');
            d3.selectAll(".node").filter(d => d.id === source || d.id === target)
                .select("circle")
                .classed("shortest-path-node", true);
        });
    } else {
        d3.selectAll(".node").filter(d => d.id === step.node)
            .select("circle")
            .classed("highlighted-node", true);
    }

    // Mettre à jour l'explication
    d3.select("#explanation").text(step.explanation || '');
}

// Appeler la fonction de mise à jour lors du clic sur le bouton "Suivant"
d3.select("#next-step").on("click", updateGraph);
