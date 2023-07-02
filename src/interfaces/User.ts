export interface User {
    id: string,
    username: string,
    cpf: string,
    phone: string,
    account_id?: string,
    created_at:string,
    updated_at?:string,
}