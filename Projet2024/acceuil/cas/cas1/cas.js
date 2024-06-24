function nextPage() {
    window.location.href = '../cas2/cas2.html'; // Changer le lien vers la page suivante si nécessaire
}

// Données pour le graphique
const noeuds = [
    { id: "A", x: 100, y: 200 },  // Déplacer la position du nœud pour éviter le chevauchement
    { id: "B", x: 200, y: 100 },
    { id: "C", x: 200, y: 300 },
    { id: "D", x: 300, y: 200 },
    { id: "E", x: 400, y: 100 },
    { id: "F", x: 400, y: 300 },
    { id: "G", x: 500, y: 200 }
];

const liens = [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 8 },
    { source: "B", target: "C", weight: 7 },
    { source: "B", target: "D", weight: 18 },
    { source: "B", target: "E", weight: 21 },
    { source: "C", target: "D", weight: 10 },
    { source: "C", target: "F", weight: 25 },
    { source: "D", target: "E", weight: 15 },
    { source: "D", target: "F", weight: 12 },
    { source: "D", target: "G", weight: 31 },
    { source: "F", target: "E", weight: 10 },
    { source: "F", target: "G", weight: 7 },
    { source: "E", target: "G", weight: 17 }
];

const etapes = [
    { step: 1, node: 'Départ', distances: { A: 'Infini', B: '0B', C: 'Infini', D: 'Infini', E: 'Infini', F: 'Infini', G: 'Infini' }, highlights: [], explanation: "Point de départ avec la valeur 0B." },
    { step: 2, node: 'B', distances: { A: '4B', B: '', C: '7B', D: '18B', E: '21B', F: 'Infini', G: 'Infini' }, highlights: ['B-A', 'B-C', 'B-D', 'B-E'], explanation: "Mise à jour des distances à partir de B." },
    { step: 3, node: 'A', distances: { A: '', B: '', C: '7B', D: '18B', E: '21B', F: 'Infini', G: 'Infini' }, highlights: ['A-C'], explanation: "Parce que la distance de B à A est la plus courte, nous mettrons donc à jour à partir du point A" },
    { step: 4, node: 'C', distances: { A: '', B: '', C: '', D: '17C', E: '21B', F: '32C', G: 'Infini' }, highlights: ['C-D', 'C-F'], explanation: "Après que le point A ait été visité, en regardant le tableau, nous voyons que le point C a la distance la plus courte du point de départ B qui est 7, les mises à jour commencent à partir du point C." },
    { step: 5, node: 'D', distances: { A: '', B: '', C: '', D: '', E: '21B', F: '29D', G: '48D' }, highlights: ['D-E', 'D-F', 'D-G'], explanation: "De même, le point D sera mis à jour car à partir de C a une distance totale de 17, plus courte que các segments restants." },
    { step: 6, node: 'E', distances: { A: '', B: '', C: '', D: '', E: '', F: '29D', G: '38E' }, highlights: ['E-G'], explanation: "Il semble que le point E partant de A soit actuellement le segment le plus court, on met à jour à partir du point E" },
    { step: 7, node: 'F', distances: { A: '', B: '', C: '', D: '', E: '', F: '', G: '36F' }, highlights: ['F-G'], explanation: "Le point F partant de D a la distance la plus courte, on met à jour le point F" },
    { step: 8, highlights: ['B-C', 'C-D', 'D-F', 'F-G'], shortestPath: true, explanation: "Le plus court chemin de B à G est B-C-D-F-G et la durée est de 36 minutes." }
];

const width = 700;
const height = 400;

const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

const lien = svg.append("g")
    .selectAll("line")
    .data(liens)
    .enter().append("line")
    .attr("class", "cas-link")
    .attr("stroke-width", d => Math.sqrt(d.weight));

const etiquetteLien = svg.append("g")
    .selectAll(".cas-link-label")
    .data(liens)
    .enter().append("text")
    .attr("class", "cas-link-label")
    .attr("dy", d => {
        if ((d.source === "D" && d.target === "G") || (d.source === "G" && d.target === "D")) return -15;
        if ((d.source === "F" && d.target === "E") || (d.source === "E" && d.target === "F")) return 15;
        return -5;
    })
    .text(d => d.weight);

const noeud = svg.append("g")
    .selectAll("g")
    .data(noeuds)
    .enter().append("g")
    .attr("class", "cas-node");

noeud.append("circle")
    .attr("r", 15)
    .attr("fill", "#1f77b4");

noeud.append("text")
    .attr("dx", -10)
    .attr("dy", 5)
    .text(d => d.id);

noeud.attr("transform", d => `translate(${d.x},${d.y})`);

lien
    .attr("x1", d => noeuds.find(noeud => noeud.id === d.source).x)
    .attr("y1", d => noeuds.find(noeud => noeud.id === d.source).y)
    .attr("x2", d => noeuds.find(noeud => noeud.id === d.target).x)
    .attr("y2", d => noeuds.find(noeud => noeud.id === d.target).y);

etiquetteLien
    .attr("x", d => (noeuds.find(noeud => noeud.id === d.source).x + noeuds.find(noeud => noeud.id === d.target).x) / 2)
    .attr("y", d => (noeuds.find(noeud => noeud.id === d.source).y + noeuds.find(noeud => noeud.id === d.target).y) / 2);

let etapeActuelle = 0;

function creerTableInitiale() {
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

creerTableInitiale();

function mettreAJourGraphique() {
    if (etapeActuelle < etapes.length) {
        const etape = etapes[etapeActuelle];

        // Mettre à jour les données du tableau pour l'étape actuelle
        Object.entries(etape.distances || {}).forEach(([key, value]) => {
            d3.select(`#step-${etapeActuelle + 1}-${key}`).text(value === Infinity ? 'Infini' : value);
        });

        // Mettre à jour la logique d'affichage et d'explication pour chaque étape
        mettreAJourVisuelsGraphique(etape);

        etapeActuelle++;
    }
}

function mettreAJourVisuelsGraphique(etape) {
    // Supprimer les highlights précédents
    d3.selectAll(".cas-link").classed("highlight", false);
    d3.selectAll(".cas-node circle").classed("highlighted-node", false);
    d3.selectAll(".cas-node circle").classed("shortest-path-node", false);

    // Surligner les liens
    if (etape.highlights) {
        etape.highlights.forEach(h => {
            const [source, target] = h.split('-');
            d3.selectAll(".cas-link").filter(d => (d.source === source && d.target === target) || (d.source === target && d.target === source))
                .classed("highlight", true);
        });
    }

    // Surligner les nœuds
    if (etape.shortestPath) {
        etape.highlights.forEach(h => {
            const [source, target] = h.split('-');
            d3.selectAll(".cas-node").filter(d => d.id === source || d.id === target)
                .select("circle")
                .classed("shortest-path-node", true);
        });
    } else {
        d3.selectAll(".cas-node").filter(d => d.id === etape.node)
            .select("circle")
            .classed("highlighted-node", true);
    }

    // Mettre à jour l'explication
    d3.select("#explanation").text(etape.explanation || '');
}

// Appeler la fonction de mise à jour lors du clic sur le bouton "Suivant"
d3.select("#next-step").on("click", mettreAJourGraphique);
