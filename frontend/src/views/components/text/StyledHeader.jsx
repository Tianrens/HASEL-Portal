import { React } from 'react';
import { text, alignLeft, subHeader, container } from './StyledHeader.module.scss';

const StyledHeader = ({ children, left, sub }) => (
    <div className={container}>
        <h2 className={`${text} ${left ? alignLeft : ''} ${sub ? subHeader : ''}`}>
            <span>{children}</span>
        </h2>
    </div>
);

export default StyledHeader;
