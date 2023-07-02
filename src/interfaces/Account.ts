import Item from "./Item";
import Payment from "./Payment";

export default interface Account {
    id: string,
    user_id: string,
    owner: string,
    items: Item[],
    payments: Payment[],
    paid_amount: number,
    account_total: number,
    created_at:string,
    updated_at?:string,
}