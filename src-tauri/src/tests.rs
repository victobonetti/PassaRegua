use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
// use rusqlite::Connection;
// use rusqlite::Connection;

use crate::User; // Importe o módulo user do arquivo principal
use crate::Product;


fn setup() -> PooledConnection<SqliteConnectionManager> {
    // Crie uma conexão do banco de dados
    let manager = SqliteConnectionManager::file("test.db");
    let pool = Pool::builder().max_size(1).build(manager).unwrap();
    let conn = pool.get().unwrap();

    // Crie a tabela users
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT,
            password TEXT
        )",
        params![],
    )
    .unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL
            )",
        params![],
    ).unwrap();

    conn
}

#[test]
fn test_user_crud() {
    setup();
    // Crie uma conexão do banco de dados
    let manager = SqliteConnectionManager::file("test.db");
    let pool = Pool::builder().max_size(1).build(manager).unwrap();
    let conn = pool.get().unwrap();

    // Crie um usuário
    let username = "john";
    let password = "password";
    let test_id = User::create_one(&conn, username.to_string(), password.to_string()).unwrap().clone();

    // Encontre o usuário criado
    let found_user = User::find_one(&conn, test_id.to_owned()).unwrap();
    assert!(found_user.is_some());
    let user = found_user.unwrap();
    assert_eq!(user.username, username);
    assert_eq!(user.password, password);

    // Exclua o usuário
    User::delete_one(&conn, test_id.to_owned()).unwrap();

    // Verifique se o usuário foi removido
    let users = User::find_all(&conn).unwrap();
    assert_eq!(users.len(), 0);
}

#[test]
fn test_product_crud() {
    setup();
    // Crie uma conexão do banco de dados
    let manager = SqliteConnectionManager::file("test.db");
    let pool = Pool::builder().max_size(1).build(manager).unwrap();
    let conn = pool.get().unwrap();

    // Crie um produto
    let name = "Product A";
    let price = 10.0;
    let test_id = Product::create_one(&conn, name, price).unwrap().clone();

    // Edite o preço do produto
    let new_price = 15.0;
    Product::edit_price(&conn, test_id.to_owned(), new_price).unwrap();

    // Encontre o produto atualizado
    let found_product = Product::find_one(&conn, test_id.to_owned()).unwrap();
    assert!(found_product.is_some());
    let product = found_product.unwrap();
    assert_eq!(product.price, new_price);

    // Edite o nome do produto
    let new_name = "Product B";
    Product::edit_name(&conn, test_id.to_owned(), new_name).unwrap();

    // Encontre o produto atualizado
    let found_product = Product::find_one(&conn, test_id.to_owned()).unwrap();
    assert!(found_product.is_some());
    let product = found_product.unwrap();
    assert_eq!(product.name, new_name);

     // Exclua o produto
     Product::delete_one(&conn, test_id.to_owned()).unwrap();

     // Verifique se o produto foi removido
     let products = Product::find_all(&conn).unwrap();
     assert_eq!(products.len(), 0);
}