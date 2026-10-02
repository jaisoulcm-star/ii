import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sprout,
  MapPin,
  Phone,
  MessageCircle,
  IndianRupee,
  CheckCircle2,
  Package,
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Product, FarmerListing } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { createFarmerListing } from "../services/farmerService";

interface FarmerSellModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (listing: FarmerListing) => void;
}

const COMMON_UNITS = [
  "kg",
  "Quintal (100kg)",
  "50kg Bag",
  "25kg Bag",
  "Liter Bottle",
  "Pack / Unit",
  "Crate (20kg)",
  "Ton",
];

export const FarmerSellModal: React.FC<FarmerSellModalProps> = ({
  product,
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const { user } = useAuth();

  const [farmerName, setFarmerName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState<string>(
    product.price ? String(product.price) : "500",
  );
  const [unit, setUnit] = useState<string>("50kg Bag");
  const [availableQuantity, setAvailableQuantity] = useState<string>("50");
  const [harvestDate, setHarvestDate] = useState("Fresh Stock / Ready for Dispatch");
  const [organicCertified, setOrganicCertified] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<FarmerListing | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericPrice = parseFloat(pricePerUnit) || 0;
  const numericQty = parseFloat(availableQuantity) || 0;
  const totalValue = numericPrice * numericQty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmerName.trim()) {
      setError("Please provide your name or farm name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please provide a valid 10-digit mobile phone number.");
      return;
    }
    if (!location.trim()) {
      setError("Please provide your village/district and state.");
      return;
    }
    if (numericPrice <= 0) {
      setError("Please enter a valid price per unit greater than 0.");
      return;
    }
    if (numericQty <= 0) {
      setError("Please enter an available quantity greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = phone.trim();
      const digitsOnly = cleanPhone.replace(/\D/g, "");
      const whatsapp = digitsOnly.startsWith("91")
        ? digitsOnly
        : `91${digitsOnly.slice(-10)}`;

      const listing = await createFarmerListing({
        productId: product.id,
        productName: product.name,
        category: product.category,
        farmerName: farmerName.trim(),
        farmerId: user?.uid,
        phone: cleanPhone,
        whatsapp,
        location: location.trim(),
        pricePerUnit: numericPrice,
        unit,
        availableQuantity: numericQty,
        harvestDate: harvestDate.trim() || "Ready for dispatch",
        organicCertified,
        notes: notes.trim() || "Direct harvest from registered farmer. Pure organic standards.",
      });

      setSubmittedListing(listing);
      if (onListingCreated) {
        onListingCreated(listing);
      }
    } catch (err: any) {
      console.error("Failed to create listing:", err);
      setError("Failed to post listing. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedListing(null);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-heritage-maroon text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Sprout size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Farmer Marketplace
                    </span>
                    <span className="text-xs text-stone-300">0% Commission</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-white mt-0.5">
                    Sell This Product Directly
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product summary strip */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-stone-300">Crop/Item:</span>
                <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {product.name}
                </span>
                <span className="text-[10px] bg-white/10 text-stone-200 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-stone-400 text-[10px] block">Market Reference</span>
                <span className="font-serif font-bold text-emerald-300">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {submittedListing ? (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-black text-stone-900">
                    Listing Live on KrishiMart!
                  </h4>
                  <p className="text-sm text-stone-600 max-w-md mx-auto">
                    Your stock of <strong className="text-stone-900">{product.name}</strong> is now visible to thousands of retail buyers, farming co-ops, and local consumers.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left max-w-md mx-auto space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Seller Name:</span>
                    <span className="font-bold text-stone-900">{submittedListing.farmerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Offered Price:</span>
                    <span className="font-bold text-emerald-800">
                      ₹{submittedListing.pricePerUnit.toLocaleString()} / {submittedListing.unit}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Available Stock:</span>
                    <span className="font-bold text-stone-900">
                      {submittedListing.availableQuantity} {submittedListing.unit}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-500">Farm Location:</span>
                    <span className="font-bold text-stone-900">{submittedListing.location}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Direct Contact:</span>
                    <span className="font-bold text-stone-900">{submittedListing.phone}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-6 py-3 bg-heritage-maroon text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-lg hover:bg-stone-900 transition-all"
                  >
                    View Product Page Listings
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I am selling fresh ${product.name} directly on KrishiMart! Stock: ${submittedListing.availableQuantity} ${submittedListing.unit} @ ₹${submittedListing.pricePerUnit}/${submittedListing.unit}. Contact me at ${submittedListing.phone}. Check here: ${window.location.href}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle size={16} />
                    Share Listing on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <Info size={16} className="text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Farmer Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      Farmer / Farm Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel / Kisan Organic Farm"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={13} className="text-emerald-700" />
                      Contact Mobile / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-700" />
                    Farm Location (Village, District, State) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taluka Anand, Dist. Kheda, Gujarat"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                  />
                </div>

                {/* Price and Quantity Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                      <IndianRupee size={12} className="text-emerald-700" />
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 450"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Unit Measurement <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    >
                      {COMMON_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                      <Package size={12} className="text-emerald-700" />
                      Quantity Available <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 100"
                      value={availableQuantity}
                      onChange={(e) => setAvailableQuantity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Badge */}
                {totalValue > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-700" />
                      <span className="font-semibold">
                        Estimated Lot Gross Value:
                      </span>
                    </div>
                    <span className="font-black text-sm font-serif">
                      ₹{totalValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* Harvest / Batch info & Organic Certified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-700" />
                      Availability / Harvest Ready Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ready for immediate dispatch"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-5 sm:pt-6">
                    <label className="relative flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={organicCertified}
                        onChange={(e) => setOrganicCertified(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                      <span className="ml-3 text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-700" />
                        Organic / Chemical-Free Verified
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Crop & Quality Highlights (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 100% naturally grown, single-origin harvest, direct farm pickup available, minimum order 5 bags..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 resize-none"
                  />
                </div>

                {/* Direct Benefits Checklist */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                  <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Direct-to-Buyer Farmer Advantage</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Zero broker commission. Buyers will contact you directly on your phone or WhatsApp to arrange payment, shipping, or farm gate collection.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 py-3.5 px-5 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-3.5 px-6 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Publishing Listing...
                      </span>
                    ) : (
                      <>
                        <Sprout size={16} />
                        Publish Farmer Sale Listing
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
