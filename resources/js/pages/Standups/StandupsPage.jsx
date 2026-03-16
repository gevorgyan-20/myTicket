import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, LayoutGrid, DollarSign, Search } from "lucide-react";
import { getStandups } from "../../api/StandupsService";
import useAuthStatus from "../../hooks/useAuthStatus";
import FrequentlyAskedQuestionsSection from "../../components/FrequentlyAskedQuestionsSection/FrequentlyAskedQuestionsSection";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const DEFAULT_PRICE = "20.00";

const WHAT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "movies", label: "Movies" },
  { value: "concerts", label: "Concerts" },
  { value: "shows", label: "Shows" },
];

const WHEN_OPTIONS = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "weekend", label: "This weekend" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom dates" },
];

const PRICE_OPTIONS = [
  { value: "under100", label: "Under $100" },
  { value: "100-300", label: "$100-$300" },
  { value: "300-500", label: "$300-$500" },
  { value: "over500", label: "Over $500" },
];

export default function StandupsPage() {
  const { role } = useAuthStatus();
  const [standups, setStandups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterWhat, setFilterWhat] = useState("all");
  const [filterWhen, setFilterWhen] = useState("all");
  const [filterWhere, setFilterWhere] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const adminPath = role === "admin" ? "/admin" : "";

  const whenDisplay = WHEN_OPTIONS.find((o) => o.value === filterWhen)?.label ?? "All dates";
  const whatDisplay = WHAT_OPTIONS.find((o) => o.value === filterWhat)?.label ?? "All";
  const priceDisplay = filterPrice
    ? PRICE_OPTIONS.find((o) => o.value === filterPrice)?.label ?? "Select"
    : "Any price";
  const whereDisplay = filterWhere || "All locations";

  useEffect(() => {
    const fetchStandups = async () => {
      try {
        const res = await getStandups();
        setStandups(res.data);
      } catch (err) {
        console.error("Error fetching standups:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandups();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading standups...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0D0D0D] mt-[158px] min-h-screen">
      <section className="relative w-full px-[108px] pb-6 border-b border-[#232323] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-4">
          <div className="flex flex-wrap items-end gap-4 flex-1">
            <FilterDropdown
              label="What"
              icon={<LayoutGrid className="w-5 h-5" />}
              value={filterWhat}
              displayText={whatDisplay}
              options={WHAT_OPTIONS}
              onSelect={setFilterWhat}
            />
            <FilterDropdown
              label="When"
              icon={<Calendar className="w-5 h-5" />}
              value={filterWhen}
              displayText={whenDisplay}
              options={WHEN_OPTIONS}
              onSelect={setFilterWhen}
            />
            <FilterDropdown
              label="Where"
              icon={<MapPin className="w-5 h-5" />}
              value={filterWhere}
              displayText={whereDisplay}
              onSelect={() => {}}
              children={(close) => (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#363636]">
                    <Search className="w-4 h-4 text-[#999]" />
                    <input
                      type="text"
                      placeholder="search location"
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#666]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterWhere("My location");
                      close();
                    }}
                    className="text-sm text-white text-left hover:text-[#E4AFF8] transition-colors"
                  >
                    use my location
                  </button>
                </div>
              )}
            />
            <FilterDropdown
              label="Price"
              icon={<DollarSign className="w-5 h-5" />}
              value={filterPrice}
              displayText={priceDisplay}
              options={PRICE_OPTIONS}
              onSelect={setFilterPrice}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-11 px-6 rounded-lg bg-[#9B30FF] text-white font-medium hover:bg-[#8B20EF] transition-colors"
            >
              Search
            </button>
            <button type="button" className="text-sm text-[#999999] hover:text-white transition-colors">
              View all
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full py-12 px-[108px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standups.map((standup) => (
              <Link
                to={`${adminPath}/standups/${standup.id}`}
                key={standup.id}
                className="group bg-[#1B1B1B] rounded-2xl overflow-hidden border border-[#303030] hover:border-[#E4AFF8] transition-colors flex flex-col"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={standup.poster_url || "https://via.placeholder.com/434x580/1B1B1B/666?text=Standup"}
                    alt={standup.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="[font-family:'Inter',Helvetica] text-lg font-semibold text-white line-clamp-1">
                    {standup.comedian || standup.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[#999999] text-sm">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(standup.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#999999] text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{standup.location || "—"}</span>
                  </div>
                  <p className="[font-family:'Inter',Helvetica] text-base font-semibold text-[#E4AFF8] mt-1">
                    from ${DEFAULT_PRICE}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              type="button"
              className="px-8 py-3 rounded-lg bg-[#9B30FF] text-white font-semibold hover:bg-[#8B20EF] transition-colors"
            >
              View More Standups
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full h-[263px] my-[120px] flex justify-start items-center">
        <div className="w-full absolute top-0 left-0 z-10 h-full bg-[linear-gradient(90deg,rgba(15,15,15,1)_2%,rgba(19,15,20,1)_16%,rgba(29,14,34,1)_28%,rgba(172,0,229,0.3)_100%)]"></div>
        <div className="w-full absolute top-0 left-0 h-full">
          <img src="/images/detail_page_imgs.png" className="size-full object-cover" alt="Events" />
        </div>
        <div className="relative z-20 flex flex-col gap-4 items-start justify-center h-full px-[108px]">
          <h3 className="[font-family:'Inter',Helvetica] text-[40px] leading-[48px] font-bold text-white">
            Start exploring event today!
          </h3>
          <p className="[font-family:'Inter',Helvetica] text-[24px] leading-[29px] text-[#B3B3B3]">
            Find concerts, shows, and more near you.
          </p>
          <button className="px-6 py-3 rounded-lg bg-[#9B30FF] text-white font-semibold hover:bg-[#8B20EF] transition-colors">
            Start
          </button>
        </div>
      </section>

      <FrequentlyAskedQuestionsSection />
    </div>
  );
}
