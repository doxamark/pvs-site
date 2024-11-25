import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StatisticService } from 'src/app/shared/service/statistic.service';
import { forkJoin } from 'rxjs';

import * as Highcharts from 'highcharts/highmaps';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

declare var require: any;
const usaMap = require('@highcharts/map-collection/countries/us/us-all.geo.json');

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    totalSavings: number = 0;
    totalTaxes: number = 0;
    totalValue: number = 0;

    totalSavingsPerYear: number[] = [];
    totalTaxesPerYear: number[] = [];
    totalValuePerYear: number[] = [];

    clientSavings: any[] = [];
    clientTaxes: any[] = [];
    clientPropertyValues: any[] = [];
    topAssessors: any[] = [];
    taxesPerState: any[] = [];

    clientSavingsChartData: any;
    clientTaxesChartData: any;
    clientPropertyValuesChartData: any;

    Highcharts: any;
    chartConstructor = 'mapChart';
    chartOptions: any;

    products!: any[];

    chartMapOptions: any;
    subscription!: Subscription;

    topAssessorsData: any = {
        labels: [
            'Los Angeles',
            'San Diego',
            'Orange',
            'San Bernardino',
            'Riverside',
            'Santa Clara',
            'Alameda',
            'Sacramento',
            'Fresno',
            'San Francisco',
        ],
        datasets: [
            {
                label: 'Value',
                backgroundColor: '#6fe9d6',
                data: [66, 49, 81, 71, 26, 65, 60, 81, 71, 26],
            },
            {
                label: 'Taxes',
                backgroundColor: '#64bbfc',
                data: [56, 52, 69, 81, 43, 55, 40, 69, 81, 43],
            },
        ],
    };

    StackedOptions = {
        indexAxis: 'y',
        plugins: {
            legend: {
                labels: {
                    color: '#black',
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: '#black',
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)',
                },
            },
            y: {
                stacked: true,
                ticks: {
                    color: '#black',
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)',
                },
            },
        },
    };

    constructor(
        private statisticService: StatisticService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.getStatistics();
        this.initChart();
        this.initMap()
        
    }

    getStatistics() {
        forkJoin({
            totalSavingsPerYear: this.statisticService.getClientSavings(),
            totalTaxesPerYear: this.statisticService.getClientTaxes(),
            totalValuePerYear: this.statisticService.getClientValue(),
            clientTrends: this.statisticService.getClientTrends(),
            taxesPerState: this.statisticService.getTaxesPerState(),
            topAssessors: this.statisticService.getTopAssessors(),
        }).subscribe(
            ({
                totalSavingsPerYear,
                totalTaxesPerYear,
                totalValuePerYear,
                clientTrends,
                taxesPerState,
                topAssessors,
            }) => {
                this.totalSavingsPerYear = totalSavingsPerYear;
                this.totalTaxesPerYear = totalTaxesPerYear;
                this.totalValuePerYear = totalValuePerYear;
                this.clientSavings = clientTrends.clientSavingsTrend;
                this.clientTaxes = clientTrends.clientTaxesTrend;
                this.clientPropertyValues = clientTrends.clientValueTrend;
                this.taxesPerState = taxesPerState;
                this.topAssessors = topAssessors;
            }
        );
    }

    initMap() {
        this.Highcharts = Highcharts;
        const taxesPerStateVar = [
            { id: 'us-ma', name: 'Massachusetts', value: 71340 },
            { id: 'us-ca', name: 'California', value: 78512 },
            { id: 'us-tx', name: 'Texas', value: 68473 },
            { id: 'us-ny', name: 'New York', value: 78039 },
            { id: 'us-fl', name: 'Florida', value: 55623 },
            { id: 'us-co', name: 'Colorado', value: 40000 },
            { id: 'us-al', name: 'Alabama', value: 0 },
            { id: 'us-ak', name: 'Alaska', value: 0 },
            { id: 'us-ar', name: 'Arkansas', value: 0 },
            { id: 'us-az', name: 'Arizona', value: 52000 },
            { id: 'us-ct', name: 'Connecticut', value: 62000 },
            { id: 'us-de', name: 'Delaware', value: 0 },
            { id: 'us-dc', name: 'District of Columbia', value: 0 },
            { id: 'us-ga', name: 'Georgia', value: 51000 },
            { id: 'us-hi', name: 'Hawaii', value: 0 },
            { id: 'us-id', name: 'Idaho', value: 0 },
            { id: 'us-il', name: 'Illinois', value: 65000 },
            { id: 'us-in', name: 'Indiana', value: 47000 },
            { id: 'us-ia', name: 'Iowa', value: 0 },
            { id: 'us-ks', name: 'Kansas', value: 0 },
            { id: 'us-ky', name: 'Kentucky', value: 0 },
            { id: 'us-la', name: 'Louisiana', value: 0 },
            { id: 'us-me', name: 'Maine', value: 0 },
            { id: 'us-md', name: 'Maryland', value: 68000 },
            { id: 'us-mi', name: 'Michigan', value: 48000 },
            { id: 'us-mn', name: 'Minnesota', value: 59000 },
            { id: 'us-ms', name: 'Mississippi', value: 0 },
            { id: 'us-mo', name: 'Missouri', value: 47000 },
            { id: 'us-mt', name: 'Montana', value: 0 },
            { id: 'us-ne', name: 'Nebraska', value: 0 },
            { id: 'us-nv', name: 'Nevada', value: 43000 },
            { id: 'us-nh', name: 'New Hampshire', value: 0 },
            { id: 'us-nj', name: 'New Jersey', value: 70000 },
            { id: 'us-nm', name: 'New Mexico', value: 0 },
            { id: 'us-nc', name: 'North Carolina', value: 55000 },
            { id: 'us-nd', name: 'North Dakota', value: 0 },
            { id: 'us-oh', name: 'Ohio', value: 56000 },
            { id: 'us-ok', name: 'Oklahoma', value: 0 },
            { id: 'us-or', name: 'Oregon', value: 47000 },
            { id: 'us-pa', name: 'Pennsylvania', value: 67000 },
            { id: 'us-ri', name: 'Rhode Island', value: 0 },
            { id: 'us-sc', name: 'South Carolina', value: 45000 },
            { id: 'us-sd', name: 'South Dakota', value: 0 },
            { id: 'us-tn', name: 'Tennessee', value: 47000 },
            { id: 'us-ut', name: 'Utah', value: 48000 },
            { id: 'us-vt', name: 'Vermont', value: 0 },
            { id: 'us-va', name: 'Virginia', value: 66000 },
            { id: 'us-wa', name: 'Washington', value: 72000 },
            { id: 'us-wv', name: 'West Virginia', value: 0 },
            { id: 'us-wi', name: 'Wisconsin', value: 47000 },
            { id: 'us-wy', name: 'Wyoming', value: 0 },
        ];

        this.chartMapOptions = {
            chart: {
                map: usaMap,
            },
            title: {
                text: '',
            },
            subtitle: {
                text: '',
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom',
                },
            },
            colorAxis: {
                min: 0,
                stops: [
                    [0, '#D6EFFF'], // Light blue
                    [0.5, '#5CA8FF'], // Medium blue
                    [1, '#003F88'],
                ],
            },
            tooltip: {
                headerFormat: '',
                pointFormat:
                    '<b>{point.name}</b><br>GDP: ${point.value} Billion',
            },
            series: [
                {
                    name: 'GDP per State',
                    mapData: usaMap,
                    data: taxesPerStateVar,
                    joinBy: ['hc-key', 'id'],
                    states: {
                        hover: {
                            color: '#BADA55',
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}', // Show state names
                    },
                },
            ],
        };
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.clientSavingsChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Client Savings Trend Over The Years',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: true,
                    backgroundColor: '#d6efff',
                    borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                },
            ],
        };

        this.clientTaxesChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Client Taxes Trend Over The Years',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: true,
                    backgroundColor: '#d6efff',
                    borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                },
            ],
        };

        this.clientPropertyValuesChartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Client Property Value Trend Over The Years',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: true,
                    backgroundColor: '#d6efff',
                    borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
