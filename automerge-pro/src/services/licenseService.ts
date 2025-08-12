import { GitHubWebhookEvent, FeatureTier, LicenseInfo } from '../types/index';

// In-memory store for demo purposes - in production, use DynamoDB
const licenseStore = new Map<number, LicenseInfo>();

export class LicenseService {
  static async handleMarketplacePurchase(event: GitHubWebhookEvent): Promise<void> {
    if (!event.marketplace_purchase || !event.installation) {
      console.log('No marketplace purchase data in event');
      return;
    }

    const { marketplace_purchase: purchase, installation } = event;
    
    switch (purchase.action) {
      case 'purchased':
        await this.activateLicense(installation.id, purchase.plan.name as FeatureTier['name']);
        break;
      case 'cancelled':
        await this.deactivateLicense(installation.id);
        break;
      case 'changed':
        await this.updateLicense(installation.id, purchase.plan.name as FeatureTier['name']);
        break;
    }
  }

  static async handleInstallationCreated(event: GitHubWebhookEvent): Promise<void> {
    if (!event.installation) {
      console.log('No installation data in event');
      return;
    }

    // Set up free tier by default
    await this.activateLicense(event.installation.id, 'free');
    console.log(`Created free tier license for installation ${event.installation.id}`);
  }

  static async handleInstallationDeleted(event: GitHubWebhookEvent): Promise<void> {
    if (!event.installation) {
      console.log('No installation data in event');
      return;
    }

    await this.deactivateLicense(event.installation.id);
    console.log(`Deactivated license for installation ${event.installation.id}`);
  }

  static async hasFeatureAccess(installationId: number, feature: string): Promise<boolean> {
    const license = licenseStore.get(installationId);
    
    if (!license || !license.is_active) {
      return false;
    }

    const tier = this.getFeatureTier(license.tier);
    
    switch (feature) {
      case 'automerge':
        return true; // All tiers have basic automerge
      case 'scheduling':
        return tier.scheduling;
      case 'advanced_conditions':
        return tier.advanced_conditions;
      case 'custom_rules':
        return tier.custom_rules;
      case 'priority_support':
        return tier.priority_support;
      default:
        return false;
    }
  }

  static async getLicenseInfo(installationId: number): Promise<LicenseInfo | null> {
    return licenseStore.get(installationId) || null;
  }

  private static async activateLicense(installationId: number, tier: FeatureTier['name']): Promise<void> {
    const license: LicenseInfo = {
      installation_id: installationId,
      tier,
      is_active: true,
      repositories_count: 0
    };

    // Pro and Enterprise tiers have expiration dates
    if (tier === 'pro' || tier === 'enterprise') {
      const expiration = new Date();
      expiration.setMonth(expiration.getMonth() + 1); // 30 days from now
      license.expires_at = expiration;
    }

    licenseStore.set(installationId, license);
    console.log(`Activated ${tier} license for installation ${installationId}`);
  }

  private static async deactivateLicense(installationId: number): Promise<void> {
    const license = licenseStore.get(installationId);
    if (license) {
      license.is_active = false;
      licenseStore.set(installationId, license);
    }
  }

  private static async updateLicense(installationId: number, tier: FeatureTier['name']): Promise<void> {
    await this.activateLicense(installationId, tier);
  }

  private static getFeatureTier(tier: FeatureTier['name']): FeatureTier {
    const tiers: Record<FeatureTier['name'], FeatureTier> = {
      free: {
        name: 'free',
        max_repositories: 5,
        advanced_conditions: false,
        scheduling: false,
        priority_support: false,
        custom_rules: false
      },
      pro: {
        name: 'pro',
        max_repositories: 50,
        advanced_conditions: true,
        scheduling: true,
        priority_support: false,
        custom_rules: true
      },
      enterprise: {
        name: 'enterprise',
        max_repositories: -1, // unlimited
        advanced_conditions: true,
        scheduling: true,
        priority_support: true,
        custom_rules: true
      }
    };

    return tiers[tier];
  }
}