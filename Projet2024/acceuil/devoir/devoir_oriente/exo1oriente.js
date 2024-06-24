function prevPage() {
    window.location.href = 'example1oriente.html'; // Changer le lien vers la page précédente si nécessaire
}

function nextPage() {
    window.location.href = 'exo2oriente.html'; // Changer le lien vers la page suivante si nécessaire
}

const nodes = [
    { id: "A", x: 50, y: 50 },
    { id: "B", x: 250, y: 50 },
    { id: "C", x: 450, y: 200 },
    { id: "D", x: 450, y: 350 },
    { id: "E", x: 250, y: 350 }
];

const links = [
    { source: "A", target: "B", weight: 10 },
    { source: "A", target: "C", weight: 3 },
    { source: "B", target: "E", weight: 4 },
    { source: "B", target: "C", weight: 2 },
    { source: "E", target: "D", weight: 2 },
    { source: "E", target: "C", weight: 8 },
    { source: "D", target: "C", weight: 7 },
    { source: "C", target: "D", weight: 9 }
];

const correctSteps = [
    { step: "Départ", distances: { A: '0A', B: 'Infini', C: 'Infini', D: 'Infini', E: 'Infini' } },
    { step: "A", distances: { A: '', B: '10A', C: '3A', D: 'Infini', E: 'Infini' } },
    { step: "C", distances: { A: '', B: '', C: '', D: '12C', E: 'Infini' } }
];

const shortestPathAnswer = 'AC';

// Créer l'élément SVG
const svg = d3.select("#graph").append("svg")
    .attr("width", 600)
    .attr("height", 400);

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

const link = svg.append("g")
    .selectAll("path")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)");

const linkLabel = svg.append("g")
    .selectAll(".link-label")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .text(d => d.weight);

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

// Générer les données de chemin pour les liens
function generatePathData(source, target, isParallel) {
    if (isParallel) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const offsetX = (target.y - source.y) * 0.1;
        const offsetY = (source.x - target.x) * 0.1;
        return `M${source.x},${source.y}L${midX + offsetX},${midY + offsetY}L${target.x},${target.y}`;
    } else {
        return `M${source.x},${source.y}L${target.x},${target.y}`;
    }
}

// Vérifier si le lien est parallèle
function isParallelLink(source, target) {
    return (source === "C" && target === "D") || (source === "D" && target === "C");
}

// Mettre à jour les positions du graphique
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
            const offset = isParallelLink(d.source, d.target) ? 10 : 0;
            return (source.x + target.x) / 2 + (d.source === "C" && d.target === "D" ? offset : -offset);
        })
        .attr("y", d => {
            const source = nodes.find(node => node.id === d.source);
            const target = nodes.find(node => node.id === d.target);
            const offset = isParallelLink(d.source, d.target) ? -10 : 0;
            return (source.y + target.y) / 2 + (d.source === "C" && d.target === "D" ? offset : -offset);
        });
}

updateGraphPositions();

// Ajouter un écouteur d'événement pour le bouton "Vérifier"
document.getElementById('check-answer').addEventListener('click', () => {
    let correct = true;
    correctSteps.forEach((step, index) => {
        Object.entries(step.distances).forEach(([node, value]) => {
            const input = document.getElementById(`${node}-${index}`);
            if (input.value !== value) {
                input.classList.add('red');
                correct = false;
            } else {
                input.classList.add('green');
            }
        });
    });

    const shortestPathInput = document.getElementById('shortest-path');
    if (shortestPathInput.value !== shortestPathAnswer) {
        shortestPathInput.classList.add('red');
        correct = false;
    } else {
        shortestPathInput.classList.add('green');
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
            input.classList.add('green');
        });
    });

    const shortestPathInput = document.getElementById('shortest-path');
    shortestPathInput.value = shortestPathAnswer;
    shortestPathInput.classList.add('green');

    d3.selectAll('.link').filter(d => (d.source === 'A' && d.target === 'C') || (d.source === 'C' && d.target === 'A'))
        .classed('highlight', true);
});
