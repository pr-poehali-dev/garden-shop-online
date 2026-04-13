"""
API для управления товарами каталога: получение, создание, обновление, удаление.
Версия: 2
"""
import json
import os
import psycopg2

SCHEMA = "t_p74084546_garden_shop_online"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")

    # GET /products — список всех активных товаров
    if method == "GET" and not path.rstrip("/").split("/")[-1].isdigit():
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, description, price, badge, icon, active, sort_order FROM {SCHEMA}.products ORDER BY sort_order, id"
        )
        rows = cur.fetchall()
        conn.close()
        products = [
            {"id": r[0], "name": r[1], "description": r[2], "price": r[3],
             "badge": r[4], "icon": r[5], "active": r[6], "sort_order": r[7]}
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"products": products})}

    # POST /products — создать товар
    if method == "POST":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.products (name, description, price, badge, icon, active, sort_order) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (body.get("name"), body.get("description"), body.get("price", 0),
             body.get("badge") or None, body.get("icon", "Leaf"),
             body.get("active", True), body.get("sort_order", 0))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 201, "headers": CORS_HEADERS, "body": json.dumps({"id": new_id})}

    # PUT /products/{id} — обновить товар
    if method == "PUT":
        product_id = path.rstrip("/").split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.products SET name=%s, description=%s, price=%s, badge=%s, icon=%s, active=%s, sort_order=%s WHERE id=%s",
            (body.get("name"), body.get("description"), body.get("price", 0),
             body.get("badge") or None, body.get("icon", "Leaf"),
             body.get("active", True), body.get("sort_order", 0), product_id)
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True})}

    # DELETE /products/{id} — удалить товар
    if method == "DELETE":
        product_id = path.rstrip("/").split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id=%s", (product_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Not found"})}