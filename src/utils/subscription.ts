import { Subscription } from 'rxjs';

export const unsubscribe = (subscription: Subscription) => !subscription.closed && subscription.unsubscribe();
