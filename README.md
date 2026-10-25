# SkyStore

An online sportswear store for Morocco: tees, jackets, joggers, shoes and watches, priced in dirhams and paid **cash on delivery**. Plain HTML, CSS and JavaScript, with no framework and no build step.

**Live demo:** https://iliasjf.github.io/SkyStore/

SkyStore started in 2022 as a static template. In 2026 it was rebuilt into a working store. It is a demo: products and prices are sample data, and no order is really sent.

## What it does

- **Shop:** filter by category, size and price, sort, and search. Filters are saved in the URL, for example `products.html?cat=shoes&max=400`.
- **Product page:** one template for every product (`product.html?id=...`), with colours that switch the photos, a size picker, a size guide, quantity, wishlist, delivery facts and related products. It also adds schema.org `Product` data for search engines.
- **Cart:** change quantities, remove items, and see a free-delivery progress bar (free from 500 DH, otherwise 30 DH). Try the demo promo code `SKY10`.
- **Checkout:** name, Moroccan phone number, city and address. Each field shows a clear error, and a summary of errors appears at the top. Payment is cash on delivery.
- **Order confirmation:** an order number, the total to pay at the door and a prefilled WhatsApp message.
- **Account:** create an account, sign in and see past orders. The demo keeps the account in the browser and stores the password only as a SHA-256 hash.
- **Wishlist, contact form, delivery and returns, FAQ, 404 page.**
- The cart, wishlist, orders and account are saved in `localStorage`, so they survive a reload.

## Quality

- Works on phones, tablets and desktops, with no sideways scrolling.
- Keyboard friendly: skip link, visible focus, labelled buttons, real `<button>` and `<label>` elements, and a size guide built with `<dialog>`.
- Fast: photos converted to WebP (about 8 MB down to under 1 MB), lazy-loaded below the fold, and no icon font (icons are inline SVG).
- Every page has a title, a description and Open Graph tags for link previews.

## Run it locally

Any static server works, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening the files directly with `file://` also works, but the account page needs `http://` or `https://` for password hashing.

## Make it a real shop

- **Products and prices:** `js/data.js`. Each product has a category, a price, sizes and photos, plus colours if it has them.
- **Delivery fee, free-delivery threshold, cities and promo codes:** also in `js/data.js`.
- **WhatsApp number:** set `SHOP_WHATSAPP` at the top of `js/order.js`.
- **Receiving orders:** the demo saves orders in the browser. For a live shop, send the order object in `js/checkout.js` to a form service, a Google Sheet or a small API.

## Files

```
index.html          Home
products.html       Shop with filters
product.html        Product page (all products)
cart.html           Cart
checkout.html       Delivery details and order
order.html          Order confirmation
wishlist.html       Saved products
Account.html        Sign in, create account, order history
Contact.html        Contact form and map
About.html          About, delivery and returns, FAQ
404.html            Page not found
css/style.css       All styles
js/data.js          Products, delivery and promo settings
js/app.js           Shared: cart, wishlist, header, product cards, toasts
js/*.js             One script per page
img/                Photos (WebP), logo, favicon
```

## Author

Built by [Ilias Jafaoui](https://iliasjf.github.io/), front-end developer in Ben Slimane, Morocco.
