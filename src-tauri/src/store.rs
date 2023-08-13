use chrono::Utc;
use serde_json::StreamDeserializer;
use sqlite::{self, State};
use crate::model::{Label, Transaction, Transfer};
use core::panic;
use std::{fs, str::FromStr};

pub struct Store {
    connection: sqlite::Connection,
}

impl Store {
    pub fn open(db_path: String) -> Result<Store, ()>{
        let conn = sqlite::open(db_path).unwrap();
        Ok(Store {
            connection: conn
        })
    }

    pub fn setup(&self) -> Result<(), ()> {
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS transactions (
                title TEXT, datetime INTEGER, amount INTEGER
            );"
        ).unwrap();
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS labels (
                name TEXT
            );"
        ).unwrap();
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS transfers (
                name TEXT, note TEXT, amount INTEGER
            );"
        ).unwrap();
        Ok(())
    }

    pub fn add_transaction(&self, record: Transaction) -> Result<Transaction, String>{
        if !record.id.is_none() {
            Err("Object has exist in db!".to_string())
        }
        else {
            let insert_query = format!(
                "INSERT INTO transactions VALUES('{}', {} , {});",
                record.title,
                record.datetime,
                record.amount
            );
            let statement = self.connection.execute(insert_query).unwrap();
            
            let get_last_inserted_row_query = "SELECT rowid, title, datetime, amount FROM transactions ORDER BY rowid DESC LIMIT 1";
            let mut statement = self.connection.prepare(get_last_inserted_row_query).unwrap();

            match statement.next().unwrap() {
                State::Done => Err("Cannot find lasta row!".to_string()),
                State::Row => {
                   Ok(Transaction {
                        id: statement.read(0).unwrap(),
                        title: statement.read(1).unwrap(),
                        datetime: statement.read(2).unwrap(),
                        amount: statement.read(3).unwrap()
                    }) 
                }
            }
        }
    }


    pub fn all_transactions(&self) -> Vec<Transaction> {
        let mut transactions: Vec<Transaction> = Vec::new();
        let mut stmnt = self.connection.prepare("SELECT rowid, title, datetime, amount FROM transactions;").unwrap();
        while let State::Row = stmnt.next().unwrap() {
            let id: i64 = stmnt.read(0).unwrap();
            let title: String = stmnt.read(1).unwrap();
            let datetime: i64 = stmnt.read(2).unwrap();
            let amount: i64 = stmnt.read(3).unwrap();
            let new = Transaction { id: Some(id), title, datetime, amount};
            transactions.push(new)
        };

        return transactions
    }
}