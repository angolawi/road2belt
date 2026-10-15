import { ExerciseDefinition } from '../types';

export interface WorkoutStructure {
  treinoA: ExerciseDefinition[];
  treinoB: ExerciseDefinition[];
}

export const SAMUEL_SARAIVA_GUIDELINES = {
  title: "Programa de Força BJJ - Samuel Saraiva",
  subtitle: "Otimize seus resultados no tatame (Ciclo de 6 Semanas)",
  footwear: "Treine descalço sempre que possível. Pés ativos constroem base estável para o tatame.",
  blocksLogic: "Os blocos formados por 3 exercícios foram organizados para serem realizados conjugados (um após o outro antes de descansar). Se necessário, quebre conforme a logística da academia.",
  cadenceExplanation: {
    format: "Excêntrica - Transição - Concêntrica - Transição (ex: 2010)",
    eccentric: "Fase em que o músculo alonga e as articulações se afastam",
    transition1: "Pausa entre fase excêntrica e concêntrica",
    concentric: "Fase em que o músculo encurta e articulações se aproximam (X = explosivo)",
    transition2: "Pausa final antes da próxima repetição"
  },
  pseLimitWarning: "Atenção: O treino de força nunca alcança PSE 9 ou 10. Intensidade máxima e exaustão são reservadas exclusivamente para o tatame."
};

