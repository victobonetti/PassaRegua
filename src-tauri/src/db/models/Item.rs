use crate::db::models::Log::Log;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, types::Null};
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
    pub created_at: String,
    pub updated_at: Option<String>,
}

use serde::{ser::SerializeMap, Serialize, Serializer};

use crate::date_now;
impl Serialize for Item {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut item_map = serializer.serialize_map(Some(7))?;
        item_map.serialize_entry("id", &self.id)?;
        item_map.serialize_entry("name", &self.name)?;
        item_map.serialize_entry("quantity", &self.quantity)?;
        item_map.serialize_entry("price", &self.price)?;
        item_map.serialize_entry("notes", &self.notes)?;
        item_map.serialize_entry("account_id", &self.account_id)?;
        item_map.serialize_entry("product_id", &self.product_id)?;
        item_map.serialize_entry("created_at", &self.created_at)?;
        item_map.serialize_entry("updated_at", &self.updated_at)?;
        item_map.end()
    }
}

impl Item {
    pub fn create_item(
        conn: &PooledConnection<SqliteConnectionManager>,
        name: String,
        quantity: i32,
        price: f64,
        account_id: String,
        product_id: String,
    ) -> Result<String, rusqlite::Error> {
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

        let date = date_now();

        // Inserir o item na tabela items
        conn.execute(
            "INSERT INTO items (id, name, quantity, price, account_id, product_id, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![uuid, name, quantity, price, account_id, product_id, date, Null],
        )?;

        let _ = Log::create_one(
            &conn,
            uuid.clone(),
            String::from("CREATE"),
            String::from("Create item."),
            format!("Created item with id: {}, name: {}, quantity: {}, price: {}, account_id: {}, product_id: {}", uuid, name, quantity, price, account_id, product_id),
        )?;

        Ok(uuid)
    }

    pub fn find_item(
        conn: &PooledConnection<SqliteConnectionManager>,
        item_id: String,
    ) -> Result<Option<Item>, rusqlite::Error> {
        let mut stmt = conn.prepare(" SELECT * FROM items WHERE id = ?1")?;
        let mut rows = stmt.query(params![item_id])?;

        if let Some(row) = rows.next()? {
            let item = Item {
                id: row.get(0)?,
                name: row.get(1)?,
                quantity: row.get(2)?,
                product_id: row.get(3)?,
                price: row.get(4)?,
                notes: row.get(5)?,
                account_id: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            };
            Ok(Some(item))
        } else {
            Ok(None)
        }
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

        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("UPDATE"),
            String::from("Edit item note."),
            format!("Edited note for item with id: {}, notes: {:?}", id, notes),
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

        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("UPDATE"),
            String::from("Edit item price."),
            format!("Edited price for item with id: {}, price: {}", id, price),
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

        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("UPDATE"),
            String::from("Edit item name."),
            format!("Edited name for item with id: {}, name: {}", id, name),
        )?;

        Ok(())
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM items WHERE id = ?1", params![id])?;

        let _ = Log::create_one(
            &conn,
            id.clone(),
            String::from("DELETE"),
            String::from("Delete item."),
            format!("Deleted item with id: {}", id),
        )?;

        Ok(())
    }
}
