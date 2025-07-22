import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateUtils } from '../utils/date.utils';

@Injectable()
export class TrendingService {
    constructor(private prisma: PrismaService) {}

    async calculateTrending(metric: 'totalMeetings' | 'totalClosings' | 'closingRate' | 'averageClosings'): Promise<{ direction: 'up' | 'down' | 'stable', value: number }> {
        const lastMeeting = await this.prisma.clientMeeting.findFirst({
            orderBy: { date: 'desc' },
            select: { date: true }
        });

        if (!lastMeeting) {
            return { direction: 'stable', value: 0 };
        }

        const now = lastMeeting.date;
        const threeMonthsAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixMonthsAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        const currentPeriodMeetings = await this.prisma.clientMeeting.findMany({
            where: {
                date: {
                    gte: threeMonthsAgo,
                    lte: now
                }
            },
            select: { closed: true, date: true }
        });

        const previousPeriodMeetings = await this.prisma.clientMeeting.findMany({
            where: {
                date: {
                    gte: sixMonthsAgo,
                    lt: threeMonthsAgo
                }
            },
            select: { closed: true, date: true }
        });

        let currentValue = 0;
        let previousValue = 0;

        switch (metric) {
            case 'totalMeetings':
                currentValue = currentPeriodMeetings.length;
                previousValue = previousPeriodMeetings.length;
                break;

            case 'totalClosings':
                currentValue = currentPeriodMeetings.filter(m => m.closed).length;
                previousValue = previousPeriodMeetings.filter(m => m.closed).length;
                break;

            case 'closingRate':
                const currentTotal = currentPeriodMeetings.length;
                const currentClosed = currentPeriodMeetings.filter(m => m.closed).length;
                currentValue = currentTotal > 0 ? (currentClosed / currentTotal) * 100 : 0;

                const previousTotal = previousPeriodMeetings.length;
                const previousClosed = previousPeriodMeetings.filter(m => m.closed).length;
                previousValue = previousTotal > 0 ? (previousClosed / previousTotal) * 100 : 0;
                break;

            case 'averageClosings':
                const currentMonths = DateUtils.groupByMonths(currentPeriodMeetings.filter(m => m.closed));
                const previousMonths = DateUtils.groupByMonths(previousPeriodMeetings.filter(m => m.closed));
                
                currentValue = currentMonths.size > 0 ? currentPeriodMeetings.filter(m => m.closed).length / currentMonths.size : 0;
                previousValue = previousMonths.size > 0 ? previousPeriodMeetings.filter(m => m.closed).length / previousMonths.size : 0;
                break;
        }

        const threshold = 0.05;
        const percentageChange = previousValue > 0 ? Math.abs(currentValue - previousValue) / previousValue : 0;
        
        const difference = currentValue - previousValue;
        const roundedDifference = Math.round(difference * 100) / 100;

        if (percentageChange <= threshold) {
            return { direction: 'stable', value: roundedDifference };
        }

        return { 
            direction: currentValue > previousValue ? 'up' : 'down', 
            value: roundedDifference 
        };
    }
}
