export default interface Item {
    id: string,
    name: string,
    quantity: number,
    price: number,
    notes: string | undefined,
    account_id: string,
    product_id: string,
    created_at:string,
    updated_at?:string,
}