export interface User {
    name: string;
    email: string;
    password: string;
    phoneNo: string;
    role: 'admin' | 'user';
  }