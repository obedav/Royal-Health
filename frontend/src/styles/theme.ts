import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    // Enhanced Royal Health Brand Colors - Single Source of Truth
    brand: {
      50: '#FCE7F3',   // Very light pink
      100: '#F8BBD9',  // Light pink
      200: '#F48FB1',  // Medium light pink
      300: '#F06292',  // Medium pink
      400: '#EC407A',  // Light pink
      500: '#C2185B',  // PRIMARY ENHANCED PINK (was #E91E63)
      600: '#AD1457',  // Darker enhanced pink
      700: '#880E4F',  // Deep pink
      800: '#6D1039',  // Very deep pink
      900: '#4A0E27',  // Darkest pink
    },
    purple: {
      50: '#F3E5F5',   // Very light purple
      100: '#E1BEE7',  // Light purple
      200: '#CE93D8',  // Medium light purple
      300: '#BA68C8',  // Medium purple
      400: '#AB47BC',  // Light purple
      500: '#7B1FA2',  // PRIMARY ENHANCED PURPLE (was #9C27B0)
      600: '#6A1B9A',  // Darker enhanced purple
      700: '#4A148C',  // Deep purple
      800: '#38006B',  // Very deep purple
      900: '#2D004F',  // Darkest purple
    },
    // Aliases for semantic use - Single Source of Truth
    primary: (theme: any) => theme.colors.brand,
    secondary: (theme: any) => theme.colors.purple,
    // Neutral colors
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'primary.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        outline: {
          borderColor: 'primary.500',
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          transition: 'all 0.2s ease-in-out',
        },
        ghost: {
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
            color: 'primary.600',
          }
        },
        // Enhanced gradient button with new colors
        gradient: {
          bgGradient: 'linear(45deg, primary.500, secondary.500)', // C2185B to 7B1FA2
          color: 'white',
          _hover: {
            bgGradient: 'linear(45deg, primary.600, secondary.600)', // AD1457 to 6A1B9A
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 14px 0 rgba(194, 24, 91, 0.25)',
          },
          _active: {
            bgGradient: 'linear(45deg, primary.700, secondary.700)',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        // New vibrant gradient variant
        vibrantGradient: {
          bgGradient: 'linear(135deg, primary.500, secondary.500)',
          color: 'white',
          fontWeight: 'bold',
          _hover: {
            bgGradient: 'linear(135deg, primary.600, secondary.600)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(194, 24, 91, 0.3)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease-in-out',
        }
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'primary.400',
            },
            _focus: {
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
            }
          }
        }
      }
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      }
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'gray.200',
          _hover: {
            boxShadow: 'md',
            borderColor: 'primary.200',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        }
      },
      variants: {
        elevated: {
          container: {
            _hover: {
              boxShadow: '0 10px 25px 0 rgba(194, 24, 91, 0.15)',
              transform: 'translateY(-4px)',
            }
          }
        }
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        lineHeight: '1.2',
      },
      variants: {
        gradient: {
          bgGradient: 'linear(45deg, primary.500, secondary.500)', // Enhanced colors
          bgClip: 'text',
          color: 'transparent',
        },
        brandGradient: {
          bgGradient: 'linear(135deg, primary.500, secondary.500)',
          bgClip: 'text',
          color: 'transparent',
          fontWeight: '800',
        }
      }
    },
    Text: {
      variants: {
        gradient: {
          bgGradient: 'linear(45deg, primary.500, secondary.500)',
          bgClip: 'text',
          color: 'transparent',
        }
      }
    },
    Link: {
      baseStyle: {
        color: 'primary.500',
        _hover: {
          color: 'primary.600',
          textDecoration: 'none',
        }
      }
    },
    Badge: {
      variants: {
        gradient: {
          bgGradient: 'linear(45deg, primary.500, secondary.500)',
          color: 'white',
        }
      }
    }
  },
  styles: {
    global: {
      body: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: 'gray.800',
        bg: 'gray.50',
      },
      '*': {
        boxSizing: 'border-box',
      }
    }
  },
  breakpoints: {
    sm: '30em',    // 480px - Mobile
    md: '48em',    // 768px - Tablet
    lg: '62em',    // 992px - Desktop
    xl: '80em',    // 1280px - Large Desktop
    '2xl': '96em', // 1536px - Extra Large
  },
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  shadows: {
    brand: '0 4px 14px 0 rgba(194, 24, 91, 0.15)', // Updated with enhanced pink
    brandLg: '0 10px 25px 0 rgba(194, 24, 91, 0.25)', // Enhanced shadow
    brandXl: '0 20px 40px 0 rgba(194, 24, 91, 0.3)', // New extra large shadow
  }
})

export default theme