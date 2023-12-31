use crate::db::models::Log::Log;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, types::Null, Result};
use uuid::Uuid;

#[derive(Debug)]
pub struct Payment {
    pub id: String,
    pub amount: f64,
    pub account_id: String,
    pub payment_type: i32,
    pub created_at: String,
    pub updated_at: Option<String>,
}

use serde::{ser::SerializeMap, Serialize, Serializer};

use crate::date_now;
impl Serialize for Payment {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut payment_map = serializer.serialize_map(Some(3))?;
        payment_map.serialize_entry("id", &self.id)?;
        payment_map.serialize_entry("amount", &self.amount)?;
        payment_map.serialize_entry("account_id", &self.account_id)?;
        payment_map.serialize_entry("type", &self.payment_type)?;
        payment_map.serialize_entry("created_at", &self.created_at)?;
        payment_map.serialize_entry("updated_at", &self.updated_at)?;
        payment_map.end()
    }
}

impl Payment {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        amount: f64,
        account_id: String,
        payment_type: i32,
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

        let date = date_now();

        // Inserir o pagamento na tabela payments
        conn.execute(
            "INSERT INTO payments (id, amount, account_id, payment_type, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![uuid, amount, account_id, payment_type, date, Null],
        )?;

        // Criar log
        let _ = Log::create_one(
            &conn,
            uuid.clone(),
            String::from("CREATE"),
            String::from("Create payment."),
            format!(
                "Created payment with id: {}, amount: {}, account_id: {}, payment_type: {}",
                uuid, amount, account_id, payment_type
            ),
        )?;

        Ok(uuid)
    }

    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
        account_id: String,
    ) -> Result<Vec<Payment>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM payments WHERE account_id = ?1")?;
        let rows = stmt.query_map(params![account_id], |row| {
            Ok(Payment {
                id: row.get(0)?,
                amount: row.get(1)?,
                account_id: row.get(2)?,
                payment_type: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?;

        let mut payments = Vec::new();
        for payment_iter in rows {
            let p = payment_iter?;
            payments.push(p);
        }
        Ok(payments)
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

        // Criar log
        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("UPDATE"),
            String::from("Update payment amount."),
            format!("Updated payment amount with id: {} to: {}", id, amount),
        )?;

        Ok(())
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM payments WHERE id = ?1", params![id])?;

        // Criar log
        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("DELETE"),
            String::from("Delete payment."),
            format!("Deleted payment with id: {}", id),
        )?;

        Ok(())
    }
}
