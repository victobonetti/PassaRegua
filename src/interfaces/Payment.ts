export default interface Payment {
    id: string,
    amount: number,
    account_id: string,
    paymentType: string,
    created_at:String,
    updated_at?:String,
}