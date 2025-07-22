export class SectionCardsDto {
    totalClientMeetings: number;
    totalClientMeetingsTrending: 'up' | 'down' | 'stable';
    totalClientMeetingsTrendingValue: number;
    totalClosings: number;
    totalClosingsTrending: 'up' | 'down' | 'stable';
    totalClosingsTrendingValue: number;
    closingRate: number;
    closingRateTrending: 'up' | 'down' | 'stable';
    closingRateTrendingValue: number;
    averageClosingsPerMonth: number;
    averageClosingsPerMonthTrending: 'up' | 'down' | 'stable';
    averageClosingsPerMonthTrendingValue: number;
}
