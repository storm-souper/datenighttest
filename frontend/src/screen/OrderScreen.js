import { deliverOrder, getOrder, getPaypalClientID, payOrder } from "../api.js";
import { getUserInfo } from "../localStorage.js";
import { hideLoading, parseRequestURL, rerender, showLoading, showMessage } from "../utils";

const addPaypalSdk = async (totalPrice) => {
  const clientID = await getPaypalClientID();
  showLoading();
  if (!window.paypal) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypalobjects.com/api/checkout.js'
    script.async = true;
    script.onload = () => handlePayment(clientID, totalPrice);
    document.body.appendChild(script);
  } else {
    handlePayment(clientID, totalPrice);
  }
};
const handlePayment = (clientID, totalPrice) => {
  window.paypal.Button.render({
    env: 'sandbox',
    client: {
      sandbox: clientID,
      production: '',
    },
    locale: 'en_US',
    style: {
      size: 'responsive',
      color: 'gold',
      shape: 'pill',
    },

    commit: true,
    payment(data, actions) {
      return actions.payment.create({
        transactions: [
          {
            amount: {
              total: totalPrice,
              currency: 'USD',
            },
          },
        ],
      });
    },
    onAuthorize(data, actions){
      return actions.payment.execute().then(async () => {
        showLoading();
        await payOrder(parseRequestURL().id, {
          orderID: data.orderID,
          payerID: data.payerID,
          paymentID: data.paymentID,
        })
        hideLoading();
        showMessage('Payment was succesful.', () => {
          rerender(OrderScreen);
        });
      });
    },
  }, '#paypal-button'
  ).then(() => {
    hideLoading();
  });
};
const OrderScreen = {
  after_render: async () => {
    const request = parseRequestURL();
    if (document.getElementById('deliver-order-button')) {
      document.addEventListener('click', async () => {
        showLoading();
        await deliverOrder(request.id);
        hideLoading();
        showMessage('Order Delivered');
        rerender(OrderScreen);
      });
    }
  },
  render: async () => {
    const isAdmin = getUserInfo();
    const request = parseRequestURL();
    const {
      _id,
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
    if (!isPaid) {
      addPaypalSdk(totalPrice)
    };
    return `  
    <div>
    <h1>Oder ${_id}</h1>
      <div class="order">
        <div class="order-info">
          <div>
            <h2>Shipping</h2>
            <div>
              ${shipping.address}, 
              ${shipping.city}, 
              ${shipping.postalCode}, 
              ${shipping.country}
            </div>
            ${isDelivered
              ? `<div class="success">Delivered at ${deliveredAt}</div>`
              : `<div class="error">Not Delivered Yet</div>`
            }
          </div>
          <div>
            <h2>Payment</h2>
            <div>
              Payment Method: ${payment.paymentMethod}
            </div>
            ${isPaid
              ? `<div class="success">Paid at ${paidAt}</div>`
              : `<div class="error">Not Paid Yet</div>`
            }
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Shopping Cart</h2>
                <div>Price</div>
              </li>
              ${
                orderItems.map(item => ` 
                <li>
                  <div class="cart-image">
                    <img src="${item.image}" alt="${item.name}" />
                  </div>
                  <div class="cart-name">
                    <div> 
                      <a href="/#/product/${item.product}">${item.name}</a>
                    </div>
                    <div>Qty: ${item.qty}</div>
                  </div>
                  <div class="cart-price">$${item.price}</div>
                </li>
                `).join('\n') 
              }
            </ul>
          </div>
        </div>
        <div class="order-action">
          <ul>
            <li>
              <h2>Order Summary</h2>
            </li>
            <li><div>Items</div><div>$${itemsPrice}</div></li>
            <li><div>Shipping</div><div>$${shippingPrice}</div></li>
            <li><div>Tax</div><div>$${taxPrice}</div></li>
            <li class="total"><div>Order Total</div><div>$${totalPrice}</div></li>
            <li><div class="fw" id="paypal-button"></div></li>
            <li>
              ${
                isPaid && !isDelivered && isAdmin 
                ? `<button id="deliver-order-button"class="primary fw">Deliver Order</button>`
                : ''
              }
            </li>
          </ul>
        </div>
      </div>
    </div>`;
  },
};

export default OrderScreen;