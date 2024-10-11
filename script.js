const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerInput = [];
let level = 0;
let score = 0;
let gameActive = false;
let speedMultiplier = 1000;
let currentUser = null;
let userScores = JSON.parse(localStorage.getItem("userScores")) || [];

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const messageDisplay = document.getElementById("message");
const scoreDisplay = document.getElementById("scoreValue");
const userNameDisplay = document.getElementById("userNameDisplay");
const rankingBtn = document.getElementById("rankingBtn");
const rankingTable = document.getElementById("rankingTable");
const rankingBody = document.getElementById("rankingBody");
const closeRankingBtn = document.getElementById('closeRankingBtn');

const sounds = {
    green: new Audio('sounds/green.mp3'),
    red: new Audio('sounds/red.mp3'),
    yellow: new Audio('sounds/yellow.mp3'),
    blue: new Audio('sounds/blue.mp3'),
    fail: new Audio('sounds/fail.mp3')
};

closeRankingBtn.addEventListener('click', () => {
    // Oculta a tabela de ranking
    rankingTable.style.display = 'none';
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
rankingBtn.addEventListener("click", showRanking);

function startGame() {
    resetGame();
    messageDisplay.textContent = "Prepare-se...";
    setTimeout(nextSequence, 1000);
}

function resetGame() {
    sequence = [];
    playerInput = [];
    level = 0;
    score = 0;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = "";
    userNameDisplay.textContent = currentUser ? `Usuário: ${currentUser}` : "";
    document.querySelectorAll('.button').forEach(button => {
        button.style.pointerEvents = "none";  // Desativar cliques no início
    });
    
    localStorage.removeItem("gameState");  // Remover o estado salvo
    gameActive = false;  // Garantir que o jogo não reinicie sozinho
}



function nextSequence() {
    playerInput = [];
    level++;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playSequence();
}

function playSequence() {
    let i = 0;
    document.querySelectorAll('.button').forEach(button => {
        button.style.pointerEvents = "none";  // Impedir interação enquanto a sequência é exibida
    });

    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            enableUserInput();  // Permitir input do usuário após a sequência ser exibida
            return;
        }
        const color = sequence[i];
        flashButton(color);
        i++;
    }, speedMultiplier);
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.style.transition = "all 0.2s ease";
    button.style.opacity = "1";
    button.style.boxShadow = `0 0 20px ${color}`;

    // Tocar o som correspondente
    if (sounds[color]) {
        sounds[color].currentTime = 0;
        sounds[color].play();
    }

    setTimeout(() => {
        button.style.opacity = "0.8";
        button.style.boxShadow = "none";
    }, 500);
}


function enableUserInput() {
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener("click", handleUserInput);
        button.style.pointerEvents = "auto";
    });
}

function handleUserInput(e) {
    if (!gameActive) return;
    
    const clickedColor = e.target.id;
    playerInput.push(clickedColor);
    flashButton(clickedColor);
    checkInput(playerInput.length - 1);
}


function checkInput(index) {
    if (playerInput[index] === sequence[index]) {
        if (playerInput.length === sequence.length) {
            score++;
            scoreDisplay.textContent = score;
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver(); 
    }
}


function saveGameState() {
    const gameState = {
        currentUser: currentUser,
        score: score,
        level: level,
        sequence: sequence
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function startGame() {
    resetGame();
    gameActive = true;  // Indicar que o jogo está ativo
    messageDisplay.textContent = "Prepare-se...";
    setTimeout(nextSequence, 1000);
}



function gameOver() {
    gameActive = false;  // O jogo termina
    messageDisplay.textContent = "Fim de Jogo! Clique em 'RESET' para tentar novamente.";
    document.querySelectorAll('.button').forEach(button => {
        button.style.pointerEvents = "none";
    });
    updateRanking();
    saveGameState();
    
    
    sounds.fail.currentTime = 0; 
    sounds.fail.play();
}



function updateRanking() {
    if (currentUser) {
        const existingUser = userScores.find(user => user.username === currentUser);

        if (existingUser) {
            if (score > existingUser.score) {
                existingUser.score = score;
            }
        } else {
            const newUserScore = { username: currentUser, score: score };
            userScores.push(newUserScore);
        }

        localStorage.setItem("userScores", JSON.stringify(userScores));
    }
}

function displayRanking() {
    rankingBody.innerHTML = "";

    userScores.sort((a, b) => b.score - a.score);

    userScores.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.score}</td>`;
        rankingBody.appendChild(row);
    });

    rankingTable.style.width = "80%";
    rankingTable.style.display = "block";
}

function initializeRanking() {
    userScores.forEach(user => {
        user.score = 0;
    });
    localStorage.setItem("userScores", JSON.stringify(userScores));
}

function showRanking() {
    displayRanking();
}

window.onload = initializeRanking;

rankingBtn.addEventListener("click", showRanking);

function closeRanking() {
    rankingTable.style.display = "none";
}

// Sistema de login e cadastro
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const submitLogin = document.getElementById("submitLogin");
const submitSignup = document.getElementById("submitSignup");

loginBtn.addEventListener("click", () => {
    loginForm.style.display = "block";
});

closeLogin.addEventListener("click", () => {
    loginForm.style.display = "none";
});

closeSignup.addEventListener("click", () => {
    signupForm.style.display = "none";
});

submitLogin.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    currentUser = username;
    userNameDisplay.textContent = `Usuário: ${currentUser}`;
    loginForm.style.display = "none";
});

document.getElementById("signupLink").addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});

submitSignup.addEventListener("click", () => {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
});

function closeRanking() {
    rankingTable.style.display = "none";
}

function restoreGameState() {
    const savedState = JSON.parse(localStorage.getItem("gameState"));
    if (savedState) {
        currentUser = savedState.currentUser;
        score = savedState.score;
        level = savedState.level;
        sequence = savedState.sequence;

        scoreDisplay.textContent = score;
        userNameDisplay.textContent = currentUser ? `Usuário: ${currentUser}` : "";

        if (sequence.length > 0) {
            messageDisplay.textContent = "Continue o jogo!";
            enableUserInput();  // Permitir que o usuário continue de onde parou
        }
    }
}

window.onload = () => {
    initializeRanking();
    restoreGameState();
};

