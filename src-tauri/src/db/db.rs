// use r2d2::Error;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use rusqlite::Result;

pub fn init_database(
) -> Result<PooledConnection<SqliteConnectionManager>, Box<dyn std::error::Error>> {
    let manager = SqliteConnectionManager::file("database.db");
    let pool = r2d2::Pool::builder().build(manager)?;

    // Obter uma conexão do pool
    let db = pool.get()?;

    build_database(&db)?;

    Ok(db)
}

fn build_database(conn: &PooledConnection<SqliteConnectionManager>) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                account_id INTEGER,
                FOREIGN KEY (account_id) REFERENCES accounts(id)
            )",
        params![],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL
            )",
        params![],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )",
        params![],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                price REAL NOT NULL,
                notes TEXT,
                account_id INTEGER NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (account_id) REFERENCES accounts(id)
            )",
        params![],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
                amount INTEGER NOT NULL,
                account_id INTEGER NOT NULL,
                FOREIGN KEY (account_id) REFERENCES accounts(id)
            )",
        params![],
    )?;

    println!("Build Ok.");

    Ok(())
}
