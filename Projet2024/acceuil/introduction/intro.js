document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('content');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const pages = [
        {
            title: "Introduction à l'algorithme de Dijkstra",
            content: `
            <h1 style="text-transform: uppercase;">Introduction à l'algorithme de Dijkstra</h1>
            <p>
                Les problèmes du plus court chemin et leurs variantes apparaissent toujours dans les concours de programmation en raison de la diversité dans la présentation et l'utilisation du problème. L'un des algorithmes les plus couramment utilisés pour trouver le chemin le plus court est l'algorithme de Dijkstra.
            </p>
            <p>
                L'algorithme de Dijkstra, nommé d'après l'informaticien néerlandais Edsger Dijkstra en 1956 et publié en 1959, est un algorithme permettant de résoudre le problème du plus court chemin à source unique dans un graphe orienté sans arêtes négatives. L'algorithme est souvent utilisé dans le routage avec des sous-programmes dans des algorithmes graphiques ou dans la technologie Global Positioning System (GPS).
            </p>
                        <img src="EsdgerDijkstra.png" alt="Description de l'image" class="side-image">
                        <strong class="image-caption"><br>Edsger Dijkstra</strong>
        `
        },
        {
            title:"Bases de l'algorithme de Dijkstra",
            content: `
                <h2>Bases de l'algorithme de Dijkstra</h2>
                <p>1. L'algorithme de Dijkstra commence au nœud que vous choisissez (le nœud source) et analyse le graphique pour trouver le chemin le plus court entre ce nœud et tous les autres nœuds du graphique.</p>
                <p>2. L'algorithme garde une trace de la distance la plus courte actuellement connue entre chaque nœud et le nœud source et met à jour ces valeurs s'il trouve un chemin plus court.</p>
                <p>3. Une fois que l'algorithme a trouvé le chemin le plus court entre le nœud source et un autre nœud, ce nœud est marqué comme « visité » et ajouté au chemin.</p>
                <p>4. Le processus se poursuit jusqu'à ce que tous les nœuds du graphique aient été ajoutés au chemin. De cette façon, nous disposons d’un chemin qui relie le nœud source à tous les autres nœuds en suivant le chemin le plus court possible pour atteindre chaque nœud.</p>
                <strong>Conditions</strong>
                <p><strong>L'algorithme de Dijkstra ne peut fonctionner qu'avec des graphiques à poids positifs</strong>. En effet, lors de l'exécution, les poids des arêtes doivent être ajoutés pour trouver le chemin le plus court.</p>
                <p>S'il y a des poids négatifs dans l'histogramme, l'algorithme ne fonctionnera pas correctement. Une fois qu'un nœud a été marqué comme « visité », le chemin actuel vers ce nœud sera marqué comme le chemin le plus court vers ce nœud. Et une pondération <strong>négative</strong> peut changer cela si le poids total peut diminuer après cette étape.</p>
            `
        },
        {
            title: "Théorie",
            content: `
                <h2>L'algorithme de Dijkstra peut-il fonctionner à la fois sur des graphes orientés et non orientés ?</h2>
                <p>Oui, l'algorithme de Dijkstra peut fonctionner à la fois sur des graphiques orientés et sur des graphiques non orientés, car cet algorithme est conçu pour fonctionner sur tout type de graphique tant qu'il répond aux exigences d'avoir des poids de bord non négatifs et d'être connecté.</p>
                <p><strong>Dans un graphe orienté</strong>, chaque arête a une direction, indiquant la direction de déplacement entre les sommets reliés par l'arête. Dans ce cas, l’algorithme suit la direction des bords lors de la recherche du chemin le plus court.</p>
                <p><strong>Dans un graphe non orienté</strong>, les arêtes n'ont aucune direction et l'algorithme peut parcourir à la fois vers l'avant et vers l'arrière le long des arêtes lors de la recherche du chemin le plus court.</p>
`
        },
        {
            title: "Applications",
            content: `
                <h2>Applications</h2>
                <p><strong>Application pratique de l'algorithme de Dijkstra dans la vie d'aujourd'hui</strong></p>
                <p>Le problème de la recherche du chemin le plus court et de ses variantes se pose fréquemment dans les concours de programmation compétitifs en raison de la diversité des manières dont les questions sont formulées et utilisées. L’algorithme de Dijkstra est l’un des algorithmes de chemin le plus court les plus couramment utilisés.</p>
                <p><strong>Application pour trouver l'itinéraire le plus court sur la carte</strong></p>
                <p>Les applications de recherche d'itinéraire et de direction actuelles affichent un certain nombre d'options avec des valeurs de temps pour vous permettre de choisir l'itinéraire le plus court du point de départ à la destination en fonction des facteurs d'influence des images et des satellites, puis d'appliquer le Dijkstra C++. algorithme pour afficher le chemin.</p>
                <p><strong>Applications dans les réseaux sociaux</strong></p>
                <p>Les pages professionnelles destinées aux petites entreprises ou les pages de réseaux sociaux qui fournissent des conseils aux abonnés appliquent également l'algorithme de Dijkstra pour intégrer le lien de l'entreprise dans le réseau social. Par conséquent, il suffit aux utilisateurs de visiter la page Facebook du vendeur, d'utiliser la fonction de routage, le système calculera automatiquement et vous guidera vers l'itinéraire le plus court.</p>
                <p><strong>Application au système d'information électronique mobile</strong></p>
                <p>En plus de la recherche d'itinéraire réelle, certains systèmes de communication mobile appliquent également cet algorithme, qui peut transmettre des informations plus rapidement lorsqu'il existe une connexion interne entre les sommets, ces sommets peuvent être GPS ou Airdrop, tant qu'il y a une connexion, l'algorithme trouvera le moyen le plus rapide de transmettre les informations que vous souhaitez.</p>
`
        }

    ];

    let currentPage = 0;

    function updatePage() {
        const page = pages[currentPage];
        contentElement.innerHTML = page.content;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });

    // Initialiser la première page
    updatePage();

    // Graph d3.js
    // Données pour le graphique
    const nodes = [
        { id: "A", x: 50, y: 75 },
        { id: "B", x: 150, y: 25 },
        { id: "C", x: 150, y: 125 },
        { id: "D", x: 250, y: 25 },
        { id: "E", x: 250, y: 125 }
    ];

    const links = [
        { source: "A", target: "B", weight: 1 },
        { source: "A", target: "C", weight: 4 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 5 },
        { source: "C", target: "D", weight: 1 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 1 }
    ];

    // Données des étapes
    const steps = [
        { step: "Départ", node: 'A', highlights: ['A-B', 'A-C'], explanation: "Initialisation : Le point de départ est A avec une distance de 0." },
        { step: "A", node: 'B', highlights: ['B-C', 'B-D'], explanation: "Étape 2 : À partir du point B, mettez à jour les distances des nœuds voisins C et D." },
        { step: "B", node: 'C', highlights: ['C-D', 'C-E'], explanation: "Étape 3 : À partir du point C, mettez à jour les distances des nœuds voisins D et E." },
        { step: "C", node: 'D', highlights: ['D-E'], explanation: "Étape 4 : À partir du point D, mettez à jour les distances du nœud voisin E." },
        { step: "D", node: 'E', highlights: [], explanation: "Étape 5 : Arrivée au point E, le chemin le plus court est déterminé." }
    ];

    // Liens du chemin le plus court
    const shortestPathLinks = [
        { source: "A", target: "B" },
        { source: "B", target: "C" },
        { source: "C", target: "D" },
        { source: "D", target: "E" }
    ];

    // Dimensions
    const width = 300;
    const height = 200;

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

    // Initialiser l'étape actuelle
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

    // Mettre à jour automatiquement le graphique toutes les 2 secondes
    setInterval(updateGraph, 2000);
});
