document.addEventListener('DOMContentLoaded', function () {
    const productId = localStorage.getItem("plid");
    if (!productId) { alert("Product id missing"); }
    else {
        const apiUrl = `https://gsentiser.vercel.app/products/${productId}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(product => {
                document.getElementById('productName').innerHTML = "<b>" + product.name + "</b>";
                document.getElementById('productPrice').innerHTML = `<b>₹${product.price.toFixed(2)}</b>`;
                document.getElementById('totalCost').innerHTML = `<b>₹${(product.price + 40.00).toFixed(2)}</b>`;
                document.getElementById("pimg").src = `../assets${product.image}`;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to load product details');
            });


        const paymentForm = document.getElementById('paymentForm');

        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();


            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                alert('Please enter a valid 16-digit card number.');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Please enter a valid expiry date in MM/YY format.');
                return;
            }

            if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
                alert('Please enter a valid 3-digit CVV.');
                return;
            }

            alert('Order placed successfully!');
            paymentForm.reset();
        });
    }
});

