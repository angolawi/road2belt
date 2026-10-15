# 🥋 BJJ Purple Tracker (`road2belt`)

Plataforma enxuta, mobile-first e offline-first projetada para o acompanhamento diário da rotina rumo à **Faixa Roxa de Jiu-Jitsu**, consolidando o tripé de alta performance:

1. **Tatame** (Sessões das 12:00, rolas, PSE, A-Game & feedback de graduados)
2. **Preparação Física & Mobilidade** (Protocolo Samuel Saraiva semanas 1 a 6 com cadências e trava de segurança de PSE + Pilates das 18:00 com Prof. Mirele)
3. **Nutrição & Recuperação** (Planejamento dietético de Aline Marinho com alternância automática entre 1.702 kcal e 1.598 kcal + Readiness diário)

---

## ⚡ Como Rodar o Projeto

No diretório do projeto:

```bash
cd /home/angolaw/development/road2belt

# Iniciar servidor de desenvolvimento (Vite)
npm run dev

# Ou construir para produção
npm run build

# Pré-visualizar versão de produção
npm run preview
```

O aplicativo estará disponível em `http://localhost:5173`. Para acessar pelo celular na mesma rede Wi-Fi, basta abrir o IP da máquina na porta `5173`.

---

## 📱 Recursos e Destaques

- **Check-in Rápido (< 60 Segundos)**: Visão unificada diária que permite registrar refeições, treinos e sono em menos de 1 minuto por dia.
- **Protocolo Samuel Saraiva (6 Semanas)**: Fichas oficiais completas de musculação para BJJ (Treinos A e B), blocos de 3 exercícios conjugados, orientações de treino descalço e cadências específicas.
- **Trava de Segurança de PSE na Musculação**: Alerta visual se PSE $\ge 9$ na musculação (intensidade máxima exclusiva do tatame).
- **Dieta Aline Marinho com Alternância Automática**:
  - **Seg/Qua/Sex (Dias com BJJ 12h)**: 1.702 kcal / 197g Carbo / 103g Proteína / 64g Lipídeos.
  - **Ter/Qui/Sáb/Dom (Dias sem BJJ)**: 1.598 kcal / 167g Carbo / 121g Proteína / 55g Lipídeos.
- **Pilates 18:00**: Check-in rápido de presença com Prof. Mirele e impacto na descompressão lombar e torácica pós-tatame.
- **Os 5 KPIs da Faixa Roxa**: Painel quinzenal e mensal calculando conformidade com os critérios de graduação:
  1. Presença no BJJ $\ge 90\%$ (11 a 12 treinos/mês)
  2. Volume de Rolas $\ge 18$ a 24 rounds/semana
  3. Plano de Força (2 a 3 sessões/semana)
  4. Frequência no Pilates ($\ge 2$ sessões/semana)
  5. Adesão Nutricional ($\ge 85\%$ das refeições marcadas)
- **PWA & Offline**: Funciona sem internet através de Service Worker e manifest instalável no iOS e Android.
- **Backup & Portabilidade**: Exportação e restauração completa em JSON para garantir segurança total dos dados.
