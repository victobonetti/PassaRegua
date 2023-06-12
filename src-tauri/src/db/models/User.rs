use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};

use crate::db::models::Account::Account;

// Estrutura para o usuário
#[derive(Debug)]
pub struct User {
    id: i32,
    username: String,
    password: String,
    account_id: Option<String>,
}

impl User {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        username: String,
        password: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute(
            "INSERT INTO products (name, price) VALUES (?1, ?2)",
            params![username, password],
        )?;

        Ok(())
    }

    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
    ) -> Result<Vec<User>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM users")?;
        let rows = stmt.query_map(params![], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                password: row.get(2)?,
                account_id: None,
            })
        })?;

        let users: Result<Vec<_>, rusqlite::Error> = rows.collect();
        println!("Users found: {:?}", users);
        users
    }

    pub fn find_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: i32,
    ) -> Result<Option<User>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM users WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            let user = User {
                id: row.get(0)?,
                username: row.get(1)?,
                password: row.get(2)?,
                account_id: None,
            };
            Ok(Some(user))
        } else {
            Ok(None)
        }
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: i32,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE * FROM users WHERE id = ?1", params![id])?;
        Ok(())
    }
}
