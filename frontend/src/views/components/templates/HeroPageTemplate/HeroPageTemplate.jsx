import React from 'react';
import { fullPage, rightSide } from './HeroPageTemplate.module.scss';
import GradientBg from '../../background/GradientBg/GradientBg';
import BlurredImageBg from '../../background/BlurredImageBg/BlurredImageBg';

function HeroPageTemplate({ children }) {
    return (
        <div className={fullPage}>
            <GradientBg>{children}</GradientBg>

            <div className={rightSide}>
                <BlurredImageBg />
            </div>
        </div>
    );
}

export default HeroPageTemplate;
