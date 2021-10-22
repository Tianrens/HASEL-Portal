import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { React } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledButton } from '../buttons/StyledButton';
import { text, alignLeft, subHeader, container, smallMargin } from './StyledHeader.module.scss';

const StyledHeader = ({ children, left, sub, back, actions }) => {
    const history = useHistory();

    return (
        <div className={`${container} ${sub ? smallMargin : ''}`}>
            <h2 className={`${text} ${left ? alignLeft : ''} ${sub ? subHeader : ''}`}>
                <span>{children}</span>
            </h2>
            {actions}
            {back && history.length > 1 && (
                <StyledButton
                    size='small'
                    icon={<ArrowBackIcon />}
                    onClick={() => history.goBack()}
                >
                    Back
                </StyledButton>
            )}
        </div>
    );
};

export default StyledHeader;
