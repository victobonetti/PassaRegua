use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
use uuid::Uuid;
use rusqlite::types::Null;

// Estrutura para o usuário
#[derive(Debug)]
#[allow(dead_code)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password: String,
    pub account_id: Option<String>,
}

use serde::{Serialize, Serializer, ser::SerializeMap};
impl Serialize for User {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut payment_map = serializer.serialize_map(Some(4))?;
        payment_map.serialize_entry("id", &self.id)?;
        payment_map.serialize_entry("username", &self.username)?;
        payment_map.serialize_entry("password", &self.password)?;
        payment_map.serialize_entry("account_id", &self.account_id)?;
        payment_map.end()
    }
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
            "INSERT INTO users (id, username, password, account_id) VALUES (?1, ?2, ?3, ?4)",
            params![uuid, username, password, Null],
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
