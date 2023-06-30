export default interface Payment {
    id: string,
    amount: number,
    account_id: string,
    type: number,
    created_at:String,
    updated_at?:String,
}

export function getType(n:number){
    switch (n) {
        case 0 :
            return 'Dinheiro';
        case 1 :
            return 'Crédito';
        case 2 :
            return 'Débito';
        case 3:
            return 'PIX';
        case 4:
            return 'Vale Alimenação'
        default:
            return '???';
    }
}


    // Types:
    // 0 - Dinheiro;
    // 1 - Crédito;
    // 2 - Débito;
    // 3 - PIX;
    // 4 - Vale alimentação;