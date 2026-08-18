'use client';

interface FlagProps {
  className?: string;
}

export function FlagUS({ className }: FlagProps) {
  const stripeHeight = 200 / 13;
  const stripes = Array.from({ length: 13 }, (_, i) => (
    <rect
      key={i}
      x='0'
      y={i * stripeHeight}
      width='300'
      height={stripeHeight}
      fill={i % 2 === 0 ? '#b22234' : '#ffffff'}
    />
  ));
  const rows = [6, 5, 6, 5, 6, 5, 6, 5, 6];
  const stars = rows.flatMap((n, r) =>
    Array.from({ length: n }, (_, j) => ({
      cx: (n === 6 ? 12.67 : 25.33) + j * 12.67,
      cy: 10.77 + r * 10.77,
    })),
  );
  return (
    <svg viewBox='0 0 300 200' className={className} aria-hidden='true'>
      {stripes}
      <rect x='0' y='0' width='152' height='107.69' fill='#3c3b6e' />
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r='4' fill='#ffffff' />
      ))}
    </svg>
  );
}

export function FlagBR({ className }: FlagProps) {
  const stars = [
    { cx: 150, cy: 62 },
    { cx: 130, cy: 88 },
    { cx: 120, cy: 75 },
    { cx: 172, cy: 80 },
    { cx: 183, cy: 70 },
    { cx: 150, cy: 142 },
    { cx: 130, cy: 116 },
    { cx: 120, cy: 130 },
    { cx: 170, cy: 124 },
    { cx: 178, cy: 134 },
  ];
  return (
    <svg viewBox='0 0 300 200' className={className} aria-hidden='true'>
      <rect x='0' y='0' width='300' height='200' fill='#009c3b' />
      <polygon points='150,10 292,100 150,190 8,100' fill='#ffdf00' />
      <circle cx='150' cy='100' r='55' fill='#002776' />
      <path
        d='M 96 104 Q 150 88 204 104 L 204 116 Q 150 100 96 116 Z'
        fill='#ffffff'
      />
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r='3' fill='#ffffff' />
      ))}
    </svg>
  );
}