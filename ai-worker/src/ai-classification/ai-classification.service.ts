import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ClassificationResultDto, MeetingForClassificationDto } from './dto';
import { CommercialSector, LeadSource, InterestReason, VambeModel } from './enum';
import { ClassificationJobData } from './classification.consumer';

@Injectable()
export class AiClassificationService {
  private readonly openai: OpenAI;

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async processClassificationJob(jobData: ClassificationJobData): Promise<void> {
    try {
      const meeting = await this.prisma.clientMeeting.findUnique({
        where: { id: jobData.meetingId },
        include: { classification: true }
      });

      if (!meeting) {
        throw new Error(`Meeting with ID ${jobData.meetingId} not found`);
      }

      if (meeting.classification) {
        console.log(`Meeting ${jobData.meetingId} already has classification, skipping.`);
        return;
      }

      const meetingDto: MeetingForClassificationDto = {
        id: meeting.id,
        name: meeting.name,
        transcription: meeting.transcription || '',
      };

      const classification = await this.classifyMeeting(meetingDto);

      await this.attachClassification(meetingDto, classification);

    } catch (error) {
      console.error('Error processing classification job:', error);
      throw error;
    }
  }

  async classifyMeeting(meeting: MeetingForClassificationDto): Promise<ClassificationResultDto> {
    if (!meeting.transcription || meeting.transcription.trim().length === 0) {
      throw new Error('Meeting transcription is required for classification');
    }

    const prompt = this.buildClassificationPrompt(meeting);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        top_p: 1,
        stop: ['\n\n'],
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst specializing in client classification for a software company called Vambe. You analyze meeting transcriptions and provide structured classifications in JSON format. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      const responseContent = completion.choices[0]?.message?.content;

      console.log('Response from OpenAI:', responseContent);

      if (!responseContent) {
        throw new Error('No response received from OpenAI');
      }

      const cleanedResponse = this.cleanJsonResponse(responseContent);
      const classification = JSON.parse(cleanedResponse) as ClassificationResultDto;

      this.validateClassification(classification);
      
      return classification;

    } catch (error) {
      console.error('Error during classification:', error);
      throw new Error(`Failed to classify meeting: ${error.message}`);
    }
  }

  async attachClassification(meeting: MeetingForClassificationDto, classification: ClassificationResultDto): Promise<void> {
    try {
      const existingClassification = await this.prisma.clientClassification.findUnique({
        where: { clientMeetingId: meeting.id }
      });

      if (existingClassification) {
        return;
      }

      await this.prisma.clientClassification.create({
        data: {
          clientMeetingId: meeting.id,
          commercialSector: classification.commercialSector as any,
          leadSource: classification.leadSource as any,
          interestReason: classification.interestReason as any,
          hasDemandPeaks: classification.hasDemandPeaks,
          hasSeasonalDemand: classification.hasSeasonalDemand,
          estimatedDailyInteractions: classification.estimatedDailyInteractions,
          estimatedWeeklyInteractions: classification.estimatedWeeklyInteractions,
          estimatedMonthlyInteractions: classification.estimatedMonthlyInteractions,
          hasTechTeam: classification.hasTechTeam,
          vambeModel: classification.vambeModel as any,
          isPotentialClient: classification.isPotentialClient,
          isProblemClient: classification.isProblemClient,
          isLostClient: classification.isLostClient,
          shouldBeContacted: classification.shouldBeContacted,
          confidenceScore: classification.confidenceScore,
          modelVersion: classification.modelVersion,
        }
      });
    } catch (error) {
      console.error('Error attaching classification:', error);
      throw error;
    }
  }

  private buildClassificationPrompt(meeting: MeetingForClassificationDto): string {
    const commercialSectors = Object.values(CommercialSector).join(', ');
    const leadSources = Object.values(LeadSource).join(', ');
    const interestReasons = Object.values(InterestReason).join(', ');
    const vambeModels = Object.values(VambeModel).join(', ');

    return `
Analyze the following meeting transcription and classify the client based on the conversation. 

Meeting Information:
- Client Name: ${meeting.name || 'Unknown'}
- Transcription:
"${meeting.transcription}"

Based on this transcription, provide a JSON classification with the following structure and guidelines:

{
  "commercialSector": "one of: ${commercialSectors}",
  "leadSource": "one of: ${leadSources}",
  "interestReason": "one of: ${interestReasons}",
  "hasDemandPeaks": boolean (true if client mentions seasonal spikes, high traffic periods, or variable demand. Mentioning growth is not enough.),
  "hasSeasonalDemand": boolean (true if client mentions Christmas, holidays, specific seasons affecting business),
  "estimatedDailyInteractions": number (estimate daily customer interactions based on business size/type, 0-10000),
  "estimatedWeeklyInteractions": number (weekly interactions, usually daily * 7),
  "estimatedMonthlyInteractions": number (monthly interactions, usually weekly * 4),
  "hasTechTeam": boolean (true if client mentions developers, IT team, technical staff),
  "vambeModel": "one of: ${vambeModels} or null" (recommend based on business size and needs),
  "isPotentialClient": boolean (true if client shows genuine interest and need for the product),
  "isProblemClient": boolean (true if client seems difficult, unrealistic expectations, or problematic),
  "isLostClient": boolean (true if client clearly rejected or showed no interest),
  "shouldBeContacted": boolean (true if follow-up is recommended),
  "confidenceScore": number (0.0 to 1.0, confidence in this classification),
  "modelVersion": "gpt-4o-mini-analysis-v1.0"
}

Classification Guidelines:
- commercialSector: Analyze the business type mentioned in the conversation
- leadSource: If not explicitly mentioned, infer from context (conference, referral, etc.)
- interestReason: Main pain point or benefit the client is seeking
- Interaction estimates: If said, use it as a reference, else be conservative but realistic based on business type and size
- vambeModel recommendations:
  * AXIS: Is like n8n, no code integration platform for large enterprises with high volume
  * MERCUR: Large and mid businesses, a model for all, with moderate customization
  * IRIS: Small businesses, ideal for quick setup
  * API: Technical clients wanting integration
- isPotentialClient: True if already closed or if genuine business need and interest are shown
- isProblemClient: Only true if the client may be a bad lead
- isLostClient: Only true if explicit affirmation
- hasDemandPeaks and hasSeasonalDemand: Only true if mentioned
- shouldBeContacted: True if is potential client and the deal can be closed ASAP
- confidenceScore: Lower if transcription is unclear or limited information

Respond with ONLY the JSON object, no additional text or formatting.
    `.trim();
  }

  private cleanJsonResponse(response: string): string {
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
    
    return cleaned.trim();
  }

  private validateClassification(classification: ClassificationResultDto): void {
    const required = [
      'commercialSector', 'leadSource', 'interestReason',
      'hasDemandPeaks', 'hasSeasonalDemand',
      'estimatedDailyInteractions', 'estimatedWeeklyInteractions', 'estimatedMonthlyInteractions',
      'hasTechTeam', 'isPotentialClient', 'isProblemClient', 'isLostClient',
      'shouldBeContacted', 'confidenceScore', 'modelVersion'
    ];

    for (const field of required) {
      if (classification[field] === undefined || classification[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Object.values(CommercialSector).includes(classification.commercialSector as CommercialSector)) {
      throw new Error(`Invalid commercialSector: ${classification.commercialSector}`);
    }

    if (!Object.values(LeadSource).includes(classification.leadSource as LeadSource)) {
      throw new Error(`Invalid leadSource: ${classification.leadSource}`);
    }

    if (!Object.values(InterestReason).includes(classification.interestReason as InterestReason)) {
      throw new Error(`Invalid interestReason: ${classification.interestReason}`);
    }

    if (classification.vambeModel && !Object.values(VambeModel).includes(classification.vambeModel as VambeModel)) {
      throw new Error(`Invalid vambeModel: ${classification.vambeModel}`);
    }

    if (classification.confidenceScore < 0 || classification.confidenceScore > 1) {
      throw new Error(`Invalid confidenceScore: ${classification.confidenceScore}`);
    }

    if (classification.estimatedDailyInteractions < 0 || 
        classification.estimatedWeeklyInteractions < 0 || 
        classification.estimatedMonthlyInteractions < 0) {
      throw new Error('Interaction estimates cannot be negative');
    }
  }
}
