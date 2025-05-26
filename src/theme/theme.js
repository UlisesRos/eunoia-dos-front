import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        brand: {
            primary: "#6A8677",
            secondary: "#EBEBEB",
        },
    },
    fonts: {
        heading: "Montserrat, sans-serif",
        body: "Roboto, sans-serif",
    },
    components: {
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
            transition: 'all 0.2s ease-in-out',
        },
        variants: {
            solid: {
                bg: 'brand.primary',
                color: 'brand.secondary',
                _hover: {
                    color: 'brand.primary',
                    bg: 'brand.secondary',
                    border: '1px solid #6A8677',
                    boxShadow: '0 8px 20px rgba(106, 134, 119, 0.4)',
                    transform: 'translateY(-2px)',
                },
            },
        },
        defaultProps: {
            variant: 'solid', // Se aplica automáticamente
        },
    },
    },
});

export default theme;