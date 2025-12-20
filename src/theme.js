const theme = {
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 40,
        gutterHorizontal: 60,
        gutterVertical: 80
    },

    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        round: 9999,
    },

    shadows: {
        soft: {
            shadowColor: "#2D3748",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 2,
        },
        medium: {
            shadowColor: "#1A202C",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 5,
        }
    },

    appBar:{
        primary: '#5D3FD3',
        secondary: '#2D3748',
        textPrimary: '#ffffff',
        iconPrimary: '#ffffff'
    },

    bottomBar:{
        primary: '#5D3FD3',
        secondary: '#2D3748',
        textPrimary: '#ffffff',
        iconPrimary: '#ffffff'
    },

    colors: {
        primary:      '#5D3FD3',
        primaryLight: '#8066E0',
        primaryDark:  '#3D258A',

        secondary:      '#2D3748',
        secondaryLight: '#718096',
        secondaryDark:  '#1A202C',

        tertiary:      '#319795',
        tertiaryLight: '#81E6D9',
        tertiaryDark:  '#285E61',

        success: '#2F855A',
        error:   '#E53E3E',
        warning: '#D69E2E',
        info:    '#3182CE',
        
        background:      '#FFFFFF',
        backgroundLight: '#F7FAFC',
        inputBackground: '#EDF2F7',
        border:          '#E2E8F0',
        disabled:        '#CBD5E0',
        
        textGray:       '#718096',
        textGrayDark:   '#4A5568',
        textGrayDarker: '#2D3748',

        surface: '#FFFFFF',

        tags: {
            green:     '#38A169',
            blue:      '#3182CE',
            red:       '#E53E3E',
            purple:    '#805AD5',
            lightblue: '#0BC5EA',
            grey:      '#718096',
        },

        textPrimary:   '#2D3748',
        textSecondary: '#ffffff',
        
        lightblue:  '#3182CE',
        lightblue1: '#3182CE',
        lightblue2: '#BEE3F8',
        
        lightgreen: '#2F855A',
        green:      '#38A169',
        
        purple:  '#5D3FD3',
        purple2: '#3D258A',
        
        red:  '#E53E3E',
        red1: '#FED7D7',
        
        gray:  '#E2E8F0',
        gray1: '#718096',
    },

    fontSizes: {
        body: 16,
        subheading: 20,
        small: 14,
        title: 28,
        bigTitle: 34,
        caption: 12
    },

    fonts: {
        main: 'System', 
        bold: 'System'
    },

    fontWeights: {
        normal: '400',
        bold: '700'
    }
}

export default theme;
export { theme };