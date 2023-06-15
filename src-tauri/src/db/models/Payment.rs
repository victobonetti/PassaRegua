use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
use uuid::Uuid;
use serde::{Serialize, Serializer, ser::SerializeMap};

#[derive(Debug)]
pub struct Payment {
    pub id: String,
    pub amount: f64,
    pub account_id: String,
}

impl Serialize for Payment {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut payment_map = serializer.serialize_map(Some(3))?;
        payment_map.serialize_entry("id", &self.id)?;
        payment_map.serialize_entry("amount", &self.amount)?;
        payment_map.serialize_entry("account_id", &self.account_id)?;
        payment_map.end()
    }
}

impl Payment {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        amount: f64,
        account_id: String,
    ) -> Result<String, rusqlite::Error> {
        // Verificar se o ID da conta é válido
        let account_exists: bool = conn.query_row(
            "SELECT COUNT(*) FROM accounts WHERE id = ?1",
            params![account_id],
            |row| row.get(0),
        )?;

        if !account_exists {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        let uuid = Uuid::new_v4().to_string();

        // Inserir o pagamento na tabela payments
        conn.execute(
            "INSERT INTO payments (id, amount, account_id) VALUES (?1, ?2, ?3)",
            params![uuid, amount, account_id],
        )?;

        Ok(uuid)
    }

    pub fn find_one(conn: &PooledConnection<SqliteConnectionManager>, id: String) -> Result<Option<Payment>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM payments WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            let payment = Payment {
                id: row.get(0)?,
                amount: row.get(1)?,
                account_id: row.get(2)?,
            };
            Ok(Some(payment))
        } else {
            Ok(None)
        }
    }

    pub fn update_amount(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        amount: f64,
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
