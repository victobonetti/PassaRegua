export default interface Payment {
    id: string,
    amount: number | string,
    account_id: string,
    type: number | string,
    created_at:string,
    updated_at?:string,
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