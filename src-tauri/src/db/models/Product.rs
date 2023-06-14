use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
use uuid::Uuid;

// Estrutura para o produto
#[allow(dead_code)]
#[derive(Debug)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub price: f64,
}

impl Product {
    #[allow(dead_code)]
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        name: &str,
        price: f64,
    ) -> Result<String, rusqlite::Error> {
        let uuid = Uuid::new_v4().to_string();

        conn.execute(
            "INSERT INTO products (id, name, price) VALUES (?1, ?2, ?3)",
            params![uuid, name, price],
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
        conn.execute(
            "UPDATE products SET price = ?1 WHERE id = ?2",
            params![new_price, id],
        )?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn edit_name(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        new_name: &str,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE products SET name = ?1 WHERE id = ?2",
            params![new_name, id],
        )?;
        Ok(())
    }
}
