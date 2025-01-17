let cartItems = JSON.parse(localStorage.getItem("cartitems")) || [];
fetch('https://gsentiser.vercel.app/products')
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            if (cartItems.includes(product.id)) {
                let row = document.createElement("tr");
                let cell1 = document.createElement("td");
                let cell2 = document.createElement("td");
                let cell3 = document.createElement("td");
                let cell4 = document.createElement("td");

                cell1.textContent = product.id;
                cell2.textContent = product.name;
                cell3.textContent = product.price;
                if (product.image) {
                    cell4.innerHTML = `<img src="../assets${product.image}" alt="${product.name}" width="50">`;
                }

                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);
                row.appendChild(cell4);
                document.getElementById("itemsTable").appendChild(row);
            }
        });
    })
    .catch(error => console.error('Error fetching products:', error));