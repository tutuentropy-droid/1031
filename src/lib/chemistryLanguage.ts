export type ChemistryTermMap = Record<string, string>;

export const classicalToModern: ChemistryTermMap = {
  '燃素': '氧气',
  '燃素说': '氧化学说',
  '热质': '热量',
  '热质说': '热力学',
  '亲和力': '化学键',
  '电液': '电流',
  '以太': '真空',
  '元素土': '化合物',
  '元素水': 'H₂O',
  '元素气': '气体',
  '元素火': '能量',
  '炼金': '化学合成',
  '哲人石': '催化剂',
  '蒸馏': '分馏',
  '煅烧': '氧化反应',
  '发酵': '生化反应',
  '腐蚀性': '氧化性',
  '挥发性': '蒸气压',
  '活性': '反应活性',
  '惰性': '化学稳定性',
  '盐基': '碱',
  '酸素': '酸根',
  '水素': '氢',
  '酸素原子': '氧原子',
  '窒素': '氮',
  '炭素': '碳',
  '饱和': '配位饱和',
  '不饱和': '不饱和键',
  '结晶质': '晶体',
  '胶质': '胶体',
  '溶液': '溶剂化体系',
  '沉淀': '固相析出',
  '中和': '酸碱中和',
  '置换': '取代反应',
  '化合': '化合反应',
  '分解': '分解反应',
  '复分解': '复分解反应',
  '爆炸极限': '爆炸浓度极限',
  '活化中心': '活性位点',
  '反应热': '焓变 ΔH',
  '反应速度': '反应速率',
  '平衡常数': '热力学平衡常数 K',
  '电离度': '解离度 α',
  '原子量': '相对原子质量',
  '分子量': '相对分子质量',
  '当量': '化学计量',
  '克分子': '摩尔 mol',
  '克原子': '摩尔原子',
  '升': '立方分米 dm³',
  '比重': '相对密度',
  '比热': '比热容 c',
  '导热率': '热导率 λ',
  '导电度': '电导率 σ',
  '硬度': '莫氏硬度',
  '沸点': '正常沸点',
  '熔点': '标准熔点',
  '凝固点': '冰点/凝固点',
  '临界点': '热力学临界点',
  '过热': '超热状态',
  '过冷': '过冷状态',
  '催化作用': '催化反应',
  '接触剂': '多相催化剂',
  '助催化剂': '助催化剂',
  '抑制剂': '反应抑制剂',
  '阻滞作用': '抑制效应',
  '活化作用': '活化效应',
  '表面张力': '表面能 γ',
  '渗透压': '渗透势 Π',
  '扩散': '分子扩散',
  '渗透': '渗透作用',
  '凝聚': '凝聚态',
  '升华': '相变升华',
  '液化': '冷凝液化',
  '气化': '汽化蒸发',
  '固化': '凝固相变',
  '游离态': '单质形态',
  '化合态': '化合形态',
  '同素体': '同素异形体',
  '同位体': '同位素',
  '异构体': '同分异构体',
  '单体': '单体分子',
  '聚合体': '高分子聚合物',
  '电解质': '离子导体',
  '非电解质': '非离子型化合物',
  '两性体': '两性化合物',
  '氧化剂': '氧化试剂',
  '还原剂': '还原试剂',
  '指示剂': 'pH指示剂',
  '脱水剂': '干燥剂',
  '干燥剂': '分子筛干燥剂',
  '吸收剂': '吸附介质',
  '漂白粉': '次氯酸钙',
  '绿矾': '硫酸亚铁',
  '蓝矾': '硫酸铜',
  '皓矾': '硫酸锌',
  '芒硝': '硫酸钠',
  '苏打': '碳酸钠',
  '小苏打': '碳酸氢钠',
  '烧碱': '氢氧化钠',
  '纯碱': '无水碳酸钠',
  '生石灰': '氧化钙',
  '熟石灰': '氢氧化钙',
  '石灰石': '碳酸钙',
  '王水': '盐酸硝酸混合物',
  '水银': '汞 Hg',
  '白金': '铂 Pt',
  '硫磺': '硫 S',
  '石墨': '碳 C(石墨)',
  '金刚石': '碳 C(金刚石)',
  '反应炉': '化学反应器',
  '温度': '热力学温度',
  '压力': '系统压强',
  '浓度': '摩尔浓度',
  '密度': '体积质量浓度',
  '纯度': '质量分数',
  '产率': '反应收率',
  '转化率': '化学转化率',
  '选择性': '反应选择性',
  '活化能': '阿伦尼乌斯活化能 Ea',
};

export const modernToClassical: ChemistryTermMap = Object.fromEntries(
  Object.entries(classicalToModern).map(([k, v]) => [v, k])
);

export const translateText = (text: string, from: 'classic' | 'modern', to: 'classic' | 'modern'): string => {
  if (from === to || !text) return text;

  const map = from === 'classic' ? classicalToModern : modernToClassical;
  let result = text;

  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (result.includes(key)) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, map[key]);
    }
  }

  return result;
};

export const translateQuestion = <T extends {
  description?: string;
  options?: string[];
  explanation?: string;
  historicalContext?: string;
}>(question: T, style: 'classic' | 'modern'): T => {
  if (style === 'classic') return question;

  return {
    ...question,
    description: question.description ? translateText(question.description, 'classic', 'modern') : undefined,
    options: question.options ? question.options.map(o => translateText(o, 'classic', 'modern')) : undefined,
    explanation: question.explanation ? translateText(question.explanation, 'classic', 'modern') : undefined,
    historicalContext: question.historicalContext ? translateText(question.historicalContext, 'classic', 'modern') : undefined,
  };
};
