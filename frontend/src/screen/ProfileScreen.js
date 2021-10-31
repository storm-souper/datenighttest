import { getMyOrders, update } from "../api";
import CheckoutSteps from "../components/CheckoutSteps";
import { clearUser, getCartItems, getUserInfo, setUserInfo } from "../localStorage";
import { hideLoading, showLoading, showMessage } from "../utils";

const ProfileScreen = {
  // submit email and password then check if ther are valid
  after_render: () => {
    document
      .getElementById("signout-button")
      .addEventListener("click", () => {
        clearUser();
        document.location.hash = '/';
      })
    document
      .getElementById("profile-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        showLoading();     
        const data = await update({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error)
        } else {
          setUserInfo(data);
          document.location.hash = '/';
        }
      });
  },
  render: async () => {
    const {name, email} = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }
    const orders = await getMyOrders();
    return `
    <div class="profile">
      <div class="profile-checkout">
        ${ getCartItems().length !== 0 
          ? CheckoutSteps.render({step1: true})
          : '<div>Cart is empty. <a href="/#/">Go Shopping</a>'
        }
      </div>
      <div class="profile-body">
        <div class="profile-info">
          <div class="form-container">
            <form id="profile-form">
              <ul class="form-items">
                <li>
                  <h1>User Profile</h1>
                </li>
                <li>
                  <label for="name">Name</label>
                  <input type="name" name="name" id="name" value="${name}" />
                </li>
                <li>
                  <label for="email">Email</label>
                  <input type="email" name="email" id="email" value="${email}" />
                </li>
                <li>
                  <label for="password">Password</label>
                  <input type="password" name="password" id="password" />
                </li>   
                <li>
                  <button type="submit" class="primary">Update</button>
                </li>
                <li>
                  <button type="button" id="signout-button">Sign Out</button>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div class="profile-orders">
        <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th>ORDER PACK</th>
                <th>QTY</th>
                <th>DATE</th>
                <th>TOTAL PRICE</th>
                <th>PAID AT</th>
                <th>DELIVERED AT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 
                ? `<tr><td coldspan = "6">No Order Found!</tr>`
                : orders.map(order => `
                  <tr>
                    <td>
                      ${order.orderItems.map(item => `
                      <li class="order-name">
                        ${item.name}
                      </li>
                      `).join('\n')}
                    </td>
                    <td>
                      ${order.orderItems.map(item => `
                      <li class="order-qty">
                        ${item.qty}
                      </li>
                      `).join('\n')}
                    </td>
                    <td>${order.createdAt}</td>  
                    <td>${order.totalPrice}</td>
                    <td>${order.paidAt || 'Not paid yet'}</td>
                    <td>${order.deliveredAt || 'Not delivered yet'}</td>
                    <td>
                      <a class='order-details-link' href="/#/order/${order._id}"> 
                        <h5>DETAILS</h5>
                      </a>
                    </td>
                  </tr>`
                ).join('\n')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>`
  },  
};

export default ProfileScreen;