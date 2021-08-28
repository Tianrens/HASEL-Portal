import React from 'react';

import { heroPattern, container } from './GradientBg.module.scss';

function GradientBg({ children }) {
    return (
        <div className={heroPattern}>
            <div className={container}>{children}</div>
        </div>
    );
}

export default GradientBg;
