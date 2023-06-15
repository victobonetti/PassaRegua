use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use uuid::Uuid;

#[derive(Debug)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub quantity: i32,
    pub price: f64,
    pub notes: Option<String>,
    pub account_id: String,
    pub product_id: String,
}

impl Item {
    fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        name: String,
        quantity: i32,
        price: f64,
        account_id: String,
        product_id: String,
    ) -> Result<(), rusqlite::Error> {
        // Verificar se o ID do produto é válido
        let product_exists: bool = conn.query_row(
            "SELECT COUNT(*) FROM products WHERE id = ?1",
            params![product_id],
            |row| row.get(0),
        )?;

        if !product_exists {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

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

        // Inserir o item na tabela items
        conn.execute(
            "INSERT INTO items (id, name, quantity, price, account_id, product_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![uuid, name, quantity, price, account_id, product_id],
        )?;

        Ok(())
    }

    pub fn edit_note(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        notes: Option<String>,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE items SET notes = ?1 WHERE id = ?2",
            params![notes, id],
        )?;

        Ok(())
    }

    pub fn edit_price(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        price: f64,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE items SET price = ?1 WHERE id = ?2",
            params![price, id],
        )?;

        Ok(())
    }

    pub fn edit_name(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        name: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE items SET name = ?1 WHERE id = ?2",
            params![name, id],
        )?;

        Ok(())
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM items WHERE id = ?1", params![id])?;
        Ok(())
    }
}
