
export enum GiftType {
  NOTE = 'NOTE',
  CHOCO_BAR = 'CHOCO_BAR',
  TEDDY_BEAR = 'TEDDY_BEAR'
}

export type ThemeType = 'pink' | 'mint';

export interface Locker {
  id: string;
  slug: string;
  ownerName: string;
  ownerToken: string;
  theme: ThemeType;
  createdAt: number;
}

export interface Gift {
  id: string;
  lockerId: string;
  giftType: GiftType;
  senderName: string;
  message: string;
  createdAt: number;
}

export interface GiftSummary {
  id: string;
  giftType: GiftType;
  createdAt: number;
}
