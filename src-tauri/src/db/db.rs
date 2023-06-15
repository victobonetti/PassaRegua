use lazy_static::lazy_static;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use rusqlite::Result;
use std::sync::{Arc, RwLock};

lazy_static! {
    static ref POOL: RwLock<Option<Arc<r2d2::Pool<SqliteConnectionManager>>>> = RwLock::new(None);
}

pub fn init_database(
) -> Result<PooledConnection<SqliteConnectionManager>, Box<dyn std::error::Error>> {
    if let Some(pool) = POOL.read().unwrap().as_ref() {
        return Ok(pool.get()?);
    }

    let manager = SqliteConnectionManager::file("database.db");
    let pool = Arc::new(r2d2::Pool::builder().build(manager)?);

    build_database(&pool.get()?)?;

    *POOL.write().unwrap() = Some(pool.clone());

    Ok(pool.get()?)
}

pub fn build_database(conn: &PooledConnection<SqliteConnectionManager>) -> Result<()> {
    // Crie a tabela users
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            account_id TEXT 
        )",
        params![],
    )
    .unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL
            )",
        params![],
    )
    .unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )",
        params![],
    )
    .unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            amount REAL NOT NULL,
            account_id TEXT NOT NULL,
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        )",
        params![],
    )
    .unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                price REAL NOT NULL,
                notes TEXT,
                account_id TEXT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (account_id) REFERENCES accounts(id)
            )",
        params![],
    )
    .unwrap();

    Ok(())
}
