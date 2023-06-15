// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

mod db {
    pub mod db;
    pub mod models {
        pub mod user;
        pub mod product;
        pub mod payment;
        pub mod account;
        pub mod item;
    }
}

#[allow(unused_imports)]
use crate::db::models::user::User;
#[allow(unused_imports)]
use crate::db::models::product::Product;
#[allow(unused_imports)]
use crate::db::models::payment::Payment;
#[allow(unused_imports)]
use crate::db::models::item::Item;
#[allow(unused_imports)]
use crate::db::models::account::Account;

#[cfg(test)]
mod tests;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _pool = db::db::init_database()?;

    // db::models::user::user::create_one(&pool, "victor".to_owned(), "1234".to_owned())?;


    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
