import Module from '../module';
import Chart from 'chart.js';

export default class Charts extends Module {
  constructor() {
    super();
    this.charts = {
      income: this.find('#income'),
      costs: this.find('#costs'),
      sources: this.find('#income-sources'),
    };
  }
  init() {

    const income = new Chart(this.charts.income, {
          type: 'line',
          data: {
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [{
                  label: 'Income',
                  data: [4, 12, 9, 10, 15, 18, 25],
                  backgroundColor: 'rgba(35,52,52,.8)',
                  borderColor: 'rgba(255,182,71,1)',
                  borderWidth: 2,
                  lineTension: 0
              }]
          },
          options: {
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });

      const costs = new Chart(this.charts.costs, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: 'Costs',
                    data: [13, 16, 10, 9, 12, 8, 6],
                    backgroundColor: 'rgba(35,52,52,.8)',
                    borderColor: 'rgba(255,182,71,1)',
                    borderWidth: 2,
                    lineTension: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

    const incSources = new Chart(this.charts.sources, {
      type: 'doughnut',
      data: {
        labels: ["Construction", "Know-how", "Consulting", "Inovations"],
        datasets: [{
          data: [10, 20, 30, 40],
          backgroundColor: [
               'rgba(0,102,204,.8)',
               'rgba(204,0,0,.8)',
               'rgba(255,182,71,.8)',
               'rgba(35,52,52,.8)',
           ],
        }],
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  }
}
