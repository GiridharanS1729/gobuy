let cards = [];

document.getElementById("sortBy").addEventListener("change", fetchProducts);

function fetchProducts() {
    const srtby = document.getElementById("sortBy").value;

    fetch('https://gsentiser.vercel.app/products')
        .then(response => response.json())
        .then(data => {
            if (srtby === "ratings") {
                cards = data.sort((a, b) => {
                    const avgA = a.stars.reduce((acc, star) => acc + star, 0) / a.stars.length;
                    const avgB = b.stars.reduce((acc, star) => acc + star, 0) / b.stars.length;
                    return avgB - avgA;
                });
            } else if (srtby === "price") {
                cards = data.sort((a, b) => b.price - a.price);
            } else if (srtby === "a-z") {
                cards = data.sort((a, b) => a.name.localeCompare(b.name));
            } else if (srtby === "z-a") {
                cards = data.sort((a, b) => b.name.localeCompare(a.name));
            }
            renderCards();
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
}



function renderCards() {
    const rightContainer = document.getElementById('right-cards');
    rightContainer.innerHTML = '';

    cards.forEach(card => {
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'h-100');

        const img = document.createElement('img');
        img.src = "../assets"+card.image;
        img.classList.add('card-img-top');
        img.alt = card.name;
        img.style.height = '200px';
        img.style.objectFit = 'cover';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = card.name;

        const cardDescription = document.createElement('p');
        cardDescription.classList.add('card-text');
        cardDescription.textContent = card.description;

        const cardPrice = document.createElement('p');
        cardPrice.classList.add('card-text', 'text-primary');
        cardPrice.textContent =  pricefrmt(card.price);

        const averageRating = calculateAverageRating(card.stars);
        const ratingText = document.createElement('p');
        ratingText.classList.add('card-text', 'text-muted');
        ratingText.textContent = `Average Rating: ${averageRating.toFixed(1)} stars`;

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('btn', 'btn-warning', 'w-100');
        addToCartButton.textContent = 'View Details';
        addToCartButton.onclick = function () {
            window.location.href = `./product-details.html`;
            localStorage.setItem("pid", card.id);
        };

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(ratingText);
        cardBody.appendChild(addToCartButton);
        cardElement.appendChild(img);
        cardElement.appendChild(cardBody);
        col.appendChild(cardElement);
        rightContainer.appendChild(col);
    });
}

function calculateAverageRating(stars) {
    const total = stars.reduce((acc, star) => acc + star, 0);
    return total / stars.length;
}

window.onload = function () {
    fetchProducts();
};

const pricefrmt=(pri)=> {return `₹${pri.toLocaleString('en-IN')}`;} 