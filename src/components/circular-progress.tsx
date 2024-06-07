import { useState, useEffect } from 'react';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  duration: number;
}

CircularProgress.defaultProps = {
  size: 100,
  strokeWidth: 10,
  progress: 0,
  duration: 0.5,
}

export default function CircularProgress ({
  size,
  strokeWidth,
  progress,
  duration,
}: CircularProgressProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * 251.2;
    setOffset(progressOffset);
  }, [progress]);

  const radiusMultiplier = 1
  const radius = size / 2 - strokeWidth / 2;
  const cx = size / 2;
  const cy = size - radius;
  const circumference = 2 * Math.PI * radius * radiusMultiplier;
  const progressOffset = circumference * (1 - progress / 100);
  const fillColor = '#232323';

  return (
    <svg viewBox={`0 0 ${size} ${size / 2}`} width={size} height={size / 2}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000"/>
          {/* <stop offset="50%" stopColor="#ffff00"/> */}
          <stop offset="100%" stopColor="#00ff00"/>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#232323"/>
          {/* <stop offset="50%" stopColor="#ffff00"/> */}
          <stop offset="100%" stopColor="#232323"/>
        </linearGradient>
      </defs>
      <path
        d={`M ${cx - radius} ${cy} A ${radius * radiusMultiplier} ${radius * radiusMultiplier} 0 0 1 ${cx + radius} ${cy}`}
        stroke="url(#gradient2)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius * radiusMultiplier} ${radius * radiusMultiplier} 0 0 1 ${cx + radius} ${cy}`}
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
      />
    </svg>
  )
}
