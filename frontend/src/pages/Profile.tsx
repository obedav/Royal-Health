// src/pages/Profile.tsx
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
  Select,
  Textarea,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SimpleGrid,
  Icon,
  useToast,
  Switch,
  FormHelperText,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaCamera,
  FaSave,
  FaEdit,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  state: string;
  city: string;
  avatar: string;
  preferredLanguage: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    state: '',
    city: '',
    avatar: '',
    preferredLanguage: 'English',
    isEmailVerified: false,
    isPhoneVerified: false,
  });

  useEffect(() => {
    // Load user profile data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        nationalId: user.nationalId || '',
        state: user.state || '',
        city: user.city || '',
        avatar: user.avatar || '',
        preferredLanguage: user.preferredLanguage || 'English',
        isEmailVerified: user.isEmailVerified || false,
        isPhoneVerified: user.isPhoneVerified || false,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a valid image file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      handleInputChange('avatar', result);
    };
    reader.readAsDataURL(file);

    toast({
      title: 'Photo Selected',
      description: 'Photo has been selected. Save your profile to upload.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Here you would call your API to update the profile
      // If there's a new avatar, upload it first
      // const updatedProfile = { ...profileData };
      // if (avatarPreview) {
      //   const avatarUrl = await uploadAvatar(avatarPreview);
      //   updatedProfile.avatar = avatarUrl;
      // }
      // await updateUserProfile(updatedProfile);
      
      // Clear preview after successful save
      setAvatarPreview('');
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  return (
    <Box bg="gray.50" minH="100vh" pt="100px" pb={8}>
      <Container maxW="4xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Profile Settings
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Manage your personal information and preferences
            </Text>
          </Box>

          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <Heading size="md">Profile Picture</Heading>
            </CardHeader>
            <CardBody>
              <HStack spacing={6}>
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    name={`${profileData.firstName} ${profileData.lastName}`}
                    src={avatarPreview || profileData.avatar}
                    border="4px solid"
                    borderColor="brand.500"
                    transition="all 0.2s ease-in-out"
                    _hover={{ transform: 'scale(1.02)' }}
                  />
                  <Button
                    position="absolute"
                    bottom="0"
                    right="0"
                    size="sm"
                    colorScheme="brand"
                    borderRadius="full"
                    p={2}
                    minW="auto"
                    onClick={handleCameraClick}
                    _hover={{
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(194, 24, 91, 0.25)',
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    <Icon as={FaCamera} />
                  </Button>
                  {avatarPreview && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      left="50%"
                      transform="translateX(-50%)"
                      colorScheme="orange"
                      variant="solid"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      Preview
                    </Badge>
                  )}
                </Box>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="600" fontSize="lg">
                    {profileData.firstName} {profileData.lastName}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="brand" variant="subtle">
                      {user?.role || 'Client'}
                    </Badge>
                    {profileData.isEmailVerified && (
                      <Badge colorScheme="green" variant="subtle">
                        Email Verified
                      </Badge>
                    )}
                    {profileData.isPhoneVerified && (
                      <Badge colorScheme="blue" variant="subtle">
                        Phone Verified
                      </Badge>
                    )}
                  </HStack>
                  <VStack spacing={2} align="start">
                    <Button
                      leftIcon={<Icon as={FaCamera} />}
                      variant="outline"
                      size="sm"
                      colorScheme="brand"
                      onClick={handleCameraClick}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(194, 24, 91, 0.15)',
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Change Photo
                    </Button>
                    {avatarPreview && (
                      <Text fontSize="xs" color="orange.600" fontWeight="500">
                        Save profile to upload new photo
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </HStack>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </CardBody>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Personal Information</Heading>
                <Button
                  leftIcon={<Icon as={isEditing ? FaSave : FaEdit} />}
                  colorScheme={isEditing ? 'green' : 'brand'}
                  variant={isEditing ? 'solid' : 'outline'}
                  size="sm"
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* First Name */}
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                  </InputGroup>
                </FormControl>

                {/* Last Name */}
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                  </InputGroup>
                </FormControl>

                {/* Email */}
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaEnvelope} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                  </InputGroup>
                  {!profileData.isEmailVerified && (
                    <FormHelperText color="orange.500">
                      Email not verified. <Button variant="link" size="xs" colorScheme="orange">Verify now</Button>
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Phone */}
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                  </InputGroup>
                  {!profileData.isPhoneVerified && (
                    <FormHelperText color="orange.500">
                      Phone not verified. <Button variant="link" size="xs" colorScheme="orange">Verify now</Button>
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Date of Birth */}
                <FormControl>
                  <FormLabel>Date of Birth</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaCalendarAlt} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                  </InputGroup>
                </FormControl>

                {/* Gender */}
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={profileData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    isDisabled={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                {/* National ID */}
                <FormControl>
                  <FormLabel>National ID (NIN)</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaIdCard} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      value={profileData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                      placeholder="11-digit NIN"
                    />
                  </InputGroup>
                </FormControl>

                {/* Preferred Language */}
                <FormControl>
                  <FormLabel>Preferred Language</FormLabel>
                  <Select
                    value={profileData.preferredLanguage}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    isDisabled={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  >
                    <option value="English">English</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* Location Information */}
              <Heading size="sm" mb={4} color="gray.700">Location Information</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* State */}
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaMapMarkerAlt} color="gray.400" />
                    </InputLeftElement>
                    <Select
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      isDisabled={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                      placeholder="Select State"
                    >
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </InputGroup>
                </FormControl>

                {/* City */}
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaMapMarkerAlt} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      isReadOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                      placeholder="Enter city"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <HStack spacing={4} justify="flex-end">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                leftIcon={<Icon as={FaSave} />}
                onClick={handleSaveProfile}
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </HStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;