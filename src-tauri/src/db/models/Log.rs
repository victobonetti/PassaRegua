use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, Result};
use uuid::Uuid;

// Estrutura para o usuário
#[derive(Debug)]
pub struct Log {
    pub id: String,
    pub target_id: String,
    pub operation_type: String,
    pub action: String,
    pub description: String,
    pub created_at: String,
}

use serde::{ser::SerializeMap, Serialize, Serializer};

use crate::date_now;
impl Serialize for Log {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut log_map = serializer.serialize_map(Some(5))?;
        log_map.serialize_entry("id", &self.id)?;
        log_map.serialize_entry("target_id", &self.target_id)?;
        log_map.serialize_entry("operation_type", &self.operation_type)?;
        log_map.serialize_entry("action", &self.action)?;
        log_map.serialize_entry("description", &self.description)?;
        log_map.serialize_entry("created_at", &self.created_at)?;
        log_map.end()
    }
}

impl Log {
    pub fn create_one(
        conn: &PooledConnection<SqliteConnectionManager>,
        target_id: String,
        operation_type: String,
        action: String,
        description: String,
    ) -> Result<String, rusqlite::Error> {
        let uuid = Uuid::new_v4().to_string();
        let date = date_now();
        conn.execute(
            "INSERT INTO logs (id, target_id,  operation_type, action, description, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![uuid, target_id, operation_type, action, description, date],
        )?;
        Ok(uuid)
    }

    pub fn find_all(
        conn: &PooledConnection<SqliteConnectionManager>,
    ) -> Result<Vec<Log>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM logs")?;
        let rows = stmt.query_map(params![], |row| {
            Ok(Log {
                id: row.get(0)?,
                target_id: row.get(1)?,
                operation_type: row.get(2)?,
                action: row.get(3)?,
                description: row.get(4)?,
                created_at: row.get(5)?,
            })
        })?;
        let logs: Result<Vec<_>, rusqlite::Error> = rows.collect();
        logs
    }
}
