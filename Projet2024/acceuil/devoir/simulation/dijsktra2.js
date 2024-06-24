let blocks = document.getElementsByClassName("drawing-area")[0];
let addEdge = false;
let cnt = 0;
let dist;

// Afficher une alerte si l'utilisateur n'a pas lu les instructions
const alerted = localStorage.getItem("alerted") || "";
if (alerted !== "yes") {
    alert(
        "Lisez les instructions avant de continuer en cliquant sur l'icône i dans le coin supérieur droit"
    );
    localStorage.setItem("alerted", "yes");
}

// Fonction pour activer le mode ajout d'arêtes
const addEdges = () => {
    if (cnt < 2) {
        alert("Créez au moins deux nœuds pour ajouter une arête");
        return;
    }
    addEdge = true;
    document.getElementById("add-edge-enable").disabled = true;
    document.getElementsByClassName("run-btn")[0].disabled = false;
    // Initialiser ou mettre à jour la matrice de distance si nécessaire
    if (!dist) {
        dist = new Array(cnt + 1)
            .fill(Infinity)
            .map(() => new Array(cnt + 1).fill(Infinity));
    } else {
        const newDist = new Array(cnt + 1)
            .fill(Infinity)
            .map(() => new Array(cnt + 1).fill(Infinity));
        for (let i = 0; i < dist.length; i++) {
            for (let j = 0; j < dist[i].length; j++) {
                newDist[i][j] = dist[i][j];
            }
        }
        dist = newDist;
    }
};

// Tableau pour stocker les IDs des nœuds sélectionnés pour ajouter des arêtes
let arr = [];

// Fonction pour ajouter un nouveau nœud à la zone de dessin
const appendBlock = (x, y) => {
    const resetButton = document.querySelector(".reset-btn");
    if (resetButton.disabled) {
        resetButton.disabled = false;
    }

    const clickInstruction = document.querySelector(".click-instruction");
    if (clickInstruction.style.display !== "none") {
        clickInstruction.style.display = "none";
    }

    // Créer un nouveau nœud
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.top = `${y}px`;
    block.style.left = `${x}px`;
    block.style.transform = `translate(-50%,-50%)`;
    block.id = cnt;
    block.innerText = cnt++;

    // Événement de clic pour le nœud
    block.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!addEdge) return;
        block.style.backgroundColor = "coral";
        arr.push(block.id);
        if (arr.length === 2) {
            drawUsingId(arr);
            arr = [];
        }
    });
    blocks.appendChild(block);
};

// Permettre la création de nœuds en cliquant sur la zone de dessin
blocks.addEventListener("click", (e) => {
    if (addEdge) return;
    if (cnt > 15) {
        alert("Vous ne pouvez pas ajouter plus de 15 sommets");
        return;
    }
    appendBlock(e.x, e.y);
});

