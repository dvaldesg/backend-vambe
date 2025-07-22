import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateUtils } from '../utils/date.utils';

@Injectable()
export class CalculationService {
    constructor(private prisma: PrismaService) {}

    async calculateAverageClosingsPerMonth(): Promise<number> {
        const closedMeetings = await this.prisma.clientMeeting.findMany({
            where: { closed: true },
            select: { date: true }
        });

        if (closedMeetings.length === 0) {
            return 0;
        }

        const monthlyClosings = new Map<string, number>();
        
        closedMeetings.forEach(meeting => {
            const date = new Date(meeting.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            monthlyClosings.set(monthYear, (monthlyClosings.get(monthYear) || 0) + 1);
        });

        const totalMonths = monthlyClosings.size;
        const totalClosings = closedMeetings.length;
        
        return totalMonths > 0 
            ? Math.round((totalClosings / totalMonths) * 100) / 100
            : 0;
    }

    async getChartAreaData(): Promise<Array<{ date: string; closed: number; open: number }>> {
        const allMeetings = await this.prisma.clientMeeting.findMany({
            select: {
                date: true,
                closed: true
            },
            orderBy: {
                date: 'asc'
            }
        });

        if (allMeetings.length === 0) {
            return [];
        }

        const weeklyData = new Map<string, { closed: number; open: number }>();

        allMeetings.forEach(meeting => {
            const date = new Date(meeting.date);
            const weekStart = DateUtils.getWeekStart(date);
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData.has(weekKey)) {
                weeklyData.set(weekKey, { closed: 0, open: 0 });
            }

            const weekStats = weeklyData.get(weekKey)!;
            if (meeting.closed) {
                weekStats.closed++;
            } else {
                weekStats.open++;
            }
        });

        const sortedWeeks = Array.from(weeklyData.keys()).sort();
        const firstWeek = new Date(sortedWeeks[0]);
        const lastWeek = new Date(sortedWeeks[sortedWeeks.length - 1]);

        const completeWeeklyData = new Map<string, { closed: number; open: number }>();
        let currentWeek = new Date(firstWeek);

        while (currentWeek <= lastWeek) {
            const weekKey = currentWeek.toISOString().split('T')[0];
            
            if (weeklyData.has(weekKey)) {
                completeWeeklyData.set(weekKey, weeklyData.get(weekKey)!);
            } else {
                completeWeeklyData.set(weekKey, { closed: 0, open: 0 });
            }

            currentWeek.setDate(currentWeek.getDate() + 7);
        }

        return Array.from(completeWeeklyData.entries())
            .map(([date, stats]) => ({
                date,
                closed: stats.closed,
                open: stats.open
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
}
