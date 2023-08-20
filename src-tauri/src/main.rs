// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod store;
mod model;

use std::path::PathBuf;

use chrono::Utc;
use model::Account;
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
fn add_transaction(title: &str, datetime: i64, amount: i64) -> Result<Transaction, String> {
    let record = Transaction { id: None, title: title.to_string(), datetime, amount};
    let session = get_connection().unwrap();
    match session.add_transaction(record) {
        Ok(tran) => Ok(tran),
        Err(err) => Err(err)
    }
}

#[tauri::command]
fn delete_transaction(id: i64) -> Result<(), String>{
    let session = get_connection().unwrap();
    session.delete_transaction(id)
    
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
    Ok(())
}

#[tauri::command]
fn add_account(record: Account) -> Result<(), String> {
    let session = get_connection().unwrap();
    match session.add_account(record) {
        Ok(_) => Ok(()),
        Err(msg) => Err("Error String".to_string())
    }
}

#[tauri::command]
fn get_all_accounts() -> Result<Vec<Account>, ()> {
    let session = get_connection().unwrap();
    Ok(session.all_accounts())
}

#[tauri::command]
fn delete_account_by_id(id: i64) -> Result<(), String> {
    let session = get_connection().unwrap();
    match session.delete_account_by_id(id) {
        Ok(_) => Ok(()),
        Err(_) => Err("Cannot delete account".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let session = get_connection().unwrap();
            setup_database(session).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_transaction, add_transaction, delete_transaction,
            get_all_accounts, add_account, delete_account_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
