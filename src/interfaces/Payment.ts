export default interface Payment {
    id: string,
    amount: number,
    account_id: string,
    type: number,
    created_at:String,
    updated_at?:String,
}


    // Types:
    // 0 - Dinheiro;
    // 1 - Crédito;
    // 2 - Débito;
    // 3 - PIX;
    // 4 - Vale alimentação;