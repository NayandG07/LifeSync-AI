import React from 'react';

interface BodyMapProps {
  selectedAreas: string[];
  onAreaClick: (area: string) => void;
}

export default function BodyMap({ selectedAreas, onAreaClick }: BodyMapProps) {
  // Define body areas and their hitboxes
  const bodyAreas = [
    { id: 'head', label: 'Head', path: 'M100,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0', cx: 125, cy: 50 },
    { id: 'chest', label: 'Chest', path: 'M100,100 h50 v60 h-50 z', cx: 125, cy: 130 },
    { id: 'abdomen', label: 'Abdomen', path: 'M100,160 h50 v50 h-50 z', cx: 125, cy: 185 },
    { id: 'arms', label: 'Arms', path: 'M85,100 h15 v120 h-15 z M150,100 h15 v120 h-15 z', cx: 170, cy: 150 },
    { id: 'legs', label: 'Legs', path: 'M100,210 h20 v130 h-20 z M130,210 h20 v130 h-20 z', cx: 125, cy: 275 },
    { id: 'back', label: 'Back', path: 'M200,100 h50 v110 h-50 z', cx: 225, cy: 155 },
    { id: 'skin', label: 'Skin', path: 'M250,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0', cx: 275, cy: 50 },
    { id: 'general', label: 'General', path: 'M250,100 h50 v50 h-50 z', cx: 275, cy: 125 },
  ];

  // Get color for body part
  const getAreaColor = (id: string, type: 'fill' | 'stroke') => {
    const isSelected = selectedAreas.includes(id);
    
    if (type === 'fill') {
      return isSelected ? 'url(#gradient-' + id + ')' : 'transparent';
    } else { // stroke
      return isSelected ? 'hsl(var(--primary) / 0.8)' : 'hsl(var(--muted-foreground) / 0.4)';
    }
  };

  return (
    <div className="body-map-container w-full flex flex-col md:flex-row md:gap-6 items-center space-y-6 md:space-y-0">
      <div className="w-full md:w-1/2 flex justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 300 350" 
          className="w-full max-w-[300px] md:max-w-full"
          style={{ 
            height: 'auto',
            '--color-primary': 'hsl(var(--primary))',
            '--color-primary-transparent': 'hsl(var(--primary) / 0.3)',
            '--color-muted': 'hsl(var(--muted-foreground) / 0.5)'
          } as React.CSSProperties}
          aria-label="Interactive body map"
          role="img"
        >
          {/* Define gradients for each body part */}
          <defs>
            <linearGradient id="gradient-head" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(240, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-chest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(250, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-abdomen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(230, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(260, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-arms" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(240, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(270, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-legs" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(250, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(280, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-back" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(260, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(290, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-skin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(300, 90%, 60%, 0.5)" />
            </linearGradient>
            <linearGradient id="gradient-general" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(280, 90%, 60%, 0.5)" />
              <stop offset="100%" stopColor="hsl(310, 90%, 60%, 0.5)" />
            </linearGradient>
            
            {/* Enhanced shadow filter for selected areas */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Add a light body silhouette as background with better contrast */}
          <path 
            d="M100,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0 M100,75 v25 h50 v-25 M100,100 h50 v110 h-50 z M85,100 h15 v120 h-15 z M150,100 h15 v120 h-15 z M100,210 h20 v130 h-20 z M130,210 h20 v130 h-20 z" 
            fill="hsl(var(--muted) / 0.6)" 
            stroke="hsl(var(--muted) / 0.9)" 
            strokeWidth="1.5"
            className="dark:opacity-30"
          />

          {/* Highlight the outline of the body with stronger color */}
          <path 
            d="M100,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0 M100,75 v25 h50 v-25 M100,100 h50 v110 h-50 z M85,100 h15 v120 h-15 z M150,100 h15 v120 h-15 z M100,210 h20 v130 h-20 z M130,210 h20 v130 h-20 z" 
            fill="none" 
            stroke="hsl(var(--primary) / 0.7)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            className="dark:opacity-70"
          />

          {/* Add clickable areas */}
          {bodyAreas.map((area) => (
            <g 
              key={area.id}
              className="cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => onAreaClick(area.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedAreas.includes(area.id)}
              aria-label={`${area.label} - Click to select`}
              onKeyDown={(e) => e.key === 'Enter' && onAreaClick(area.id)}
            >
              <path
                id={area.id}
                d={area.path}
                fill={getAreaColor(area.id, 'fill')}
                stroke={getAreaColor(area.id, 'stroke')}
                strokeWidth={selectedAreas.includes(area.id) ? "2.5" : "1.5"}
                opacity={selectedAreas.includes(area.id) ? 1 : 0.8}
                style={{ 
                  transition: 'all 0.3s ease-in-out',
                  filter: selectedAreas.includes(area.id) ? 'drop-shadow(0 0 4px hsl(var(--primary) / 0.4))' : 'none'
                }}
              />
              
              {/* Labels */}
              <text
                x={area.cx}
                y={area.cy}
                textAnchor="middle"
                fill={selectedAreas.includes(area.id) ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.8)'}
                fontSize="12"
                fontWeight={selectedAreas.includes(area.id) ? 'bold' : 'normal'}
                pointerEvents="none"
                className="select-none"
                style={{
                  textShadow: selectedAreas.includes(area.id) ? '0 0 5px rgba(255, 255, 255, 0.7)' : 'none'
                }}
              >
                {area.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="body-map-legend w-full md:w-1/2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 w-full">
          {bodyAreas.map((area) => (
            <button
              key={area.id}
              className={`p-4 text-sm rounded-md transition-all duration-200 border-2 ${
                selectedAreas.includes(area.id) 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300 shadow-md dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 dark:border-blue-700' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/80'
              }`}
              onClick={() => onAreaClick(area.id)}
              aria-pressed={selectedAreas.includes(area.id)}
            >
              <div className="flex items-center gap-2">
                <div 
                  className={`w-4 h-4 rounded-full ${
                    selectedAreas.includes(area.id) 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`} 
                />
                <span className={selectedAreas.includes(area.id) ? "font-medium text-base" : "text-base"}>
                  {area.label}
                </span>
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                {selectedAreas.includes(area.id) ? 
                  (bodyAreas.find(a => a.id === area.id)?.label === area.label ? 
                    `${area.label} symptoms added` : 
                    `${area.label} selected`) : 
                  `Select ${area.label.toLowerCase()}`
                }
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 