import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

interface RevenueCount {
  _id: number;
  total: number;
}

interface UserCount {
  _id: number;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalToys: number;
  userCountsPerMonth: UserCount[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStatistics();
  }

  fetchStatistics() {
    this.http
      .get('http://localhost:33070/order/statistics')
      .subscribe((data: any) => {
        this.totalUsers = data.totalUsers;
        this.totalOrders = data.totalOrders;
        this.totalRevenue = data.totalRevenue;
        this.totalToys = data.totalToys;
        this.userCountsPerMonth = data.userCountsPerMonth;

        this.renderStatisticsChart(data.revenueCountsPerMonth);
        this.renderUsersPerMonthChart();
      });
  }

  renderStatisticsChart(revenueCountsPerMonth: RevenueCount[]) {
    const ctx = document.getElementById('statisticsChart') as HTMLCanvasElement;

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const labels = revenueCountsPerMonth.map((entry) => months[entry._id - 1]);
    const data = revenueCountsPerMonth.map((entry) => entry.total);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
    });
  }

  renderUsersPerMonthChart() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const ctx = document.getElementById(
      'usersPerMonthChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.userCountsPerMonth.map((entry) => months[entry._id - 1]),
        datasets: [
          {
            label: 'Users per Month',
            data: this.userCountsPerMonth.map((entry) => entry.count),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
