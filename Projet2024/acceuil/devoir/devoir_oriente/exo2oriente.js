function prevPage() {
    window.location.href = 'exo1oriente.html'; // Changer le lien vers la page précédente si nécessaire
}

function nextPage() {
    window.location.href = 'exo3oriente.html'; // Changer le lien vers la page suivante si nécessaire
}

// Données pour le graphique
const nodes = [
    { id: "A", x: 50, y: 200 },  // Gauche du carré
    { id: "B", x: 250, y: 50 },  // Haut-gauche du carré
    { id: "C", x: 450, y: 50 },  // Haut-droite du carré
    { id: "D", x: 450, y: 350 },  // Bas-droite du carré
    { id: "E", x: 250, y: 350 }   // Bas-gauche du carré
];

const links = [
    { source: "A", target: "B", weight: 10 },
    { source: "A", target: "E", weight: 3 },
    { source: "B", target: "E", weight: 4 },
    { source: "B", target: "C", weight: 4 },
    { source: "E", target: "C", weight: 8 },
    { source: "E", target: "B", weight: 1 },
    { source: "E", target: "D", weight: 2 },
    { source: "C", target: "D", weight: 9 },
    { source: "D", target: "C", weight: 2 }
];

const correctSteps = [
    { step: "Départ", distances: { Etape: 'Départ', A: '0A', B: 'Infini', C: 'Infini', D: 'Infini', E: 'Infini' } },
    { step: "A", distances: { Etape: 'A', A: '', B: '10A', C: 'Infini', D: 'Infini', E: '3A' } },
    { step: "E", distances: { Etape: 'E', A: '', B: '4E', C: '11E', D: '5E', E: '' } },
    { step: "B", distances: { Etape: 'B', A: '', B: '', C: '8B', D: '5E', E: '' } },
    { step: "D", distances: { Etape: 'D', A: '', B: '', C: '7D', D: '', E: '' } }
];

const shortestPath = "AEDC";

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", 600)
    .attr("height", 400);

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
    return (source === "C" && target === "D") || (source === "D" && target === "C") || (source === "E" && target === "B") || (source === "B" && target === "E");
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
            const offset = isParallelLink(d.source, d.target) ? 15 : 0;
            return (source.x + target.x) / 2 + (d.source === "E" && d.target === "B" || d.source === "D" && d.target === "C" ? -offset : offset);
        })
        .attr("y", d => {
            const source = nodes.find(node => node.id === d.source);
            const target = nodes.find(node => node.id === d.target);
            const offset = isParallelLink(d.source, d.target) ? -15 : 0;
            return (source.y + target.y) / 2 + (d.source === "E" && d.target === "B" || d.source === "D" && d.target === "C" ? -offset : offset);
        });
}

updateGraphPositions();

// Ajouter un écouteur d'événement pour le bouton "Vérifier"
document.getElementById('check-answer').addEventListener('click', () => {
    let correct = true;
    correctSteps.forEach((step, index) => {
        Object.entries(step.distances).forEach(([node, value]) => {
            if (node !== 'Etape') { // Ignore la colonne Etape
                const input = document.getElementById(`${node}-${index}`);
                if (input.value !== value) {
                    input.style.backgroundColor = 'red';
                    correct = false;
                } else {
                    input.style.backgroundColor = 'lightgreen';
                }
            }
        });
    });

    const userPath = document.getElementById('shortest-path-input').value;
    if (userPath === shortestPath) {
        document.getElementById('shortest-path-input').style.backgroundColor = 'lightgreen';
    } else {
        document.getElementById('shortest-path-input').style.backgroundColor = 'red';
        correct = false;
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
            input.style.backgroundColor = 'lightgreen';
        });
    });

    document.getElementById('shortest-path-input').value = shortestPath;
    document.getElementById('shortest-path-input').style.backgroundColor = 'lightgreen';

    // Surligner le plus court chemin sur le graphique
    link.classed("shortest-path", d => {
        return (d.source === "A" && d.target === "E") || (d.source === "E" && d.target === "D") || (d.source === "D" && d.target === "C");
    });

    node.selectAll("circle").classed("highlighted-node", d => {
        return shortestPath.includes(d.id);
    });
});
