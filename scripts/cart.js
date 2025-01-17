document.addEventListener("DOMContentLoaded", function () {
    let cartItems = JSON.parse(localStorage.getItem("cartitems")) || [];
    let s = `<thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
             </thead>`;

    const itble = document.getElementById("itemsTable");
    const cartMessage = document.getElementById("cartMessage");
    

    if (itble) {
        fetch('https://gsentiser.vercel.app/products')
            .then(response => response.json())
            .then(products => {
                if (cartItems.length == 0) {
                    cartMessage.style.display="block";
                }
                else{
                    itble.innerHTML = s;
                    products.forEach(product => {
                        if (cartItems.includes(product.id)) {
                            let row = document.createElement("tr");
                            let cell1 = document.createElement("td");
                            let cell2 = document.createElement("td");
                            let cell3 = document.createElement("td");
                            let cell4 = document.createElement("td");
                            let cell5 = document.createElement("td");

                            cell1.textContent = product.id;
                            cell2.textContent = product.name;
                            cell3.textContent = product.price;

                            if (product.image) {
                                cell4.innerHTML = `<img src="../assets${product.image}" alt="${product.name}" width="50">`;
                            }

                            let removeBtn = document.createElement("button");
                            removeBtn.textContent = "Remove";
                            removeBtn.className = "remove-btn";
                            removeBtn.addEventListener("click", () => {
                                cartItems = cartItems.filter(item => item !== product.id);
                                localStorage.setItem("cartitems", JSON.stringify(cartItems));
                                row.remove();
                            });

                            cell5.appendChild(removeBtn);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            row.appendChild(cell3);
                            row.appendChild(cell4);
                            row.appendChild(cell5);

                            itble.appendChild(row);
                        }
                    });

                }
            })
            .catch(error => console.error('Error fetching products:', error));
    } else {
        console.error("Table with id 'itemsTable' not found.");
    }
});
