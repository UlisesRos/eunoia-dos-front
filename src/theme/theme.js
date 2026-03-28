import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        brand: {
            primary: "#6A8677",
            secondary: "#EBEBEB",
            dark: "#4a6157",
            light: "#8fa99b",
            cream: "#f8f5f0",
            muted: "#d4e0da",
        },
    },

    fonts: {
        heading: "'Playfair Display', Georgia, serif",
        body: "'Questrial', sans-serif",
        mono: "'Questrial', sans-serif",
    },

    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
    },

    radii: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
        full: "9999px",
    },

    shadows: {
        sm: "0 1px 3px rgba(74, 97, 87, 0.12), 0 1px 2px rgba(74, 97, 87, 0.08)",
        md: "0 4px 16px rgba(74, 97, 87, 0.15), 0 2px 6px rgba(74, 97, 87, 0.08)",
        lg: "0 10px 30px rgba(74, 97, 87, 0.18), 0 4px 12px rgba(74, 97, 87, 0.1)",
        xl: "0 20px 50px rgba(74, 97, 87, 0.22), 0 8px 20px rgba(74, 97, 87, 0.12)",
        card: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        glow: "0 0 20px rgba(106, 134, 119, 0.45)",
        "glow-lg": "0 0 40px rgba(106, 134, 119, 0.55)",
    },

    components: {

        // ─── BUTTON ────────────────────────────────────────────────
        Button: {
            baseStyle: {
                fontFamily: "'Questrial', sans-serif",
                fontWeight: "400",
                letterSpacing: "0.04em",
                borderRadius: "full",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                _focus: {
                    boxShadow: "0 0 0 3px rgba(106, 134, 119, 0.4)",
                },
            },
            variants: {
                solid: {
                    bg: "brand.primary",
                    color: "brand.secondary",
                    _hover: {
                        bg: "brand.dark",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(74, 97, 87, 0.35)",
                        _disabled: { transform: "none", boxShadow: "none" },
                    },
                    _active: {
                        bg: "brand.dark",
                        transform: "translateY(0)",
                    },
                },
                outline: {
                    border: "1.5px solid",
                    borderColor: "brand.primary",
                    color: "brand.primary",
                    bg: "transparent",
                    _hover: {
                        bg: "brand.primary",
                        color: "brand.secondary",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(74, 97, 87, 0.25)",
                    },
                },
                ghost: {
                    color: "brand.primary",
                    _hover: {
                        bg: "rgba(106, 134, 119, 0.1)",
                    },
                },
                // Variante especial para páginas con fondo verde
                onGreen: {
                    bg: "transparent",
                    border: "1.5px solid",
                    borderColor: "brand.secondary",
                    color: "brand.secondary",
                    fontFamily: "'Questrial', sans-serif",
                    borderRadius: "full",
                    letterSpacing: "0.06em",
                    _hover: {
                        bg: "brand.secondary",
                        color: "brand.primary",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    },
                    _active: {
                        bg: "brand.secondary",
                        color: "brand.primary",
                        transform: "translateY(0)",
                    },
                },
                // Variante filled blanca para fondos oscuros
                white: {
                    bg: "white",
                    color: "brand.primary",
                    _hover: {
                        bg: "brand.cream",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },

        // ─── INPUT ─────────────────────────────────────────────────
        Input: {
            baseStyle: {
                field: {
                    fontFamily: "'Questrial', sans-serif",
                    borderRadius: "xl",
                },
            },
            variants: {
                outline: {
                    field: {
                        borderColor: "rgba(106, 134, 119, 0.35)",
                        bg: "white",
                        color: "gray.800",
                        _hover: {
                            borderColor: "brand.primary",
                        },
                        _focus: {
                            borderColor: "brand.primary",
                            boxShadow: "0 0 0 2px rgba(106, 134, 119, 0.25)",
                        },
                        _placeholder: {
                            color: "gray.400",
                        },
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },

        // ─── SELECT ────────────────────────────────────────────────
        Select: {
            baseStyle: {
                field: {
                    fontFamily: "'Questrial', sans-serif",
                    borderRadius: "xl",
                },
            },
            variants: {
                outline: {
                    field: {
                        borderColor: "rgba(106, 134, 119, 0.35)",
                        bg: "white",
                        color: "gray.800",
                        _hover: { borderColor: "brand.primary" },
                        _focus: {
                            borderColor: "brand.primary",
                            boxShadow: "0 0 0 2px rgba(106, 134, 119, 0.25)",
                        },
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },

        // ─── TEXTAREA ──────────────────────────────────────────────
        Textarea: {
            variants: {
                outline: {
                    borderColor: "rgba(106, 134, 119, 0.35)",
                    bg: "white",
                    fontFamily: "'Questrial', sans-serif",
                    borderRadius: "xl",
                    _hover: { borderColor: "brand.primary" },
                    _focus: {
                        borderColor: "brand.primary",
                        boxShadow: "0 0 0 2px rgba(106, 134, 119, 0.25)",
                    },
                },
            },
            defaultProps: { variant: "outline" },
        },

        // ─── FORM LABEL ────────────────────────────────────────────
        FormLabel: {
            baseStyle: {
                fontFamily: "'Questrial', sans-serif",
                fontWeight: "500",
                fontSize: "sm",
                color: "brand.dark",
                letterSpacing: "0.03em",
                mb: 1,
            },
        },

        // ─── HEADING ───────────────────────────────────────────────
        Heading: {
            baseStyle: {
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: "700",
                letterSpacing: "-0.01em",
                lineHeight: "1.2",
                color: "brand.primary",
            },
        },

        // ─── TEXT ──────────────────────────────────────────────────
        Text: {
            baseStyle: {
                fontFamily: "'Questrial', sans-serif",
            },
        },

        // ─── MODAL ─────────────────────────────────────────────────
        Modal: {
            baseStyle: {
                dialog: {
                    borderRadius: "2xl",
                    boxShadow: "xl",
                },
                header: {
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: "600",
                    fontSize: "xl",
                    color: "brand.dark",
                    borderBottom: "1px solid",
                    borderColor: "brand.muted",
                    pb: 3,
                },
                closeButton: {
                    borderRadius: "full",
                    _hover: { bg: "brand.muted" },
                },
            },
        },

        // ─── BADGE ─────────────────────────────────────────────────
        Badge: {
            baseStyle: {
                fontFamily: "'Questrial', sans-serif",
                fontWeight: "500",
                borderRadius: "full",
                letterSpacing: "0.04em",
            },
        },

        // ─── DIVIDER ───────────────────────────────────────────────
        Divider: {
            baseStyle: {
                borderColor: "brand.muted",
                opacity: 1,
            },
        },
    },

    styles: {
        global: {
            body: {
                bg: "brand.primary",
                color: "brand.secondary",
                fontFamily: "'Questrial', sans-serif",
            },
            "h1, h2, h3, h4, h5, h6": {
                fontFamily: "'Playfair Display', Georgia, serif",
            },
        },
    },
});

export default theme;
