const DashboardMenu = {
  render: (props) => {
    return `
    <div class="dashboard-menu">
      <ul>
        <li class="${props.selected === 'dashboard' ? 'selected' : ''}">
          <a href="/#/dashboard">Dashboard</a>
        </li>
        <li class="${props.selected === 'orders' ? 'selected' : ''}">
          <a href="/#/orderlist">Order List</a>
        </li>
        <li class="${props.selected === 'products' ? 'selected' : ''}">
          <a href="/#/productlist">Product List</a>
        </li>
      </ul>
    </div>`;
  },
};

export default DashboardMenu;