use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
use uuid::Uuid;

// Estrutura para o usuário
#[derive(Debug)]
#[allow(dead_code)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password: String,
    pub account_id: Option<String>,
}

impl User {
    #[allow(dead_code)]
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        username: String,
        password: String,
    ) -> Result<String, rusqlite::Error> {

        let uuid = Uuid::new_v4().to_string();

        conn.execute(
            "INSERT INTO users (id, username, password) VALUES (?1, ?2, ?3)",
            params![uuid, username, password],
        )?;

        Ok(uuid)
    }

    #[allow(dead_code)]
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
        println!("users found: {:?}", users);
        users
    }

    #[allow(dead_code)]
    pub fn find_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
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

    #[allow(dead_code)]
    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM users WHERE id = ?1", params![id])?;
        Ok(())
    }

    
}
