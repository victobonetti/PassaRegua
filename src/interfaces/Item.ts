export default interface Item {
    id: String,
    name: String,
    quantity: number,
    price: number,
    notes: String | undefined,
    account_id: String,
    product_id: String,
    created_at:String,
    updated_at?:String,
}