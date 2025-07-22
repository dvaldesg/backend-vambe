export class DateUtils {
    static getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const weekStart = new Date(d.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    static groupByWeeks(meetings: { date: Date; closed: boolean }[]): Map<string, number> {
        const weeklyData = new Map<string, number>();
        
        meetings.forEach(meeting => {
            const weekStart = this.getWeekStart(meeting.date);
            const weekKey = weekStart.toISOString().split('T')[0];
            weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + 1);
        });

        return weeklyData;
    }

    static groupByMonths(meetings: { date: Date; closed: boolean }[]): Map<string, number> {
        const monthlyData = new Map<string, number>();
        
        meetings.forEach(meeting => {
            const date = new Date(meeting.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
        });

        return monthlyData;
    }
}
