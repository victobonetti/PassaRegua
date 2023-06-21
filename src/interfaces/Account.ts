import Item from "./Item";
import Payment from "./Payment";

export default interface Account {
    id: String,
    user_id: String,
    owner: String,
    items: Item[],
    payments: Payment[],
    paid_amount: number,
    account_total: number,
    created_at:String,
    updated_at?:String,
}