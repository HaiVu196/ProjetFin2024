function prevPage() {
    window.location.href = '../concept2/concept2.html';
}

function nextPage() {
    window.location.href = '../concept4/concept4.html';
}

const nodes = [
    {id: 'A', x: 400, y: 100, color: 'blue'}, // Top
    {id: 'B', x: 600, y: 300},                // Right
    {id: 'D', x: 400, y: 500},                // Bottom
    {id: 'C', x: 200, y: 300}                 // Left
];

const links = [
    {source: 'A', target: 'B', length: 2},
    {source: 'A', target: 'C', length: 6},
    {source: 'B', target: 'D', length: 3},
    {source: 'C', target: 'D', length: -5}
];

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

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
    .text(d => d.id)
    .attr("dy", 4)
    .attr("dx", -10);

const linkLabel = svg.append("g")
    .attr("class", "link-labels")
    .selectAll("text")
    .data(links)
    .enter().append("text")
    .attr("class", "link-label")
    .text(d => d.length)
    .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
    .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2);

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
