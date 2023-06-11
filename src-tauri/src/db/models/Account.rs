use uuid::Uuid;

// Estrutura para a conta de fiado
#[derive(Debug)]
pub struct Account {
    id: i32,
    user_id: i32,
    product_id: i32,
    amount: i32,
}