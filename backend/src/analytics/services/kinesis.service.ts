import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class KinesisService {
  private readonly logger = new Logger(KinesisService.name);
  private kinesis: AWS.Kinesis;
  private streamName: string;

  constructor(private configService: ConfigService) {
    this.kinesis = new AWS.Kinesis({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
    
    this.streamName = this.configService.get(
      'KINESIS_STREAM_NAME',
      'automerge-analytics-dev',
    );
  }

  async putRecord(data: any, partitionKey?: string): Promise<void> {
    try {
      const params: AWS.Kinesis.PutRecordInput = {
        StreamName: this.streamName,
        Data: JSON.stringify(data),
        PartitionKey: partitionKey || data.userId || data.sessionId || 'default',
      };

      const result = await this.kinesis.putRecord(params).promise();
      
      this.logger.log(
        `Successfully put record to Kinesis: ${result.SequenceNumber}`,
      );
    } catch (error) {
      this.logger.error(`Failed to put record to Kinesis: ${error.message}`);
      // Don't throw error to prevent breaking the main flow
    }
  }

  async putRecords(records: any[]): Promise<void> {
    try {
      const kinesisRecords: AWS.Kinesis.PutRecordsRequestEntry[] = records.map(
        (record, index) => ({
          Data: JSON.stringify(record),
          PartitionKey:
            record.userId || record.sessionId || `default-${index}`,
        }),
      );

      const params: AWS.Kinesis.PutRecordsInput = {
        StreamName: this.streamName,
        Records: kinesisRecords,
      };

      const result = await this.kinesis.putRecords(params).promise();
      
      const failedRecords = result.Records.filter((r) => r.ErrorCode);
      
      if (failedRecords.length > 0) {
        this.logger.warn(
          `${failedRecords.length} records failed to be put to Kinesis`,
        );
      } else {
        this.logger.log(
          `Successfully put ${records.length} records to Kinesis`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to put records to Kinesis: ${error.message}`);
    }
  }
}