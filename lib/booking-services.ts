export function arrangedWithTrainer(service: { code: string; is_subscription?: boolean; requires_pair?: boolean }) {
  return service.code === 'pair' || service.code === 'subscription' || !!service.is_subscription || !!service.requires_pair
}
