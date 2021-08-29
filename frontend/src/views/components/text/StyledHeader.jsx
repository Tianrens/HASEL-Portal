import { React } from 'react';
import { text, alignLeft, container } from './StyledHeader.module.scss';

const StyledHeader = ({ children, left }) => (
    <div className={container}>
        <h2 className={`${text} ${left ? alignLeft : ''}`}>
            <span>{children}</span>
        </h2>
    </div>
);

export default StyledHeader;
