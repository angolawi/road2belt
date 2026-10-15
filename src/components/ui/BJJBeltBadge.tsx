import React from 'react';
import { BJJBeltColor, BJJ_BELT_METAS } from '../../types';

interface BJJBeltBadgeProps {
  color?: BJJBeltColor;
  degrees?: number; // 0 a 4
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const BJJBeltBadge: React.FC<BJJBeltBadgeProps> = ({
  color = 'PURPLE',
  degrees = 0,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const meta = BJJ_BELT_METAS[color] || BJJ_BELT_METAS.PURPLE;
  const clampedDegrees = Math.max(0, Math.min(degrees, 4));

  // Dimensões baseadas no tamanho
  const dimensions = {
    sm: { height: 14, width: 64, sleeveWidth: 20, stripeWidth: 2.5, stripeGap: 2 },
    md: { height: 20, width: 88, sleeveWidth: 26, stripeWidth: 3, stripeGap: 2.5 },
    lg: { height: 28, width: 124, sleeveWidth: 38, stripeWidth: 4, stripeGap: 3.5 }
  }[size];

  // Cores do corpo e da ponteira (tarja)
  const isBlackBelt = color === 'BLACK';
  const sleeveBg = isBlackBelt ? '#dc2626' : '#0f172a'; // Tarja vermelha para preta, preta para as demais

  const getLabelText = () => {
    if (clampedDegrees === 0) return meta.name;
    return `${meta.name} (${clampedDegrees}º Grau)`;
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* SVG da Faixa Autêntica */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="rounded-sm shadow-sm flex-shrink-0"
      >
        {/* Corpo principal da faixa com relevo suave */}
        <rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          rx="2"
          fill={meta.hex}
        />
        {/* Costura superior e inferior */}
        <line
          x1="0"
          y1="2"
          x2={dimensions.width}
          y2="2"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={dimensions.height - 2}
          x2={dimensions.width}
          y2={dimensions.height - 2}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1"
        />

        {/* Tarja de graduação (sleeve) */}
        <rect
          x={dimensions.width - dimensions.sleeveWidth - 4}
          y="0"
          width={dimensions.sleeveWidth}
          height={dimensions.height}
          rx="1"
          fill={sleeveBg}
        />

        {/* Borda da ponteira branca se faixa preta ou comum */}
        <line
          x1={dimensions.width - dimensions.sleeveWidth - 4}
          y1="0"
          x2={dimensions.width - dimensions.sleeveWidth - 4}
          y2={dimensions.height}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />

        {/* Graus (Stripes) */}
        {Array.from({ length: clampedDegrees }).map((_, i) => {
          const stripeX =
            dimensions.width -
            dimensions.sleeveWidth -
            1 +
            (i + 1) * (dimensions.stripeWidth + dimensions.stripeGap);

          return (
            <rect
              key={i}
              x={stripeX}
              y="1"
              width={dimensions.stripeWidth}
              height={dimensions.height - 2}
              rx="0.5"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {showLabel && (
        <span className={`font-bold ${size === 'sm' ? 'text-[11px]' : 'text-xs'} ${meta.textClass}`}>
          {getLabelText()}
        </span>
      )}
    </div>
  );
};
