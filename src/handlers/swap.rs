use serde::{Deserialize, Serialize};
use actix_web::{web, HttpResponse, Responder};

#[derive(Deserialize, Debug)]
pub struct SwapRequest {
    pub email: String,
    pub swap_from: String,
    pub swap_to: String,
    pub amount_from: f64,
}

#[derive(Serialize, Debug)]
pub struct SwapResponse {
    pub success: bool,
    pub amount_to: f64,
    pub fee_charged: f64,
}

pub async fn handle_swap(req: web::Json<SwapRequest>) -> impl Responder {
    let platform_fee = req.amount_from * 0.01;
    let net_amount = req.amount_from - platform_fee;

    let ton_rate = 7.24;
    let mut result_amount = 0.0;

    if req.swap_from == "USDT" && req.swap_to == "TON" {
        result_amount = net_amount / ton_rate;
    } else if req.swap_from == "TON" && req.swap_to == "USDT" {
        result_amount = net_amount * ton_rate;
    } else {
        result_amount = net_amount;
    }

    let response = SwapResponse {
        success: true,
        amount_to: result_amount,
        fee_charged: platform_fee,
    };

    HttpResponse::Ok().json(response)
}