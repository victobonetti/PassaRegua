use crate::db::models::Log::Log;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::types::Null;
use rusqlite::{params, Result};
use uuid::Uuid;

// Estrutura para o usuário
#[derive(Debug)]
pub struct User {
    pub id: String,
    pub username: String,
    pub cpf: String,
    pub phone: String,
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
        user_map.serialize_entry("cpf", &self.cpf)?;
        user_map.serialize_entry("phone", &self.phone)?;
        user_map.serialize_entry("account_id", &self.account_id)?;
        user_map.serialize_entry("created_at", &self.created_at)?;
        user_map.serialize_entry("updated_at", &self.updated_at)?;
        user_map.end()
    }
}

impl User {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        username: String,
        cpf: String,
        phone: String,
    ) -> Result<String, rusqlite::Error> {
        let uuid = Uuid::new_v4().to_string();
        let date = date_now();
        conn.execute(
            "INSERT INTO users (id, username, cpf, phone, account_id, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![uuid, username, cpf, phone, Null, date, Null],
        )?;

        // Criar log
        let _ = Log::create_one(
            &conn,
            String::from(&uuid),
            String::from("CREATE"), //must be CREATE, UPDATE OR DELETE.
            String::from("Create user."),
            format!(
                "Created user with name: {}, cpf: {}, phone: {}",
                username, cpf, phone
            ),
        );

        Ok(uuid)
    }

    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
    ) -> Result<Vec<User>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM users")?;
        let rows = stmt.query_map(params![], |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                cpf: row.get(2)?,
                phone: row.get(3)?,
                account_id: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;
        let users: Result<Vec<_>, rusqlite::Error> = rows.collect();
        users
    }

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
                cpf: row.get(2)?,
                phone: row.get(3)?,
                account_id: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            };
            println!("User found: {:?}", user);
            Ok(Some(user))
        } else {
            Ok(None)
        }
    }

    pub fn delete_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
    ) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM users WHERE id = ?1", params![id])?;

        let _ = Log::create_one(
            &conn,
            String::from(&id),
            String::from("DELETE"), // Must be CREATE, UPDATE, or DELETE.
            String::from("Delete user."),
            format!("Deleted user with id: {}", id),
        )?;

        Ok(())
    }

    pub fn edit_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        id: String,
        username: String,
        cpf: String,
        phone: String,
    ) -> Result<()> {
        let date = date_now();
        conn.execute(
            "UPDATE users SET username = ?, cpf = ?, phone = ?, updated_at = ? WHERE id = ?",
            params![username, cpf, phone, date, id],
        )?;
        let resultados = User::find_one(conn, id.to_owned())?;
        if let Some(resultados) = resultados {
            assert_eq!(resultados.username, username);
            assert_eq!(resultados.cpf, cpf);
            assert_eq!(resultados.phone, phone);
        }

        let _ = Log::create_one(
            &conn,
            String::from(&id),
            String::from("UPDATE"), // Must be CREATE, UPDATE, or DELETE.
            String::from("Edit user."),
            format!(
                "Edited user with id: {}. New name: {}, new cpf: {}, new phone: {}",
                id, username, cpf, phone
            ),
        )?;

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
