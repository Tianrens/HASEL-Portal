import React from 'react';

import { bgImg } from './BlurredImageBg.module.scss';

function BlurredImageBg({ children }) {
    return <div className={bgImg}>{children}</div>;
}

export default BlurredImageBg;
