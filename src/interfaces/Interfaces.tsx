export interface Message {
  role: 'user' | 'ai';
  content: string;
  createdAt?: Date;
}

export interface File {
  id?: string,
  name: string,
  description: string,
  fileAddress?: string,
  fileSize?: number,
  uploadedBy: User,
  createdAt?: Date
}

export interface User {
  id?: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  teamLoggedIn?: Team | null,
  createdAt?: string
}

export interface TeamMember {
  status: 'admin' | 'participant' | 'owner',
  user?: User,
  messages?: Message[]
}

export interface Team {
  id?: string,
  title: string,
  description: string,
  code: string,
  ownerId?: string,
  members?: TeamMember[],
  files?: File[],
  createdAt?: Date,
}