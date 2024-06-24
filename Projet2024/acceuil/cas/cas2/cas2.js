
function prevPage() {
    window.location.href = '../cas1/cas.html';
}

const nodes = [
    { id: "Bordeaux", x: 100, y: 200 },
    { id: "Clermont", x: 300, y: 100 },
    { id: "Lyon", x: 500, y: 100 },
    { id: "Marseille", x: 700, y: 300 },
    { id: "Montpellier", x: 500, y: 300 },
    { id: "Brive", x: 300, y: 200 },
    { id: "Toulouse", x: 200, y: 300 },
    { id: "Valence", x: 600, y: 200 },
    { id: "Biarritz", x: 50, y: 250 },
    { id: "Pau", x: 100, y: 350 },
    { id: "Grenoble", x: 700, y: 100 }
];

const timeLinks = [
    { source: "Bordeaux", target: "Brive", weight: "2h08" },
    { source: "Bordeaux", target: "Toulouse", weight: "2h24" },
    { source: "Bordeaux", target: "Biarritz", weight: "2h17" },
    { source: "Bordeaux", target: "Pau", weight: "2h10" },
    { source: "Clermont", target: "Lyon", weight: "1h58" },
    { source: "Clermont", target: "Montpellier", weight: "3h26" },
    { source: "Clermont", target: "Brive", weight: "2h10" },
    { source: "Lyon", target: "Valence", weight: "2h10" },
    { source: "Lyon", target: "Grenoble", weight: "2h10" },
    { source: "Marseille", target: "Montpellier", weight: "1h47" },
    { source: "Marseille", target: "Valence", weight: "2h08" },
    { source: "Montpellier", target: "Toulouse", weight: "2h28" },
    { source: "Montpellier", target: "Valence", weight: "1h58" },
    { source: "Brive", target: "Toulouse", weight: "1h58" },
    { source: "Toulouse", target: "Pau", weight: "2h08" },
    { source: "Valence", target: "Grenoble", weight: "2h08" },
    { source: "Biarritz", target: "Pau", weight: "2h08" }
];

const costLinks = [
    { source: "Lyon", target: "Clermont", weight: 13.80 },
    { source: "Montpellier", target: "Clermont", weight: 8.60 },
    { source: "Montpellier", target: "Marseille", weight: 10.80 },
    { source: "Brive", target: "Bordeaux", weight: 16.80 },
    { source: "Brive", target: "Clermont", weight: 11.90 },
    { source: "Toulouse", target: "Bordeaux", weight: 18.00 },
    { source: "Toulouse", target: "Montpellier", weight: 19.60 },
    { source: "Toulouse", target: "Brive", weight: 15.10 },
    { source: "Valence", target: "Lyon", weight: 7.10 },
    { source: "Valence", target: "Marseille", weight: 16.20 },
    { source: "Valence", target: "Montpellier", weight: 17.80 },
    { source: "Biarritz", target: "Bordeaux", weight: 5.60 },
    { source: "Pau", target: "Bordeaux", weight: 25.00 },
    { source: "Pau", target: "Toulouse", weight: 11.60 },
    { source: "Pau", target: "Biarritz", weight: 9.50 },
    { source: "Grenoble", target: "Lyon", weight: 12.10 },
    { source: "Grenoble", target: "Valence", weight: 8.80 }
];

const width = 800;
const height = 600;

function createGraph(svgId, links) {
    const svg = d3.select(svgId).append("svg")
        .attr("width", width)
        .attr("height", height);

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "cas2-link")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

    const linkLabel = svg.append("g")
        .selectAll(".cas2-link-label")
        .data(links)
        .enter().append("text")
        .attr("class", "cas2-link-label")
        .attr("dy", -5)
        .text(d => d.weight);

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", "cas2-node");

    node.append("circle")
        .attr("r", 15)
        .attr("fill", "#1f77b4");

    node.append("text")
        .attr("dx", d => {
            switch(d.id) {
                case 'Bordeaux': return -20;
                case 'Toulouse': return -25;
                case 'Montpellier': return 20;
                case 'Clermont': return -25;
                case 'Lyon': return 20;
                default: return 20;
            }
        })
        .attr("dy", d => {
            switch(d.id) {
                case 'Bordeaux': return -20;
                case 'Toulouse': return -25;
                case 'Montpellier': return 25;
                case 'Clermont': return -15;
                case 'Lyon': return -15;
                default: return 5;
            }
        })
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
}

