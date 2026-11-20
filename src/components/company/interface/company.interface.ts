export interface Company {
  id: number;
  picture: string | undefined;
  name: string;
  domain: string | null;
  email: string;
  verified: boolean;
}
