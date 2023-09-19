import {ButtonStylesParams, MantineTheme, MantineThemeOverride, useMantineTheme} from '@mantine/core';

export const ivaoTheme: MantineThemeOverride = {
    colorScheme: 'light',
    colors: {
        blue: [
            '#e7eaf5',
            '#cfd5eb',
            '#9eabd6',
            '#8696cc',
            '#8696cc',
            '#6e80c2',
            '#566bb8',
            '#3d56ad',
            '#2541a3',
            '#0D2C99',
        ],
        green: [
            '#eaf9ef',
            '#d5f4e0',
            '#c0eed0',
            '#abe8c0',
            '#97e3b1',
            '#82dda1',
            '#6dd791',
            '#58d181',
            '#43cc72',
            '#2ec662',
        ],
        yellow: [
            '#fefaea',
            '#fef5d5',
            '#fdf0c0',
            '#fdebab',
            '#fce696',
            '#fbe080',
            '#fbdb6b',
            '#fad656',
            '#fad141',
            '#f9cc2c',
        ],
        red: [
            '#fdebeb',
            '#fbd6d6',
            '#f8c2c2',
            '#f6aeae',
            '#f49a9a',
            '#f28585',
            '#f07171',
            '#ed5d5d',
            '#eb4848',
            '#E93434',
        ],
        lightBlue: [
            '#eceef7',
            '#d8ddee',
            '#c5cce6',
            '#b1bbde',
            '#9eaad6',
            '#8a99cd',
            '#7EA2D6',
            '#7788c5',
            '#5066b4',
            '#3C55AC',
        ],
        gray: [
            '#D7D7DC',
            '#c2c2c6',
            '#acacb0',
            '#97979a',
            '#818184',
            '#6c6c6e',
            '#565658',
            '#404042',
            '#2b2b2c',
            '#151516',
        ],
    },
    globalStyles: (theme) => ({
        '*, *::before, *::after': {
            boxSizing: 'border-box',
        },

        body: {
            backgroundColor: '#f8f8f8',
            color: "white",
            lineHeight: theme.lineHeight,
        },

    }),

    components: {
        Button: {
            styles: (theme, params: ButtonStylesParams, {variant}) => ({
                root: {
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                        boxShadow: 'none',
                    },
                },
            }),
        },

        Menu: {
            styles: {
                dropdown: {
                    backgroundColor: "white",
                },
                item: {
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: '#f6f5f5',
                    },
                },
            },
        },
    },
    primaryColor: 'blue',
    primaryShade: 9,
    white: '#fffff',
    fontFamily: 'Montserrat, sans-serif',
};