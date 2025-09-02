// src/pages/Settings.tsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SimpleGrid,
  Icon,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import {
  FaLock,
  FaBell,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaDownload,
  FaHistory,
  FaCog,
  FaKey,
  FaMobileAlt,
  FaEnvelope,
} from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  appointmentReminders: boolean;
  securityAlerts: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    appointmentReminders: true,
    securityAlerts: true,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSettingChange = async (setting: keyof SecuritySettings) => {
    const newValue = !settings[setting];
    
    // Optimistic update
    setSettings(prev => ({
      ...prev,
      [setting]: newValue
    }));

    try {
      // Here you would call your API to update the setting
      // await updateUserSetting(setting, newValue);
      
      toast({
        title: 'Settings Updated',
        description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${newValue ? 'enabled' : 'disabled'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Revert on error
      setSettings(prev => ({
        ...prev,
        [setting]: !newValue
      }));
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update setting. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would call your API to change password
      // await changePassword(passwordData);
      
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onPasswordClose();
    } catch (error) {
      toast({
        title: 'Password Change Failed',
        description: 'Failed to change password. Please check your current password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Here you would call your API to delete account
      // await deleteUserAccount();
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      logout();
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete account. Please contact support.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onDeleteClose();
    }
  };

  const handleDownloadData = async () => {
    setIsLoading(true);
    try {
      // Here you would call your API to generate data export
      // const data = await exportUserData();
      
      toast({
        title: 'Data Export Started',
        description: 'Your data export will be emailed to you shortly.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" pt="100px" pb={8}>
      <Container maxW="4xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Account Settings
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Manage your security, privacy, and notification preferences
            </Text>
          </Box>

          {/* Account Overview */}
          <Card>
            <CardHeader>
              <Heading size="md">Account Overview</Heading>
            </CardHeader>
            <CardBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Account Status</StatLabel>
                  <StatNumber>
                    <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                      Active
                    </Badge>
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Member Since</StatLabel>
                  <StatNumber fontSize="lg">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Account Type</StatLabel>
                  <StatNumber>
                    <Badge colorScheme="brand" fontSize="md" px={3} py={1} borderRadius="full">
                      {user?.role || 'Client'}
                    </Badge>
                  </StatNumber>
                </Stat>
              </StatGroup>
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaShieldAlt} color="green.500" />
                <Heading size="md">Security & Privacy</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Password Change */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <HStack>
                    <Icon as={FaLock} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Password</Text>
                      <Text fontSize="sm" color="gray.600">
                        Last changed 30 days ago
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    leftIcon={<Icon as={FaKey} />}
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    onClick={onPasswordOpen}
                  >
                    Change Password
                  </Button>
                </HStack>

                {/* Two-Factor Authentication */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <HStack>
                    <Icon as={FaMobileAlt} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Two-Factor Authentication</Text>
                      <Text fontSize="sm" color="gray.600">
                        Add an extra layer of security to your account
                      </Text>
                    </VStack>
                  </HStack>
                  <Switch
                    colorScheme="green"
                    isChecked={settings.twoFactorEnabled}
                    onChange={() => handleSettingChange('twoFactorEnabled')}
                  />
                </HStack>

                {/* Security Alerts */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <HStack>
                    <Icon as={FaBell} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Security Alerts</Text>
                      <Text fontSize="sm" color="gray.600">
                        Get notified of suspicious account activity
                      </Text>
                    </VStack>
                  </HStack>
                  <Switch
                    colorScheme="green"
                    isChecked={settings.securityAlerts}
                    onChange={() => handleSettingChange('securityAlerts')}
                  />
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaBell} color="blue.500" />
                <Heading size="md">Notification Preferences</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Email Notifications */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Email Notifications</Text>
                    <Text fontSize="sm" color="gray.600">
                      General account notifications
                    </Text>
                  </VStack>
                  <Switch
                    colorScheme="blue"
                    isChecked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                  />
                </HStack>

                {/* SMS Notifications */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">SMS Notifications</Text>
                    <Text fontSize="sm" color="gray.600">
                      Important updates via SMS
                    </Text>
                  </VStack>
                  <Switch
                    colorScheme="blue"
                    isChecked={settings.smsNotifications}
                    onChange={() => handleSettingChange('smsNotifications')}
                  />
                </HStack>

                {/* Push Notifications */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Push Notifications</Text>
                    <Text fontSize="sm" color="gray.600">
                      Browser push notifications
                    </Text>
                  </VStack>
                  <Switch
                    colorScheme="blue"
                    isChecked={settings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                  />
                </HStack>

                {/* Marketing Emails */}
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Marketing Emails</Text>
                    <Text fontSize="sm" color="gray.600">
                      Updates and promotions
                    </Text>
                  </VStack>
                  <Switch
                    colorScheme="blue"
                    isChecked={settings.marketingEmails}
                    onChange={() => handleSettingChange('marketingEmails')}
                  />
                </HStack>

                {/* Appointment Reminders */}
                <HStack justify="space-between" p={4} bg="blue.50" borderRadius="lg" gridColumn={{ md: "1 / -1" }}>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Appointment Reminders</Text>
                    <Text fontSize="sm" color="gray.600">
                      Reminders for upcoming appointments and health checkups
                    </Text>
                  </VStack>
                  <Switch
                    colorScheme="blue"
                    isChecked={settings.appointmentReminders}
                    onChange={() => handleSettingChange('appointmentReminders')}
                  />
                </HStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={FaDownload} color="purple.500" />
                <Heading size="md">Data & Privacy</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Download Your Data</Text>
                    <Text fontSize="sm" color="gray.600">
                      Download a copy of all your data stored with us
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<Icon as={FaDownload} />}
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                    onClick={handleDownloadData}
                    isLoading={isLoading}
                  >
                    Download
                  </Button>
                </HStack>

                <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600">Account Activity</Text>
                    <Text fontSize="sm" color="gray.600">
                      View your recent account activity and login history
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<Icon as={FaHistory} />}
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                  >
                    View Activity
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Danger Zone */}
          <Card borderColor="red.200" borderWidth="2px">
            <CardHeader>
              <HStack>
                <Icon as={FaTrash} color="red.500" />
                <Heading size="md" color="red.600">Danger Zone</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Permanent Action!</AlertTitle>
                  <AlertDescription>
                    Once you delete your account, all your data will be permanently removed and cannot be recovered.
                  </AlertDescription>
                </Box>
              </Alert>
              
              <HStack justify="space-between" p={4} bg="red.50" borderRadius="lg" borderColor="red.200" borderWidth="1px">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="600" color="red.700">Delete Account</Text>
                  <Text fontSize="sm" color="red.600">
                    Permanently delete your account and all associated data
                  </Text>
                </VStack>
                <Button
                  leftIcon={<Icon as={FaTrash} />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={onDeleteOpen}
                >
                  Delete Account
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Password Change Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* Current Password */}
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      icon={<Icon as={showCurrentPassword ? FaEyeSlash : FaEye} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* New Password */}
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      icon={<Icon as={showNewPassword ? FaEyeSlash : FaEye} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Confirm Password */}
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      icon={<Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onPasswordClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handlePasswordChange}
              isLoading={isLoading}
              loadingText="Changing..."
            >
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.600">Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>This action cannot be undone!</AlertTitle>
                <AlertDescription>
                  All your data, appointments, and health records will be permanently deleted.
                </AlertDescription>
              </Box>
            </Alert>
            <Text>
              Are you sure you want to permanently delete your account? Type <strong>"DELETE"</strong> below to confirm.
            </Text>
            <Input
              mt={4}
              placeholder="Type DELETE to confirm"
              // Add confirmation input handling here
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteAccount}
              isLoading={isLoading}
              loadingText="Deleting..."
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Settings;