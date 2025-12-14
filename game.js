/*
 * Genvejstaster-spil (opdateret)
 *
 * Spillet viser et sted, hvor en genvejsfunktion skal udføres (f.eks. “Kopiér markeret tekst”).
 * Spilleren skal trykke på den korrekte tastekombination (Ctrl + C) uden at se
 * hvilken kombination det er. Hvis spilleren gætter forkert tre gange i træk for
 * den samme opgave, vises der en hint med den konkrete kombination.
 * Windows/Meta-kombinationer er fjernet for at undgå utilsigtede systemaktioner.
 */

/*
 * Listen over opgaver er begrænset til sikre Ctrl-kombinationer, som ikke
 * fremkalder potentielt ubehagelige systemhandlinger (som at lukke faner
 * eller genindlæse siden). Windows/Meta-kombinationer er helt udeladt,
 * da de ikke kan forhindres i at aktivere operativsystemet.
 */
const tasks = [
    {
        action: "Kopiér markeret tekst",      // Copy selection
        hint: "Ctrl + C",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'c'
    },
    {
        action: "Indsæt fra udklipsholder",    // Paste from clipboard
        hint: "Ctrl + V",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'v'
    },
    {
        action: "Klip markeret tekst",         // Cut selection
        hint: "Ctrl + X",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'x'
    },
    {
        action: "Fortryd sidste handling",     // Undo last action
        hint: "Ctrl + Z",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'z'
    },
    {
        action: "Gentag/omgør handling",       // Redo last undo
        hint: "Ctrl + Y",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'y'
    },
    {
        action: "Markér alt",                  // Select all
        hint: "Ctrl + A",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'a'
    },
    {
        action: "Gør tekst fed",               // Bold formatting
        hint: "Ctrl + B",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'b'
    },
    {
        action: "Gør tekst kursiv",            // Italic formatting
        hint: "Ctrl + I",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'i'
    },
    {
        action: "Gør tekst understreget",      // Underline formatting
        hint: "Ctrl + U",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'u'
    },
    {
        action: "Åbn søgefelt i dokumentet",   // Open search/find field
        hint: "Ctrl + F",
        check: (e) => e.ctrlKey && e.key.toLowerCase() === 'f'
    }
];

let currentTask = null;
let score = 0;
let failCount = 0; // Antal mislykkede forsøg på nuværende opgave

const taskDiv = document.getElementById('task');
const scoreDiv = document.getElementById('score');
const messageDiv = document.getElementById('message');

function pickRandomTask() {
    const index = Math.floor(Math.random() * tasks.length);
    currentTask = tasks[index];
    failCount = 0;
    // Vis kun beskrivelsen, ikke kombinationen
    taskDiv.textContent = currentTask.action;
}

function updateScore() {
    scoreDiv.textContent = `Point: ${score}`;
}

function showMessage(text, className) {
    messageDiv.textContent = text;
    messageDiv.className = className;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 1000);
}

function handleKeyDown(e) {
    // Ignorér rene modifier-taster
    const ignoredKeys = [
        'Control', 'ControlLeft', 'ControlRight',
        'Shift', 'ShiftLeft', 'ShiftRight',
        'Alt', 'AltLeft', 'AltRight', 'AltGraph',
        'Meta', 'MetaLeft', 'MetaRight'
    ];
    if (ignoredKeys.includes(e.key)) {
        return;
    }

    // Hvis den aktuelle opgave findes
    if (currentTask && currentTask.check(e)) {
        score++;
        updateScore();
        showMessage('Rigtigt!', 'correct');
        pickRandomTask();
    } else {
        // Forkert tastekombination
        failCount++;
        if (failCount >= 3) {
            // Vis hint med den konkrete kombination
            taskDiv.textContent = `${currentTask.action} — hint: ${currentTask.hint}`;
        }
        showMessage('Forkert – prøv igen.', 'wrong');
    }

    // Forhindre browserens standardhandling for de fleste Ctrl-kombinationer
    if (e.ctrlKey && !ignoredKeys.includes(e.key)) {
        e.preventDefault();
    }
}

window.addEventListener('load', () => {
    updateScore();
    pickRandomTask();
    document.addEventListener('keydown', handleKeyDown);
});
