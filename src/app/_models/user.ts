export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    initialCash: number;
    availableCash: number;
    token?: string;
}