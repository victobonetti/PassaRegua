export default interface Item {
    id: String,
    name: String,
    quantity: number,
    price: number,
    notes: String | undefined,
    accountId: String,
    productId: String,
    createdAt:String,
    updatedAt?:String,
}