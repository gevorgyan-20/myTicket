import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Search, Banknote, Loader2 } from "lucide-react";
import { getMovies } from "../../api/MoviesService";
import useAuthStatus from "../../hooks/useAuthStatus";
import FrequentlyAskedQuestionsSection from "../../components/FrequentlyAskedQuestionsSection/FrequentlyAskedQuestionsSection";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import { getVenues } from "../../api/VenueService";

export default function MoviesPage() {
  const { t, i18n } = useTranslation();
  const { role } = useAuthStatus();
  const [movies, setMovies] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filterWhen, setFilterWhen] = useState("all");
  const [filterWhere, setFilterWhere] = useState("");
  const [filterVenueId, setFilterVenueId] = useState(null);
  const [filterPrice, setFilterPrice] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore]);

  const adminPath = role === "admin" ? "/admin" : "";

  const WHEN_OPTIONS = useMemo(() => [
    { value: "all", label: t('concerts.page.allDates') },
    { value: "today", label: t('concerts.page.today') },
    { value: "weekend", label: t('concerts.page.weekend') },
    { value: "month", label: t('concerts.page.month') },
  ], [t]);

  const PRICE_OPTIONS = useMemo(() => [
    { value: "under1000", label: t('concerts.page.under1000') },
    { value: "1000-3000", label: t('concerts.page.fromTo3000') },
    { value: "3000-5000", label: t('concerts.page.fromTo5000') },
    { value: "over5000", label: t('concerts.page.over5000') },
  ], [t]);

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(i18n.language === 'hy' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateRange(start, end) {
    if (!start) return t('concerts.page.comingSoon');
    if (!end || start === end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  function formatPriceRange(min, max) {
    if (min == null && max == null) return t('concerts.page.tba');
    if (min === max) return `${min}֏`;
    return `${min} - ${max}֏`;
  }

  const whenDisplay = WHEN_OPTIONS.find((o) => o.value === filterWhen)?.label ?? t('concerts.page.allDates');
  const priceDisplay = filterPrice
    ? PRICE_OPTIONS.find((o) => o.value === filterPrice)?.label ?? t('common.seeAll')
    : t('concerts.page.anyPrice');
  const whereDisplay = filterWhere === "all" || !filterWhere ? t('concerts.page.allLocations') : filterWhere;

  const fetchMovies = async (isNewSearch = false) => {
    if (isNewSearch) {
      setIsLoading(true);
      setPage(1);
    } else {
      setIsFetchingMore(true);
    }

    const params = {
      page: isNewSearch ? 1 : page,
      when: filterWhen,
      where: filterWhere,
    };
    if (filterVenueId) params.venue_id = filterVenueId;
    if (filterPrice) {
      if (filterPrice === "under1000") params.price_max = 1000;
      else if (filterPrice === "1000-3000") { params.price_min = 1000; params.price_max = 3000; }
      else if (filterPrice === "3000-5000") { params.price_min = 3000; params.price_max = 5000; }
      else if (filterPrice === "over5000") params.price_min = 5000;
    }

    try {
      const response = await getMovies(params);
      const newItems = response.data.data || response.data;
      
      setMovies(prev => isNewSearch ? newItems : [...prev, ...newItems]);
      
      const limit = params.per_page || 10;
      setHasMore(newItems.length >= limit);

    } catch (error) {
      console.error("Failed to fetch movies", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await getVenues();
      setVenues(response.data);
    } catch (error) {
      console.error("Failed to fetch venues", error);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchMovies(true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(false);
    }
  }, [page]);

  const handleSearch = () => {
    fetchMovies(true);
  };

  const handleViewAll = () => {
    setFilterWhen("all");
    setFilterWhere("all");
    setFilterVenueId(null);
    setFilterPrice("");
    
    const resetParams = { when: "all", where: "all", page: 1 };
    setIsLoading(true);
    setPage(1);
    getMovies(resetParams).then(res => {
      setMovies(res.data.data || res.data);
      setHasMore((res.data.data || res.data).length >= 10);
      setIsLoading(false);
    });
  };

  const filteredVenues = venues.filter((v) =>
    v.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    v.city?.toLowerCase().includes(locationSearch.toLowerCase())
  );

  if (isLoading && page === 1) {
    return (
      <div className="loading-center">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t('movies.page.loading')}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0D0D0D] mt-[80px] md:mt-[158px] min-h-screen">
      <section className="relative w-full px-4 md:px-[108px] pb-6 border-b border-[#232323] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-end gap-3 md:gap-4">
          <div className="grid grid-cols-2 md:flex md:items-end gap-3 flex-1">
            <FilterDropdown
              label={t('concerts.page.when')}
              icon={<Calendar className="w-4 h-4 md:w-5 md:h-5" />}
              value={filterWhen}
              displayText={whenDisplay}
              options={WHEN_OPTIONS}
              onSelect={setFilterWhen}
            />
            <FilterDropdown
              label={t('concerts.page.where')}
              icon={<MapPin className="w-4 h-4 md:w-5 md:h-5" />}
              value={filterWhere}
              displayText={whereDisplay}
              onSelect={() => {}}
              children={(close) => (
                <div className="flex flex-col gap-3 w-64">
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#363636]">
                    <Search className="w-4 h-4 text-[#999]" />
                    <input
                      type="text"
                      placeholder={t('concerts.page.searchLocation')}
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
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
                    {t('concerts.page.useMyLocation')}
                  </button>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-1 mt-2 border-t border-[#333] pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterWhere("all");
                        setFilterVenueId(null);
                        close();
                      }}
                      className="text-sm text-[#999] text-left hover:text-white transition-colors py-1"
                    >
                      {t('concerts.page.allVenues')}
                    </button>
                    {filteredVenues.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setFilterWhere(v.name);
                          setFilterVenueId(v.id);
                          close();
                        }}
                        className="text-sm text-white text-left hover:text-[#9B30FF] transition-colors py-1"
                      >
                        {v.name} {v.city ? `(${v.city})` : ""}
                      </button>
                    ))}
                    {filteredVenues.length === 0 && (
                      <span className="text-xs text-[#666] italic py-2">{t('concerts.page.noVenuesFound')}</span>
                    )}
                  </div>
                </div>
              )}
            />
            <div className="md:col-span-1">
              <FilterDropdown
                label={t('concerts.page.price')}
                icon={<Banknote className="w-4 h-4 md:w-5 md:h-5" />}
                value={filterPrice}
                displayText={priceDisplay}
                options={PRICE_OPTIONS}
                onSelect={setFilterPrice}
              />
            </div>
            {/* Search Button for Mobile (integrated in grid) */}
            <div className="flex md:hidden items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full h-10 rounded-xl bg-[#9B30FF] text-white font-bold hover:bg-[#8B20EF] transition-all active:scale-95 shadow-lg shadow-purple-600/20 text-xs uppercase tracking-wider"
              >
                {t('concerts.page.search')}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-1 md:mt-0">
            <button
              type="button"
              onClick={handleSearch}
              className="hidden md:flex items-center justify-center h-12 px-8 rounded-xl bg-[#9B30FF] text-white font-bold hover:bg-[#8B20EF] transition-all active:scale-95 shadow-lg shadow-purple-600/20"
            >
              {t('concerts.page.search')}
            </button>
            <button
              type="button"
              onClick={handleViewAll}
              className="text-[10px] md:text-sm text-[#999999] hover:text-white transition-colors whitespace-nowrap font-medium"
            >
              {t('concerts.page.viewAll')}
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full py-8 md:py-12 px-4 md:px-[108px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {movies.map((movie, index) => (
              <Link
                to={`${adminPath}/movies/${movie.id}`}
                key={movie.id}
                ref={index === movies.length - 1 ? lastElementRef : null}
                className="group bg-[#1B1B1B] rounded-2xl overflow-hidden border border-[#303030] hover:border-[#E4AFF8] transition-colors flex flex-col"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={movie.poster_url || "/images/defaults/movie.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-4 flex flex-col gap-1 md:gap-2">
                  <h2 className="font-poppins text-sm md:text-lg font-bold text-white line-clamp-1">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-1 md:gap-2 text-[#999999] text-[10px] md:text-sm">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{formatDateRange(movie.first_show_date, movie.last_show_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-[#999999] text-[10px] md:text-sm">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{t('movies.page.cinema')}</span>
                  </div>
                  <p className="text-xs md:text-base font-bold text-[#E4AFF8] mt-1">
                    {formatPriceRange(movie.min_price, movie.max_price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {isFetchingMore && (
            <div className="flex justify-center mt-12">
              <Loader2 className="w-8 h-8 text-[#9B30FF] animate-spin" />
            </div>
          )}
        </div>
      </section>

      <section className="relative w-full h-[263px] my-12 md:my-[120px] flex justify-start items-center">
        <div className="w-full absolute top-0 left-0 z-10 h-full bg-[linear-gradient(90deg,rgba(15,15,15,1)_2%,rgba(19,15,20,1)_16%,rgba(29,14,34,1)_28%,rgba(172,0,229,0.3)_100%)]"></div>
        <div className="w-full absolute top-0 left-0 h-full">
          <img src="/images/detail_page_imgs.png" className="size-full object-cover" alt="detail_page_imgs" />
        </div>
        <div className="relative z-20 flex flex-col gap-4 items-start justify-center h-full px-4 md:px-[108px]">
            <h3 className="font-poppins text-3xl md:text-[40px] md:leading-[48px] font-bold text-white">
              {t('concerts.page.exploreTitle')}
            </h3>
            <p className="text-lg md:text-[24px] md:leading-[29px] text-[#B3B3B3]">
              {t('concerts.page.exploreSubtitle')}
            </p>
            <Link to="/">
              <button className="px-6 py-3 rounded-lg bg-[#9B30FF] text-white font-semibold hover:bg-[#8B20EF] transition-colors">
                {t('concerts.page.start')}
              </button>
            </Link>
        </div>
      </section>

      <FrequentlyAskedQuestionsSection />
    </div>
  );
}
