use rusqlite::{Result};
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Error;

pub fn init_database() -> Result<PooledConnection<SqliteConnectionManager>, Error> {
    let manager = SqliteConnectionManager::file("database.db");
    let pool = r2d2::Pool::builder()
        .build(manager)?;

    // Obter uma conexão do pool
    let db = pool.get()?;

    Ok(db)
}
