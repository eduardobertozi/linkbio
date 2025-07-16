export interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon: string;
  order: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  backgroundColor: string;
  buttonColor: string;
}

export interface LinkBioData {
  profile: UserProfile;
  links: Link[];
}