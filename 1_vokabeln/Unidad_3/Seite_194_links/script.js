document.addEventListener("DOMContentLoaded", function () {
    // Vokabel-Daten
    const flashcardData = [
        { german: "das Handy", spanish: "el móvil" },
        { german: "du hast", spanish: "tienes" },
        { german: "jetzt", spanish: "ahora" },
        { german: "der", spanish: "el" },
        { german: "die", spanish: "la" },
        { german: "ein", spanish: "un" },
        { german: "eine", spanish: "una" },
        { german: "die Party", spanish: "la fiesta" },
        { german: "der Nachname", spanish: "el apellido" },
        { german: "das Haus", spanish: "la casa" },
        { german: "der Strand", spanish: "la playa" },
        { german: "das Stadtzentrum", spanish: "el centro" },
        { german: "der Junge", spanish: "el chico" },
        { german: "das Mädchen", spanish: "la chica" },
        { german: "das Kilogramm", spanish: "el kilo" },
        { german: "die Sehenswürdigkeit", spanish: "el monumento" },
        { german: "die Küste", spanish: "la costa" },
        { german: "das Mal", spanish: "la vez" },
        { german: "das Stadion", spanish: "el estadio" },
        { german: "der Tag", spanish: "el día" },
        { german: "die Sache", spanish: "la cosa" },
        { german: "die Aufregung", spanish: "la emoción" },
        { german: "der Platz", spanish: "la plaza" }
    ];

    // Funktion, um die Karteikarten zufällig zu mischen
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Karussell und Karteikarten laden
    const flashcardCarousel = document.getElementById("flashcardCarousel");
    const shuffledFlashcards = shuffleArray(flashcardData);

    shuffledFlashcards.forEach((data, index) => {
        const card = document.createElement("div");
        card.classList.add("flashcard");
        if (index !== 3) card.classList.add("hidden"); // Nur die mittlere Karte ist sichtbar
        card.innerHTML = `
            <p class="front">${data.german}</p>
            <p class="back">${data.spanish}</p>
        `;
        card.addEventListener("click", () => card.classList.toggle("flip")); // Klick zum Umdrehen
        flashcardCarousel.appendChild(card);
    });

    // Karussellsteuerung
    let currentIndex = 3; // Mittlere Karte
    const cards = document.querySelectorAll(".flashcard");

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.add("hidden");
            if (index === currentIndex) {
                card.classList.remove("hidden");
                card.style.transform = "translateX(0)";
            } else if (index < currentIndex) {
                card.style.transform = `translateX(${(index - currentIndex) * 60}px) scale(0.8)`;
            } else {
                card.style.transform = `translateX(${(index - currentIndex) * 60}px) scale(0.8)`;
            }
        });
    }

    updateCarousel();

    // Links/Rechts Tastensteuerung für das Karussell
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        } else if (event.key === "ArrowLeft") {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }
    });
});
