document.addEventListener("DOMContentLoaded", () => {
    const vocabulary = [
        { german: "das Handy", spanish: "el móvil" },
        { german: "der Tag", spanish: "el día" },
        { german: "die Party", spanish: "la fiesta" },
        { german: "das Haus", spanish: "la casa" },
        { german: "die Aufregung", spanish: "la emoción" },
        { german: "die Sache", spanish: "la cosa" },
        { german: "der Strand", spanish: "la playa" },
        { german: "der Junge", spanish: "el chico" },
        { german: "das Stadtzentrum", spanish: "el centro" },
        { german: "die Küste", spanish: "la costa" },
        { german: "der Nachname", spanish: "el apellido" },
        { german: "das Kilogramm", spanish: "el kilo" },
        { german: "die Sehenswürdigkeit", spanish: "el monumento" },
        { german: "die Plaza", spanish: "la plaza" },
        { german: "jetzt", spanish: "ahora" },
        { german: "du hast", spanish: "tienes" },
        { german: "ein", spanish: "un" },
        { german: "eine", spanish: "una" },
        { german: "die", spanish: "la" },
        { german: "der", spanish: "el" }
    ];

    const gameContainer = document.getElementById("gameContainer");
    const timerElement = document.getElementById("timer");
    const popup = document.getElementById("popup");
    const playerNameInput = document.getElementById("playerName");
    const submitNameButton = document.getElementById("submitName");
    const leaderboardList = document.getElementById("leaderboardList");

    let startTime, timerInterval;
    let matchedPairs = 0;
    let gameStarted = false;
    let firstCard = null;
    let secondCard = null;
    let finalTime = 0; // Speichert die Endzeit des Spiels

    const resetLeaderboard = () => {
        const currentTime = Date.now();
        const lastResetTime = localStorage.getItem("lastResetTime") || 0;
        const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;

        if (currentTime - lastResetTime > sixMonths) {
            localStorage.setItem("leaderboard", JSON.stringify([]));
            localStorage.setItem("lastResetTime", currentTime);
        }
    };
    resetLeaderboard();

    const formatTime = milliseconds => {
        const minutes = String(Math.floor(milliseconds / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((milliseconds % 60000) / 1000)).padStart(2, '0');
        const ms = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0');
        return `${minutes}:${seconds}.${ms}`;
    };

    const startTimer = () => {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedMilliseconds = Date.now() - startTime;
            timerElement.textContent = formatTime(elapsedMilliseconds);
        }, 10);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        finalTime = Date.now() - startTime; // Endzeit des Spiels wird gespeichert
        popup.classList.add("show");
    };

    const saveScore = (name, time) => {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        
        leaderboard.push({ name, time });
        leaderboard = leaderboard.sort((a, b) => a.time - b.time).slice(0, 10); // Sortiert und begrenzt auf die Top 10

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        updateLeaderboard(); // Aktualisiert die Rangliste direkt nach Speichern
    };

    const updateLeaderboard = () => {
        const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboardList.innerHTML = leaderboard
            .map(entry => `<li>${entry.name} - ${formatTime(entry.time)}</li>`)
            .join('');
    };

    submitNameButton.addEventListener("click", () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            saveScore(playerName, finalTime); // Speichern der erreichten Endzeit
            playerNameInput.value = "";
            popup.classList.remove("show");
            resetGame();
        }
    });

    const setupGame = () => {
        gameContainer.innerHTML = "";
        matchedPairs = 0;
        gameStarted = false;
        timerElement.textContent = "00:00.00";

        const cardsArray = vocabulary
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .flatMap(pair => [
                { text: pair.german, language: "german", match: pair.spanish },
                { text: pair.spanish, language: "spanish", match: pair.spanish }
            ])
            .sort(() => Math.random() - 0.5);

        cardsArray.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("word-card");
            cardElement.textContent = card.text;
            cardElement.dataset.language = card.language;
            cardElement.dataset.match = card.match;
            cardElement.addEventListener("click", handleCardClick);
            gameContainer.appendChild(cardElement);
        });
    };

    const resetGame = () => {
        setupGame();
    };

    const handleCardClick = event => {
        const clickedCard = event.target;

        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }

        if (clickedCard.classList.contains("matched") || clickedCard === firstCard) return;

        if (!firstCard) {
            firstCard = clickedCard;
            clickedCard.classList.add("selected");
        } else {
            secondCard = clickedCard;
            clickedCard.classList.add("selected");

            // Überprüfe, ob die Karten übereinstimmen
            if (firstCard.dataset.match === secondCard.dataset.match) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                matchedPairs++;
                if (matchedPairs === 6) stopTimer();
                resetSelectedCards();
            } else {
                // Falsche Zuordnung: visuelles Feedback
                firstCard.classList.add("error");
                secondCard.classList.add("error");

                setTimeout(() => {
                    firstCard.classList.remove("error", "selected");
                    secondCard.classList.remove("error", "selected");
                    resetSelectedCards();
                }, 500);
            }
        }
    };

    const resetSelectedCards = () => {
        firstCard = null;
        secondCard = null;
    };

    setupGame();
    updateLeaderboard();
});
