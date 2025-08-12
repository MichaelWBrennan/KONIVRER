import { DynamoDB } from 'aws-sdk';
import { BillingTier, LicenseData } from '../types';

export class LicenseService {
  private dynamodb: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(tableName: string = 'automerge-pro-licenses') {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  async validateLicense(installationId: number): Promise<LicenseData | null> {
    try {
      const result = await this.dynamodb.get({
        TableName: this.tableName,
        Key: { installationId }
      }).promise();

      if (!result.Item) {
        // Default free tier for new installations
        return {
          installationId,
          tier: 'free',
          features: ['basic_merge', 'status_checks'],
          isActive: true
        };
      }

      const license = result.Item as LicenseData;
      
      // Check if license is expired
      if (license.expiresAt && new Date() > new Date(license.expiresAt)) {
        license.isActive = false;
        license.tier = 'free';
        license.features = ['basic_merge', 'status_checks'];
      }

      // Check if trial is expired
      if (license.trialEndsAt && new Date() > new Date(license.trialEndsAt) && license.tier !== 'free') {
        license.isActive = false;
        license.tier = 'free';
        license.features = ['basic_merge', 'status_checks'];
      }

      return license;
    } catch (error) {
      console.error('Failed to validate license:', error);
      return null;
    }
  }

  async updateLicense(installationId: number, licenseData: Partial<LicenseData>): Promise<boolean> {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: { installationId },
        UpdateExpression: 'SET #tier = :tier, #features = :features, #isActive = :isActive, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#tier': 'tier',
          '#features': 'features',
          '#isActive': 'isActive',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':tier': licenseData.tier || 'free',
          ':features': licenseData.features || ['basic_merge', 'status_checks'],
          ':isActive': licenseData.isActive !== undefined ? licenseData.isActive : true,
          ':updatedAt': new Date().toISOString()
        }
      }).promise();

      return true;
    } catch (error) {
      console.error('Failed to update license:', error);
      return false;
    }
  }

  async startTrial(installationId: number, tier: BillingTier = 'pro', durationDays: number = 14): Promise<boolean> {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + durationDays);

    const features = this.getFeaturesForTier(tier);

    try {
      await this.dynamodb.put({
        TableName: this.tableName,
        Item: {
          installationId,
          tier,
          features,
          isActive: true,
          trialEndsAt: trialEndDate.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }).promise();

      return true;
    } catch (error) {
      console.error('Failed to start trial:', error);
      return false;
    }
  }

  async processMarketplacePurchase(purchaseData: any): Promise<boolean> {
    try {
      const { account, marketplace_purchase } = purchaseData;
      const installationId = account.id;
      const planName = marketplace_purchase.plan.name.toLowerCase();
      
      let tier: BillingTier = 'free';
      if (planName.includes('pro')) tier = 'pro';
      if (planName.includes('enterprise')) tier = 'enterprise';

      const features = this.getFeaturesForTier(tier);

      await this.dynamodb.put({
        TableName: this.tableName,
        Item: {
          installationId,
          tier,
          features,
          isActive: true,
          marketplacePurchaseId: marketplace_purchase.id,
          planId: marketplace_purchase.plan.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }).promise();

      return true;
    } catch (error) {
      console.error('Failed to process marketplace purchase:', error);
      return false;
    }
  }

  private getFeaturesForTier(tier: BillingTier): string[] {
    const featureMap = {
      free: ['basic_merge', 'status_checks'],
      pro: ['basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics'],
      enterprise: ['basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics', 'custom_actions', 'audit_logs', 'sso']
    };

    return featureMap[tier] || featureMap.free;
  }

  async generateDevLicense(installationId: number, tier: BillingTier = 'enterprise'): Promise<string> {
    const licenseData = {
      installationId,
      tier,
      features: this.getFeaturesForTier(tier),
      isActive: true,
      isDevelopment: true,
      createdAt: new Date().toISOString()
    };

    // In development, we can create a JWT token for local testing
    const jwt = require('jsonwebtoken');
    const secret = process.env.DEV_LICENSE_SECRET || 'dev-secret-key';
    
    const token = jwt.sign(licenseData, secret, { expiresIn: '30d' });
    
    // Also store in DynamoDB for consistency
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: licenseData
    }).promise();

    return token;
  }
}