/* =====================================================================
   FILE NAME : cart.js
   PROJECT   : Pâtisseries Plain - E-Commerce Website
   COURSE    : ITE 011 - Introduction to Computing | GROUP 3

   WHAT THIS FILE DOES
   It does the cart math. Every time the customer clicks a size or a
   quantity, this code:
     1. finds every product that has a size selected,
     2. multiplies price x quantity for each one,
     3. adds everything up,
     4. writes the results on the page (cart bar, cart list, totals).

   WHERE THE PRICES COME FROM
   Each size button in index.html carries its own data, for example:
     <input ... data-name="Strawberry Cake" data-size="Whole" data-price="2299">
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- 1. SMALL HELPERS ---------- */

  var PESO = "\u20B1"; // the peso sign

  // 4598 becomes "₱4,598" (adds the comma automatically)
  function money(amount) {
    return PESO + amount.toLocaleString("en-PH");
  }

  /* ---------- 2. FIND THE PLACES WE WILL WRITE TO ---------- */

  var form       = document.getElementById("order-form");   // the whole shop
  var cartBar    = document.querySelector(".cartbar-info"); // the dark bar at the bottom
  var cartList   = document.getElementById("cart-lines");   // the list inside the cart screen
  var totalSpots = document.querySelectorAll(".total-amount"); // every place that shows the total

  /* ---------- 3. READ WHAT THE CUSTOMER PICKED ---------- */

  function readCart() {
    var items = [];
    var cards = document.querySelectorAll(".card"); // one card = one product

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];

      // Which size is selected? (".opt-add" = Slice, Whole, Demi, Grande, Venti...)
      var pickedSize = card.querySelector(".opt-add:checked");
      if (!pickedSize) { continue; } // "None" is selected, so skip this product

      // Which quantity is selected? (1 to 5)
      var pickedQty = card.querySelector(".qty .chip-input:checked");
      var qty = pickedQty ? parseInt(pickedQty.value, 10) : 1;

      var price = parseInt(pickedSize.getAttribute("data-price"), 10);

      items.push({
        name: pickedSize.getAttribute("data-name"),
        size: pickedSize.getAttribute("data-size"),
        qty: qty,
        subtotal: price * qty // price times quantity
      });
    }
    return items;
  }

  /* ---------- 4. CALCULATE AND SHOW ---------- */

  function makeLine(item) {
    var li = document.createElement("li");
    li.className = "line";

    var name = document.createElement("span");
    name.className = "line-name";
    name.textContent = item.name + " ";
    var size = document.createElement("em");
    size.textContent = item.size;
    name.appendChild(size);

    var qty = document.createElement("span");
    qty.className = "line-qty";
    qty.textContent = "\u00D7 " + item.qty; // "× 2"

    var price = document.createElement("span");
    price.className = "line-price";
    price.textContent = money(item.subtotal);

    li.appendChild(name);
    li.appendChild(qty);
    li.appendChild(price);
    return li;
  }

  function updateCart() {
    var items = readCart();
    var total = 0;
    var count = 0;

    cartList.textContent = ""; // clear the old list

    for (var i = 0; i < items.length; i++) {
      total += items[i].subtotal; // add up the money
      count += items[i].qty;      // add up the number of items
      cartList.appendChild(makeLine(items[i]));
    }

    cartBar.textContent = "Cart: " + count + " item(s), " + money(total);

    for (var j = 0; j < totalSpots.length; j++) {
      totalSpots[j].textContent = money(total);
    }
  }

  /* ---------- 5. RUN IT AT THE RIGHT TIMES ---------- */

  // Whenever any radio button is clicked, recalculate.
  document.addEventListener("change", updateCart);

  // "Start a new order" resets the form; recalculate once it has finished.
  form.addEventListener("reset", function () {
    setTimeout(updateCart, 0);
  });

  // Also run when the page is shown again (for example the browser's Back button).
  window.addEventListener("pageshow", updateCart);

  // Run once when the page first loads.
  updateCart();
})();
