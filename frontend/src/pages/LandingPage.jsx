import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import useSearchStore from "@/store/useSearchStore";
import { resolveDestination } from "@/utils/destinationResolver";

const DESTINATIONS = [
  {
    name: "Bali Retreats",
    country: "Indonesia",
    rating: 4.9,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2nEr0SQcyjCllWCd7pdnxbOb2UIevDY7dkBQ3Y-6YUCV7crycw-lo4jfX8XLdlf7EXth_6wQNlliTzwEOaPysu7tT7nAj8-hAcuyyV09hsRtbNa6rgp4L8FUL_tJXyFnsgp8N_3nLE0JUB4jCvoL9sYUgD_6AMD-scR21btmiVxR7RaCgysdlkZk7vPVkWB4TnbCS4OpHCyFkHOjmtA0ePrEVzp5SopJVNuimFaENpHo-CMG3HN1WzeRkJN4113G-La9fR6aOgw",
    span: "md:col-span-7",
    titleSize: "text-3xl",
  },
  {
    name: "Venice Canals",
    country: "Italy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ7-WQmJIgPaz6gaIIxm8HaNm2YrEnaz5Q7DVz5wRkF7g3SEvPJd1ilgiEgZ2-W_GoEEH-_HnWYFpcTtoIm1GewtHj2vO9RlOp9MZZMsqz2kuZ8Vj1ruzv-0PMsd6bvCWEDBNWyD2c8DUL9yGJ_nTNX4CtNbJK-Scg2RGfkhZtnVqb1KDlPQBEuy1MXER3-kP5BUAbj12WXuptnASmbt6ply-JsrOWQiFp85eqkKbjqQcj5_YCWRWC4VUR8Fjr0NqTkQuKouar4g",
    span: "md:col-span-5",
    titleSize: "text-3xl",
  },
  {
    name: "Parisian Nights",
    country: "France",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFpCbabM8OY8lpa4S8U1HBU30s5ukEtpGRENdw0T4-3moqDlIzjbk7naQeGRcrXfHqy_O2u-hZmK7oo9rrGbBHHRlJpsQZNS1Q1dvnVh7T4w_sMHyrWmfG6SHfSJCdT3gzcHiAT0bgGhqObJNJW2nYBRHvwymDvyjEpQp0o7nJN3S0pl8QWFNg8crElSLLawQg5L46fdtQgG13McAyAP5r3UiMVW7-Q4oIcmcmoBZDMnEIJ_DOLk52IAxzEx4K54EUAEKhM0rocQ",
    span: "md:col-span-4",
    titleSize: "text-2xl",
  },
  {
    name: "Azure Horizons",
    country: "Maldives",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPS3qJijopl3d0r2swijkuBypi-zVZduhT_rfomyxcc5Y2au74B3CWwNGp371J7Kdm2GOWsIvSOL-pmSd8mySL584EBsyLA2WUzeunNLXSJutQcUANqaey-IW3xlTEwknz2z7a35YZXaqQz7eFc0bYWXbKqvWxJrKIGoKaNlpis8esDqeC8f1qG03DloTTD24UevWEeLjOJyIAXe4My_BcAfW_4xv0FuYIf7DiKy9U_LiazCpQVD-Cy2TZ2qkWuHKGff76QisKxQ",
    span: "md:col-span-8",
    titleSize: "text-3xl",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const { setSearchType, setSearchParams } = useSearchStore();
  const [heroSearch, setHeroSearch] = useState({
    from: "",
    to: "",
    departDate: "",
    travelers: "",
  });

  const handleHeroSearch = () => {
    setSearchType("flights");
    setSearchParams({
      from: heroSearch.from.trim(),
      to: heroSearch.to.trim(),
      departDate: heroSearch.departDate.trim(),
      travelers: Number(heroSearch.travelers) || 1,
      tripType: tripType === "one" ? "oneWay" : "roundTrip",
    });
    navigate(ROUTES.FLIGHTS);
  };

  const handleDestinationClick = async (dest) => {
    try {
      const resolved = await resolveDestination(dest.country);
      navigate(resolved.path);
    } catch {
      navigate(`${ROUTES.EXPLORE}?q=${encodeURIComponent(dest.country)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      {/* Solid Atmospheric Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-background" />

      <Navbar />

      <main className="padding-top-5rem">
        {/* ─── Hero Section ─── */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
            <img
              className="w-full h-full object-cover"
              alt="Cinematic wide shot of a tropical beach"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK--esmNuIJb70CvbEJOnNc5KT9n_jdZ96DES2iFvghtVx9qwm5W3LZCRiOsRQz9lQfnP6CARB74bOmU3a8arvMMeask_sxEevyvt1qBKWu6XGDk45ydfVx7wmmuveACbV7EUYr0KKiakTzRjcUcGsFsZL_i2jz9-shrZGnUj0HU9Br6bLpGGKLtUWToDfbc53TXvjXxUEFhhZBr5XdxkTG5UbvhljM84F0k_Qq1nSZzL2LuvUGOOxcRAIoosCR3zZBnkDCd1cXQ"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-6xl w-full text-center">
            <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-extrabold text-on-surface tracking-tight leading-tight md:leading-none mb-8 drop-shadow-sm">
              Explore the world <br />
              with <span className="text-primary italic">Voyage.</span>
            </h1>

            {/* Search Glass Container */}
            <div className="flex flex-col gap-4 max-w-5xl mx-auto">
              {/* Trip Type Toggle */}
              <div className="flex justify-center md:justify-start">
                <div className="glass-panel ghost-border p-1 rounded-full flex gap-1 shadow-sm">
                  <button
                    onClick={() => setTripType("round")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      tripType === "round"
                        ? "bg-primary text-on-primary"
                        : "text-on-surface hover:bg-white/50"
                    }`}
                  >
                    Round Trip
                  </button>
                  <button
                    onClick={() => setTripType("one")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      tripType === "one"
                        ? "bg-primary text-on-primary"
                        : "text-on-surface hover:bg-white/50"
                    }`}
                  >
                    One Way
                  </button>
                </div>
              </div>

              {/* Search Form */}
              <div className="glass-panel ghost-border rounded-[2.5rem] p-4 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                      From
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        flight_takeoff
                      </span>
                      <input
                        className="bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold w-full outline-none"
                        placeholder="Cairo (CAI)"
                        type="text"
                        value={heroSearch.from}
                        onChange={(e) =>
                          setHeroSearch({ ...heroSearch, from: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start text-left md:border-l border-slate-200/50 md:pl-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                      To
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        flight_land
                      </span>
                      <input
                        className="bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold w-full outline-none"
                        placeholder="London (LHR)"
                        type="text"
                        value={heroSearch.to}
                        onChange={(e) =>
                          setHeroSearch({ ...heroSearch, to: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start text-left md:border-l border-slate-200/50 md:pl-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                      Check In - Out
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        calendar_today
                      </span>
                      <input
                        className="bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold w-full outline-none"
                        placeholder="Add dates"
                        type="text"
                        value={heroSearch.departDate}
                        onChange={(e) =>
                          setHeroSearch({
                            ...heroSearch,
                            departDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start text-left md:border-l border-slate-200/50 md:pl-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                      Travelers
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        group
                      </span>
                      <input
                        className="bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold w-full outline-none"
                        placeholder="Add guests"
                        type="number"
                        min="1"
                        value={heroSearch.travelers}
                        onChange={(e) =>
                          setHeroSearch({
                            ...heroSearch,
                            travelers: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleHeroSearch}
                  className="w-full md:w-auto bg-gradient-to-r from-primary to-primary-dim text-on-primary px-10 py-4 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured Destinations ─── */}
        <section className="max-w-7xl mx-auto px-6 py-32 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">
                Curated Collections
              </span>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">
                Escape the ordinary.
              </h2>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => handleDestinationClick(dest)}
                className={`${dest.span} relative group overflow-hidden rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] cursor-pointer`}
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={dest.name}
                  src={dest.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-white/80 font-medium mb-1">
                    {dest.country}
                  </p>
                  <h3 className={`${dest.titleSize} font-headline font-bold`}>
                    {dest.name}
                  </h3>
                </div>
                {dest.rating && (
                  <div className="absolute top-8 right-8 glass-panel ghost-border text-on-surface px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {dest.rating}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <Footer />
    </div>
  );
}