// Dados extraídos diretamente da planilha oficial de Samuel Saraiva
export const SAMUEL_SARAIVA_WEEKS: Record<number, WorkoutStructure> = {
  // SEMANAS 1 & 2
  1: {
    treinoA: [
      // Bloco 1
      { id: 'w1-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Mobilidade articular de quadril e tornozelo' },
      { id: 'w1-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Sentado' },
      { id: 'w1-a-3', block: 1, name: 'Quadrupedia Tocando os Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Estabilidade de core e cintura escapular' },
      // Bloco 2
      { id: 'w1-a-4', block: 2, name: 'Agachamento Goblet', sets: 3, reps: '10', cadence: '1011', targetPse: 8, notes: 'Halter frontal, foco em profundidade' },
      { id: 'w1-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '1111', targetPse: 8, notes: 'Semiajoelhado (*Cada lado)' },
      { id: 'w1-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '1011', targetPse: 8, notes: 'Quadril elevado em ponte glútea' },
      // Bloco 3
      { id: 'w1-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '1111', targetPse: 8, notes: 'Foco no cotovelo (*Cada lado)' },
      { id: 'w1-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Ajoelhado HBC' },
      { id: 'w1-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '10 totais', cadence: '1010', targetPse: 8, notes: 'Passos controlados com postura ereta' }
    ],
    treinoB: [
      // Bloco 1
      { id: 'w1-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w1-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: '1313', targetPse: 6, notes: 'Mobilidade torácica e posterior' },
      { id: 'w1-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      // Bloco 2
      { id: 'w1-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados sem peso' },
      { id: 'w1-b-5', block: 2, name: 'Deadlift HBC', sets: 3, reps: '10', cadence: '2011', targetPse: 8, notes: 'HBC com coluna neutra' },
      { id: 'w1-b-6', block: 2, name: 'Remada Inversa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'HBC' },
      // Bloco 3
      { id: 'w1-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: 'Isometria', targetPse: 7, notes: 'Fortalecimento de paravertebrais' },
      { id: 'w1-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados ajoelhado' },
      { id: 'w1-b-9', block: 3, name: 'Puxada no Cabo', sets: 3, reps: '10', cadence: '2010', targetPse: 8, notes: 'Ajoelhado no cabo' }
    ]
  },
  2: {
    // Semana 2 tem mesma base de progressão da semana 1 com consolidação de carga
    treinoA: [
      { id: 'w2-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Mobilidade articular' },
      { id: 'w2-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Sentado' },
      { id: 'w2-a-3', block: 1, name: 'Quadrupedia Tocando os Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Estabilidade' },
      { id: 'w2-a-4', block: 2, name: 'Agachamento Goblet', sets: 3, reps: '10', cadence: '1011', targetPse: 8, notes: 'Goblet (manter profundidade)' },
      { id: 'w2-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '1111', targetPse: 8, notes: 'Semiajoelhado' },
      { id: 'w2-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '1011', targetPse: 8, notes: 'Quadril elevado' },
      { id: 'w2-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '1111', targetPse: 8, notes: 'Cotovelo' },
      { id: 'w2-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Ajoelhado HBC' },
      { id: 'w2-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '10 totais', cadence: '1010', targetPse: 8, notes: 'Totais' }
    ],
    treinoB: [
      { id: 'w2-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w2-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: '1313', targetPse: 6, notes: 'Alongamento ativo' },
      { id: 'w2-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      { id: 'w2-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados sem peso' },
      { id: 'w2-b-5', block: 2, name: 'Deadlift HBC', sets: 3, reps: '10', cadence: '2011', targetPse: 8, notes: 'HBC' },
      { id: 'w2-b-6', block: 2, name: 'Remada Inversa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'HBC' },
      { id: 'w2-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: 'Isometria', targetPse: 7, notes: 'Posterior' },
      { id: 'w2-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados ajoelhado' },
      { id: 'w2-b-9', block: 3, name: 'Puxada no Cabo', sets: 3, reps: '10', cadence: '2010', targetPse: 8, notes: 'Ajoelhado no cabo' }
    ]
  },
  // SEMANAS 3 & 4
  3: {
    treinoA: [
      { id: 'w3-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Profundo' },
      { id: 'w3-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Ameaçando a subir' },
      { id: 'w3-a-3', block: 1, name: 'Quadrupedia Tocando os Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Base firme' },
      { id: 'w3-a-4', block: 2, name: 'Agachamento com Halteres', sets: 3, reps: '10', cadence: '2401', targetPse: 8, notes: 'Dois halteres nos ombros' },
      { id: 'w3-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '4040', targetPse: 8, notes: 'Semiajoelhado' },
      { id: 'w3-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '4010', targetPse: 8, notes: 'Quadril elevado' },
      { id: 'w3-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '4111', targetPse: 8, notes: 'Cotovelo' },
      { id: 'w3-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Em pé HBC' },
      { id: 'w3-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '10 totais', cadence: '1410', targetPse: 8, notes: 'Totais' }
    ],
    treinoB: [
      { id: 'w3-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w3-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: '1313', targetPse: 6, notes: 'Alongamento ativo' },
      { id: 'w3-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      { id: 'w3-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados HBC' },
      { id: 'w3-b-5', block: 2, name: 'Deadlift HBC', sets: 3, reps: '10', cadence: '20X1', targetPse: 8, notes: 'HBC explosivo na subida' },
      { id: 'w3-b-6', block: 2, name: 'Remada Inversa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'HBC' },
      { id: 'w3-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: '1010', targetPse: 7, notes: 'HBC' },
      { id: 'w3-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados ajoelhado' },
      { id: 'w3-b-9', block: 3, name: 'Puxada Barra Fixa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Barra fixa' }
    ]
  },
  4: {
    // Semana 4 consolida o bloco 3-4
    treinoA: [
      { id: 'w4-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Profundo' },
      { id: 'w4-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Ameaçando a subir' },
      { id: 'w4-a-3', block: 1, name: 'Quadrupedia Tocando os Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Base firme' },
      { id: 'w4-a-4', block: 2, name: 'Agachamento com Halteres', sets: 3, reps: '10', cadence: '2401', targetPse: 8, notes: 'Dois halteres nos ombros' },
      { id: 'w4-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '4040', targetPse: 8, notes: 'Semiajoelhado' },
      { id: 'w4-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '4010', targetPse: 8, notes: 'Quadril elevado' },
      { id: 'w4-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '4111', targetPse: 8, notes: 'Cotovelo' },
      { id: 'w4-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Em pé HBC' },
      { id: 'w4-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '10 totais', cadence: '1410', targetPse: 8, notes: 'Totais' }
    ],
    treinoB: [
      { id: 'w4-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w4-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: '1313', targetPse: 6, notes: 'Alongamento ativo' },
      { id: 'w4-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      { id: 'w4-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados HBC' },
      { id: 'w4-b-5', block: 2, name: 'Deadlift HBC', sets: 3, reps: '10', cadence: '20X1', targetPse: 8, notes: 'HBC explosivo' },
      { id: 'w4-b-6', block: 2, name: 'Remada Inversa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'HBC' },
      { id: 'w4-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: '1010', targetPse: 7, notes: 'HBC' },
      { id: 'w4-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados ajoelhado' },
      { id: 'w4-b-9', block: 3, name: 'Puxada Barra Fixa', sets: 3, reps: '10', cadence: '1010', targetPse: 8, notes: 'Barra fixa' }
    ]
  },
  // SEMANAS 5 & 6
  5: {
    treinoA: [
      { id: 'w5-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Manter postura' },
      { id: 'w5-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Emendando Cócoras' },
      { id: 'w5-a-3', block: 1, name: 'Quadrupedia Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Tirando os pés opostos' },
      { id: 'w5-a-4', block: 2, name: 'Agachamento com Barra', sets: 3, reps: '10', cadence: '10X1', targetPse: 8, notes: 'Barra nas costas, concêntrica explosiva' },
      { id: 'w5-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '0000', targetPse: 8, notes: 'Split (*Cada lado)' },
      { id: 'w5-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '10X1', targetPse: 8, notes: 'Elevado o quadril' },
      { id: 'w5-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '1011', targetPse: 8, notes: 'Apoio da mão (*Cada lado)' },
      { id: 'w5-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '10X1', targetPse: 8, notes: 'Em pé HBC explosivo' },
      { id: 'w5-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '16 totais', cadence: '1010', targetPse: 8, notes: 'Totais' }
    ],
    treinoB: [
      { id: 'w5-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w5-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: 'Controlado', targetPse: 6, notes: 'Carrinho de mão' },
      { id: 'w5-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      { id: 'w5-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados HBC' },
      { id: 'w5-b-5', block: 2, name: 'Deadlift com Barra', sets: 3, reps: '10', cadence: '20X1', targetPse: 8, notes: 'Barra, saída potente' },
      { id: 'w5-b-6', block: 2, name: 'Remada Inversa Barra', sets: 3, reps: '10', cadence: '101X', targetPse: 8, notes: 'Barra' },
      { id: 'w5-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: '1010', targetPse: 7, notes: 'HBC' },
      { id: 'w5-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados em pé' },
      { id: 'w5-b-9', block: 3, name: 'Puxada Barra Fixa', sets: 3, reps: '10', cadence: '10X0', targetPse: 8, notes: 'Barra fixa potente' }
    ]
  },
  6: {
    // Semana 6 repete a estrutura da semana 5 com carga de pico do ciclo
    treinoA: [
      { id: 'w6-a-1', block: 1, name: 'Cócoras', sets: 3, reps: '1 min', cadence: 'Livre', targetPse: 5, notes: 'Manter postura' },
      { id: 'w6-a-2', block: 1, name: 'Rolamento', sets: 3, reps: '10', cadence: 'Controlado', targetPse: 5, notes: 'Emendando Cócoras' },
      { id: 'w6-a-3', block: 1, name: 'Quadrupedia Ombros', sets: 3, reps: '20', cadence: 'Controlado', targetPse: 6, notes: 'Tirando os pés opostos' },
      { id: 'w6-a-4', block: 2, name: 'Agachamento com Barra', sets: 3, reps: '10', cadence: '10X1', targetPse: 8, notes: 'Barra nas costas' },
      { id: 'w6-a-5', block: 2, name: 'Rotação no Cabo', sets: 3, reps: '10 cada lado', cadence: '0000', targetPse: 8, notes: 'Split' },
      { id: 'w6-a-6', block: 2, name: 'Supino no Chão', sets: 3, reps: '20', cadence: '10X1', targetPse: 8, notes: 'Elevado o quadril' },
      { id: 'w6-a-7', block: 3, name: 'TGU Parcial', sets: 3, reps: '5 cada lado', cadence: '1011', targetPse: 8, notes: 'Apoio da mão' },
      { id: 'w6-a-8', block: 3, name: 'Desenvolvimento HBC', sets: 3, reps: '10', cadence: '10X1', targetPse: 8, notes: 'Em pé HBC' },
      { id: 'w6-a-9', block: 3, name: 'Passada pra Frente', sets: 3, reps: '16 totais', cadence: '1010', targetPse: 8, notes: 'Totais' }
    ],
    treinoB: [
      { id: 'w6-b-1', block: 1, name: 'Escorpião', sets: 3, reps: '10', cadence: '1111', targetPse: 5, notes: 'Alternados' },
      { id: 'w6-b-2', block: 1, name: 'Quadril Alto / Baixo', sets: 3, reps: '5', cadence: 'Controlado', targetPse: 6, notes: 'Carrinho de mão' },
      { id: 'w6-b-3', block: 1, name: 'Carregada na Marcha', sets: 3, reps: '20', cadence: '2020', targetPse: 5, notes: 'Alternados' },
      { id: 'w6-b-4', block: 2, name: 'Alcance Diagonal', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados HBC' },
      { id: 'w6-b-5', block: 2, name: 'Deadlift com Barra', sets: 3, reps: '10', cadence: '20X1', targetPse: 8, notes: 'Barra' },
      { id: 'w6-b-6', block: 2, name: 'Remada Inversa Barra', sets: 3, reps: '10', cadence: '101X', targetPse: 8, notes: 'Barra' },
      { id: 'w6-b-7', block: 3, name: 'Superman', sets: 3, reps: '30 seg', cadence: '1010', targetPse: 7, notes: 'HBC' },
      { id: 'w6-b-8', block: 3, name: 'Halo', sets: 3, reps: '10', cadence: '1111', targetPse: 7, notes: 'Alternados em pé' },
      { id: 'w6-b-9', block: 3, name: 'Puxada Barra Fixa', sets: 3, reps: '10', cadence: '10X0', targetPse: 8, notes: 'Barra fixa' }
    ]
  }
};
