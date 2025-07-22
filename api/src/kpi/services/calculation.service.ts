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

    async getNewLeadsData(): Promise<Array<{ dateRange: string; meetingsClosed: number; notClosed: number }>> {
        const lastMeeting = await this.prisma.clientMeeting.findFirst({
            orderBy: { date: 'desc' },
            select: { date: true }
        });

        if (!lastMeeting) {
            return [];
        }

        const endDate = lastMeeting.date;
        const startDate = new Date(endDate.getTime() - (6 * 7 * 24 * 60 * 60 * 1000));

        const meetings = await this.prisma.clientMeeting.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { date: true, closed: true },
            orderBy: { date: 'asc' }
        });

        const weeklyData = new Map<string, { closed: number; notClosed: number }>();

        meetings.forEach(meeting => {
            const weekStart = DateUtils.getWeekStart(meeting.date);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const weekKey = `${weekStart.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`;

            if (!weeklyData.has(weekKey)) {
                weeklyData.set(weekKey, { closed: 0, notClosed: 0 });
            }

            const weekStats = weeklyData.get(weekKey)!;
            if (meeting.closed) {
                weekStats.closed++;
            } else {
                weekStats.notClosed++;
            }
        });

        return Array.from(weeklyData.entries())
            .map(([dateRange, stats]) => ({
                dateRange,
                meetingsClosed: stats.closed,
                notClosed: stats.notClosed
            }));
    }

    async getVambeReasonData(): Promise<Array<{ reason: string; quantity: number }>> {
        const classifications = await this.prisma.clientClassification.findMany({
            select: { interestReason: true }
        });

        const reasonCounts = new Map<string, number>();

        classifications.forEach(classification => {
            const reason = classification.interestReason;
            reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
        });

        return Array.from(reasonCounts.entries())
            .map(([reason, quantity]) => ({ reason, quantity }))
            .sort((a, b) => b.quantity - a.quantity);
    }

    async getLeadsSourceData(): Promise<{ source: string; quantity: number }[]> {
    const classifications = await this.prisma.clientClassification.findMany({
      select: {
        leadSource: true,
      },
    });

    const sourceCount = classifications.reduce((acc, item) => {
      const source = item.leadSource || 'Sin clasificar';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCount)
      .map(([source, quantity]) => ({ source, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }

  async getCommercialSectorsData(): Promise<{ commercial_sector: string; quantity: number }[]> {
    const classifications = await this.prisma.clientClassification.findMany({
      select: {
        commercialSector: true,
      },
    });

    const sectorCount = classifications.reduce((acc, item) => {
      const sector = item.commercialSector || 'Sin clasificar';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sectorCount)
      .map(([commercial_sector, quantity]) => ({ commercial_sector, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }

  async getLeadsSourceSuccessRateData(): Promise<{ leadSource: string; closed: number; notClosed: number; successRate: number }[]> {
    const meetingsWithClassification = await this.prisma.clientMeeting.findMany({
      where: {
        classification: {
          isNot: null
        }
      },
      select: {
        closed: true,
        classification: {
          select: {
            leadSource: true
          }
        }
      }
    });

    const sourceStats = meetingsWithClassification.reduce((acc, meeting) => {
      const source = meeting.classification?.leadSource || 'Sin clasificar';
      
      if (!acc[source]) {
        acc[source] = { closed: 0, notClosed: 0 };
      }
      
      if (meeting.closed) {
        acc[source].closed++;
      } else {
        acc[source].notClosed++;
      }
      
      return acc;
    }, {} as Record<string, { closed: number; notClosed: number }>);

    return Object.entries(sourceStats)
      .map(([leadSource, stats]) => {
        const total = stats.closed + stats.notClosed;
        const successRate = total > 0 ? Math.round((stats.closed / total) * 100 * 100) / 100 : 0;
        
        return {
          leadSource,
          closed: stats.closed,
          notClosed: stats.notClosed,
          successRate
        };
      })
      .sort((a, b) => b.successRate - a.successRate);
  }

  async getCommercialSectorSuccessRateData(): Promise<{ commercialSector: string; closed: number; notClosed: number; successRate: number }[]> {
    const meetingsWithClassification = await this.prisma.clientMeeting.findMany({
      where: {
        classification: {
          isNot: null
        }
      },
      select: {
        closed: true,
        classification: {
          select: {
            commercialSector: true
          }
        }
      }
    });

    const sectorStats = meetingsWithClassification.reduce((acc, meeting) => {
      const sector = meeting.classification?.commercialSector || 'Sin clasificar';
      
      if (!acc[sector]) {
        acc[sector] = { closed: 0, notClosed: 0 };
      }
      
      if (meeting.closed) {
        acc[sector].closed++;
      } else {
        acc[sector].notClosed++;
      }
      
      return acc;
    }, {} as Record<string, { closed: number; notClosed: number }>);

    return Object.entries(sectorStats)
      .map(([commercialSector, stats]) => {
        const total = stats.closed + stats.notClosed;
        const successRate = total > 0 ? Math.round((stats.closed / total) * 100 * 100) / 100 : 0;
        
        return {
          commercialSector,
          closed: stats.closed,
          notClosed: stats.notClosed,
          successRate
        };
      })
      .sort((a, b) => b.successRate - a.successRate);
  }

  async getSalesmanPerformanceData(): Promise<{ salesmanName: string; data: { month: string; totalMeetings: number; closedMeetings: number }[] }[]> {
    const meetings = await this.prisma.clientMeeting.findMany({
      select: {
        salesmanName: true,
        date: true,
        closed: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    if (meetings.length === 0) {
      return [];
    }

    const dates = meetings.map(m => new Date(m.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const allMonths: string[] = [];
    let currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    while (currentDate <= endDate) {
      allMonths.push(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const salesmanStats = meetings.reduce((acc, meeting) => {
      const salesmanName = meeting.salesmanName;
      const date = new Date(meeting.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[salesmanName]) {
        acc[salesmanName] = {};
      }
      
      if (!acc[salesmanName][monthKey]) {
        acc[salesmanName][monthKey] = { totalMeetings: 0, closedMeetings: 0 };
      }
      
      acc[salesmanName][monthKey].totalMeetings++;
      if (meeting.closed) {
        acc[salesmanName][monthKey].closedMeetings++;
      }
      
      return acc;
    }, {} as Record<string, Record<string, { totalMeetings: number; closedMeetings: number }>>);

    return Object.entries(salesmanStats)
      .map(([salesmanName, monthlyData]) => ({
        salesmanName,
        data: allMonths.map(month => ({
          month,
          totalMeetings: monthlyData[month]?.totalMeetings || 0,
          closedMeetings: monthlyData[month]?.closedMeetings || 0
        }))
      }))
      .sort((a, b) => a.salesmanName.localeCompare(b.salesmanName));
  }

  async getSalesmanSuccessRateData(salesmanId: number): Promise<{ commercialSector: string; closed: number; notClosed: number; successRate: number }[]> {
    const meetingsWithClassification = await this.prisma.clientMeeting.findMany({
      where: {
        salesmanId: salesmanId,
        classification: {
          isNot: null
        }
      },
      select: {
        closed: true,
        classification: {
          select: {
            commercialSector: true
          }
        }
      }
    });

    const sectorStats = meetingsWithClassification.reduce((acc, meeting) => {
      const sector = meeting.classification?.commercialSector || 'Sin clasificar';
      
      if (!acc[sector]) {
        acc[sector] = { closed: 0, notClosed: 0 };
      }
      
      if (meeting.closed) {
        acc[sector].closed++;
      } else {
        acc[sector].notClosed++;
      }
      
      return acc;
    }, {} as Record<string, { closed: number; notClosed: number }>);

    return Object.entries(sectorStats)
      .map(([commercialSector, stats]) => {
        const total = stats.closed + stats.notClosed;
        const successRate = total > 0 ? Math.round((stats.closed / total) * 100 * 100) / 100 : 0;
        
        return {
          commercialSector,
          closed: stats.closed,
          notClosed: stats.notClosed,
          successRate
        };
      })
      .sort((a, b) => b.successRate - a.successRate);
  }
}
