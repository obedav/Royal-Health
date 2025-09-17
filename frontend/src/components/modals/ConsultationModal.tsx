// src/components/modals/EnhancedConsultationModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { keyframes as emotionKeyframes } from '@emotion/react'
import SimpleConsultationForm from '../forms/SimpleConsultationForm'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

// Animation keyframes
const fadeInUp = emotionKeyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = emotionKeyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = emotionKeyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose
}) => {
  const overlayBg = useColorModeValue('rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.9)')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bg={overlayBg}
        backdropFilter="blur(12px)"
        zIndex={1000}
      />
      <ModalContent
        maxH="95vh"
        bg="transparent"
        boxShadow="none"
        overflow="hidden"
        animation={`${fadeInUp} 0.4s ease-out`}
        zIndex={1001}
      >
        <ModalCloseButton
          position="absolute"
          top="20px"
          right="20px"
          zIndex={1002}
          bg="white"
          color="gray.600"
          borderRadius="full"
          size="lg"
          _hover={{
            bg: "gray.100",
            color: "gray.800",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        />
        <ModalBody p={0}>
          <SimpleConsultationForm
            onClose={onClose}
            showBookingOption={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConsultationModal