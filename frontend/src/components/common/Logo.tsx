import { Box, Image, Text, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "horizontal" | "vertical";
  onClick?: () => void;
  imageSrc?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  variant = "horizontal",
  onClick,
  imageSrc = "/logo-img.jpg",
}) => {
  const sizeMap = {
    sm: { icon: "104px", text: "sm" },
    md: { icon: "124px", text: "lg" },
    lg: { icon: "144px", text: "xl" },
    xl: { icon: "140px", text: "2xl" },
  };

  const dimensions = sizeMap[size];

  const [imageError, setImageError] = useState(false);

  const LogoIcon = () => (
    <Box
      width={dimensions.icon}
      height={dimensions.icon}
      position="relative"
      cursor={onClick ? "pointer" : "default"}
    >
      {!imageError ? (
        <Image
          src={imageSrc}
          alt="Royal Health Logo"
          width="100%"
          height="100%"
          objectFit="contain"
          onError={() => setImageError(true)}
        />
      ) : (
        // fallback SVG
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="transparent"
          borderRadius="md"
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="25" r="12" fill="#E91E63" />
            <path
              d="M30 45 Q50 35 70 45 L75 75 Q50 85 25 75 Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E91E63" />
                <stop offset="100%" stopColor="#9C27B0" />
              </linearGradient>
            </defs>
          </svg>
        </Box>
      )}
    </Box>
  );

  const LogoText = () => (
    <VStack
      spacing={0}
      align={variant === "horizontal" ? "flex-start" : "center"}
    >
      <Text
        fontSize={dimensions.text}
        fontWeight="800"
        letterSpacing="tight"
        bgGradient="linear(45deg, purple.700, purple.900)"
        bgClip="text"
        sx={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        lineHeight="1"
      >
        ROYAL HEALTH
      </Text>
      <Text
        fontSize={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
        fontWeight="600"
        color="purple.800"
        letterSpacing="wide"
        lineHeight="1"
      >
        CONSULT
      </Text>
    </VStack>
  );

  if (variant === "vertical") {
    return (
      <VStack
        spacing={3}
        align="center"
        onClick={onClick}
        cursor={onClick ? "pointer" : "default"}
      >
        <LogoIcon />
        {showText && <LogoText />}
      </VStack>
    );
  }

  return (
    <HStack
      spacing={3}
      align="center"
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
    >
      <LogoIcon />
      {showText && <LogoText />}
    </HStack>
  );
};

export default Logo;
