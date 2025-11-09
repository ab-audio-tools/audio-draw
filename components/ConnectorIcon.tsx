/**
 * ConnectorIcon - SVG icons for different connector types
 */

import React from 'react';
import type { ConnectorType } from '@/lib/deviceSchema';

interface ConnectorIconProps {
    type: ConnectorType;
    size?: number;
    color?: string;
}

export default function ConnectorIcon({ type, size = 16, color = '#374151' }: ConnectorIconProps) {
    const renderIcon = () => {
        switch (type) {
            case 'xlr':
                // XLR: rotated so two pins on top, one below (remove central line)
                return (
                    <g>
                        <circle cx="8" cy="8" r="6.2" fill="none" stroke={color} strokeWidth="1.2" />
                        {/* two pins on top row */}
                        <circle cx="5.5" cy="8" r="1.1" fill={color} />
                        <circle cx="10.5" cy="8" r="1.1" fill={color} />
                        {/* single pin below */}
                        <circle cx="8" cy="11" r="1.1" fill={color} />
                    </g>
                );

            case 'jack-ts':
                // Jack TS: vertical shaft (tip up, sleeve down)
                return (
                    <g>
                        {/* shaft */}
                        <rect x="6.2" y="3.5" width="3.6" height="8.5" rx="0.6" fill={color} />
                        {/* tip separation line (white) */}
                        <line x1="8" y1="6" x2="8" y2="8" stroke="white" strokeWidth="0.9" />
                        {/* tip cap */}
                        <rect x="7" y="3.2" width="2" height="1.2" rx="0.4" fill={color} />
                    </g>
                );

            case 'jack-trs':
                // Jack TRS: vertical shaft with tip/ring/sleeve markings
                return (
                    <g>
                        <rect x="6.2" y="3.5" width="3.6" height="8.5" rx="0.6" fill={color} />
                        {/* tip/ring separation lines */}
                        <line x1="6.6" y1="5.2" x2="9.4" y2="5.2" stroke="white" strokeWidth="0.9" />
                        <line x1="6.6" y1="7.2" x2="9.4" y2="7.2" stroke="white" strokeWidth="0.9" />
                        {/* tip cap */}
                        <rect x="7" y="3.2" width="2" height="1.2" rx="0.4" fill={color} />
                    </g>
                );

            case 'rca':
                // RCA: Circle with center pin (removed side rect)
                return (
                    <g>
                        <circle cx="8" cy="8" r="5.5" fill="none" stroke={color} strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2.5" fill={color} />
                        <circle cx="8" cy="8" r="1" fill="white" />
                    </g>
                );

            case 'midi-din':
                // MIDI DIN: full circle with 5 pins arranged like a smile
                return (
                    <g>
                        <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="1.2" />
                        {/* five pins in a slight arc (smile) */}
                        <circle cx="4.5" cy="8.5" r="0.7" fill={color} />
                        <circle cx="5.5" cy="10.5" r="0.7" fill={color} />
                        <circle cx="8" cy="11.5" r="0.7" fill={color} />
                        <circle cx="10.5" cy="10.5" r="0.7" fill={color} />
                        <circle cx="11.5" cy="8.5" r="0.7" fill={color} />
                    </g>
                );

            case 'usb':
                // USB: logo USB con tridente a 3 punte
                return (
                    <g>
                        <line x1="8" y1="12" x2="8" y2="5" stroke="" stroke-width="1.2"></line>
                        <polygon points="6.5,3.5 8,0 9.5,3.5" fill={color}></polygon>
                        <circle cx="4.8" cy="7" r="0.6" fill={color} stroke={color} stroke-width="1"></circle>
                        <polyline points="4.8,7 4.8,10.5 8,13.8" fill="none" stroke={color}></polyline>
                        <polyline points="11.2,5 11.2,8 8,11.2" fill="none" stroke={color}></polyline>
                        <rect x="10.2" y="4.3" width="2" height="2" fill={color}></rect>
                        <line x1="8" y1="14" x2="8" y2="3.5" stroke={color} stroke-width="1"></line>
                        <circle cx="8" cy="14.6" r="0.8" fill={color} stroke={color} stroke-width="1"></circle>
                    </g>
                );



            case 'ethernet':
                // Ethernet: RJ45 with 8 contacts
                return (
                    <g>
                        <rect x="3.5" y="4" width="9" height="8" rx="0.8" fill="none" stroke={color} strokeWidth="1.2" />
                        <rect x="4.5" y="9" width="7" height="2" fill={color} opacity="0.3" />
                        <line x1="5" y1="6" x2="5" y2="8.5" stroke={color} strokeWidth="0.7" />
                        <line x1="6.5" y1="6" x2="6.5" y2="8.5" stroke={color} strokeWidth="0.7" />
                        <line x1="8" y1="6" x2="8" y2="8.5" stroke={color} strokeWidth="0.7" />
                        <line x1="9.5" y1="6" x2="9.5" y2="8.5" stroke={color} strokeWidth="0.7" />
                        <line x1="11" y1="6" x2="11" y2="8.5" stroke={color} strokeWidth="0.7" />
                    </g>
                );

            case 'optical':
                // Optical (TOSLINK) female projection view
                return (
                    <g>
                        {/* outer round body */}
                        <rect x="3.2" y="5.6" width="9.6" height="4.8" rx="1.2" fill="none" stroke={color} strokeWidth="1.1" />
                        {/* trapezoid female aperture */}
                        <path d="M5 6.8 L11 6.8 L10 9.2 L6 9.2 Z" fill={color} />
                        {/* small central square hole */}
                        <rect x="7" y="7.4" width="2" height="1.2" rx="0.2" fill="#fff" />
                    </g>
                );

            case 'speakon':
                
                return (
                    <g>
                        <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="1.2"></circle>
                        <line x1="9" y1="13" x2="7" stroke={color} strokeWidth="1" y2="13"></line>
                        <line x1="9.5" y1="3" x2="6.5" stroke={color} strokeWidth="1" y2="3"></line>
                        <circle cx="8" cy="8" r="2" fill="none" stroke={color}></circle>
                    </g>
                );

            case 'iec':
                // IEC/Power: show a lightning bolt to indicate power
                return (
                    <g>

                        {/* lightning bolt */}
                        <polyline points="7,0 12,0 9,7 12,8 7.5,16 8,10 4,8 7,0" fill="none" stroke={color}></polyline>
                    </g>
                );

            default:
                return (
                    <circle cx="8" cy="8" r="5" fill="none" stroke={color} strokeWidth="1.5" />
                );
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            {renderIcon()}
        </svg>
    );
}
