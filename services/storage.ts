
import { Locker, Gift, GiftType, GiftSummary } from '../types';

const LOCKERS_KEY = 'vday_lockers';
const GIFTS_KEY = 'vday_gifts';
const MY_TOKENS_KEY = 'vday_my_tokens'; // Local storage for ownership tokens

export const storage = {
  getLockers: (): Locker[] => {
    const data = localStorage.getItem(LOCKERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveLocker: (locker: Locker) => {
    const lockers = storage.getLockers();
    lockers.push(locker);
    localStorage.setItem(LOCKERS_KEY, JSON.stringify(lockers));
    
    // Save ownership locally
    const myTokens = storage.getMyTokens();
    myTokens[locker.slug] = locker.ownerToken;
    localStorage.setItem(MY_TOKENS_KEY, JSON.stringify(myTokens));
  },

  getMyTokens: (): Record<string, string> => {
    const data = localStorage.getItem(MY_TOKENS_KEY);
    return data ? JSON.parse(data) : {};
  },

  getOwnerTokenForSlug: (slug: string): string | null => {
    const tokens = storage.getMyTokens();
    return tokens[slug] || null;
  },

  getLockerBySlug: (slug: string): Locker | undefined => {
    return storage.getLockers().find(l => l.slug === slug);
  },

  getLockerByToken: (token: string): Locker | undefined => {
    return storage.getLockers().find(l => l.ownerToken === token);
  },

  getGifts: (): Gift[] => {
    const data = localStorage.getItem(GIFTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveGift: (gift: Gift) => {
    const gifts = storage.getGifts();
    gifts.push(gift);
    localStorage.setItem(GIFTS_KEY, JSON.stringify(gifts));
  },

  getGiftSummariesByLockerId: (lockerId: string): GiftSummary[] => {
    return storage.getGifts()
      .filter(g => g.lockerId === lockerId)
      .map(({ id, giftType, createdAt }) => ({ id, giftType, createdAt }));
  },

  getFullGiftsByLockerToken: (token: string): Gift[] => {
    const locker = storage.getLockerByToken(token);
    if (!locker) return [];
    return storage.getGifts().filter(g => g.lockerId === locker.id);
  }
};
