/* eslint-disable react-hooks/exhaustive-deps */
// File derived from https://www.npmjs.com/package/material-ui-search-bar, converted to mui v5
import React, {
    cloneElement,
    forwardRef,
    useEffect,
    useRef,
    useState,
    useCallback,
    useImperativeHandle,
} from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';

const styles = (theme) => ({
    rootPaper: {
        height: theme.spacing(6),
        display: 'flex',
        justifyContent: 'space-between',
    },
    iconButton: {
        color: theme.palette.action.active,
        transform: 'scale(1, 1)',
        transition: theme.transitions.create(['transform', 'color'], {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
        }),
    },
    iconButtonHidden: {
        transform: 'scale(0, 0)',
        '& > $icon': {
            opacity: 0,
        },
    },
    searchIconButton: {
        marginRight: theme.spacing(-6),
    },
    icon: {
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
        }),
    },
    input: {
        width: '100%',
    },
    searchContainer: {
        margin: 'auto 16px',
        width: `calc(100% - ${theme.spacing(6 + 4)})`, // 6 button + 4 margin
    },
});

/**
 * Material design search bar
 * @see [Search patterns](https://material.io/archive/guidelines/patterns/search.html)
 */
const SearchBar = forwardRef(
    (
        {
            cancelOnEscape,
            className,
            classes,
            closeIcon,
            disabled,
            onCancelSearch,
            onRequestSearch,
            searchIcon,
            style,
            ...inputProps
        },
        ref,
    ) => {
        const inputRef = useRef();
        const [value, setValue] = useState(inputProps.value);

        useEffect(() => {
            setValue(inputProps.value);
        }, [inputProps.value]);

        const handleFocus = useCallback(
            (e) => {
                if (inputProps.onFocus) {
                    inputProps.onFocus(e);
                }
            },
            [inputProps.onFocus],
        );

        const handleBlur = useCallback(
            (e) => {
                setValue((v) => v.trim());
                if (inputProps.onBlur) {
                    inputProps.onBlur(e);
                }
            },
            [inputProps.onBlur],
        );

        const handleInput = useCallback(
            (e) => {
                setValue(e.target.value);
                if (inputProps.onChange) {
                    inputProps.onChange(e.target.value);
                }
            },
            [inputProps.onChange],
        );

        const handleCancel = useCallback(() => {
            setValue('');
            if (onCancelSearch) {
                onCancelSearch();
            }
        }, [onCancelSearch]);

        const handleRequestSearch = useCallback(() => {
            if (onRequestSearch) {
                onRequestSearch(value);
            }
        }, [onRequestSearch, value]);

        const handleKeyUp = useCallback(
            (e) => {
                if (e.charCode === 13 || e.key === 'Enter') {
                    handleRequestSearch();
                } else if (cancelOnEscape && (e.charCode === 27 || e.key === 'Escape')) {
                    handleCancel();
                }
                if (inputProps.onKeyUp) {
                    inputProps.onKeyUp(e);
                }
            },
            [handleRequestSearch, cancelOnEscape, handleCancel, inputProps.onKeyUp],
        );

        useImperativeHandle(ref, () => ({
            focus: () => {
                inputRef.current.focus();
            },
            blur: () => {
                inputRef.current.blur();
            },
        }));

        return (
            <Paper className={classNames(classes.rootPaper, className)} style={style}>
                <div className={classes.searchContainer}>
                    <Input
                        {...inputProps}
                        inputRef={inputRef}
                        onBlur={handleBlur}
                        value={value}
                        onChange={handleInput}
                        onKeyUp={handleKeyUp}
                        onFocus={handleFocus}
                        fullWidth
                        className={classes.input}
                        disableUnderline
                        disabled={disabled}
                    />
                </div>
                <IconButton
                    onClick={handleRequestSearch}
                    className={classNames(classes.iconButton, classes.searchIconButton, {
                        [classes.iconButtonHidden]: value !== '',
                    })}
                    disabled={disabled}
                    size='large'
                >
                    {cloneElement(searchIcon, {
                        classes: { rootPaper: classes.icon },
                    })}
                </IconButton>
                <IconButton
                    onClick={handleCancel}
                    className={classNames(classes.iconButton, {
                        [classes.iconButtonHidden]: value === '',
                    })}
                    disabled={disabled}
                    size='large'
                >
                    {cloneElement(closeIcon, {
                        classes: { rootPaper: classes.icon },
                    })}
                </IconButton>
            </Paper>
        );
    },
);

SearchBar.defaultProps = {
    className: '',
    closeIcon: <ClearIcon />,
    disabled: false,
    placeholder: 'Search',
    searchIcon: <SearchIcon />,
    style: null,
    value: '',
};

export default withStyles(styles)(SearchBar);
