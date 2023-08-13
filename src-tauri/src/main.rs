// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod store;
mod model;

use std::path::PathBuf;

use chrono::Utc;
use store::Store;

use tauri::Config;
use tauri::api::path::app_data_dir;

use crate::model::{Transaction, Label, Transfer};

#[tauri::command]
fn get_transaction() -> Vec<Transaction> {
    let session = get_connection().unwrap();
    session.all_transactions()
}

#[tauri::command]
fn add_transaction(title: &str, datetime: i64, amount: i64) -> Result<Transaction, ()> {
    let record = Transaction { id: None, title: title.to_string(), datetime, amount};
    let session = get_connection().unwrap();
    Ok(session.add_transaction(record).unwrap())
}

fn get_db_path() -> PathBuf {
    let app_path = app_data_dir(&Config::default()).unwrap();
    app_path.join("wallet.sqlite")
}

fn get_connection() -> Result<Store, ()> {
    let db_path = get_db_path();
    let session = Store::open(String::from(db_path.to_str().unwrap())).unwrap();
    Ok(session)
}

fn setup_database(session: Store) -> Result<(), ()> {
    session.setup().unwrap();
    // fill_db(session).unwrap();
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let session = get_connection().unwrap();
            setup_database(session).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_transaction, add_transaction])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
