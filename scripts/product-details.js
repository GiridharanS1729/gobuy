const prt = "https://gsentiser.vercel.app";

function fetchProductDetails() {
    const productId = localStorage.getItem("pid");

    if (!productId) {
        alert('Product ID is missing');
        return;
    }

    fetch(`${prt}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            renderProductDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}


function renderProductDetails(product) {
    const productDetailsContainer = document.getElementById('product-details');
    const ratrev = document.getElementById("revrat");

    const d1 = document.createElement('div');
    d1.className = "ll";
    const productImage = document.createElement('img');
    productImage.src = "../assets" + product.image;
    productImage.alt = product.name;
    d1.appendChild(productImage);

    const d2 = document.createElement('div');
    d2.className = "rr";
    const productTitle = document.createElement('h2');
    productTitle.textContent = product.name;
    d2.appendChild(productTitle);

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;
    d2.appendChild(productDescription);

    const productPrice = document.createElement('p');
    productPrice.classList.add('text-primary');
    productPrice.textContent = `Price: ${pricefrmt(product.price)}`;
    d2.appendChild(productPrice);

    const btns = document.createElement('div');
    btns.className = "crtby";
    const buy = document.createElement('button');
    buy.textContent = "Buy Now";
    buy.className = "buy";
    buy.onclick = function () {
        window.open(`./buynow.html`, "_blank");
        localStorage.setItem("plid", product.id);
    };
    btns.appendChild(buy);

    const crt = document.createElement('button');
    crt.textContent = "Add to Cart";
    crt.className = "crt";


    crt.onclick = function () {
        let cartItems = JSON.parse(localStorage.getItem("cartitems")) || [];
        cartItems.push(product.id);
        localStorage.setItem("cartitems", JSON.stringify(cartItems));
        alert("Successfully added to Cart");
    };
    btns.appendChild(crt);
    d2.appendChild(btns);


    const ratingInput = document.createElement('textarea');
    ratingInput.placeholder = 'Enter your rating (e.g., "good", "excellent")';
    ratingInput.id = "autores";
    ratingInput.style.width = '100%';
    ratingInput.style.resize = 'none';
    ratingInput.style.overflowY = 'hidden';
    d2.appendChild(ratingInput);

    $(document).ready(function () {
        $('#autores').on('input', function () {
            this.style.height = 'auto';
            const maxHeight = 6 * parseFloat(window.getComputedStyle(this).lineHeight);
            if (this.scrollHeight > maxHeight) {
                this.style.height = maxHeight + 'px';
                this.style.overflowY = 'scroll';
            } else {
                this.style.height = this.scrollHeight + 'px';
                this.style.overflowY = 'hidden';
            }
        });
    });

    const addRatingButton = document.createElement('button');
    addRatingButton.textContent = 'Write a product review';
    addRatingButton.className = "add-btn"
    addRatingButton.onclick = function () {
        const newRatingText = ratingInput.value.trim();
        if (newRatingText) {
            analyzeSentiments([newRatingText], product);
        } else {
            alert('Rating text cannot be empty.');
        }
    };
    addRatingButton.id = "add-rating-button";
    d2.appendChild(addRatingButton);
    
    productDetailsContainer.innerHTML = "";
    productDetailsContainer.appendChild(d1);
    productDetailsContainer.appendChild(d2);


    // ratings
    const avgrat = document.createElement('p');
    avgrat.className = "fstrs";
    const anns = calculateAverageRating(product.stars);
    const post = "★".repeat(Math.floor(anns));
    const hlf = (anns * 10) % 10 >= 1 ? "⯪" : "";
    const negt = 5 - (post.length + hlf.length);
    // console.log(post + hlf + negt + anns);
    avgrat.textContent = post;
    avgrat.textContent += hlf;
    avgrat.textContent += "✩".repeat(negt);

    const averageRating = anns;

    avgrat.innerHTML += "&nbsp;".repeat(5);
    avgrat.innerHTML += `${averageRating.toFixed(1)} <span class="strsdef">out of 5 stars</span>`;
    ratrev.innerHTML = "";
    ratrev.appendChild(avgrat);

    const totrat = document.createElement('span');
    totrat.style = `color:#00f;font-size:16px;`;
    totrat.innerHTML = "Total " + product.stars.length + " ratings<br/><br/>";
    ratrev.appendChild(totrat);

    const revstrs = document.createElement('div');
    revstrs.style.position = "relative";
    revstrs.style.width = "70%";

    const avgrate = EavgRat(product);

    for (let i = 5; i > 0; i -= 2) {
        var ew = avgrate[i];
        // console.log(ew);

        const progressContainer = document.createElement('div');
        progressContainer.style.display = "flex";
        progressContainer.style.alignItems = "center";
        progressContainer.style.marginBottom = "10px";
        progressContainer.title = ew + "%";

        const percentageText = document.createElement('span');
        percentageText.textContent = i + " star";
        percentageText.style.fontSize = "14px";
        percentageText.style.color = "#2162a1";
        percentageText.style.marginRight = "10px";

        const percentageTex = document.createElement('span');
        percentageTex.textContent = Math.round(ew) + " %";
        percentageTex.style.fontSize = "14px";
        percentageTex.style.color = "#2162a1";
        percentageTex.style.marginLeft = "10px";

        const barContainer = document.createElement('div');
        barContainer.style.flex = "1";
        barContainer.style.height = "20px";
        barContainer.style.background = "#f1f1f1";
        barContainer.style.borderColor = "#000";
        barContainer.style.borderWidth = "1px";
        barContainer.style.borderStyle = "solid";
        barContainer.style.borderRadius = "5px";
        barContainer.style.position = "relative";

        const progressBar = document.createElement('div');
        progressBar.style.width = ew + "%";
        progressBar.style.height = "100%";
        progressBar.style.background = "#de7921";
        progressBar.style.borderRadius = "5px";
        progressBar.style.position = "absolute";
        barContainer.appendChild(progressBar);

        progressContainer.appendChild(percentageText);
        progressContainer.appendChild(barContainer);
        progressContainer.appendChild(percentageTex);
        revstrs.appendChild(progressContainer);
    }


    ratrev.appendChild(revstrs);
    fetchRatings(product.id);
}

async function analyzeSentiments(textRatings, product) {
    try {
        const results = await Promise.all(
            textRatings.map(async (textRating) => {
                const response = await axios.post(`${prt}/analyze`, { text: textRating });
                return response.data.sentiment;
            })
        );
        const newStarRating = results.map(sentiment => getStarRating(sentiment));
        const productId = new URLSearchParams(window.location.search).get('id');
        const textRating = textRatings[0];

        const response = await axios.put(`${prt}/products/${productId}`, {
            textRating: textRating,
            stars: newStarRating
        });

        const updatedProduct = response.data;

        alert('Rating successfully added!');
        fetchRatings(product.id);
    } catch (error) {
        console.error("Error analyzing sentiments or updating product:", error);
        alert('Error analyzing sentiment or updating product.');
    }
}

function getStarRating(sentiment) {
    if (sentiment === "Positive") return 5;
    if (sentiment === "Negative") return 1;
    return 3;
}

function getsenti(sen) {
    if (sen === 5) return "Positive";
    else if (sen === 3) return "Neutral";
    else return "Negative";
}

EavgRat = (product) => {
    const ratavgs = {};
    var totlen = product.stars.length;
    const oper = 100 / totlen;
    for (i = 1; i < 6; i += 2) {
        ratavgs[i] = product.stars.filter((star) => star === i).length;
    }
    for (i = 1; i < 6; i += 2) {
        ratavgs[i] = (ratavgs[i] * oper).toFixed(2);
    }
    return ratavgs;
}

function calculateAverageRating(stars) {
    const totalStars = stars.reduce((acc, star) => acc + star, 0);
    return totalStars / stars.length;
}

function fetchRatings(productId) {
    fetch(`${prt}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            displayRatings(product.textRatings, product.stars);
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
        });
}

function displayRatings(textRatings, stars) {

    const ratingsList = document.getElementById('ratings-list');
    ratingsList.innerHTML = '';

    textRatings.forEach((rating, index) => {
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';

        const ratingText = document.createElement('p');
        ratingText.textContent = rating;
        ratingItem.appendChild(ratingText);

        const strs = document.createElement('p');
        strs.innerHTML = "⭐".repeat(stars[index]);
        ratingItem.appendChild(strs);

        const starRating = document.createElement('p');
        starRating.textContent = `Rating: ${getsenti(stars[index])}`;
        ratingItem.appendChild(starRating);

        ratingsList.appendChild(ratingItem);
    });
}

window.onload = function () {
    const user = localStorage.getItem("userData");
    const upid = localStorage.getItem("pid");
    if (user && upid) {
        fetchProductDetails();
    }
    else if (!upid && user) {
        window.location.href = "/files/home.html";
    }
    else {
        window.location.href = "/index.html";
    }
};

const pricefrmt = (pri) => { return `₹${pri.toLocaleString('en-IN')}`; }
