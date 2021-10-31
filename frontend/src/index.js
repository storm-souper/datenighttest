import Header from "./components/Header.js";
import CartScreen from "./screen/CartScreen.js";
import DashboardScreen from "./screen/DashboardScreen.js";
import Error404Screen from "./screen/Error404Screen.js";
import HomeScreen from "./screen/HomeScreen.js";
import OrderListScreen from "./screen/OrderListScreen.js";
import OrderScreen from "./screen/OrderScreen.js";
import PaymentScreen from "./screen/PaymentScreen.js";
import PlaceOrderScreen from "./screen/PlaceorderScreen.js";
import ProductEditScreen from "./screen/productEditScreen.js";
import ProductListScreen from "./screen/ProductListScreen.js";
import ProductScreen from "./screen/ProductScreen.js";
import ProfileScreen from "./screen/ProfileScreen.js";
import RegisterScreen from "./screen/RegisterScreen.js";
import ShippingScreen from "./screen/ShippingScreen.js";
import SigninScreen from "./screen/SigninScreen.js";
import { hideLoading, parseRequestURL, showLoading } from "./utils.js";
const routes = {
  '/': HomeScreen,
  '/product/:id': ProductScreen,
  '/order/:id': OrderScreen,
  '/cart/:id': CartScreen,
  '/cart': CartScreen,
  '/signin': SigninScreen,
  '/register': RegisterScreen,
  '/profile': ProfileScreen,
  '/shipping': ShippingScreen,
  '/payment': PaymentScreen,
  '/placeorder': PlaceOrderScreen,
  '/dashboard': DashboardScreen,
  '/productlist': ProductListScreen,
  '/product/:id/edit': ProductEditScreen,
  '/orderlist': OrderListScreen,
};
const router = async () => {
  showLoading();
  const request = parseRequestURL();
  const parseURL =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');
  const screen = routes[parseURL] ? routes[parseURL] : Error404Screen;
  const header = document.getElementById('header-container');
  header.innerHTML = await Header.render(); 
  await Header.after_render();
  const main = document.getElementById('main-container');
  main.innerHTML = await screen.render(); 
  if (screen.after_render) await screen.after_render(); 
  hideLoading();
};

window.addEventListener("load", router);
window.addEventListener("hashchange", router);