use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, types::Null, Result};
use uuid::Uuid;

// Estrutura para o produto
#[allow(dead_code)]
#[derive(Debug)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub price: f64,
    pub created_at: String,
    pub updated_at: Option<String>,
}

use serde::{ser::SerializeMap, Serialize, Serializer};

use crate::date_now;
impl Serialize for Product {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut product_map = serializer.serialize_map(Some(3))?;
        product_map.serialize_entry("id", &self.id)?;
        product_map.serialize_entry("name", &self.name)?;
        product_map.serialize_entry("price", &self.price)?;
        product_map.serialize_entry("created_at", &self.created_at)?;
        product_map.serialize_entry("updated_at", &self.updated_at)?;
        product_map.end()
    }
}

impl Product {
    #[allow(dead_code)]
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        name: &str,
        price: f64,
    ) -> Result<String, rusqlite::Error> {
        let uuid = Uuid::new_v4().to_string();

        let date = date_now();

        conn.execute(
            "INSERT INTO products (id, name, price, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![uuid, name, price, date, Null],
        )?;

        Ok(uuid)
    }

    #[allow(dead_code)]
    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
    ) -> Result<Vec<Product>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM products")?;
        let product_iter = stmt.query_map(params![], |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                price: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })?;

        let mut products = Vec::new();
        for product_result in product_iter {
            let product = product_result?;
            products.push(product);
        }

        println!("Products found: {:?}", products);
        Ok(products)
    }

    #[allow(dead_code)]
    pub fn find_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<Option<Product>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM products WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            let product = Product {
                id: row.get(0)?,
                name: row.get(1)?,
                price: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            };
            Ok(Some(product))
        } else {
            Ok(None)
        }
    }

    #[allow(dead_code)]
    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM products WHERE id = ?1", params![id])?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn edit_price(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        new_price: f64,
    ) -> Result<(), rusqlite::Error> {

        println!("price is: {}", new_price);

        let date = date_now();

        conn.execute(
            "UPDATE products SET price = ?1, updated_at = ?2 WHERE id = ?3",
            params![new_price, date, id],
        )?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn edit_name(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        new_name: &str,
    ) -> Result<(), rusqlite::Error> {

        let date = date_now();

        conn.execute(
            "UPDATE products SET name = ?1, updated_at = ?2 WHERE id = ?3",
            params![new_name, date, id],
        )?;
        Ok(())
    }
}
