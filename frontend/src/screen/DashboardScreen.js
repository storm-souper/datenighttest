import { getSummary } from "../api";
import DashboardMenu from "../components/DashboardMenu";
import Chartist, { sum } from 'chartist';

let summary = {}
const DashboardScreen = {
  after_render: () => {  
    const dailyOrders = summary.dailyOrders;
    dailyOrders.map(x => {
      const newSortNumber = parseInt(x._id.replaceAll('-', ''))
      x.sortNumber = newSortNumber
    });
    dailyOrders.sort((a, b) => (a.sortNumber > b.sortNumber) ? 1 : -1);
    new Chartist.Line(
      '.ct-chart-line', 
      {
        labels: dailyOrders.map(x => x._id),
        series: [dailyOrders.map(x => x.sales)],
      }, 
      {
        showArea: true
      },
    );
    new Chartist.Pie(
      '.ct-chart-pie', 
      {
        labels: summary.productCategories.map(x => x._id),
        series: summary.productCategories.map(x => x.count),
      }, 
      {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        showLabel: true,
        donutSolid: true,
      },
    )
  },
  render: async () => {
    summary = await getSummary();
    console.log(summary.dailyOrders)
    return `
    <div class="dashboard">
      ${DashboardMenu.render({selected:'dashboard'})}
      <div class="dashboard-content">
        <h1>Dashboard</h1>
        <ul class="summary-items">
          <li>
            <div class="summary-title color1">
              <span><i class="fa fa-users">Users</i></span>
            </div>
            <div class="summary-body">${summary.users[0].numUsers}</div>
          </li>
          <li>
            <div class="summary-title color2">
              <span><i class="fa fa-users">Paid Orders</i></span>
            </div>
            <div class="summary-body">${summary.orders.numOrders}</div>
          </li>
          <li>
            <div class="summary-title color3">
              <span><i class="fa fa-users">Sales</i></span>
            </div>
            <div class="summary-body">$${summary.orders.totalSales}</div>
          </li>
        </ul>
        <div class="charts">
          <div>
            <h2>Sales</h2>
            <div class="ct-perfect-fourth ct-chart-line"></div>
          </div>
          <div>
            <h2>Categories</h2>
            <div class="ct-perfect-fourth ct-chart-pie"></div>
          </div>
        </div>
      </div>
    </div>
    `;
  },
};

export default DashboardScreen;