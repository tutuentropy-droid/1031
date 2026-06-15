import { getQuestionById, elements, checkLineCompletion, getUnoccupiedCells, getRandomQuestion } from '../data/store';
import type { SubmitPeriodicAnswerResponse, CellOwner, Element } from '../../shared/types';

let currentBoard: Record<string, CellOwner> = {};
const completedLines: { type: 'row' | 'col'; index: number; owner: CellOwner }[] = [];

export function processPeriodicAnswer(
  questionId: string,
  selectedIndex: number,
  elementId: string
): SubmitPeriodicAnswerResponse {
  const question = getQuestionById(questionId);
  if (!question) {
    return {
      isCorrect: false,
      correctIndex: -1,
      explanation: '题目不存在',
      capturedElement: null,
      lostElement: null,
      newBoardState: currentBoard,
      lineCompleted: null,
      gameOver: false,
      winner: null,
    };
  }

  const isCorrect = selectedIndex === question.correctIndex;
  const element = elements.find(e => e.id === elementId);

  let capturedElement: Element | null = null;
  let lostElement: Element | null = null;
  let lineCompleted: { type: 'row' | 'col'; index: number; owner: CellOwner } | null = null;

  if (isCorrect && element) {
    const key = `${element.row}-${element.col}`;
    if (!currentBoard[key]) {
      currentBoard[key] = 'player';
      capturedElement = element;

      lineCompleted = checkLineCompletion(currentBoard, elements);
      if (lineCompleted && !isLineAlreadyCompleted(lineCompleted)) {
        completedLines.push(lineCompleted);
      }
    }
  } else if (!isCorrect) {
    const unoccupiedCells = getUnoccupiedCells(currentBoard);
    if (unoccupiedCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * unoccupiedCells.length);
      const aiElementId = unoccupiedCells[randomIndex];
      const aiElement = elements.find(e => e.id === aiElementId);
      if (aiElement) {
        const key = `${aiElement.row}-${aiElement.col}`;
        currentBoard[key] = 'ai';
        lostElement = aiElement;

        lineCompleted = checkLineCompletion(currentBoard, elements);
        if (lineCompleted && !isLineAlreadyCompleted(lineCompleted)) {
          completedLines.push(lineCompleted);
        }
      }
    }
  }

  const allCellsOccupied = getUnoccupiedCells(currentBoard).length === 0;
  const playerCells = Object.values(currentBoard).filter(v => v === 'player').length;
  const aiCells = Object.values(currentBoard).filter(v => v === 'ai').length;

  let gameOver = false;
  let winner: CellOwner = null;

  // 仅根据本回合完成的行列或棋盘占满来判定胜负，避免历史 completedLines 导致重启后误判
  if (lineCompleted) {
    gameOver = true;
    winner = lineCompleted.owner;
  } else if (allCellsOccupied) {
    gameOver = true;
    winner = playerCells > aiCells ? 'player' : (aiCells > playerCells ? 'ai' : null);
  }

  const nextQuestion = getRandomQuestion('mendeleev') || undefined;

  return {
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    capturedElement,
    lostElement,
    newBoardState: currentBoard,
    lineCompleted,
    gameOver,
    winner,
    nextQuestion,
  };
}

function isLineAlreadyCompleted(
  line: { type: 'row' | 'col'; index: number; owner: CellOwner }
): boolean {
  return completedLines.some(
    (l) => l.type === line.type && l.index === line.index && l.owner === line.owner
  );
}

export function resetPeriodicGame(): void {
  currentBoard = {};
  completedLines.length = 0;
}

export function getCurrentBoard(): Record<string, CellOwner> {
  return currentBoard;
}