createGraph("#time-graph", timeLinks);
createGraph("#cost-graph", costLinks);

function parseTime(timeString) {
    const [hours, minutes] = timeString.split('h').map(d => parseInt(d));
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m < 10 ? '0' : ''}${m}`;
}

function dijkstra(nodes, links, startNode, endNode, weightProp, parseFunc = null) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue((a, b) => distances[a] < distances[b]);

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });

    distances[startNode] = 0;
    pq.enqueue(startNode);

    while (!pq.isEmpty()) {
        const currentNode = pq.dequeue();
        if (currentNode === endNode) break;

        const neighbors = links.filter(link => link.source === currentNode || link.target === currentNode);

        neighbors.forEach(neighbor => {
            const neighborNode = neighbor.source === currentNode ? neighbor.target : neighbor.source;
            const weight = parseFunc ? parseFunc(neighbor[weightProp]) : neighbor[weightProp];
            const alt = distances[currentNode] + parseFloat(weight);

            if (alt < distances[neighborNode]) {
                distances[neighborNode] = alt;
                previous[neighborNode] = currentNode;
                pq.enqueue(neighborNode);
            }
        });
    }

    const path = [];
    let u = endNode;

    while (previous[u]) {
        path.unshift(u);
        u = previous[u];
    }
    if (u === startNode) path.unshift(u);
    return { path, distance: distances[endNode] };
}

class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() { return this._heap.length; }
    isEmpty() { return this.size() === 0; }
    peek() { return this._heap[0]; }
    enqueue(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    dequeue() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > 0) {
            this._swap(0, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > 0 && this._greater(node, Math.floor((node - 1) / 2))) {
            this._swap(node, Math.floor((node - 1) / 2));
            node = Math.floor((node - 1) / 2);
        }
    }
    _siftDown() {
        let node = 0;
        while (
            (node * 2 + 1 < this.size() && this._greater(node * 2 + 1, node)) ||
            (node * 2 + 2 < this.size() && this._greater(node * 2 + 2, node))
            ) {
            let maxChild = (node * 2 + 2 < this.size() && this._greater(node * 2 + 2, node * 2 + 1)) ? node * 2 + 2 : node * 2 + 1;
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

document.getElementById("calculate").addEventListener("click", () => {
    const timeResult1 = dijkstra(nodes, timeLinks, "Grenoble", "Biarritz", "weight", parseTime);
    const timeResult2 = dijkstra(nodes, timeLinks, "Valence", "Bordeaux", "weight", parseTime);
    const costResult1 = dijkstra(nodes, costLinks, "Grenoble", "Biarritz", "weight");
    const costResult2 = dijkstra(nodes, costLinks, "Valence", "Bordeaux", "weight");

    document.getElementById("results").innerHTML = `
        <p>Temps le plus court de Grenoble à Biarritz : ${formatTime(timeResult1.distance)}</p>
        <p>Distance : ${timeResult1.path.join(' -> ')}</p>
        <p>Temps le plus court de Valence à Bordeaux : ${formatTime(timeResult2.distance)}</p>
        <p>Distance : ${timeResult2.path.join(' -> ')}</p>
        <p>Coût le moins cher de Grenoble à Biarritz : ${costResult1.distance}€</p>
        <p>Distance : ${costResult1.path.join(' -> ')}</p>
        <p>Coût le moins cher de Valence à Bordeaux : ${costResult2.distance}€</p>
        <p>Distance : ${costResult2.path.join(' -> ')}</p>
    `;

    const statsTableBody = document.querySelector("#stats-table tbody");
    statsTableBody.innerHTML = `
        <tr>
            <td>Grenoble</td>
            <td>Biarritz</td>
            <td>${formatTime(timeResult1.distance)}</td>
            <td>${costResult1.distance}€</td>
        </tr>
        <tr>
            <td>Valence</td>
            <td>Bordeaux</td>
            <td>${formatTime(timeResult2.distance)}</td>
            <td>${costResult2.distance}€</td>
        </tr>
    `;

    highlightPath("#time-graph", timeResult1.path);
    highlightPath("#time-graph", timeResult2.path);
    highlightPath("#cost-graph", costResult1.path);
    highlightPath("#cost-graph", costResult2.path);
});

function highlightPath(svgId, path) {
    const svg = d3.select(svgId).select("svg");
    const links = svg.selectAll("line").data();

    svg.selectAll("line").attr("stroke", d => {
        return path.includes(d.source) && path.includes(d.target) ? "red" : "#999";
    });
}

// document.addEventListener("DOMContentLoaded", function() {
//     // Tạo cell SageMath
//     sagecell.makeSagecell({
//         inputLocation: '#sagemath-output',
//         evalButtonText: 'Chạy SageMath',
//         template: sagecell.templates.minimal,
//         code: `
// G = Graph({
//     'Bordeaux': ['Brive', 'Toulouse', 'Biarritz', 'Pau'],
//     'Clermont': ['Lyon', 'Montpellier', 'Brive'],
//     'Lyon': ['Valence', 'Grenoble'],
//     'Marseille': ['Montpellier', 'Valence'],
//     'Montpellier': ['Toulouse', 'Valence'],
//     'Brive': ['Toulouse'],
//     'Toulouse': ['Pau'],
//     'Valence': ['Grenoble'],
//     'Biarritz': ['Pau']
// })
// G.show()
//         `
//     });
//
//     // Your existing D3.js and Dijkstra implementation here
//
//     document.getElementById("calculate").addEventListener("click", () => {
//         const timeResult1 = dijkstra(nodes, timeLinks, "Grenoble", "Biarritz", "weight", parseTime);
//         const timeResult2 = dijkstra(nodes, timeLinks, "Valence", "Bordeaux", "weight", parseTime);
//         const costResult1 = dijkstra(nodes, costLinks, "Grenoble", "Biarritz", "weight");
//         const costResult2 = dijkstra(nodes, costLinks, "Valence", "Bordeaux", "weight");
//
//         document.getElementById("results").innerHTML = `
//             <p>Temps le plus court de Grenoble à Biarritz : ${formatTime(timeResult1.distance)}</p>
//             <p>Distance : ${timeResult1.path.join(' -> ')}</p>
//
//             <p>Temps le plus court de Valence à Bordeaux : ${formatTime(timeResult2.distance)}</p>
//             <p>Distance : ${timeResult2.path.join(' -> ')}</p>
//
//             <p>Coût le moins cher de Grenoble à Biarritz : ${costResult1.distance}€</p>
//             <p>Distance : ${costResult1.path.join(' -> ')}</p>
//
//             <p>Coût le moins cher de Valence à Bordeaux : ${costResult2.distance}€</p>
//             <p>Distance : ${costResult2.path.join(' -> ')}</p>
//         `;
//
//         const statsTableBody = document.querySelector("#stats-table tbody");
//         statsTableBody.innerHTML = `
//             <tr>
//                 <td>Grenoble</td>
//                 <td>Biarritz</td>
//                 <td>${formatTime(timeResult1.distance)}</td>
//                 <td>${costResult1.distance}€</td>
//             </tr>
//             <tr>
//                 <td>Valence</td>
//                 <td>Bordeaux</td>
//                 <td>${formatTime(timeResult2.distance)}</td>
//                 <td>${costResult2.distance}€</td>
//             </tr>
//         `;
//
//         highlightPath("#time-graph", timeResult1.path);
//         highlightPath("#time-graph", timeResult2.path);
//         highlightPath("#cost-graph", costResult1.path);
//         highlightPath("#cost-graph", costResult2.path);
//     });
//
//     function highlightPath(svgId, path) {
//         const svg = d3.select(svgId).select("svg");
//         const links = svg.selectAll("line").data();
//
//         svg.selectAll("line").attr("stroke", d => {
//             return path.includes(d.source) && path.includes(d.target) ? "red" : "#999";
//         });
//     }
// });