// Fonction pour dessiner une arête entre les nœuds
const drawLine = (x1, y1, x2, y2, ar) => {
    if (dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
        document.getElementById(arr[0]).style.backgroundColor = "#333";
        document.getElementById(arr[1]).style.backgroundColor = "#333";
        return;
    }
    const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90;
    dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);
    dist[Number(ar[1])][Number(ar[0])] = Math.round(len / 10);
    const line = document.createElement("div");
    line.id =
        Number(ar[0]) < Number(ar[1])
            ? `line-${ar[0]}-${ar[1]}`
            : `line-${ar[1]}-${ar[0]}`;
    line.classList.add("line");
    line.style.width = `${len}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    let p = document.createElement("p");
    p.classList.add("edge-weight");
    p.innerText = Math.round(len / 10);
    p.contentEditable = "true";
    p.inputMode = "numeric";
    p.addEventListener("blur", (e) => {
        if (isNaN(Number(e.target.innerText))) {
            alert("Entrez un poids d'arête valide");
            return;
        }
        n1 = Number(p.closest(".line").id.split("-")[1]);
        n2 = Number(p.closest(".line").id.split("-")[2]);
        dist[n1][n2] = Number(e.target.innerText);
        dist[n2][n1] = Number(e.target.innerText);
    });
    line.style.transform = `rotate(${
        x1 > x2 ? Math.PI + Math.atan(slope) : Math.atan(slope)
    }rad)`;
    p.style.transform = `rotate(${
        x1 > x2 ? (Math.PI + Math.atan(slope)) * -1 : Math.atan(slope) * -1
    }rad)`;
    line.append(p);
    blocks.appendChild(line);
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    document.getElementById(arr[1]).style.backgroundColor = "#333";
};

// Fonction pour obtenir les coordonnées (x, y) du nœud sélectionné
const drawUsingId = (ar) => {
    if (ar[0] === ar[1]) {
        document.getElementById(arr[0]).style.backgroundColor = "#333";
        arr = [];
        return;
    }
    x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
    y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
    x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
    y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
    drawLine(x1, y1, x2, y2, ar);
};

// Fonction pour trouver le plus court chemin du nœud source vers tous les autres nœuds
const findShortestPath = (el) => {
    let visited = [];
    let unvisited = [];
    clearScreen();
    let source = Number(el.previousElementSibling.value);
    if (source >= cnt || isNaN(source)) {
        alert("Source invalide");
        return;
    }
    document.getElementById(source).style.backgroundColor = "grey";
    let parent = [];
    parent[source] = -1;
    visited = [];
    for (i = 0; i < cnt; i++) unvisited.push(i);
    let cost = [];
    for (i = 0; i < cnt; i++) {
        i === source
            ? null
            : dist[source][i]
                ? (cost[i] = dist[source][i])
                : (cost[i] = Infinity);
    }
    cost[source] = 0;
    let minCost = [];
    minCost[source] = 0;
    while (unvisited.length) {
        let mini = cost.indexOf(Math.min(...cost));
        visited.push(mini);
        unvisited.splice(unvisited.indexOf(mini), 1);
        for (j of unvisited) {
            if (j === mini) continue;
            if (cost[j] > dist[mini][j] + cost[mini]) {
                minCost[j] = dist[mini][j] + cost[mini];
                cost[j] = dist[mini][j] + cost[mini];
                parent[j] = mini;
            } else {
                minCost[j] = cost[j];
            }
        }
        cost[mini] = Infinity;
    }
    for (i = 0; i < cnt; i++)
        parent[i] === undefined ? (parent[i] = source) : null;
    indicatePath(parent, source);
    // Réactiver le bouton "Ajouter des arêtes"
    document.getElementById("add-edge-enable").disabled = false;
    addEdge = false; // Assurez-vous que la variable addEdge est réinitialisée à false
};

// Fonction pour indiquer le chemin
const indicatePath = async (parentArr, src) => {
    document.getElementsByClassName("path")[0].innerHTML = "";
    for (i = 0; i < cnt; i++) {
        let p = document.createElement("p");
        p.innerText = "Nœud " + i + " --> " + src;
        await printPath(parentArr, i, p);
    }
};

const printPath = async (parent, j, el_p) => {
    if (parent[j] === -1) return;
    await printPath(parent, parent[j], el_p);
    el_p.innerText = el_p.innerText + " " + j;
    document.getElementsByClassName("path")[0].style.padding = "1rem";
    document.getElementsByClassName("path")[0].appendChild(el_p);
    if (j < parent[j]) {
        let tmp = document.getElementById(`line-${j}-${parent[j]}`);
        await colorEdge(tmp);
    } else {
        let tmp = document.getElementById(`line-${parent[j]}-${j}`);
        await colorEdge(tmp);
    }
};

// Fonction pour colorier les arêtes sur le chemin
const colorEdge = async (el) => {
    if (el.style.backgroundColor !== "aqua") {
        await wait(1000);
        el.style.backgroundColor = "aqua";
        el.style.height = "8px";
    }
};

// Fonction pour effacer la couleur des arêtes et des chemins actuels
const clearScreen = () => {
    let lines = document.getElementsByClassName("line");
    for (line of lines) {
        line.style.backgroundColor = "#EEE";
        line.style.height = "5px";
    }
};

// Fonction d'attente
const wait = async (t) => {
    let pr = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("fait!");
        }, t);
    });
    res = await pr;
};

// Fonction pour réinitialiser la zone de dessin à l'état initial
const resetDrawingArea = () => {
    blocks.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("click-instruction");
    p.innerHTML = "Cliquez ici pour créer un nœud";
    blocks.appendChild(p);
    document.getElementById("add-edge-enable").disabled = false;
    document.querySelector(".reset-btn").disabled = true;
    document.getElementsByClassName("path")[0].innerHTML = "";
    cnt = 0;
    dist = [];
    addEdge = false;
};
