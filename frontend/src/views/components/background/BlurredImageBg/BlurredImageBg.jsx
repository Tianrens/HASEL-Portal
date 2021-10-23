import React from 'react';

import { bgImg } from './BlurredImageBg.module.scss';

/** Used as a background element, showing the UoA Clocktower */
function BlurredImageBg({ children }) {
    return <div className={bgImg}>{children}</div>;
}

export default BlurredImageBg;
