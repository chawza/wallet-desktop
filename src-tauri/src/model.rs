use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Transaction {
    pub id: Option<i64>,
    pub title: String,
    pub datetime: i64,
    pub amount: i64,
}

pub struct Transfer {
    name: String,
    note: String,
    amount: usize
}

pub struct Label {
    id: usize,
    name: String,
}