export class SalesmanPerformanceDataDto {
    month: string; // "YYYY-MM"
    totalMeetings: number;
    closedMeetings: number;
}

export class SalesmanPerformanceDto {
    salesmanName: string;
    data: SalesmanPerformanceDataDto[];
}
