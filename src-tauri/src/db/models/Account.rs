// Estrutura para a conta de fiado
use crate::db::models::Item::Item;
use crate::db::models::Payment::Payment;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};

#[derive(Debug)]
pub struct Account {
    id: String,
    user_id: i32,
    items: Option<Vec<Item>>,
    payments: Option<Vec<Payment>>,
    paid_amount: f64,
    account_total: f64,
}

impl Account {
    fn get_payments(
        conn: &PooledConnection<SqliteConnectionManager>,
        account_id: i32,
    ) -> Result<Vec<Payment>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM payments WHERE account_id = ?1")?;
        let rows = stmt.query_map(params![account_id], |row| {
            Ok(Payment {
                id: row.get(0)?,
                amount: row.get(1)?,
                account_id: row.get(2)?,
            })
        })?;

        let payments: Result<Vec<_>, rusqlite::Error> = rows.collect();
        println!("Payments found: {:?}", payments);
        payments
    }

    fn get_items(
        conn: &PooledConnection<SqliteConnectionManager>,
        account_id: i32,
    ) -> Result<Vec<Item>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM items WHERE account_id = ?1")?;
        let rows = stmt.query_map(params![account_id], |row| {
            Ok(Item {
                id: row.get(0)?,
                name: row.get(1)?,
                quantity: row.get(2)?,
                price: row.get(3)?,
                notes: row.get(4)?,
                account_id: row.get(5)?,
                product_id: row.get(6)?,
            })
        })?;

        let items: Result<Vec<_>, rusqlite::Error> = rows.collect();
        println!("Items found: {:?}", items);
        items
    }

    pub fn find_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        account_id: i32,
    ) -> Result<Account, rusqlite::Error> {
        let items = Account::get_items(conn, account_id)?;
        let payments = Account::get_payments(conn, account_id)?;

        let paid_amount = payments.iter().map(|payment| payment.amount as f64).sum();
        let account_total = items
            .iter()
            .map(|item| item.price * item.quantity as f64)
            .sum();

        Ok(Account {
            id: account_id,
            user_id: 0, // Insira o valor correto aqui
            items: Some(items),
            payments: Some(payments),
            paid_amount,
            account_total,
        })
    }

    pub fn delete_account(
        conn: &PooledConnection<SqliteConnectionManager>,
        account_id: i32,
    ) -> Result<(), rusqlite::Error> {
        // Excluir os registros da tabela payments relacionados à conta
        conn.execute(
            "DELETE FROM payments WHERE account_id = ?1",
            params![account_id],
        )?;

        // Excluir os registros da tabela items relacionados à conta
        conn.execute(
            "DELETE FROM items WHERE account_id = ?1",
            params![account_id],
        )?;

        // Verificar se algum usuário possui a conta
        let mut stmt = conn.prepare("SELECT id FROM users WHERE account_id = ?1 LIMIT 1")?;
        let mut rows = stmt.query(params![account_id])?;
        if let Some(row) = rows.next()? {
            let user_id: i32 = row.get(0)?;
            // Atualizar o usuário, removendo o valor da coluna account_id
            conn.execute(
                "UPDATE users SET account_id = NULL WHERE id = ?1",
                params![user_id],
            )?;
        }

        // Excluir a conta da tabela accounts
        conn.execute("DELETE FROM accounts WHERE id = ?1", params![account_id])?;

        Ok(())
    }

    fn find_one_by_user(
        conn: &PooledConnection<SqliteConnectionManager>,
        user_id: i32,
    ) -> Result<Option<Account>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM accounts WHERE user_id = ?1 LIMIT 1")?;
        let mut rows = stmt.query(params![user_id])?;

        if let Some(row) = rows.next()? {
            let account = Account {
                id: row.get(0)?,
                user_id: row.get(1)?,
                items: None,
                payments: None,
                paid_amount: 0.0,
                account_total: 0.0,
            };
            Ok(Some(account))
        } else {
            Ok(None)
        }
    }

    pub fn create_account(
        conn: &PooledConnection<SqliteConnectionManager>,
        user_id: i32,
    ) -> Result<i32, rusqlite::Error> {
        // Verificar se o usuário já possui uma conta cadastrada
        let existing_account = Account::find_one_by_user(conn, user_id)?;
        if existing_account.is_some() {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        // Criar a conta
        conn.execute(
            "INSERT INTO accounts (user_id) VALUES (?1)",
            params![user_id],
        )?;

        // Obter o ID da conta recém-criada
        let account_id = conn.last_insert_rowid() as i32;

        Ok(account_id)
    }
}
