from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, MenuItem, Order, OrderItem
from collections import defaultdict

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)


ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"
def admin_required():
    token = request.headers.get("Authorization")
    return token == "admin-token"

def seed_menu():
    if MenuItem.query.count() == 0:
        items = [
            {
                "name": "Classic Cappuccino",
                "category": "Hot Coffee",
                "price": 149,
                "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800",
                "rating": 4.9,
                "badge": "Best Seller",
            },
            {
                "name": "Iced Latte",
                "category": "Cold Coffee",
                "price": 169,
                "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
                "rating": 4.8,
                "badge": "Trending",
            },
            {
                "name": "Mocha Frappe",
                "category": "Cold Coffee",
                "price": 199,
                "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800",
                "rating": 4.7,
                "badge": "Premium",
            },
        ]

        for item in items:
            db.session.add(MenuItem(**item))

        db.session.commit()


@app.route("/")
def home():
    return jsonify({"message": "Coffee Shop API running"})


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    if data["username"] == ADMIN_USERNAME and data["password"] == ADMIN_PASSWORD:
        return jsonify({"message": "Login success", "token": "admin-token"})

    return jsonify({"error": "Invalid admin credentials"}), 401


@app.route("/api/menu", methods=["GET"])
def get_menu():
    category = request.args.get("category")
    search = request.args.get("search")

    query = MenuItem.query

    if category and category != "All":
        query = query.filter_by(category=category)

    if search:
        query = query.filter(MenuItem.name.ilike(f"%{search}%"))

    return jsonify([item.to_dict() for item in query.all()])

@app.route("/api/menu", methods=["POST"])
def add_menu_item():
    if not admin_required():
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.json

    item = MenuItem(
        name=data["name"],
        category=data["category"],
        price=data["price"],
        image=data["image"],
        rating=data.get("rating", 4.5),
        badge=data.get("badge", "New"),
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Item added", "item": item.to_dict()}), 201


@app.route("/api/menu/<int:item_id>", methods=["PUT"])
def update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    data = request.json

    item.name = data.get("name", item.name)
    item.category = data.get("category", item.category)
    item.price = data.get("price", item.price)
    item.image = data.get("image", item.image)
    item.rating = data.get("rating", item.rating)
    item.badge = data.get("badge", item.badge)
    item.available = data.get("available", item.available)

    db.session.commit()

    return jsonify({"message": "Item updated", "item": item.to_dict()})


@app.route("/api/menu/<int:item_id>", methods=["DELETE"])
def delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item deleted"})


@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.json

    if not data.get("items"):
        return jsonify({"error": "Cart is empty"}), 400

    order = Order(
        customer_name=data["customer_name"],
        phone=data["phone"],
        table_no=data.get("table_no", "Takeaway"),
        payment_method=data.get("payment_method", "Cash"),
        total_amount=data["total_amount"],
    )

    db.session.add(order)
    db.session.flush()

    for item in data["items"]:
        order_item = OrderItem(
            order_id=order.id,
            name=item["name"],
            price=item["price"],
            quantity=item["quantity"],
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({"message": "Order placed", "order": order.to_dict()}), 201


@app.route("/api/orders", methods=["GET"])
def get_orders():
    orders = Order.query.order_by(Order.id.desc()).all()
    return jsonify([order.to_dict() for order in orders])


@app.route("/api/orders/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json

    order.status = data.get("status", order.status)
    db.session.commit()

    return jsonify({"message": "Status updated", "order": order.to_dict()})


@app.route("/api/orders/track", methods=["POST"])
def track_order():
    data = request.json
    order_id = data.get("order_id")
    phone = data.get("phone")

    order = Order.query.filter_by(id=order_id, phone=phone).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    return jsonify(order.to_dict())


@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    orders = Order.query.all()

    total_sales = sum(order.total_amount for order in orders)
    total_orders = len(orders)
    pending_orders = len([o for o in orders if o.status == "Pending"])
    completed_orders = len([o for o in orders if o.status == "Completed"])

    daily_sales = defaultdict(float)
    popular_items = defaultdict(int)

    for order in orders:
        day = order.created_at.strftime("%d %b")
        daily_sales[day] += order.total_amount

        for item in order.items:
            popular_items[item.name] += item.quantity

    return jsonify({
        "total_sales": total_sales,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "menu_items": MenuItem.query.count(),
        "daily_sales": {
            "labels": list(daily_sales.keys()),
            "values": list(daily_sales.values()),
        },
        "popular_items": {
            "labels": list(popular_items.keys()),
            "values": list(popular_items.values()),
        },
    })


with app.app_context():
    db.create_all()
    seed_menu()


if __name__ == "__main__":
    app.run(debug=True)