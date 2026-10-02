import React, { useState } from "react";
import {
  Sprout,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Package,
  Calendar,
  Trash2,
  PlusCircle,
  ExternalLink,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { FarmerListing, Product } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { deleteFarmerListing } from "../services/farmerService";

interface FarmerDirectSectionProps {
  product: Product;
  listings: FarmerListing[];
  onOpenSellModal: () => void;
  onListingDeleted?: (listingId: string) => void;
}

export const FarmerDirectSection: React.FC<FarmerDirectSectionProps> = ({
  product,
  listings,
  onOpenSellModal,
  onListingDeleted,
}) => {
  const { user, isAdmin } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (listingId: string) => {
    if (!window.confirm("Are you sure you want to remove this farmer listing?")) return;
    setDeletingId(listingId);
    try {
      await deleteFarmerListing(listingId);
      if (onListingDeleted) {
        onListingDeleted(listingId);
      }
    } catch (e) {
      console.error("Failed to delete listing", e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-stone-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
              Farm-To-Consumer Direct
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Verified Farmer Network
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Direct from Farmers Selling {product.name}
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
            Connect directly with verified organic growers and farmers stocking this harvest without middlemen or broker cuts.
          </p>
        </div>

        {/* Sell Button Action */}
        <button
          type="button"
          onClick={onOpenSellModal}
          className="shrink-0 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 group"
        >
          <Sprout size={18} className="text-emerald-300 group-hover:rotate-12 transition-transform" />
          <span>Farmer: Sell This Product</span>
        </button>
      </div>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map((listing) => {
            const isOwner =
              isAdmin || (user && listing.farmerId && user.uid === listing.farmerId);

            const whatsappMessage = encodeURIComponent(
              `Hello ${listing.farmerName}, I saw your listing for "${product.name}" on KrishiMart. I am interested in purchasing from you. Is it still available?`,
            );

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between space-y-5 group"
              >
                <div>
                  {/* Top Bar with Seller and Location */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-black text-stone-900 text-lg">
                          {listing.farmerName}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={10} className="text-emerald-600" />
                          Verified Farmer
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin size={13} className="text-stone-400 shrink-0" />
                        <span>{listing.location}</span>
                      </div>
                    </div>

                    {listing.organicCertified && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300/80 flex items-center gap-1 shrink-0">
                        <ShieldCheck size={12} className="text-emerald-700" />
                        100% Organic
                      </span>
                    )}
                  </div>

                  {/* Pricing and Stock Banner */}
                  <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-150 grid grid-cols-2 gap-3 text-left">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                        Direct Farm Price
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-serif font-black text-emerald-900">
                          ₹{listing.pricePerUnit.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-stone-500 font-semibold">
                          / {listing.unit}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                        Available Stock
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Package size={14} className="text-emerald-700 shrink-0" />
                        <span className="text-base font-bold text-stone-800">
                          {listing.availableQuantity} {listing.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Harvest / Batch info & notes */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    {listing.harvestDate && (
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Calendar size={13} className="text-stone-400 shrink-0" />
                        <span>{listing.harvestDate}</span>
                      </div>
                    )}
                    {listing.notes && (
                      <p className="text-stone-500 italic bg-stone-50/60 p-2.5 rounded-xl border border-stone-100 text-[11px] leading-relaxed">
                        "{listing.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Action Connect Buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-1">
                    <a
                      href={`tel:${listing.phone}`}
                      className="flex-1 py-2.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone size={13} className="text-emerald-700" />
                      <span>Call Farmer</span>
                    </a>

                    <a
                      href={`https://wa.me/${listing.whatsapp || listing.phone.replace(/\D/g, "")}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete your listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-emerald-900/5 rounded-3xl p-8 sm:p-10 border border-emerald-900/10 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Sprout size={28} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="text-lg font-serif font-black text-stone-900">
              Are You a Farmer Cultivating or Stocking {product.name}?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              No farmer listings are published yet for this item in your region. List your harvest batch to reach thousands of organic buyers directly with zero brokerage.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>List My Stock to Sell</span>
          </button>
        </div>
      )}
    </div>
  );
};
