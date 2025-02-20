export interface User {
    userid: number,
    name: string;
    email: string;
    password: string;
    phoneNo: string;
    role: 'admin' | 'user';
  }