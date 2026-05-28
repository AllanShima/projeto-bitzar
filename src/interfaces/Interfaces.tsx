export interface Message {
  role: 'user' | 'ai';
  content: string;
  createdAt?: Date;
}

export interface File {
  id?: string,
  name: string,
  description: string,
  fileAddress: string,
  fileSize: string,
  uploadedBy: User,
  createdAt?: string
}

export interface User {
  id?: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  messages?: Message[],
  teamLoggedIn?: Team | null,
  createdAt?: string
}

export interface TeamMember {
  status: 'admin' | 'participant',
  user?: User
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