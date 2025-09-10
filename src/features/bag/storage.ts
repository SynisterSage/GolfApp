// src/features/bag/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BAG_KEY = "golfapp:bag:v1";

export type ClubType = "Wood" | "Hybrid" | "Iron" | "Wedge" | "Putter";
export type BagClub = {
  id: string;
  type: ClubType;
  label: string;
  loft?: string;
  yardage?: string; 
};

export type Bag = {
  updatedAt: number;
  clubs: BagClub[]; // up to 14
};

/** New default: empty bag */
export const EMPTY_BAG: Bag = { updatedAt: Date.now(), clubs: [] };

export async function loadBag(): Promise<Bag> {
  try {
    const raw = await AsyncStorage.getItem(BAG_KEY);
    if (!raw) return EMPTY_BAG;
    const parsed = JSON.parse(raw) as Bag;
    if (!parsed?.clubs) return EMPTY_BAG;
    return parsed;
  } catch {
    return EMPTY_BAG;
  }
}

export async function saveBag(bag: Bag): Promise<void> {
  try {
    const toSave = { ...bag, updatedAt: Date.now() };
    await AsyncStorage.setItem(BAG_KEY, JSON.stringify(toSave));
  } catch {}
}
