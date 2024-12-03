export interface User {
    id: string;
    clerkId: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'CONSULTANT' | 'CLIENT';
  }
  
  export interface Client {
    id: string;
    name: string;
    mspId: string;
    consultantId?: string;
  }
  
  export interface Consultant {
    id: string;
    name: string;
    email: string;
  }
  
  export interface MSP {
    id: string;
    name: string;
  }
  
  