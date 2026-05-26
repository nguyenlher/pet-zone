import React from 'react';

export function VNFlag({ className = "w-5 h-3.5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 900 600" 
      className={`${className} shadow-sm rounded-sm`} 
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <rect width="900" height="600" fill="#da251d"/>
      <polygon points="450,150 485,259 600,259 507,327 542,436 450,369 358,436 393,327 300,259 415,259" fill="#ffff00"/>
    </svg>
  );
}

export function USFlag({ className = "w-5 h-3.5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 7410 3900" 
      className={`${className} shadow-sm rounded-sm`} 
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <rect width="7410" height="3900" fill="#b22234" />
      <path d="M0,300H7410M0,900H7410M0,1500H7410M0,2100H7410M0,2700H7410M0,3300H7410" stroke="#fff" stroke-width="300" />
      <rect width="2964" height="2100" fill="#3c3b6e" />
      <g fill="#fff">
        <g id="s18">
          <g id="s9">
            <g id="s5">
              <polygon points="247,94 286,214 186,138 308,138 208,214" />
              <polygon points="739,94 778,214 678,138 800,138 700,214" />
              <polygon points="1231,94 1270,214 1170,138 1292,138 1192,214" />
              <polygon points="1723,94 1762,214 1662,138 1784,138 1684,214" />
              <polygon points="2215,94 2254,214 2154,138 2276,138 2176,214" />
            </g>
            <polygon points="2707,94 2746,214 2646,138 2768,138 2668,214" />
            <polygon points="493,234 532,354 432,278 554,278 454,354" />
            <polygon points="985,234 1024,354 924,278 1046,278 946,354" />
            <polygon points="1477,234 1516,354 1416,278 1538,278 1438,354" />
            <polygon points="1969,234 2008,354 1908,278 2030,278 1930,354" />
          </g>
          <polygon points="2461,234 2500,354 2400,278 2522,278 2422,354" />
        </g>
        <use href="#s18" y="280" />
        <use href="#s18" y="560" />
        <use href="#s18" y="840" />
        <use href="#s9" y="1120" />
        <use href="#s5" y="1120" x="2218" stroke="none" />
      </g>
    </svg>
  );
}
