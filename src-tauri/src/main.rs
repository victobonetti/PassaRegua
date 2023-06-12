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
        #[allow(non_snake_case)]
        pub mod Product;
        pub mod Item;
        pub mod User;
        pub mod Account;
        pub mod Payment;
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {

    let pool = db::db::init_database()?;


    

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
