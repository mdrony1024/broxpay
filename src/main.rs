use actix_web::{App, HttpServer, web};
mod handlers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8080;
    println!("Broxpay Secure Rust Server starting on port {}...", port);

    HttpServer::new(|| {
        App::new()
            .route("/api/swap", web::post().to(handlers::swap::handle_swap))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}