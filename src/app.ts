const wordEl = document.getElementById("word") as HTMLDivElement;
const wrongLettersEl = document.getElementById(
	"wrong-letters"
) as HTMLDivElement;
const playAgainBtn = document.getElementById(
	"play-button"
) as HTMLButtonElement;
const popup = document.getElementById("popup-container") as HTMLDivElement;
const notification = document.getElementById(
	"notification-container"
) as HTMLDivElement;
const finalMessage = document.getElementById(
	"final-message"
) as HTMLHeadingElement;

const figureParts = document.querySelectorAll(".figure-part")!;

let words: string[];
let selectedWord: string;
let timesPlayed = 0;

const correctLetters: string[] = [];
const wrongLetters: string[] = [];

// fetches the words from an API
async function getWords() {
	try {
		const res = await fetch(
			"https://random-word-api.herokuapp.com/word?number=10",
			{
				mode: "no-cors",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = await res.json();
		words = data;
		selectedWord = words[Math.floor(Math.random() * words.length)];

		displayWord();
	} catch (error) {
		alert("Failed to fetch data, the service might be down :(");
		const data = [
			"wizard",
			"english",
			"norwegian",
			"programming",
			"syntax",
			"elbow",
		];
		words = data;
		selectedWord = words[Math.floor(Math.random() * words.length)];

		displayWord();
	}
}

// Show hidden word
function displayWord() {
	wordEl.innerHTML = `
    ${selectedWord
			.split("")
			.map(
				(letter) => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
        </span>`
			)
			.join("")}
    `;

	const innerWord = wordEl.innerText.replace(/\n/g, "");

	if (innerWord === selectedWord) {
		finalMessage.innerText = "Congrats! You won!";
		popup.style.display = "flex";
	}
}

function updateWrongLettersEl(): void {
	wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;

	// display parts
	// Solve SVG type declartion TS
	figureParts.forEach((part: any, index) => {
		const errors = wrongLetters.length;

		if (index < errors) {
			part.style.display = "block";
		} else {
			part.style.display = "none";
		}
	});
	// check if lost

	if (wrongLetters.length === figureParts.length) {
		finalMessage.innerText = "You lost :(";
		popup.style.display = "flex";
	}
}

// show notification
function showNotification(): void {
	notification.classList.add("show");

	setTimeout(() => {
		notification.classList.remove("show");
	}, 2000);
}

// keydown letter press
window.addEventListener("keydown", (e) => {
	if (e.keyCode >= 65 && e.keyCode <= 90) {
		const letter = e.key;

		if (selectedWord.includes(letter)) {
			if (!correctLetters.includes(letter)) {
				correctLetters.push(letter);
				displayWord();
			} else {
				showNotification();
			}
		} else {
			if (!wrongLetters.includes(letter)) {
				wrongLetters.push(letter);
				updateWrongLettersEl();
			} else {
				showNotification();
			}
		}
	}
});

// restart game and play again
playAgainBtn.addEventListener("click", () => {
	//Empty arrays
	correctLetters.splice(0);
	wrongLetters.splice(0);

	// the array words is fetching 10 words, if the player has played more than 10 times, refetch!
	timesPlayed += 1;

	if (timesPlayed > 5) {
		getWords();
	} else {
		for (var i = 0; i < words.length; i++) {
			if (words[i] === selectedWord) {
				words.splice(i, 1);
			}
		}
		selectedWord = words[Math.floor(Math.random() * words.length)];
		displayWord();
	}
	updateWrongLettersEl();

	popup.style.display = "none";
});

getWords();
