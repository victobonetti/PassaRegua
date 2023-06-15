// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod db {
    pub mod db;
    pub mod models {
        mod User;
        pub mod account;
        pub mod item;
        pub mod payment;
        pub mod product;
        pub mod user;
    }
}

use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;

#[allow(unused_imports)]
use crate::db::models::account::Account;
#[allow(unused_imports)]
use crate::db::models::item::Item;
#[allow(unused_imports)]
use crate::db::models::payment::Payment;
#[allow(unused_imports)]
use crate::db::models::product::Product;
#[allow(unused_imports)]
use crate::db::models::user::User;

#[cfg(test)]
mod tests;

use serde::Deserialize;

#[derive(Deserialize)]
struct CreateUserParams {
    username: String,
    password: String,
}

#[tauri::command]
async fn create_user(username: String, password: String) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => {
            return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned())
        }
    };

    let result = match User::create_one(&conn, username, password) {
        Ok(result) => Ok(result),
        Err(_) => Err("Erro ao criar usuário.".to_owned()),
    };
    result
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
