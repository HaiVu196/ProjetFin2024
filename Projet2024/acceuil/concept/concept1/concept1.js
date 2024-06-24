function prevPage() {
    window.location.href = '../concept.html';
}

function nextPage() {
    window.location.href = '../concept2/concept2.html'; // Thay đổi đường dẫn trang kế tiếp nếu cần
}

const nodes = [
    {id: 'A', x: 100, y: 300, color: 'blue'},
    {id: 'B', x: 300, y: 400},
    {id: 'C', x: 300, y: 200},
    {id: 'D', x: 450, y: 250},
    {id: 'E', x: 450, y: 120},
    {id: 'F', x: 600, y: 300, color: 'green'}
];

const links = [
    {source: 'A', target: 'B', length: 1},
    {source: 'A', target: 'C', length: 1},
    {source: 'B', target: 'C', length: 3},
    {source: 'B', target: 'F', length: 10},
    {source: 'C', target: 'D', length: 2},
    {source: 'C', target: 'E', length: 4},
    {source: 'D', target: 'F', length: 4},
    {source: 'E', target: 'F', length: 3}
];

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

node.append("circle")
    .attr("r", 20)
    .attr("fill", d => d.color ? d.color : "#fff");

node.append("text")
    .text(d => d.id);

const linkLabel = svg.append("g")
    .attr("class", "link-labels")
    .selectAll("text")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .text(d => d.length);

function ticked() {
    link
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);

    linkLabel
        .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
        .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2);
}

ticked();

const graph = new Map();
nodes.forEach(node => graph.set(node.id, new Map()));
links.forEach(link => graph.get(link.source).set(link.target, link.length));

const explanations = [
    'Démarrez l\'algorithme de Dijkstra à partir du nœud A.',
    'Le A représente désormais le nœud au début de notre file d’attente prioritaire. Le nœud A a deux arcs représentant ainsi deux possibilités à ce moment. L\'algorithme prend en compte la distance du nœud de départ ainsi que les poids des arêtes pour choisir le prochain nœud à visiter. Les différentes combinaisons actuellement disponibles sont : 0 + 1 (nœud A vers nœud B) et 0 + 1 (A vers C). Dans notre cas, les deux nœuds sont effectivement équivalents, notre file d\'attente prioritaire contient les nœuds B et C (A a été supprimé), mais B vient en premier donc c\'est le nœud que nous visiterons au prochain tour :',
    'Notre algorithme nous amène au nœud B, avec une distance totale de 1. Le point très important ici c\'est que dans le tour final, on a deux choix possibles d\'arcs à prendre, en choisissant un des deux arcs, on n\'oublie pas pour garder l\'autre au cas où ce ne serait pas le chemin le plus optimal que nous venons de prendre. Et la file d\'attente prioritaire est un point essentiel car cette structure se chargera de déplacer automatiquement le nœud C vers le haut si ce dernier devient finalement un choix plus intéressant. Lors de l\'ajout des voisins du nœud B à notre file d\'attente, nous devons choisir entre : 0 + 1 (nœuds A à C), 1 + 3 (B à C) ou 1 + 10 (B à F). Nous voyons que le minimum a été atteint pour 0 + 1, c\'est-à-dire les nœuds A à C. Par conséquent, notre file d\'attente prioritaire n\'a plus de nœud B et tient compte du nœud C que nous passerons au prochain tour ',
    'Nous sommes au nœud C à une distance totale du nœud de départ de A, comme d\'habitude nous allons essayer de comparer nos anciennes possibilités avec celles qui ont été ajoutées (voisins de C). L’algorithme doit donc choisir entre : 1 + 2 (nœuds C à D), 1 + 4 (C à E). Le choix avec la distance minimale est donc le premier choix : passer du nœud C au nœud D.',
    'La mise à jour du nœud D vers le nœud F est 4, nous aurons une distance totale du nœud de départ de 3 + 4 = 7, nous continuons à vérifier les nœuds restants, en continuant avec le nœud E.',
    'Du nœud E au nœud F il y a une distance de 4, la distance totale du nœud de départ est de 8',
    'En comparant avec les nœuds connectés au nœud F, nous concluons que :',
    'La distance la plus courte de A à F est : A C D F'
];

