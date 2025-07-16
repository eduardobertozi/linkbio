import { faker } from '@faker-js/faker';
import { LinkBioData, Link, UserProfile } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generator
const generateMockData = (): LinkBioData => {
  const profile: UserProfile = {
    id: faker.string.uuid(),
    username: 'usuario',
    displayName: 'Criador de conteúdo',
    bio: 'Criador de conteúdo',
    avatar: faker.image.avatarGitHub(),
    backgroundColor: '#1a1a1a',
    buttonColor: '#00d632'
  };

  const links: Link[] = [
    {
      id: faker.string.uuid(),
      title: 'Instagram',
      url: 'https://instagram.com/usuario',
      isActive: true,
      icon: 'instagram',
      order: 1
    },
    {
      id: faker.string.uuid(),
      title: 'YouTube',
      url: 'https://youtube.com/channel/usuario',
      isActive: true,
      icon: 'youtube',
      order: 2
    },
    {
      id: faker.string.uuid(),
      title: 'Website',
      url: 'https://meusite.com',
      isActive: false,
      icon: 'globe',
      order: 3
    }
  ];

  return { profile, links };
};

// Simulated API functions
export const linkbioService = {
  async getProfile(): Promise<UserProfile> {
    await delay(800);
    return generateMockData().profile;
  },

  async getLinks(): Promise<Link[]> {
    await delay(600);
    return generateMockData().links;
  },

  async updateLink(linkId: string, updates: Partial<Link>): Promise<Link> {
    await delay(500);
    const links = generateMockData().links;
    const link = links.find(l => l.id === linkId);
    if (!link) throw new Error('Link not found');
    return { ...link, ...updates };
  },

  async createLink(linkData: Omit<Link, 'id'>): Promise<Link> {
    await delay(700);
    return {
      id: faker.string.uuid(),
      ...linkData
    };
  },

  async deleteLink(linkId: string): Promise<void> {
    await delay(400);
    // Simulate deletion
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(600);
    const profile = generateMockData().profile;
    return { ...profile, ...updates };
  }
};