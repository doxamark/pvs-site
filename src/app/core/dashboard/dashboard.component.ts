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
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
    clientName: string = ''

    sectionLoading: boolean = false;
    topAssessorsLoading: boolean = false;
    taxPerStateLoading: boolean = false;
    totalSavings: number = 0;
    totalTaxes: number = 0;
    totalValue: number = 0;

    totalSavingsPerYear: any[] = [];
    totalTaxesPerYear: any[] = [];
    totalValuePerYear: any[] = [];

    topAssessors: any[] = [];
    taxesPerState: any[] = [];

    clientSavingsChartData: any;
    clientTaxesChartData: any;
    clientPropertyValuesChartData: any;

    Highcharts: any;
    chartConstructor = 'mapChart';
    chartOptions: any;

    chartMapOptions: any;
    subscription!: Subscription;

    selectedSavingsYear: any = {};
    selectedTaxYear: any = {};
    selectedValueYear: any = {};
    selectedAssessorState: any = { state: 'Alabama', abbr: 'AL' };

    yearTrend: any[] = [
        { year: '5 years', value: 5 },
        { year: '10 years', value: 10 },
        { year: '15 years', value: 15 },
    ];

    selectedYearTrend: any = this.yearTrend[0];

    usStateYears: any[] = [];
    selectedStateYear: any = {};

    usStates: any[] = [];
    topAssessorsData: any = [];
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

        this.statisticService.getUSStates().subscribe((usStates) => {
            this.usStates = usStates;
        });
    }

    ngOnInit() {
        this.clientName = localStorage.getItem('clientName')
        this.usStateYears = this.generateYearOptions(
            2000,
            new Date().getFullYear()
        );
        this.selectedStateYear = this.usStateYears[0];
        this.getStatistics();
    }

    onSavingsYearChange(event: any): void {
        this.selectedSavingsYear = event.value;
        this.totalSavings = event.value.value;
    }

    onTaxYearChange(event: any): void {
        this.selectedTaxYear = event.value;
        this.totalTaxes = event.value.value;
    }

    onValueYearChange(event: any): void {
        this.selectedValueYear = event.value;
        this.totalValue = event.value.value;
    }

    onYearTrendChange(event: any): void {
        this.selectedYearTrend = event.value;
        this.initChart();
    }

    onStateChange(event: any): void {
        this.topAssessorsLoading = true;
        this.selectedAssessorState = event.value;
        this.statisticService
            .getTopAssessors(this.selectedAssessorState.state)
            .subscribe((topAssessors) => {
                this.topAssessors = topAssessors;
                this.initStackGraph();

                setTimeout(() => {
                    this.topAssessorsLoading = false;
                }, 500);
            });
    }

    onStateYearChange(event: any): void {
        this.taxPerStateLoading = true;
        this.selectedStateYear = event.value;
        this.statisticService
            .getTaxesPerState(this.selectedStateYear.label)
            .subscribe((taxesPerState) => {
                this.taxesPerState = taxesPerState;
                this.initMap();

                setTimeout(() => {
                    this.taxPerStateLoading = false;
                }, 500);
            });
    }

    getStatistics() {
        this.sectionLoading = true;
        forkJoin({
            totalSavingsPerYear: this.statisticService.getClientSavings(),
            totalTaxesPerYear: this.statisticService.getClientTaxes(),
            totalValuePerYear: this.statisticService.getClientValue(),
            taxesPerState: this.statisticService.getTaxesPerState(
                this.selectedStateYear.label
            ),
            topAssessors: this.statisticService.getTopAssessors(
                this.selectedAssessorState.state
            ),
        }).subscribe(
            ({
                totalSavingsPerYear,
                totalTaxesPerYear,
                totalValuePerYear,
                taxesPerState,
                topAssessors,
            }) => {
                this.totalSavingsPerYear = totalSavingsPerYear;
                this.totalTaxesPerYear = totalTaxesPerYear;
                this.totalValuePerYear = totalValuePerYear;
                this.taxesPerState = taxesPerState;
                this.topAssessors = topAssessors;

                this.selectedSavingsYear = this.totalSavingsPerYear[0];
                this.totalSavings = this.totalSavingsPerYear[0].value;

                this.selectedTaxYear = this.totalTaxesPerYear[0];
                this.totalTaxes = this.totalTaxesPerYear[0].value;

                this.selectedValueYear = this.totalValuePerYear[0];
                this.totalValue = this.totalValuePerYear[0].value;

                this.initChart();
                this.initStackGraph();
                this.initMap();
                setTimeout(() => {
                    this.sectionLoading = false;
                }, 500);
            }
        );
    }

    initMap() {
        this.Highcharts = Highcharts;

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
                    data: this.taxesPerState,
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
            labels: this.totalSavingsPerYear
                .slice(1, this.selectedYearTrend.value + 1)
                .map((item) => item.year)
                .reverse(),
            datasets: [
                {
                    label: 'Client Savings Trend Over The Years',
                    data: this.totalSavingsPerYear
                        .slice(1, this.selectedYearTrend.value + 1)
                        .map((item) => item.value)
                        .reverse(),
                    fill: true,
                    backgroundColor: '#d6efff',
                    borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                },
            ],
        };

        this.clientTaxesChartData = {
            labels: this.totalTaxesPerYear
                .slice(0, this.selectedYearTrend.value)
                .map((item) => item.year)
                .reverse(),
            datasets: [
                {
                    label: 'Client Taxes Trend Over The Years',
                    data: this.totalTaxesPerYear
                        .slice(0, this.selectedYearTrend.value)
                        .map((item) => item.value)
                        .reverse(),
                    fill: true,
                    backgroundColor: '#d6efff',
                    borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                },
            ],
        };

        this.clientPropertyValuesChartData = {
            labels: this.totalValuePerYear
                .slice(0, this.selectedYearTrend.value)
                .map((item) => item.year)
                .reverse(),
            datasets: [
                {
                    label: 'Client Property Value Trend Over The Years',
                    data: this.totalValuePerYear
                        .slice(0, this.selectedYearTrend.value)
                        .map((item) => item.value)
                        .reverse(),
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

    initStackGraph() {
        this.topAssessorsData = {
            labels: this.topAssessors.map((item) => item.name),
            datasets: [
                {
                    label: 'Value',
                    backgroundColor: '#6fe9d6',
                    data: this.topAssessors.map((item) => item.value),
                },
                {
                    label: 'Taxes',
                    backgroundColor: '#64bbfc',
                    data: this.topAssessors.map((item) => item.tax),
                },
            ],
        };
    }

    generateYearOptions(
        startYear: number,
        endYear: number
    ): { label: string; value: number }[] {
        const options = [];
        for (let year = endYear; year >= startYear; year--) {
            options.push({ label: year.toString(), value: year });
        }
        return options;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
