const CheckoutSteps = {
  render: (props) => {
    return ` 
    <div class="checkout-steps">
      <a class="${props.step1 ? 'active' : ''}" href="/#/profile">Signin</a>
      <a class="${props.step2 ? 'active' : ''}" href="/#/shipping">Shipping</a>
      <a class="${props.step3 ? 'active' : ''}" href="/#/payment">Payment</a>
      <a class="${props.step4 ? 'active' : ''}" href="/#/placeorder">Place Order</a>
    </div>`;
  },
};

export default CheckoutSteps;