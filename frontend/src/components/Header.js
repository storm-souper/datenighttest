import { getUserInfo } from "../localStorage";

const Header = {
  render: async () => {
    const {name, isAdmin} = await getUserInfo();
    return ` 
    <div class="brand">
      <a href="/#/">NewWeb</a>
    </div>
    <div>
    ${
      name 
      ? `<a href="/#/profile">${name}</a>` 
      : `<a href="/#/signin">Sign-In</a>`
    } 
      <a href="/#/cart">Cart</a>
      ${isAdmin 
        ? `<a href="/#/dashboard">Dashboard</a>` 
        : ''}
    </div>`;
  },  
  after_render: () => {},
};

export default Header;