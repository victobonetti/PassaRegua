use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
// use uuid::Uuid;

// Estrutura para o produto
#[allow(dead_code)]
#[derive(Debug)]
pub struct Product {
    id: i32,
    name: String,
    price: f64,
}

impl Product {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        name: &str,
        price: f64,
    ) -> Result<(), rusqlite::Error> {

        // let uuid = Uuid::new_v4();

        conn.execute(
            "INSERT INTO products (name, price) VALUES (?1, ?2)",
            params![name, price],
        )?;

        Ok(())
    }

    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
    ) -> Result<Vec<Product>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM products")?;
        let product_iter = stmt.query_map(params![], |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                price: row.get(2)?,
            })
        })?;

        let products: Result<Vec<_>, rusqlite::Error> = product_iter.collect();
        println!("Products found: {:?}", products);
        products
    }
}
