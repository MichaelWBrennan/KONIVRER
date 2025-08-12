import Joi from 'joi';
import { AutomergePro, BillingTier } from '../types';

const mergeActionSchema = Joi.object({
  type: Joi.string().valid('merge', 'squash', 'rebase', 'comment', 'label', 'assign').required(),
  value: Joi.string().optional(),
  delay: Joi.number().min(0).optional()
});

const mergeRuleSchema = Joi.object({
  name: Joi.string().required(),
  enabled: Joi.boolean().default(true),
  conditions: Joi.array().items(Joi.string()).required(),
  actions: Joi.array().items(mergeActionSchema).required(),
  priority: Joi.number().min(0).max(100).default(50)
});

const mergeConditionsSchema = Joi.object({
  required_status_checks: Joi.array().items(Joi.string()).default([]),
  required_reviews: Joi.number().min(0).max(10).default(1),
  dismiss_stale_reviews: Joi.boolean().default(false),
  require_code_owner_reviews: Joi.boolean().default(false),
  required_approving_review_count: Joi.number().min(0).max(10).default(1),
  allow_squash_merge: Joi.boolean().default(true),
  allow_merge_commit: Joi.boolean().default(true),
  allow_rebase_merge: Joi.boolean().default(true)
});

const notificationChannelSchema = Joi.object({
  type: Joi.string().valid('slack', 'email', 'github', 'webhook').required(),
  endpoint: Joi.string().required(),
  events: Joi.array().items(Joi.string()).default([])
});

const notificationSettingsSchema = Joi.object({
  channels: Joi.array().items(notificationChannelSchema).default([]),
  events: Joi.array().items(Joi.string()).default([]),
  template: Joi.string().optional()
});

export const automergeProSchema = Joi.object({
  version: Joi.string().valid('1.0', '2.0').default('2.0'),
  rules: Joi.array().items(mergeRuleSchema).min(1).required(),
  conditions: mergeConditionsSchema.required(),
  notifications: notificationSettingsSchema.default({}),
  billing: Joi.string().valid('free', 'pro', 'enterprise').optional()
});

export function validateConfig(config: any): { error?: Error; value?: AutomergePro } {
  const { error, value } = automergeProSchema.validate(config, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });
  
  return { error, value };
}

export function validateFeatureAccess(tier: BillingTier, feature: string): boolean {
  const featureAccess = {
    free: ['basic_merge', 'status_checks'],
    pro: ['basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics'],
    enterprise: ['basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics', 'custom_actions', 'audit_logs', 'sso']
  };
  
  return featureAccess[tier]?.includes(feature) || false;
}