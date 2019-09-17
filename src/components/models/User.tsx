export default interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  website: string;
  phone: string;
  company: object;
  address: object;
  [key: string]: string | number | object;
}