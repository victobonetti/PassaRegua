use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::types::Null;
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
    pub created_at: String,
    pub updated_at: Option<String>,
}

use serde::{ser::SerializeMap, Serialize, Serializer};

use crate::date_now;
impl Serialize for User {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut user_map = serializer.serialize_map(Some(4))?;
        user_map.serialize_entry("id", &self.id)?;
        user_map.serialize_entry("username", &self.username)?;
        user_map.serialize_entry("password", &self.password)?;
        user_map.serialize_entry("account_id", &self.account_id)?;
        user_map.serialize_entry("created_at", &self.created_at)?;
        user_map.serialize_entry("updated_at", &self.updated_at)?;
        user_map.end()
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
        let date = date_now();
        conn.execute(
            "INSERT INTO users (id, username, password, account_id, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![uuid, username, password, Null, date, Null],
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
                account_id: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?;
        let users: Result<Vec<_>, rusqlite::Error> = rows.collect();
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
                account_id: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            };
            println!("User found: {:?}", user);
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

    #[allow(dead_code)]
    pub fn edit_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        username: String,
        password: String,
    ) -> Result<()> {
        let date = date_now();
        conn.execute(
            "UPDATE users SET username = ?, password = ?, updated_at = ? WHERE id = ?",
            params![username, password, date, id],
        )?;
        let resultados = User::find_one(conn, id)?;
        if let Some(resultados) = resultados {
            assert_eq!(resultados.username, username);
            println!("{:?}", resultados);
            println!("{:?},{:?}", username, password);
        }
        Ok(())
    }

    pub fn get_username(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<Option<String>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT username FROM users WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            let username: String = row.get(0)?;
            println!("USERNAME: {}", username);
            Ok(Some(username))
        } else {
            Ok(None)
        }
    }
}
