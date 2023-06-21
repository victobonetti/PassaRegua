export default interface Payment {
    id: string,
    amount: number,
    accountId: string,
    createdAt:String,
    updatedAt?:String,
}