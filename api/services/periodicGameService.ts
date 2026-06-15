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
      if (lineCompleted) {
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
        if (lineCompleted) {
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

  if (allCellsOccupied || completedLines.some(l => l.owner !== null)) {
    if (completedLines.length > 0) {
      const playerLines = completedLines.filter(l => l.owner === 'player').length;
      const aiLines = completedLines.filter(l => l.owner === 'ai').length;
      if (playerLines > 0 && aiLines === 0) {
        gameOver = true;
        winner = 'player';
      } else if (aiLines > 0 && playerLines === 0) {
        gameOver = true;
        winner = 'ai';
      }
    }
    
    if (!gameOver && allCellsOccupied) {
      gameOver = true;
      winner = playerCells > aiCells ? 'player' : (aiCells > playerCells ? 'ai' : null);
    }
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

export function resetPeriodicGame(): void {
  currentBoard = {};
  completedLines.length = 0;
}

export function getCurrentBoard(): Record<string, CellOwner> {
  return currentBoard;
}
