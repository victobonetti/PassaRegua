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
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = db::db::init_database()?;

    let product_name = "Example Product";
    let product_price = 9.99;

    // Cria um novo produto
    db::models::Product::Product::create_one(&pool, product_name, product_price)?;
    println!("Product created successfully.");

    // Obtém todos os produtos
    db::models::Product::Product::find_all(&pool)?;


    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
