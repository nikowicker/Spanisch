// memory.js

// Vokabelliste
const vocabulary = [
    { german: "das Stadtviertel", spanish: "el barrio" },
    { german: "das Museum", spanish: "el museo" },
    { german: "die Apotheke", spanish: "la farmacia" },
    { german: "U-Bahn-Station", spanish: "la parada de metro" },
    { german: "die Haltestelle", spanish: "la parada" }
];

let gameStarted = false;
let startTime;
let timerInterval;
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let finalTime = 0;

// Vokabeln mischen und 6 zufällige Paare auswählen
function getRandomPairs() {
    const selectedPairs = vocabulary.sort(() => Math.random() - 0.5).slice(0, 6);
    return selectedPairs.flatMap(pair => [
        { text: pair.german, language: "german", match: pair.spanish },
        { text: pair.spanish, language: "spanish", match: pair.spanish }
    ]).sort(() => Math.random() - 0.5);
}

// Formatierte Zeit zurückgeben
function formatTime(milliseconds) {
    const minutes = String(Math.floor(milliseconds / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((milliseconds % 60000) / 1000)).padStart(2, '0');
    const ms = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0');
    return `${minutes}:${seconds}.${ms}`;
}

// Spieltimer starten
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedMilliseconds = Date.now() - startTime;
        document.getElementById("timer").textContent = formatTime(elapsedMilliseconds);
    }, 10);
}

// Timer stoppen und Endzeit speichern
function stopTimer() {
    clearInterval(timerInterval);
    finalTime = Date.now() - startTime;
    document.getElementById("popup").classList.add("show");
}

// Spiel zurücksetzen und Karten neu laden
function resetGame() {
    gameStarted = false;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    document.getElementById("timer").textContent = "00:00.00";
    document.getElementById("popup").classList.remove("show");
    setupGame();
}

// Spiel-Setup und Karten laden
function setupGame() {
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.innerHTML = ""; // Lösche alte Karten

    const cardsArray = getRandomPairs(); // 12 Karten (6 Paare) zufällig auswählen

    cardsArray.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("word-card");
        cardElement.textContent = card.text;
        cardElement.dataset.language = card.language;
        cardElement.dataset.match = card.match;
        cardElement.addEventListener("click", handleCardClick);
        gameContainer.appendChild(cardElement);
    });
}

// Karten-Klick-Handler
function handleCardClick(event) {
    const clickedCard = event.target;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (clickedCard.classList.contains("matched") || clickedCard === firstCard) return;

    clickedCard.classList.add("selected");

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;

        if (firstCard.dataset.match === secondCard.dataset.match) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matchedPairs++;
            if (matchedPairs === 6) stopTimer();
            resetSelectedCards();
        } else {
            // Falsche Zuordnung: Karten rot aufblinken lassen
            firstCard.classList.add("error");
            secondCard.classList.add("error");

            setTimeout(() => {
                firstCard.classList.remove("selected", "error");
                secondCard.classList.remove("selected", "error");
                resetSelectedCards();
            }, 500);
        }
    }
}

// Auswahl zurücksetzen
function resetSelectedCards() {
    firstCard = null;
    secondCard = null;
}

// Rangliste aktualisieren und speichern
function saveScore(name, time) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, time });
    leaderboard = leaderboard.sort((a, b) => a.time - b.time).slice(0, 10); // Nur Top 10
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

// Rangliste anzeigen
function updateLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = leaderboard
        .map(entry => `<li>${entry.name} - ${formatTime(entry.time)}</li>`)
        .join('');
}

// Namens-Eintrag und Punktespeicherung
document.getElementById("submitName").addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName) {
        saveScore(playerName, finalTime);
        document.getElementById("playerName").value = "";
        document.getElementById("popup").classList.remove("show");
        resetGame();
    }
});

// Initialisierung des Spiels
document.addEventListener("DOMContentLoaded", () => {
    setupGame();
    updateLeaderboard();
});