const steps = [];
let distances = new Map();
let previous = new Map();
let queue = new Set();
let stepIndex = 0;
let shortestPath = [];
let notedSteps = new Set(); // Set to keep track of noted steps

function initializeDijkstra() {
    distances = new Map();
    previous = new Map();
    queue = new Set();
    nodes.forEach(node => {
        if (node.id === 'A') {
            distances.set(node.id, 0);
        } else {
            distances.set(node.id, Infinity);
        }
        queue.add(node.id);
    });

    steps.push({
        action: 'start',
        explanation: explanations[0],
        activeNodes: ['A'],
        activeLinks: []
    });
}

function dijkstraStep() {
    if (queue.size === 0) return;

    const u = Array.from(queue).reduce((minNode, node) => {
        if (distances.get(node) < distances.get(minNode)) {
            return node;
        } else {
            return minNode;
        }
    }, Array.from(queue)[0]);

    queue.delete(u);

    const neighbors = graph.get(u);
    neighbors.forEach((length, neighbor) => {
        if (queue.has(neighbor)) {
            const alt = distances.get(u) + length;
            if (alt < distances.get(neighbor)) {
                distances.set(neighbor, alt);
                previous.set(neighbor, u);
            }
        }
    });

    const activeLinks = Array.from(neighbors.keys()).map(neighbor => {
        return {source: u, target: neighbor};
    });

    const explanationIndex = steps.length;
    steps.push({
        action: 'update',
        explanation: explanations[explanationIndex],
        activeNodes: [u],
        activeLinks: activeLinks
    });

    if (u === 'F') {
        // Xây dựng đường đi ngắn nhất từ 'A' đến 'F'
        let pathNode = 'F';
        while (pathNode !== 'A') {
            const prevNode = previous.get(pathNode);
            shortestPath.unshift({source: prevNode, target: pathNode});
            pathNode = prevNode;
        }
        shortestPath.unshift({source: 'A', target: shortestPath[0].source});

        steps.push({
            action: 'shortestPath',
            explanation: explanations[explanations.length - 1],
            activeNodes: [],
            activeLinks: shortestPath
        });
        return;
    }
}

initializeDijkstra();
while (queue.size > 0) {
    dijkstraStep();
}

function nextStep() {
    if (stepIndex >= steps.length - 1) return;
    stepIndex++;
    const step = steps[stepIndex];
    updateGraph(step);
    if (!notedSteps.has(stepIndex)) {
        appendNote(step.explanation);
        notedSteps.add(stepIndex);
    }
}

function prevStep() {
    if (stepIndex <= 0) return;
    stepIndex--;
    const step = steps[stepIndex];
    updateGraph(step);
}

function updateGraph(step) {
    link.classed("active", d => {
        return step.activeLinks.some(al =>
            (d.source === al.source && d.target === al.target) ||
            (d.source === al.target && d.target === al.source));
    });

    if (step.action === 'shortestPath') {
        link.classed("shortest", d => {
            return step.activeLinks.some(al =>
                (d.source === al.source && d.target === al.target) ||
                (d.source === al.target && d.target === al.source));
        });
    }

    node.classed("visited", d => steps.slice(0, stepIndex + 1).some(step => step.activeNodes.includes(d.id)));
    node.classed("current", d => d.id === step.activeNodes[0]);

    d3.select(".explanation1").text(step.explanation);
}

function appendNote(note) {
    const notesList = document.getElementById("notesList");
    const li = document.createElement("li");
    li.textContent = note;
    notesList.appendChild(li);
}
