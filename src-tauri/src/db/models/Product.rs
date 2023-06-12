use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};

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
        id: i32,
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
        id: i32,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM products WHERE id = ?1", params![id])?;
        Ok(())
    }

    
}
