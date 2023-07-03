// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod db {
    pub mod db;
    pub mod models {
        pub mod account;
        pub mod item;
        pub mod payment;
        pub mod product;
        pub mod user;
    }
}

use crate::db::models::account::Account;
use crate::db::models::item::Item;
use crate::db::models::payment::Payment;
use crate::db::models::product::Product;
use crate::db::models::user::User;
use chrono::Utc;

#[cfg(test)]
mod tests;

pub fn date_now() -> String {
    let date = Utc::now().naive_utc();
    let date_now = date.format("%Y-%m-%d %H:%M:%S").to_string();
    println!("{}", date_now);
    date_now
}

#[tauri::command]
fn get_database_content_status() -> bool {
    let users = find_all_users().unwrap();
    match users.len() {
        0 => false,
        _ => true,
    }
}

//User Service
#[tauri::command]
fn create_user(username: String, cpf: String, phone: String) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    let result = match User::create_one(&conn, username, cpf, phone) {
        Ok(result) => Ok(result),
        Err(_) => Err("Erro ao criar usuário.".to_owned()),
    };
    result
}

#[tauri::command]
fn find_username(id: String) -> Result<Option<String>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados".to_owned()),
    };

    match User::get_username(&conn, id) {
        Ok(users) => Ok(users),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn find_all_users() -> Result<Vec<User>, String> {
    println!("Chamada feita");

    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados".to_owned()),
    };

    match User::find_all(&conn) {
        Ok(users) => {
            println!("{}", users.len());
            Ok(users)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn find_user_by_id(id: String) -> Result<Option<User>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match User::find_one(&conn, id) {
        Ok(user) => Ok(user),
        Err(_) => Err("Erro ao buscar usuário.".to_owned()),
    }
}

#[tauri::command]
fn delete_user_by_id(id: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match User::delete_one(&conn, id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao deletar usuário.".to_owned()),
    }
}

#[tauri::command]
fn edit_user(id: String, username: String, cpf: String, phone: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match User::edit_one(&conn, id, username, cpf, phone) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar usuário.".to_owned()),
    }
}
//ProductsService

#[tauri::command]
fn create_product(name: String, price: f64) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::create_one(&conn, &name, price) {
        Ok(result) => Ok(result),
        Err(_) => Err("Erro ao criar produto.".to_owned()),
    }
}

#[tauri::command]
fn find_all_products() -> Result<Vec<Product>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::find_all(&conn) {
        Ok(products) => Ok(products),
        Err(_) => Err("Erro ao buscar produtos.".to_owned()),
    }
}

#[tauri::command]
fn find_product_by_id(id: String) -> Result<Option<Product>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::find_one(&conn, id) {
        Ok(product) => Ok(product),
        Err(_) => Err("Erro ao buscar produto.".to_owned()),
    }
}

#[tauri::command]
fn delete_product_by_id(id: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::delete_one(&conn, id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao deletar produto.".to_owned()),
    }
}

#[tauri::command]
fn edit_product_price(id: String, new_price: f64) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::edit_price(&conn, id, new_price) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar preço do produto.".to_owned()),
    }
}

#[tauri::command]
fn edit_product_name(id: String, new_name: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Product::edit_name(&conn, id, &new_name) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar nome do produto.".to_owned()),
    }
}

//Payments Service

#[tauri::command]
fn create_payment(amount: f64, account_id: String, payment_type: i32) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    // Types:
    // 0 - Dinheiro;
    // 1 - Crédito;
    // 2 - Débito;
    // 3 - PIX;
    // 4 - Vale alimentação;

    if payment_type > 4 || payment_type < 0 {
        Err("Tipo de pagamento inválido.".to_string())
    } else {
        match Payment::create_one(&conn, amount, account_id, payment_type) {
            Ok(result) => Ok(result),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[tauri::command]
fn find_payments_by_id(account_id: String) -> Result<Vec<Payment>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    let payment = match Payment::find_all(&conn, account_id) {
        Ok(payment) => Ok(payment),
        Err(_) => Err("Erro ao buscar pagamento.".to_owned()),
    };
    payment
}

#[tauri::command]
fn update_payment_amount(id: String, amount: f64) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Payment::update_amount(&conn, id, amount) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao atualizar valor do pagamento.".to_owned()),
    }
}

#[tauri::command]
fn delete_payment_by_id(id: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Payment::delete_one(&conn, id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao deletar pagamento.".to_owned()),
    }
}

//Items Service
#[tauri::command]
fn create_item(
    name: String,
    quantity: i32,
    price: f64,
    account_id: String,
    product_id: String,
) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::create_item(&conn, name, quantity, price, account_id, product_id) {
        Ok(result) => Ok(result),
        Err(_) => Err("Erro ao criar item.".to_owned()),
    }
}

#[tauri::command]
fn find_item_by_id(id: String) -> Result<Option<Item>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::find_item(&conn, id) {
        Ok(item) => Ok(item),
        Err(_) => Err("Erro ao buscar item.".to_owned()),
    }
}

#[tauri::command]
fn edit_item_note(id: String, notes: Option<String>) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::edit_note(&conn, id, notes) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar nota do item.".to_owned()),
    }
}

#[tauri::command]
fn edit_item_price(id: String, price: f64) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::edit_price(&conn, id, price) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar preço do item.".to_owned()),
    }
}

#[tauri::command]
fn edit_item_name(id: String, name: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::edit_name(&conn, id, name) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao editar nome do item.".to_owned()),
    }
}

#[tauri::command]
fn delete_item_by_id(id: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Item::delete_one(&conn, id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao deletar item.".to_owned()),
    }
}

//Accounts Service

#[tauri::command]
fn find_all_accounts() -> Result<Vec<Account>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Account::find_all(&conn) {
        Ok(result) => {
            println!("Result: {:?}", result);
            Ok(result)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn create_account(user_id: String) -> Result<String, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(e) => return Err(e.to_string()),
    };

    match Account::create_account(&conn, user_id) {
        Ok(result) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn find_account_by_id(account_id: String) -> Result<Option<Account>, String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Account::find_one(&conn, account_id) {
        Ok(account) => Ok(account),
        Err(_) => Err("Erro ao buscar conta.".to_owned()),
    }
}

#[tauri::command]
fn delete_account_by_id(account_id: String) -> Result<(), String> {
    let conn = match db::db::init_database() {
        Ok(conn) => conn,
        Err(_) => return Err("Erro ao gerar conexão com pool do banco de dados.".to_owned()),
    };

    match Account::delete_one(&conn, account_id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Erro ao deletar conta.".to_owned()),
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_user,
            find_all_users,
            find_username,
            find_user_by_id,
            edit_user,
            delete_user_by_id,
            create_product,
            find_all_products,
            find_product_by_id,
            delete_product_by_id,
            edit_product_price,
            edit_product_name,
            create_payment,
            find_payments_by_id,
            update_payment_amount,
            delete_payment_by_id,
            create_item,
            find_item_by_id,
            edit_item_note,
            edit_item_price,
            edit_item_name,
            delete_item_by_id,
            create_account,
            find_account_by_id,
            delete_account_by_id,
            find_all_accounts,
            get_database_content_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
