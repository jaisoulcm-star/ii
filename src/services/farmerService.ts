import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { FarmerListing } from "../types";

const LOCAL_STORAGE_KEY = "krishimart_farmer_listings";

export const getStoredLocalListings = (): FarmerListing[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredLocalListings = (listings: FarmerListing[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listings));
  } catch (e) {
    console.error("Failed to save local farmer listings", e);
  }
};

// Seed default initial mock farmer listings for a rich first experience
export const getInitialMockFarmerListings = (productId?: string): FarmerListing[] => {
  const seedListings: FarmerListing[] = [
    {
      id: "farmer-seed-1",
      productId: "1",
      productName: "Bio-Gold Organic Nitrogen Liquid",
      category: "Nutrients",
      farmerName: "Balwinder Singh & Sons",
      farmerId: "seed-user-1",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      location: "Ludhiana, Punjab",
      pricePerUnit: 420,
      unit: "Liter",
      availableQuantity: 150,
      harvestDate: "Batch 2026-A, Fresh Stock",
      organicCertified: true,
      notes: "Direct from our dairy organic compost processing unit. 100% lab tested.",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "farmer-seed-2",
      productId: "2",
      productName: "Trichoderma Viride Bio-Fungicide",
      category: "Fungicides",
      farmerName: "Kisan Organic Producer Co-Op",
      farmerId: "seed-user-2",
      phone: "+91 94231 78901",
      whatsapp: "919423178901",
      location: "Nashik, Maharashtra",
      pricePerUnit: 290,
      unit: "1kg Pack",
      availableQuantity: 80,
      harvestDate: "Manufactured Jan 2026",
      organicCertified: true,
      notes: "Bulk stock available. Free delivery for orders above 20 packs in Maharashtra.",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "farmer-seed-3",
      productId: "4",
      productName: "Desi Wheat Seeds Sharbati Gold",
      category: "Seeds",
      farmerName: "Rameshwar Patel",
      farmerId: "seed-user-3",
      phone: "+91 98260 12345",
      whatsapp: "919826012345",
      location: "Sehore, Madhya Pradesh",
      pricePerUnit: 3400,
      unit: "Quintal (100kg)",
      availableQuantity: 45,
      harvestDate: "Current Rabi Season Harvest",
      organicCertified: true,
      notes: "Grade-1 Sharbati wheat seed, germination rate above 96%. Direct farm pickup available.",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

  if (productId) {
    return seedListings.filter((l) => l.productId === productId);
  }
  return seedListings;
};

export const fetchFarmerListingsByProduct = async (
  productId: string,
): Promise<FarmerListing[]> => {
  let firestoreListings: FarmerListing[] = [];

  try {
    const q = query(
      collection(db, "farmerListings"),
      where("productId", "==", productId),
    );
    const snap = await getDocs(q);
    firestoreListings = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as FarmerListing[];
  } catch (err) {
    console.warn("Could not query Firestore for farmerListings:", err);
  }

  // Merge with local storage
  const localListings = getStoredLocalListings().filter(
    (l) => l.productId === productId,
  );

  // Fallback to seed if both are empty
  const seeds = getInitialMockFarmerListings(productId);

  const combinedMap = new Map<string, FarmerListing>();
  [...seeds, ...localListings, ...firestoreListings].forEach((item) => {
    combinedMap.set(item.id, item);
  });

  return Array.from(combinedMap.values());
};

export const createFarmerListing = async (
  data: Omit<FarmerListing, "id" | "createdAt" | "status">,
): Promise<FarmerListing> => {
  const newListing: FarmerListing = {
    ...data,
    id: `fl-${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Attempt Firestore insertion
  try {
    const docRef = await addDoc(collection(db, "farmerListings"), {
      ...data,
      status: "active",
      createdAt: serverTimestamp(),
    });
    newListing.id = docRef.id;
  } catch (err) {
    console.warn("Firestore farmer listing creation fallback to localStorage:", err);
  }

  // Save to local storage for instant offline & resilience
  const current = getStoredLocalListings();
  const updated = [newListing, ...current.filter((l) => l.id !== newListing.id)];
  saveStoredLocalListings(updated);

  return newListing;
};

export const deleteFarmerListing = async (listingId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "farmerListings", listingId));
  } catch (err) {
    console.warn("Firestore delete listing failed or offline:", err);
  }

  const current = getStoredLocalListings();
  saveStoredLocalListings(current.filter((l) => l.id !== listingId));
};
