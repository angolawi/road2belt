import { MealDetail, NutritionProtocolType } from '../types';

export interface PlanMeta {
  title: string;
  totalKcal: number;
  proteinsG: number;
  carbsG: number;
  fatsG: number;
  meals: Record<string, MealDetail>;
  shoppingList: { category: string; items: string[] }[];
}

export const ALINE_MARINHO_PLANS: Record<NutritionProtocolType, PlanMeta> = {
  DIAS_COM_BJJ: {
    title: "Dias com Jiu-Jitsu (Treino 12:00)",
    totalKcal: 1702,
    proteinsG: 102.7,
    carbsG: 197.4,
    fatsG: 63.5,
    meals: {
      breakfast: {
        time: "06:40",
        name: "Café da Manhã",
        kcal: 563,
        description: "Suporte energético inicial para o dia de tatame",
        options: [
          "2 ovos de galinha mexidos com manteiga",
          "1 fatia média de cuscuz de milho cozido (135g) OU 3 col. sopa cheias de goma de tapioca (60g) OU 1 pão francês (50g)",
          "200ml café coado com açúcar"
        ],
        tips: "Ao optar pela tapioca, adicione 1 colher de sopa de semente de chia ou linhaça."
      },
      snackAm: {
        time: "10:00",
        name: "Colação (Pré-Tatame 12:00)",
        kcal: 108,
        description: "Glicogênio rápido e gorduras boas antes do tatame",
        options: [
          "1 kiwi médio OU 1 laranja média OU 1 maçã argentina OU 7 morangos médios",
          "1 pedaço pequeno de coco fresco (15g) OU 1 colher de sopa cheia de amendoim (19g)"
        ],
        tips: "Varie nas frutas diariamente, não consuma sempre a mesma."
      },
      lunch: {
        time: "13:30",
        name: "Almoço (Pós-Tatame)",
        kcal: 687,
        description: "Recuperação glicogênica e reparação muscular pós-rolas",
        options: [
          "1.5 filé médio (150g) de peito de frango grelhado OU 110g de carne bovina magra",
          "2 colheres de arroz cheias (90g) de arroz branco cozido",
          "1 concha cheia de feijão carioca cozido (140g)",
          "5 colheres de sopa cheias de batata doce cozida (120g) OU 2 pedaços pequenos de mandioca (100g) OU 4 colheres de inhame (140g)",
          "2 colheres de servir cheias de legumes no vapor (cenoura, brócolis, abobrinha, abóbora, rabanete)",
          "2 pegadores de folhas escuras (agrião, rúcula, almeirão)",
          "1 colher de sopa de azeite de oliva extravirgem (8ml)"
        ],
        tips: "Para temperar a salada, prefira molhos naturais com limão, azeite e sal."
      },
      snackPm: {
        time: "16:30",
        name: "Lanche da Tarde (Pré-Pilates)",
        kcal: 344,
        description: "Manutenção energética vespertina",
        options: [
          "1 porção de Shake de chocolate e amendoim (348g) OU Bowl pré-treino OU Vitamina de abacate com aveia (305ml) OU lanche dos dias sem BJJ"
        ],
        tips: "Ideal para consumir antes da sessão de Pilates das 18:00."
      },
      dinner: {
        time: "22:30",
        name: "Ceia Leve (Opcional)",
        kcal: 0,
        description: "Apenas se sentir fome no período da noite",
        options: [
          "Opção 1: 1 pote pequeno de iogurte natural (165g) + 5 morangos médios",
          "Opção 2: 1 fatia média de abacaxi (75g) + 1 banana média (40g) + 1 colher de sopa de farelo de aveia (10g)"
        ],
        tips: "Ceia leve e sem peso no estômago para preservar a qualidade do sono."
      }
    },
    shoppingList: [
      { category: "Frutas e Vegetais", items: ["Kiwi", "Laranja", "Maçã", "Morango", "Banana", "Abacaxi", "Batata doce", "Mandioca", "Inhame", "Cenoura", "Brócolis", "Abobrinha", "Abóbora", "Rúcula/Agrião"] },
      { category: "Proteínas e Ovos", items: ["Ovos de galinha", "Peito de frango", "Carne bovina magra", "Iogurte natural"] },
      { category: "Cereais e Grãos", items: ["Arroz branco", "Feijão carioca", "Cuscuz de milho", "Goma de tapioca", "Farelo de aveia", "Chia / Linhaça"] },
      { category: "Gorduras e Oleaginosas", items: ["Azeite extravirgem", "Amendoim", "Coco fresco", "Manteiga"] }
    ]
  },
  DIAS_SEM_BJJ: {
    title: "Dias sem Jiu-Jitsu (Foco Força S&C ou Descanso)",
    totalKcal: 1598,
    proteinsG: 120.7,
    carbsG: 166.9,
    fatsG: 55.3,
    meals: {
      breakfast: {
        time: "06:40",
        name: "Café da Manhã",
        kcal: 490,
        description: "Proteínas elevadas e carboidratos controlados",
        options: [
          "1 fatia média de mamão formosa (170g) OU 1 banana prata (75g) OU 1 pera média (110g) OU 2 fatias de melão (230g)",
          "2 ovos de galinha mexidos, cozidos ou em forma de omelete",
          "200ml café coado com açúcar"
        ],
        tips: "Pode preparar os ovos com ervas finas e pouco sal."
      },
      snackAm: {
        time: "10:00",
        name: "Colação",
        kcal: 160,
        description: "Fruta fresca combinada com gordura monoinsaturada",
        options: [
          "1 maçã média (130g) OU 1 banana média (40g) OU 1 kiwi médio (76g) OU 7 morangos (84g)",
          "1 colher de sopa rasa de amendoim (13g) OU 1 pedaço pequeno de coco (15g)"
        ]
      },
      lunch: {
        time: "13:00",
        name: "Almoço Padrão",
        kcal: 443,
        description: "Equilíbrio calórico e saciedade prolongada",
        options: [
          "1 filé médio (100g) de peito de frango grelhado OU 110g de carne magra",
          "1.5 colher de arroz cheia (67.5g) de arroz branco",
          "1 concha cheia de feijão carioca (140g)",
          "2 colheres de servir cheias de legumes no vapor (abóbora, abobrinha, cenoura, rabanete)",
          "2 pegadores de folhas escuras (agrião, rúcula, almeirão, brócolis)",
          "1 colher de sopa de azeite extravirgem (8ml)"
        ]
      },
      snackPm: {
        time: "16:00",
        name: "Pré-Treino / Lanche da Tarde",
        kcal: 190,
        description: "Combustível para a musculação das 17h/18h",
        options: [
          "1 porção de tapioca com frango (85g) OU 1 panqueca de banana de frigideira (134g) OU 1 banana média + 1 colher sopa de pasta de amendoim (16g)"
        ]
      },
      dinner: {
        time: "19:30",
        name: "Jantar",
        kcal: 316,
        description: "Refeição noturna leve para recuperação",
        options: [
          "1 filé médio (100g) de peito de frango grelhado OU 110g de carne magra",
          "1 colher de arroz cheia (45g) de arroz branco",
          "2 colheres de servir cheias de legumes no vapor",
          "1 colher de sopa de azeite extravirgem (8ml)"
        ]
      }
    },
    shoppingList: [
      { category: "Frutas e Vegetais", items: ["Mamão", "Banana", "Melão", "Pera", "Maçã", "Kiwi", "Morango", "Abóbora", "Abobrinha", "Cenoura", "Rabanete", "Folhas escuras"] },
      { category: "Proteínas", items: ["Ovos", "Peito de frango", "Carne magra"] },
      { category: "Cereais e Outros", items: ["Arroz", "Feijão", "Goma de tapioca", "Pasta de amendoim", "Amendoim", "Coco", "Azeite extravirgem"] }
    ]
  }
};
