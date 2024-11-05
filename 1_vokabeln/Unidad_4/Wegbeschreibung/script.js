<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitale Uhr mit spanischer Uhrzeit</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f9f9f9; /* Dezentes Weiß */
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .clock-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #b4e4d0;
            border-radius: 20px;
            padding: 20px;
            gap: 10px;
            position: relative; /* Fixiert den Container */
        }
        .clock {
            color: red;
            font-size: 48px;
            font-weight: bold;
            background-color: black;
            padding: 10px 20px;
            border-radius: 10px;
        }
        .input-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
        }
        .time-input {
            padding: 15px;
            font-size: 20px;
            border-radius: 10px;
            border: 2px solid #b4e4d0;
            width: 200px;
            text-align: center;
        }
        .checkmark {
            display: none;
            font-size: 24px;
            color: #27d67b;
        }
        .arrow-container {
            display: flex;
            gap: 20px;
            justify-content: center;
        }
        .arrow-button {
            background-color: #d9c7f5;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
        }
        .arrow-button:hover {
            background-color: #b4a0e8;
        }
        .spanish-time-button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #d9c7f5;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 18px;
        }
        .spanish-time-button:hover {
            background-color: #b4a0e8;
        }
        .message {
            display: none;
            margin-top: 10px; /* Fixiert das Lob unter der Uhr */
            font-size: 24px;
            font-weight: bold;
            color: #27d67b;
            background-color: #101010;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 0px 20px #27d67b;
            position: absolute;
            top: 100%;
            transform: translateY(20px); /* Abstand unterhalb des Uhrencontainers */
        }
        .feedback {
            display: none;
            font-size: 24px;
            font-weight: bold;
            color: #27d67b;
            margin-top: 10px;
        }
        .countdown {
            display: none;
            font-size: 30px;
            font-weight: bold;
            color: #ff3333;
            margin-top: 10px;
        }
        .countdown-intense {
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        /* Stil für den Zurück-Button */
        .back-button {
            position: fixed;
            bottom: 20px;
            background-color: #d9c7f5;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 18px;
            border: none;
            cursor: pointer;
            color: #101010;
            text-decoration: none;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }
        .back-button:hover {
            background-color: #b4a0e8;
        }
    </style>
</head>
<body>

    <div class="clock-container">
        <div id="clock" class="clock">00:00</div>

        <div class="arrow-container" id="arrows">
            <div>
                <button class="arrow-button" onclick="adjustTime('hour', 1)">▲</button>
                <button class="arrow-button" onclick="adjustTime('hour', -1)">▼</button>
            </div>
            <div>
                <button class="arrow-button" onclick="adjustTime('minute', 5)">▲</button>
                <button class="arrow-button" onclick="adjustTime('minute', -5)">▼</button>
            </div>
        </div>

        <!-- Eingabefeld für spanische Zeitangabe -->
        <div class="input-container" id="inputContainer" style="display: none;">
            <input type="text" id="timeInput" class="time-input" placeholder="¿Qué hora es?">
            <span id="checkmark" class="checkmark">✔️</span>
        </div>

        <!-- Anzeige der spanischen Zeitangabe zu Beginn -->
        <button id="spanish-time-button" class="spanish-time-button" onclick="checkMatch()">Ocho y media</button>

        <!-- Countdown-Anzeige -->
        <div id="countdown" class="countdown">Tiempo: 10</div>

        <!-- Erfolgsnachricht unterhalb des Containers -->
        <div id="message" class="message">¡Muy bien!</div>
    </div>

    <!-- Erfolgsnachricht und Feedback -->
    <div id="feedback" class="feedback"></div>

    <!-- Zurück-Button -->
    <a href="file:///C:/Users/Ich/Desktop/Niko/Website/Startseite/Unidad_4/index.html" class="back-button">Zurück</a>

    <script>
        const times = [
            { times: ["08:30", "20:30"], spanish: "Ocho y media" },
            { times: ["12:45", "00:45"], spanish: "Una menos cuarto" },
            { times: ["15:15", "03:15"], spanish: "Tres y cuarto" },
            { times: ["21:30", "09:30"], spanish: "Nueve y media" },
            { times: ["11:55", "23:55"], spanish: "Doce menos cinco" },
            { times: ["07:25", "19:25"], spanish: "Siete y veinticinco" },
            { times: ["10:40", "22:40"], spanish: "Once menos veinte" },
            { times: ["06:10", "18:10"], spanish: "Seis y diez" },
            { times: ["04:50", "16:50"], spanish: "Cinco menos diez" },
            { times: ["13:35", "01:35"], spanish: "Dos menos veinticinco" }
        ];

        const feedbackMessages = ["¡Excelente!", "¡Perfecto!", "¡Muy bien hecho!", "¡Genial!", "¡Sigue así!", "¡Increíble!"];
        let currentIndex = 0;
        let currentHour = 0;
        let currentMinute = 0;
        let correctAnswers = 0;
        let difficultyIncreased = false;
        let countdownTimer;
        let countdownStartTimer;

        // Uhrzeit anpassen
        function adjustTime(type, value) {
            if (type === 'hour') {
                currentHour = (currentHour + value + 24) % 24; 
            } else if (type === 'minute') {
                currentMinute = (currentMinute + value + 60) % 60;
            }
            updateClock();
        }

        // Uhr aktualisieren
        function updateClock() {
            const hourString = currentHour.toString().padStart(2, '0');
            const minuteString = currentMinute.toString().padStart(2, '0');
            document.getElementById('clock').textContent = `${hourString}:${minuteString}`;
        }

        // Übereinstimmung überprüfen
        function checkMatch() {
            const currentDisplay = document.getElementById('clock').textContent;
            const currentSpanishTime = times[currentIndex];

            if (currentSpanishTime.times.includes(currentDisplay)) {
                correctAnswers++;
                if (correctAnswers < 8) {
                    document.getElementById("message").style.display = "block";
                    setTimeout(() => {
                        document.getElementById("message").style.display = "none";
                    }, 2000);
                }

                if (correctAnswers === 8 && !difficultyIncreased) {
                    increaseDifficulty();
                } else if (!difficultyIncreased) {
                    currentIndex = Math.floor(Math.random() * times.length);
                    document.getElementById("spanish-time-button").textContent = times[currentIndex].spanish;
                }
            }
        }

        // Schwierigkeitsgrad erhöhen
        function increaseDifficulty() {
            difficultyIncreased = true;
            document.getElementById("arrows").style.display = "none"; 
            document.getElementById("inputContainer").style.display = "flex"; 
            document.getElementById("spanish-time-button").style.display = "none"; 
            generateRandomTime();

            document.getElementById('timeInput').addEventListener('input', function() {
                const input = this.value.trim().toLowerCase();
                const correctSpanishTime = times[currentIndex].spanish.toLowerCase();

                if (input === correctSpanishTime) {
                    showFeedback();
                    resetCountdown();
                    this.value = ""; 
                    generateRandomTime(); 
                }
            });
        }

        // Zufällige Uhrzeit generieren und anzeigen
        function generateRandomTime() {
            currentIndex = Math.floor(Math.random() * times.length);
            const [randomHour, randomMinute] = times[currentIndex].times[0].split(":");
            currentHour = parseInt(randomHour);
            currentMinute = parseInt(randomMinute);
            updateClock();

            clearTimeout(countdownStartTimer);
            countdownStartTimer = setTimeout(startCountdown, 30000);
        }

        // Feedback anzeigen
        function showFeedback() {
            const feedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
            const feedbackElement = document.getElementById("feedback");
            feedbackElement.textContent = feedback;
            feedbackElement.style.display = "block";
            setTimeout(() => feedbackElement.style.display = "none", 2000);
        }

        // Countdown starten
        function startCountdown() {
            let timeRemaining = 10;
            const countdownElement = document.getElementById("countdown");
            countdownElement.style.display = "block";

            countdownTimer = setInterval(() => {
                countdownElement.textContent = `Tiempo: ${timeRemaining}`;
                if (timeRemaining <= 5) {
                    countdownElement.classList.add("countdown-intense");
                }
                if (timeRemaining <= 0) {
                    clearInterval(countdownTimer);
                    countdownElement.style.display = "none";
                    resetGame();
                }
                timeRemaining--;
            }, 1000);
        }

        // Countdown zurücksetzen
        function resetCountdown() {
            clearTimeout(countdownStartTimer);
            clearInterval(countdownTimer);
            document.getElementById("countdown").style.display = "none";
            document.getElementById("countdown").classList.remove("countdown-intense");
        }

        // Spiel komplett zurücksetzen
        function resetGame() {
            difficultyIncreased = false;
            correctAnswers = 0;
            document.getElementById("arrows").style.display = "flex";
            document.getElementById("inputContainer").style.display = "none";
            document.getElementById("spanish-time-button").style.display = "block";
            document.getElementById("countdown").classList.remove("countdown-intense");
            currentIndex = Math.floor(Math.random() * times.length);
            document.getElementById("spanish-time-button").textContent = times[currentIndex].spanish;
        }

        // Startanzeige und erste spanische Zeitangabe setzen
        updateClock();
        currentIndex = Math.floor(Math.random() * times.length);
        document.getElementById("spanish-time-button").textContent = times[currentIndex].spanish;
    </script>
</body>
</html>
