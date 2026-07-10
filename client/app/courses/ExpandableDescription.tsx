// 'use client';

// import { useState, useRef } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// interface ExpandableDescriptionProps {
//   description: string;
//   formatFn: (desc: string) => string;
//   /** Number of lines to show when collapsed (default 5) */
//   collapsedLines?: number;
// }

// /**
//  * Shows a rich-text course description with a "Read more / Read less" toggle.
//  * The collapsed height is based on `collapsedLines` × line-height so the cut-off
//  * is clean on all viewports.
//  */
// export function ExpandableDescription({
//   description,
//   formatFn,
//   collapsedLines = 5,
// }: ExpandableDescriptionProps) {
//   const [expanded, setExpanded] = useState(false);
//   const topRef = useRef<HTMLDivElement>(null);

//   const lineHeightPx = 28; // matches leading-relaxed at base-16px
//   const collapsedHeight = collapsedLines * lineHeightPx;

//   const handleCollapse = () => {
//     setExpanded(false);
//     // Scroll back so the top of the description stays in view
//     topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   return (
//     <div ref={topRef} className="space-y-3">
//       {/* Description body */}
//       <div
//         className="relative overflow-hidden transition-all duration-500 ease-in-out"
//         style={{ maxHeight: expanded ? '9999px' : `${collapsedHeight}px` }}
//       >
//         <div
//           className="text-text-secondary text-sm md:text-base leading-relaxed font-light tiptap"
//           dangerouslySetInnerHTML={{ __html: formatFn(description) }}
//         />

//         {/* Fade-out gradient shown only when collapsed */}
//         {!expanded && (
//           <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg to-transparent" />
//         )}
//       </div>

//       {/* Toggle button */}
//       <button
//         type="button"
//         onClick={expanded ? handleCollapse : () => setExpanded(true)}
//         className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors cursor-pointer"
//       >
//         {expanded ? (
//           <>
//             <ChevronUp size={14} />
//             Read less
//           </>
//         ) : (
//           <>
//             <ChevronDown size={14} />
//             Read more
//           </>
//         )}
//       </button>
//     </div>
//   );
// }

'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableDescriptionProps {
    description: string;
    formatFn: (desc: string) => string;
}

export function ExpandableDescription({ description, formatFn }: ExpandableDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!description) return null;

    const formattedHtml = formatFn(description);

    // Agar description chhoti hai to button dikhane ki zaroorat nahi
    const isLongDescription = description.length > 350;

    const handleToggle = () => {
        if (isExpanded) {
            setIsExpanded(false);
            // Kuch milliseconds ka delay taake DOM update ho jaye, phir scroll karein
            setTimeout(() => {
                containerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }, 50);
        } else {
            setIsExpanded(true);
        }
    };

    return (
        <div ref={containerRef} className="space-y-4 flex flex-col items-start">
            <div
                className={`text-text-secondary text-base md:text-lg leading-relaxed font-light tiptap transition-all duration-300 relative overflow-hidden ${!isExpanded && isLongDescription ? 'max-h-[160px]' : 'max-h-[9999px]'
                    }`}
            >
                <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />

                {/* Gradiant overlay jab text collapsed ho */}
                {!isExpanded && isLongDescription && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
                )}
            </div>

            {isLongDescription && (
                <button
                    onClick={handleToggle}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-gold uppercase hover:text-gold-light transition-colors mt-2 border border-gold/20 bg-gold/5 px-3 py-1.5 rounded-lg backdrop-blur-sm"
                >
                    {isExpanded ? (
                        <>
                            Show Less <ChevronUp size={14} />
                        </>
                    ) : (
                        <>
                            Show More <ChevronDown size={14} />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}