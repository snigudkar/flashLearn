// script.js

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLxmyshhWk60Z0BgTdaRzSmKfkrEhDh68",
    authDomain: "flashlearn-827a9.firebaseapp.com",
    databaseURL: "https://flashlearn-827a9-default-rtdb.firebaseio.com",
    projectId: "flashlearn-827a9",
    storageBucket: "flashlearn-827a9.appspot.com",
    messagingSenderId: "1052980548967",
    appId: "1:1052980548967:web:9a318d7d1c50398477cbc2"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Get DOM elements
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const addFlashcardBtn = document.getElementById('add-flashcard-btn');
const flashcardsContainer = document.getElementById('flashcards-container');

// Function to create a new flashcard in Firebase
function createFlashcard(question, answer) {
    const flashcardId = db.ref().child('flashcards').push().key;
    db.ref('flashcards/' + flashcardId).set({
        question: question,
        answer: answer
    }).then(() => {
        console.log('Flashcard created successfully');
    }).catch((error) => {
        console.error('Error creating flashcard:', error);
    });
}

// Function to display flashcards
function displayFlashcards() {
    db.ref('flashcards').on('value', (snapshot) => {
        flashcardsContainer.innerHTML = '';
        const flashcards = snapshot.val();
        if (flashcards) {
            for (let id in flashcards) {
                const flashcard = flashcards[id];
                const flashcardElement = document.createElement('div');
                flashcardElement.className = 'flashcard';
                flashcardElement.innerHTML = `
                    <p><strong>Q:</strong> ${flashcard.question}</p>
                    <p><strong>A:</strong> ${flashcard.answer}</p>
                    <button onclick="deleteFlashcard('${id}')">Delete</button>
                `;
                flashcardsContainer.appendChild(flashcardElement);
            }
        }
    }, (error) => {
        console.error('Error fetching flashcards:', error);
    });
}

// Function to delete a flashcard from Firebase
function deleteFlashcard(id) {
    db.ref('flashcards/' + id).remove().then(() => {
        console.log('Flashcard deleted successfully');
    }).catch((error) => {
        console.error('Error deleting flashcard:', error);
    });
}

// Event listener for the Add Flashcard button
addFlashcardBtn.addEventListener('click', () => {
    const question = questionInput.value;
    const answer = answerInput.value;

    if (question && answer) {
        createFlashcard(question, answer);
        questionInput.value = '';
        answerInput.value = '';
    } else {
        alert('Please enter both a question and an answer');
    }
});

// Display flashcards on page load
displayFlashcards();
