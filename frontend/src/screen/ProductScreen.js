import { getProduct } from "../api";
import Rating from "../components/Rating";
import { hideLoading, parseRequestURL, showLoading } from "../utils";

const ProductScreen = {
  after_render: () => {
    const request = parseRequestURL();
    document.getElementById("add-to-cart").addEventListener("click",
    () => {
      document.location.hash = `/cart/${request.id}`
    });
  },
  render: async () => {
    const request = parseRequestURL();
    showLoading();
    const product = await getProduct(request.id);
    hideLoading();
    if (product.error) {
      return `<div>${product.error}</div>`; 
    }
    return `
    <div class="content">
      <div class="back-to-homepage">
        <a href="/#/">Back to HomePage</a>
      </div>
      <div class="details">
        <div class="details-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="details-info">
          <ul>
            <li>
              <h1>${product.name}</h1>
            </li>
            <li>
              ${Rating.render({
                value: product.rating,
                text: `${product.numReviews} reviews`
              })}
            </li>
            <li>
              Price: <strong>$${product.price}</strong>
            </li>
            <li>
              Category: <i>${product.category}</i>
            </li>
          </ul>
        </div>
        <div class="details-action">
          <ul>
            <li>
              Price: $${product.price}
            </li>
            <li>
              Status:
                ${product.countInStocks > 0
                  ? `<span class="success">In Stocks</span>`  
                  : `<span class="error">Unavailable</span>`
                }
            </li>
            <li>
              <button id="add-to-cart" class="primary">Add to Cart</div>
            </li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

export default ProductScreen;
