import React from 'react';

import { heroPattern, container } from './GradientBg.module.scss';

/** Used a background element for text, showing a regular dotted pattern */
function GradientBg({ children }) {
    return (
        <div className={heroPattern}>
            <div className={container}>{children}</div>
        </div>
    );
}

export default GradientBg;
