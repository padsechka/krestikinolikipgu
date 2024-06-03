// Получаем элемент для отображения статуса игры
const statusDisplay = document.querySelector('.game--status');

// Инициализация переменных
let gameActive = true; // Игра активна, если true
let currentPlayer = "X"; // Текущий игрок ("X" или "O")
let gameState = ["", "", "", "", "", "", "", "", ""]; // Текущее состояние игрового поля

// Функции для отображения сообщений
const winningMessage = () => `Игрок ${currentPlayer} победил!`; // Сообщение о победе
const drawMessage = () => `Ничья!`; // Сообщение о ничьей
const currentPlayerTurn = () => `Сейчас ходит ${currentPlayer}`; // Сообщение о текущем ходе

// Устанавливаем начальное сообщение
statusDisplay.innerHTML = currentPlayerTurn();

// Определяем выигрышные комбинации
// Каждый внутренний массив в winningConditions представляет одну выигрышную комбинацию. Комбинации группируются следующим образом:

//    Горизонтальные линии:
//        [0, 1, 2]: Верхняя горизонтальная линия.
//        [3, 4, 5]: Средняя горизонтальная линия.
//        [6, 7, 8]: Нижняя горизонтальная линия.
//    Вертикальные линии:
//        [0, 3, 6]: Левая вертикальная линия.
//        [1, 4, 7]: Средняя вертикальная линия.
//        [2, 5, 8]: Правая вертикальная линия.
//    Диагональные линии:
//        [0, 4, 8]: Диагональная линия от верхнего левого угла до нижнего правого угла.
//        [2, 4, 6]: Диагональная линия от верхнего правого угла до нижнего левого угла.
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Функция для обработки хода игрока
function handleCellPlayed(clickedCell, clickedCellIndex) {
    // Обновляем состояние игры
    gameState[clickedCellIndex] = currentPlayer;
    // Отображаем символ текущего игрока в нажатой ячейке
    clickedCell.innerHTML = currentPlayer;
}

// Функция для смены игрока
function handlePlayerChange() {
    // Меняем текущего игрока на противоположного
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    // Обновляем сообщение о текущем ходе
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Функция для проверки результата игры
function handleResultValidation() {
    let roundWon = false;
    // Проверяем все выигрышные комбинации
    for(let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        // Пропускаем пустые ячейки
        if(a === '' || b === '' || c === '')
            continue;
        // Проверяем, совпадают ли значения в выигрышной комбинации
        if(a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    // Если найден победитель
    if(roundWon) {
        statusDisplay.innerHTML = winningMessage(); // Отображаем сообщение о победе
        gameActive = false; // Останавливаем игру
        return;
    }

    // Проверяем на ничью (если нет пустых ячеек)
    const roundDraw = !gameState.includes("");
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage(); // Отображаем сообщение о ничьей
        gameActive = false; // Останавливаем игру
        return;
    }

    // Меняем игрока, если нет победы и ничьи
    handlePlayerChange();
}

// Функция для обработки клика по ячейке
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target; // Получаем кликнутую ячейку
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index')); // Получаем индекс ячейки

    // Проверяем, не занята ли ячейка и активна ли игра
    if(gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    // Обрабатываем ход игрока и проверяем результат
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Функция для перезапуска игры
function handleRestartGame() {
    gameActive = true; // Активируем игру
    currentPlayer = "X"; // Устанавливаем начального игрока
    gameState = ["", "", "", "", "", "", "", "", ""]; // Очищаем игровое поле
    statusDisplay.innerHTML = currentPlayerTurn(); // Обновляем сообщение о текущем ходе
    // Очищаем все ячейки на игровом поле
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

// Добавляем обработчики событий для ячеек и кнопки перезапуска
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
