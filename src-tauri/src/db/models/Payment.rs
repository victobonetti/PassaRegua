use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};

#[derive(Debug)]
pub struct Payment {
    pub id: String,
    pub amount: i32,
    pub account_id: i32,
}

impl Payment {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        amount: i32,
        account_id: i32,
    ) -> Result<(), rusqlite::Error> {
        // Verificar se o ID da conta é válido
        let account_exists: bool = conn.query_row(
            "SELECT COUNT(*) FROM accounts WHERE id = ?1",
            params![account_id],
            |row| row.get(0),
        )?;

        if !account_exists {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        // Inserir o pagamento na tabela payments
        conn.execute(
            "INSERT INTO payments (amount, account_id) VALUES (?1, ?2)",
            params![amount, account_id],
        )?;

        Ok(())
    }

    pub fn update_amount(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        amount: i32,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE payments SET amount = ?1 WHERE id = ?2",
            params![amount, id],
        )?;

        Ok(())
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM payments WHERE id = ?1", params![id])?;
        Ok(())
    }
}
