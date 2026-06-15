import type { Chemist, Question, FunFact, Element, ElementFact, CellOwner } from '../../shared/types';

export const chemists: Chemist[] = [
  {
    id: 'boyle',
    name: '罗伯特·波义耳',
    era: '1627-1691',
    description: '近代化学之父，提出化学元素概念，著有《怀疑的化学家》',
    avatar: '⚗️'
  },
  {
    id: 'lavoisier',
    name: '安托万·拉瓦锡',
    era: '1743-1794',
    description: '现代化学之父，确立质量守恒定律，推翻燃素说',
    avatar: '🔥'
  },
  {
    id: 'mendeleev',
    name: '德米特里·门捷列夫',
    era: '1834-1907',
    description: '元素周期表发明者，预言未知元素的存在',
    avatar: '📊'
  }
];

export const questions: Question[] = [
  {
    id: 'boyle-q1',
    chemistId: 'boyle',
    description: '波义耳在1661年出版的著作，标志着近代化学的开端，这本书是？',
    options: [
      '《怀疑的化学家》',
      '《化学原理》',
      '《元素论》',
      '《炼金指南》'
    ],
    correctIndex: 0,
    explanation: '《怀疑的化学家》是波义耳最著名的著作，书中批判了炼金术的元素学说。',
    historicalContext: '1661年，波义耳提出化学不是医学或炼金术的附属，而是一门独立的科学。'
  },
  {
    id: 'boyle-q2',
    chemistId: 'boyle',
    description: '波义耳提出的著名气体定律是关于气体哪两个性质之间的关系？',
    options: [
      '温度与体积',
      '压强与体积',
      '密度与压强',
      '温度与压强'
    ],
    correctIndex: 1,
    explanation: '波义耳定律指出：在恒温下，一定量气体的体积与压强成反比。',
    historicalContext: '这是人类历史上发现的第一个"定律"——用数学公式描述的自然规律。'
  },
  {
    id: 'boyle-q3',
    chemistId: 'boyle',
    description: '波义耳认为元素的正确定义是什么？',
    options: [
      '由火、水、土、气四元素组成',
      '不能再分解的简单物质',
      '由原子构成的物质',
      '具有固定熔点的物质'
    ],
    correctIndex: 1,
    explanation: '波义耳将元素定义为"不能再分解的简单物质"，推翻了古希腊四元素说。',
    historicalContext: '这一观点为后来的化学元素研究奠定了基础。'
  },
  {
    id: 'boyle-q4',
    chemistId: 'boyle',
    description: '波义耳无意中发现紫罗兰花瓣遇酸变红，由此发明了什么？',
    options: [
      'pH试纸',
      '石蕊试纸',
      '酚酞指示剂',
      '甲基橙'
    ],
    correctIndex: 1,
    explanation: '波义耳发现紫罗兰花瓣遇酸变红，由此发明了石蕊试纸，这是最早的酸碱指示剂。',
    historicalContext: '这个偶然发现开创了分析化学中酸碱滴定的重要方法。'
  },
  {
    id: 'lavoisier-q1',
    chemistId: 'lavoisier',
    description: '拉瓦锡通过加热氧化汞分解实验，发现了什么气体？',
    options: [
      '氮气',
      '氢气',
      '氧气',
      '二氧化碳'
    ],
    correctIndex: 2,
    explanation: '拉瓦锡发现氧化汞加热分解产生的气体能助燃，将其命名为"氧气"。',
    historicalContext: '这个实验推翻了统治化学界百年的"燃素说"，开创了现代化学。'
  },
  {
    id: 'lavoisier-q2',
    chemistId: 'lavoisier',
    description: '拉瓦锡提出的化学反应基本定律是？',
    options: [
      '定比定律',
      '质量守恒定律',
      '倍比定律',
      '气体反应体积定律'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡通过精确的定量实验证明：化学反应前后总质量不变。',
    historicalContext: '他用定量实验方法将化学从定性研究推向定量研究。'
  },
  {
    id: 'lavoisier-q3',
    chemistId: 'lavoisier',
    description: '拉瓦锡将水通过灼热的铁管，发现水可以分解产生什么气体？',
    options: [
      '氧气',
      '氢气',
      '氮气',
      '一氧化碳'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡发现水分解产生氢气，证明水不是元素而是化合物。',
    historicalContext: '这个实验彻底推翻了水是基本元素的古老观念。'
  },
  {
    id: 'lavoisier-q4',
    chemistId: 'lavoisier',
    description: '拉瓦锡在法国大革命中因何罪名被送上断头台？',
    options: [
      '叛国罪',
      '税务官身份',
      '学术造假',
      '反革命宣传'
    ],
    correctIndex: 1,
    explanation: '拉瓦锡因为曾担任包税官的职务，在法国大革命中被送上断头台。',
    historicalContext: '著名数学家拉格朗日惋惜道："砍下他的头只需要一瞬间，但再长出这样的头脑也许需要一百年。"'
  },
  {
    id: 'mendeleev-q1',
    chemistId: 'mendeleev',
    description: '门捷列夫是根据元素的什么性质来排列元素周期表的？',
    options: [
      '原子序数',
      '原子量',
      '质子数',
      '电子数'
    ],
    correctIndex: 1,
    explanation: '门捷列夫按照原子量递增的顺序排列元素，发现了元素性质的周期性。',
    historicalContext: '后来莫斯莱发现应该按原子序数排列，但门捷列夫的周期律依然正确。'
  },
  {
    id: 'mendeleev-q2',
    chemistId: 'mendeleev',
    description: '门捷列夫的周期表中预言了"类铝"元素，后来被发现的是？',
    options: [
      '锗',
      '镓',
      '钪',
      '铟'
    ],
    correctIndex: 1,
    explanation: '门捷列夫预言的"类铝"就是后来发现的镓，其性质与预言惊人吻合。',
    historicalContext: '镓是第一种被发现的、门捷列夫预言的元素，这使周期律获得广泛认可。'
  },
  {
    id: 'mendeleev-q3',
    chemistId: 'mendeleev',
    description: '门捷列夫编制元素周期表是在哪一年？',
    options: [
      '1859年',
      '1869年',
      '1879年',
      '1889年'
    ],
    correctIndex: 1,
    explanation: '1869年，门捷列夫正式发表了他的元素周期表。',
    historicalContext: '有趣的是，他是在玩"化学纸牌"游戏时获得灵感排列出元素周期表的。'
  },
  {
    id: 'mendeleev-q4',
    chemistId: 'mendeleev',
    description: '门捷列夫预言的"类硅"元素，后来被发现并命名为？',
    options: [
      '锗',
      '硒',
      '砷',
      '溴'
    ],
    correctIndex: 0,
    explanation: '门捷列夫预言的"类硅"就是锗，由德国化学家温克勒在1886年发现。',
    historicalContext: '锗的发现进一步证实了元素周期律的正确性，门捷列夫的预言几乎分毫不差。'
  }
];

export const funFacts: FunFact[] = [
  {
    id: 'fact-1',
    chemistId: 'boyle',
    title: '波义耳与指示剂',
    content: '波义耳是第一个发现酸碱指示剂的人！他无意中将紫罗兰花瓣掉入盐酸中，发现花瓣变红，由此发明了石蕊试纸。',
    year: 1645
  },
  {
    id: 'fact-2',
    chemistId: 'boyle',
    title: '不信炼金术的化学家',
    content: '波义耳出生在一个炼金术盛行的年代，但他却公开质疑炼金术的"点石成金"之说，认为必须通过实验来验证一切。',
    year: 1661
  },
  {
    id: 'fact-3',
    chemistId: 'boyle',
    title: '科学家与宗教',
    content: '波义耳是一位非常虔诚的基督徒，他用自己的财产设立了"波义耳讲座"，专门用于捍卫基督教信仰。',
    year: 1691
  },
  {
    id: 'fact-4',
    chemistId: 'lavoisier',
    title: '拉瓦锡的断头实验',
    content: '拉瓦锡在法国大革命中被送上断头台。传说他与刽子手约定，头被砍下后尽可能眨眼，以验证人死后是否还有意识。据说他眨了15次眼。',
    year: 1794
  },
  {
    id: 'fact-5',
    chemistId: 'lavoisier',
    title: '21岁的气象学家',
    content: '拉瓦锡从21岁开始，连续15年每天早上4点起床，晚上10点睡觉，坚持记录天气数据，一生中从未间断。',
    year: 1764
  },
  {
    id: 'fact-6',
    chemistId: 'lavoisier',
    title: '命名氧气的人',
    content: '"氧气"（Oxygen）这个名字是拉瓦锡起的，在希腊语中意为"酸的形成者"，因为他错误地认为所有酸都含有氧。',
    year: 1777
  },
  {
    id: 'fact-7',
    chemistId: 'mendeleev',
    title: '被拒绝的诺贝尔奖',
    content: '门捷列夫的元素周期表如此重要，但他却从未获得诺贝尔奖。因为1906年的评委会主席与他有私怨，以"周期表太老"为由否决了他。',
    year: 1906
  },
  {
    id: 'fact-8',
    chemistId: 'mendeleev',
    title: '全能的门捷列夫',
    content: '门捷列夫不仅是化学家，还研究过气象学、地质学、经济学，甚至参与过北极探险。他为俄罗斯的度量衡制度奠定了基础。',
    year: 1899
  },
  {
    id: 'fact-9',
    chemistId: 'mendeleev',
    title: '化学纸牌游戏',
    content: '门捷列夫发明元素周期表的灵感来自于他爱玩的"化学纸牌"游戏。他把每种元素写在卡片上，像玩扑克牌一样排列，终于发现了元素周期律。',
    year: 1869
  }
];

const usedQuestionIds: Set<string> = new Set();
const unlockedFactIds: Set<string> = new Set();

export function getQuestionsByChemist(chemistId: string): Question[] {
  return questions.filter(q => q.chemistId === chemistId);
}

export function getRandomQuestion(chemistId: string): Question | null {
  const chemistQuestions = getQuestionsByChemist(chemistId).filter(
    q => !usedQuestionIds.has(q.id)
  );
  
  if (chemistQuestions.length === 0) {
    usedQuestionIds.clear();
    return getRandomQuestion(chemistId);
  }
  
  const randomIndex = Math.floor(Math.random() * chemistQuestions.length);
  const selectedQuestion = chemistQuestions[randomIndex];
  usedQuestionIds.add(selectedQuestion.id);
  return selectedQuestion;
}

export function getRandomFact(chemistId?: string): FunFact | null {
  let availableFacts = chemistId 
    ? funFacts.filter(f => f.chemistId === chemistId && !unlockedFactIds.has(f.id))
    : funFacts.filter(f => !unlockedFactIds.has(f.id));
  
  if (availableFacts.length === 0) {
    unlockedFactIds.clear();
    availableFacts = chemistId 
      ? funFacts.filter(f => f.chemistId === chemistId)
      : funFacts;
  }
  
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  const selectedFact = availableFacts[randomIndex];
  unlockedFactIds.add(selectedFact.id);
  return selectedFact;
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getChemistById(id: string): Chemist | undefined {
  return chemists.find(c => c.id === id);
}

export const elements: Element[] = [
  { id: 'h', symbol: 'H', name: '氢', atomicNumber: 1, row: 0, col: 0, chemistId: 'lavoisier', category: '非金属', color: '#E8C9A0' },
  { id: 'he', symbol: 'He', name: '氦', atomicNumber: 2, row: 0, col: 3, chemistId: 'lavoisier', category: '稀有气体', color: '#A0D8E8' },
  { id: 'li', symbol: 'Li', name: '锂', atomicNumber: 3, row: 1, col: 0, chemistId: 'mendeleev', category: '碱金属', color: '#E8A0A0' },
  { id: 'be', symbol: 'Be', name: '铍', atomicNumber: 4, row: 1, col: 1, chemistId: 'boyle', category: '碱土金属', color: '#C9E8A0' },
  { id: 'b', symbol: 'B', name: '硼', atomicNumber: 5, row: 1, col: 2, chemistId: 'lavoisier', category: '类金属', color: '#E8E8A0' },
  { id: 'c', symbol: 'C', name: '碳', atomicNumber: 6, row: 1, col: 3, chemistId: 'boyle', category: '非金属', color: '#A0A0A0' },
  { id: 'n', symbol: 'N', name: '氮', atomicNumber: 7, row: 2, col: 0, chemistId: 'lavoisier', category: '非金属', color: '#A0C4E8' },
  { id: 'o', symbol: 'O', name: '氧', atomicNumber: 8, row: 2, col: 1, chemistId: 'lavoisier', category: '非金属', color: '#E8A0C4' },
  { id: 'f', symbol: 'F', name: '氟', atomicNumber: 9, row: 2, col: 2, chemistId: 'mendeleev', category: '卤素', color: '#C4A0E8' },
  { id: 'ne', symbol: 'Ne', name: '氖', atomicNumber: 10, row: 2, col: 3, chemistId: 'mendeleev', category: '稀有气体', color: '#A0E8C4' },
  { id: 'na', symbol: 'Na', name: '钠', atomicNumber: 11, row: 3, col: 0, chemistId: 'mendeleev', category: '碱金属', color: '#FFB347' },
  { id: 'mg', symbol: 'Mg', name: '镁', atomicNumber: 12, row: 3, col: 1, chemistId: 'boyle', category: '碱土金属', color: '#77DD77' },
  { id: 'al', symbol: 'Al', name: '铝', atomicNumber: 13, row: 3, col: 2, chemistId: 'lavoisier', category: '金属', color: '#CFCFC4' },
  { id: 'si', symbol: 'Si', name: '硅', atomicNumber: 14, row: 3, col: 3, chemistId: 'mendeleev', category: '类金属', color: '#FDFD96' },
  { id: 'p', symbol: 'P', name: '磷', atomicNumber: 15, row: 0, col: 1, chemistId: 'boyle', category: '非金属', color: '#FF9999' },
  { id: 's', symbol: 'S', name: '硫', atomicNumber: 16, row: 0, col: 2, chemistId: 'lavoisier', category: '非金属', color: '#FFFF99' },
];

export const elementFacts: ElementFact[] = [
  { id: 'ef-1', elementId: 'h', title: '最轻的元素', content: '氢是宇宙中最轻、最丰富的元素，占宇宙可见物质的75%。拉瓦锡将其命名为"水的形成者"。', year: 1766, chemistId: 'lavoisier' },
  { id: 'ef-2', elementId: 'o', title: '氧气的发现', content: '拉瓦锡通过加热氧化汞发现了氧气，并推翻了统治化学界百年的"燃素说"。', year: 1774, chemistId: 'lavoisier' },
  { id: 'ef-3', elementId: 'h', title: '氢气球的时代', content: '1783年，人类第一次乘坐氢气球飞上天空。然而氢气的易燃易爆性也带来了许多灾难。', year: 1783, chemistId: 'lavoisier' },
  { id: 'ef-4', elementId: 'n', title: '空气的主要成分', content: '拉瓦锡发现空气不是单一物质，而是由约4/5的氮气和1/5的氧气组成的混合物。', year: 1777, chemistId: 'lavoisier' },
  { id: 'ef-5', elementId: 'c', title: '生命的骨架', content: '碳是所有有机化合物的基础，它能形成长链和复杂结构，这是生命诞生的关键。', year: 1661, chemistId: 'boyle' },
  { id: 'ef-6', elementId: 'p', title: '意外发现的磷', content: '德国炼金术士布兰德在蒸发尿液时意外发现了磷。他最初以为找到了"点金石"。', year: 1669, chemistId: 'boyle' },
  { id: 'ef-7', elementId: 's', title: '古老的元素', content: '硫是人类最早知道的元素之一，在《圣经》中就有记载。波义耳研究了硫的燃烧反应。', year: 1660, chemistId: 'boyle' },
  { id: 'ef-8', elementId: 'be', title: '绿宝石的成分', content: '铍存在于绿宝石中，它的名字来源于希腊语"beryllos"，意为"绿宝石"。', year: 1798, chemistId: 'boyle' },
  { id: 'ef-9', elementId: 'mg', title: '耀眼的白光', content: '镁燃烧时会发出强烈的白光，早期被用于摄影闪光灯和烟火。', year: 1755, chemistId: 'boyle' },
  { id: 'ef-10', elementId: 'li', title: '最轻的金属', content: '锂是最轻的金属，可以漂浮在水面上。它的名字来源于希腊语"lithos"，意为"石头"。', year: 1817, chemistId: 'mendeleev' },
  { id: 'ef-11', elementId: 'na', title: '食盐的核心', content: '钠最常见的化合物是氯化钠（食盐）。纯净的钠是一种柔软的银白色金属，遇水剧烈反应。', year: 1807, chemistId: 'mendeleev' },
  { id: 'ef-12', elementId: 'f', title: '最活泼的非金属', content: '氟是最活泼的非金属元素，几乎能与所有物质发生反应。它的发现历程充满了危险。', year: 1886, chemistId: 'mendeleev' },
  { id: 'ef-13', elementId: 'si', title: '半导体之王', content: '硅是地壳中第二丰富的元素，是现代电子工业的基础，支撑着整个信息时代。', year: 1824, chemistId: 'mendeleev' },
  { id: 'ef-14', elementId: 'ne', title: '霓虹灯的秘密', content: '氖气在放电时会发出明亮的橙红色光，被广泛用于霓虹灯。"霓虹"就是"neon"的音译。', year: 1898, chemistId: 'mendeleev' },
  { id: 'ef-15', elementId: 'he', title: '太阳元素', content: '氦气最初是在太阳光谱中发现的，名字来源于希腊语"helios"，意为"太阳"。', year: 1868, chemistId: 'mendeleev' },
  { id: 'ef-16', elementId: 'al', title: '曾经比黄金还贵', content: '在19世纪，铝是一种非常稀有的贵金属，法国皇帝拿破仑三世曾用铝制餐具招待贵宾。', year: 1825, chemistId: 'lavoisier' },
];

export const ROWS = 4;
export const COLS = 4;

export function getElementById(id: string): Element | undefined {
  return elements.find(e => e.id === id);
}

export function getElementsByChemist(chemistId: string): Element[] {
  return elements.filter(e => e.chemistId === chemistId);
}

export function getRandomElementByChemist(chemistId: string): Element | null {
  const chemistElements = getElementsByChemist(chemistId);
  if (chemistElements.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * chemistElements.length);
  return chemistElements[randomIndex];
}

export function getElementFact(elementId: string): ElementFact | undefined {
  return elementFacts.find(f => f.elementId === elementId);
}

export function getRandomElementFact(chemistId?: string): ElementFact | null {
  let availableFacts = chemistId
    ? elementFacts.filter(f => f.chemistId === chemistId)
    : elementFacts;
  
  if (availableFacts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  return availableFacts[randomIndex];
}

export function checkLineCompletion(
  board: Record<string, CellOwner>,
  elements: Element[]
): { type: 'row' | 'col'; index: number; owner: CellOwner } | null {
  for (let row = 0; row < ROWS; row++) {
    const rowElements = elements.filter(e => e.row === row);
    const owner = checkRowColCompletion(rowElements.map(e => board[`${e.row}-${e.col}`]));
    if (owner) {
      return { type: 'row', index: row, owner };
    }
  }
  
  for (let col = 0; col < COLS; col++) {
    const colElements = elements.filter(e => e.col === col);
    const owner = checkRowColCompletion(colElements.map(e => board[`${e.row}-${e.col}`]));
    if (owner) {
      return { type: 'col', index: col, owner };
    }
  }
  
  return null;
}

function checkRowColCompletion(owners: CellOwner[]): CellOwner {
  if (owners.length === 0) return null;
  const firstOwner = owners[0];
  if (!firstOwner) return null;
  for (const owner of owners) {
    if (owner !== firstOwner) return null;
  }
  return firstOwner;
}

export function getUnoccupiedCells(board: Record<string, CellOwner>): string[] {
  const unoccupied: string[] = [];
  for (const element of elements) {
    const key = `${element.row}-${element.col}`;
    if (!board[key]) {
      unoccupied.push(element.id);
    }
  }
  return unoccupied;
}

export function getPlayerCells(board: Record<string, CellOwner>): string[] {
  const playerCells: string[] = [];
  for (const element of elements) {
    const key = `${element.row}-${element.col}`;
    if (board[key] === 'player') {
      playerCells.push(element.id);
    }
  }
  return playerCells;
}

export function getAICells(board: Record<string, CellOwner>): string[] {
  const aiCells: string[] = [];
  for (const element of elements) {
    const key = `${element.row}-${element.col}`;
    if (board[key] === 'ai') {
      aiCells.push(element.id);
    }
  }
  return aiCells;
}
