import Link from "next/link";
import { photos } from "@/lib/photos";
import { AddButton, BagCount, FreshFilters, FreshGrid, MobileNavigation, PreviewForm, SearchForm } from "./store";
import { Photo } from "./photo";

export function Ticker() {
  return (
    <aside className="w-full bg-tangerine text-white border-b-2 border-ink overflow-hidden py-2 font-mono-display text-xs tracking-wider uppercase font-bold relative z-50">
    <div className="animate-marquee whitespace-nowrap">
    <span className="mx-6 flex items-center gap-2">✦ THE GENERAL EDIT ✦</span>
    <span className="mx-6 flex items-center gap-2">🔥 NEW DROP FRIDAY AT 11AM — CHROME &amp; COBALT ✦</span>
    <span className="mx-6 flex items-center gap-2">📦 OBJECTS, ESSENTIALS &amp; VINTAGE FINDS ✦</span>
    <span className="mx-6 flex items-center gap-2">✨ CURATED WEIRD &amp; WONDERFUL HOME GOODS SINCE FOREVER ✦</span>
    <span className="mx-6 flex items-center gap-2">✦ THE GENERAL EDIT ✦</span>
    <span className="mx-6 flex items-center gap-2">🔥 NEW DROP FRIDAY AT 11AM — CHROME &amp; COBALT ✦</span>
    <span className="mx-6 flex items-center gap-2">📦 OBJECTS, ESSENTIALS &amp; VINTAGE FINDS ✦</span>
    <span className="mx-6 flex items-center gap-2">✨ CURATED WEIRD &amp; WONDERFUL HOME GOODS SINCE FOREVER ✦</span>
    </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 w-full z-40 bg-cream/95 backdrop-blur-md border-b-2 border-ink transition-all">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3 xl:gap-6">
    <div className="flex items-center gap-4">
    <Link className="group inline-flex flex-col" href="/">
    <span className="font-serif text-xl sm:text-3xl md:text-4xl tracking-tight font-light uppercase leading-none group-hover:text-tangerine transition-colors">
                THE GENERAL EDIT<span className="text-tangerine text-4xl">.</span>
    </span>
    <span className="font-mono-display text-[10px] tracking-[0.25em] text-ink/70 font-semibold uppercase mt-0.5">
                INDEPENDENT GENERAL STORE
              </span>
    </Link>
    </div>
    <nav className="hidden xl:flex items-center gap-5 2xl:gap-8 font-mono-display text-sm tracking-wide font-bold uppercase">
    <Link className="text-ink hover:text-cobalt hover:underline underline-offset-4 decoration-2 decoration-canary transition-all" href="/collections/objects">
              Objects &amp; Curios
            </Link>
    <Link className="text-ink hover:text-tangerine hover:underline underline-offset-4 decoration-2 decoration-melon transition-all" href="/collections/home">
              Home &amp; Living
            </Link>
    <Link className="text-ink hover:text-cobalt hover:underline underline-offset-4 decoration-2 decoration-butter transition-all" href="/collections/essentials">
              Everyday Essentials
            </Link>
    <Link className="text-ink hover:text-brick hover:underline underline-offset-4 decoration-2 decoration-bubblegum transition-all flex items-center gap-1.5" href="/collections/vintage">
    <span>Vintage &amp; Found</span>
    <span className="bg-canary text-ink px-1.5 py-0.2 text-[10px] rounded font-bold border border-ink">1-OF-1</span>
    </Link>
    <Link className="text-tangerine hover:text-ink hover:underline underline-offset-4 decoration-2 transition-all flex items-center gap-1" href="/#the-drop">
    <span className="w-2 h-2 rounded-full bg-tangerine animate-ping"></span>
    <span>The Next Drop</span>
    </Link>
    </nav>
    <div className="flex items-center gap-3">
    <SearchForm />
    <Link href="/favorites" aria-label="Favorites" className="p-2 border-2 border-ink rounded-full hover:bg-canary transition-colors hidden sm:flex items-center justify-center">
    <span className="material-symbols-outlined text-[20px]">favorite</span>
    </Link>
    <Link className="flex items-center gap-2 bg-ink text-white px-2 sm:px-4 py-2 border-2 border-ink font-mono-display text-xs uppercase tracking-wider font-bold hover:bg-canary hover:text-ink transition-colors hard-shadow-sm group active:translate-y-0.5" href="/cart">
    <span aria-hidden="true" className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">shopping_bag</span>
    <span>BAG</span>
    <span className="min-w-5 bg-tangerine group-hover:bg-ink group-hover:text-white text-ink px-1 py-0.5 text-center text-[11px] font-bold"><BagCount /></span>
    </Link>
    </div>
    </div>
    <MobileNavigation />
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-cream border-t-2 border-ink pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cream/20">
    <div className="lg:col-span-2 space-y-4">
    <h3 className="font-serif text-3xl font-light text-white">THE GENERAL EDIT.</h3>
    <p className="font-sans text-sm text-cream/70 max-w-sm leading-relaxed">
                A playful, high-spirited downtown general store for interesting living. Objects to use forever, gifts people don&apos;t regift, and odd vintage discoveries.
              </p>
    <div className="pt-2 font-mono-display text-xs text-cream/80 space-y-1">
    <p className="font-bold text-canary">THE GENERAL EDIT</p>

    </div>
    </div>
    <div className="space-y-3 font-mono-display text-xs uppercase tracking-wider">
    <p className="font-bold text-tangerine text-sm">DEPARTMENTS</p>
    <ul className="space-y-2 text-cream/70">
    <li><Link className="hover:text-canary transition-colors" href="/collections/objects">Objects &amp; Curios</Link></li>
    <li><Link className="hover:text-canary transition-colors" href="/collections/home">Home &amp; Lighting</Link></li>
    <li><Link className="hover:text-canary transition-colors" href="/collections/essentials">Everyday Essentials</Link></li>
    <li><Link className="hover:text-canary transition-colors" href="/collections/vintage">Vintage &amp; Found (1-of-1)</Link></li>
    <li><Link className="hover:text-canary transition-colors" href="/#the-drop">The Next Drop</Link></li>
    <li><Link className="hover:text-canary transition-colors" href="/shop">Shop All</Link></li>
    </ul>
    </div>
    <div className="space-y-3 font-mono-display text-xs uppercase tracking-wider">
    <p className="font-bold text-canary text-sm">DISPATCH &amp; HELP</p>
    <ul className="space-y-2 text-cream/70">
    <li><Link className="hover:text-canary transition-colors" href="/shipping">Courier Delivery Info</Link></li>
    <li><span>Order Tracking</span></li>
    <li><Link className="hover:text-canary transition-colors" href="/returns">Returns &amp; Exchanges</Link></li>
    <li><span>Trade &amp; Interior Designers</span></li>
    <li><span>Vintage Consignment Desk</span></li>
    <li><Link className="hover:text-canary transition-colors" href="/contact">Say Hello</Link></li>
    </ul>
    </div>
    <div className="space-y-3 font-mono-display text-xs uppercase tracking-wider">
    <p className="font-bold text-melon text-sm">FOLLOW THE CIRCUS</p>
    <ul className="space-y-2 text-cream/70">
    <li><span>Instagram @thegeneraledit</span></li>
    <li><span>TikTok Unboxings</span></li>
    <li><span>Spotify Store Playlists</span></li>
    <li><span>Sunday Gazette Archive</span></li>
    </ul>
    </div>
    </div>
    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-display text-xs text-cream/60">
    <p>&copy; THE GENERAL EDIT. PROUDLY INDEPENDENT.</p>
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
    <Link className="hover:text-cream transition-colors" href="/privacy">PRIVACY POLICY</Link>
    <Link className="hover:text-cream transition-colors" href="/terms">TERMS OF SALE</Link>
    <Link className="hover:text-cream transition-colors" href="/accessibility">ACCESSIBILITY</Link>
    </div>
    </div>
    </div>
    </footer>
  );
}

export function Hero() {
  return (
    <section className="relative w-full border-b-2 border-ink bg-[#FFFDF9] overflow-hidden pt-10 pb-16 lg:pb-24">
    <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-butter/40 blur-2xl pointer-events-none"></div>
    <div className="absolute bottom-6 left-12 w-72 h-72 rounded-full bg-melon/20 blur-2xl pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
    <div className="lg:col-span-6 flex flex-col justify-center relative z-10 space-y-6">
    <div className="flex flex-wrap items-center gap-2.5">
    <span className="bg-canary text-ink px-3 py-1 font-mono-display text-xs font-bold uppercase tracking-wider border-2 border-ink hard-shadow-sm sticker-rotate-1">
                  ★ THE GENERAL EDIT
                </span>
    <span className="bg-bubblegum/40 text-ink px-3 py-1 font-mono-display text-xs font-bold uppercase tracking-wider border-2 border-ink sticker-rotate-2">
                  VOL. 04 SPRING EDITIONS
                </span>
    <span className="hidden sm:inline-block bg-cobalt text-white px-2.5 py-1 font-mono-display text-xs font-bold uppercase tracking-wider border-2 border-ink">
                  FRESH FINDS
                </span>
    </div>
    <h1 className="font-serif text-[clamp(2.25rem,9.5vw,3rem)] sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.05] text-ink">
                Good things. <br/>
    <span className="italic font-normal text-tangerine relative inline-block">
                  Strange things.
    <svg className="absolute -bottom-2 left-0 w-full text-canary" height="8" preserveAspectRatio="none" viewBox="0 0 100 8">
    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="4"></path>
    </svg>
    </span><br/>
                Everyday things.
              </h1>
    <p className="font-sans text-lg lg:text-xl text-ink/80 max-w-xl leading-relaxed">
                The independent general store for people who appreciate a weird Italian chrome lighter, a seriously good French toilet brush, and handmade glassware that makes cheap seltzer feel like a f&ecirc;te.
              </p>
    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
    <a className="bg-ink hover:bg-tangerine text-white px-8 py-4 font-mono-display text-sm tracking-wider uppercase font-bold border-2 border-ink hard-shadow flex items-center justify-center gap-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none" href="#just-catalogued">
    <span>EXPLORE WHAT&apos;S NEW</span>
    <span className="material-symbols-outlined text-lg">arrow_forward</span>
    </a>
    <a className="bg-cream hover:bg-canary text-ink px-6 py-4 font-mono-display text-sm tracking-wider uppercase font-bold border-2 border-ink hard-shadow-sm flex items-center justify-center gap-2 transition-all" href="#everyday-edit">
    <span>DAILY HEROES (UNDER $50)</span>
    </a>
    </div>
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs font-mono-display text-ink/70">
    <span className="flex items-center gap-1.5">
    <span className="material-symbols-outlined text-tangerine text-sm">local_shipping</span>
                  Curated for everyday living
                </span>
    <span className="flex items-center gap-1.5">
    <span className="material-symbols-outlined text-cobalt text-sm">recycling</span>
                  No filler, just keeper stuff
                </span>
    </div>
    </div>
    <div className="lg:col-span-6 relative mt-4 lg:mt-0">
    <div className="absolute -top-4 -left-1 sm:-left-4 z-20 bg-canary text-ink px-3 sm:px-4 py-2 border-2 border-ink hard-shadow sticker-rotate-3">
    <p className="font-mono-display text-xs font-bold uppercase tracking-widest">STAFF PICK OF THE WEEK</p>
    <p className="font-serif italic text-sm">“Genuinely sparks joy at 7 AM”</p>
    </div>
    <div className="absolute -bottom-5 right-1 sm:right-6 z-20 max-w-[calc(100%-0.75rem)] bg-tangerine text-white px-3 sm:px-4 py-2 border-2 border-ink hard-shadow sticker-rotate-2 flex items-center gap-2">
    <span className="material-symbols-outlined text-sm">verified</span>
    <span className="font-mono-display text-xs font-bold uppercase tracking-wider">RESTOCKED: MARVIS CINNAMON</span>
    </div>
    <div className="relative bg-cream-muted border-2 border-ink p-3 hard-shadow-lg">
    <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-white">
    <Photo photo={photos["hero"]} className="w-full h-full object-cover" eager />
    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-auto bg-white/95 backdrop-blur-sm border-2 border-ink p-2 sm:p-3 hard-shadow-sm flex items-center gap-2 sm:gap-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-cobalt flex items-center justify-center text-white font-mono-display font-bold text-xs">
                      NEW
                    </div>
    <div>
    <p className="font-mono-display text-[11px] font-bold uppercase tracking-wider text-ink">Modernist Wave Study</p>
    <p className="font-serif text-sm text-ink/80 italic">Ceramics, Cast Brass &amp; Mint</p>
    </div>
    </div>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-3 sm:pb-0 text-xs font-mono-display uppercase tracking-wide sm:tracking-widest sm:px-2 font-bold text-ink">
    <span className="flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 bg-cobalt inline-block rounded-full"></span>
                    Explore the collection
                  </span>
    <Link href="/collections/objects" className="text-tangerine hover:underline">Shop The Still Life →</Link>
    </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export function Promises() {
  return (
    <section className="border-b-2 border-ink bg-butter py-3 px-6">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono-display text-xs md:text-sm font-bold uppercase tracking-wider">
    <div className="flex items-center gap-2">
    <span className="text-tangerine">●</span>
    <span>Never boring home goods</span>
    </div>
    <div className="flex items-center gap-2">
    <span className="text-cobalt">●</span>
    <span>Estate treasures tested &amp; cleaned</span>
    </div>
    <div className="flex items-center gap-2">
    <span className="text-forest">●</span>
    <span>New, vintage, and secondhand finds</span>
    </div>
    <div className="flex items-center gap-2">
    <span className="text-brick">●</span>
    <span>Gift wrap with custom neon ribbon</span>
    </div>
    </div>
    </section>
  );
}

export function Departments() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="departments">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
    <div>
    <div className="inline-block bg-cobalt text-white px-2.5 py-0.5 text-xs font-mono-display uppercase font-bold tracking-widest mb-2 border border-ink">
                DEPARTMENTS
              </div>
    <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink">
                Browse by Mood &amp; Habit
              </h2>
    </div>
    <p className="font-sans text-ink/70 max-w-sm text-sm">
              Everything has been rigorously vetted for visual thrill and actual everyday usefulness.
            </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <Link className="group relative flex flex-col bg-white border-2 border-ink hard-shadow transition-all hover:-translate-y-1 hover:hard-shadow-lg" href="/collections/objects">
    <div className="relative aspect-square w-full overflow-hidden bg-melon/20 border-b-2 border-ink">
    <Photo photo={photos["objects"]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <span className="absolute top-3 left-3 bg-canary text-ink border-2 border-ink px-2.5 py-1 font-mono-display text-xs font-bold uppercase tracking-wider hard-shadow-sm sticker-rotate-1">
                  FUN STUFF
                </span>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
    <div>
    <div className="flex items-center justify-between">
    <h3 className="font-serif text-2xl font-normal group-hover:text-cobalt transition-colors">Objects &amp; Curiosities</h3>
    <span className="material-Symbols-outlined text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
    </div>
    <p className="font-sans text-xs text-ink/70 mt-2 leading-relaxed">
                    Sculptural candle holders, wavy glass, chrome bookends, and kinetic balance mobiles.
                  </p>
    </div>
    <span className="mt-4 font-mono-display text-[11px] font-bold text-tangerine uppercase tracking-wider">
                  Explore the collection →
                </span>
    </div>
    </Link>
    <Link className="group relative flex flex-col bg-white border-2 border-ink hard-shadow transition-all hover:-translate-y-1 hover:hard-shadow-lg" href="/collections/home">
    <div className="relative aspect-square w-full overflow-hidden bg-butter/30 border-b-2 border-ink">
    <Photo photo={photos["home"]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <span className="absolute top-3 left-3 bg-lilac text-ink border-2 border-ink px-2.5 py-1 font-mono-display text-xs font-bold uppercase tracking-wider hard-shadow-sm sticker-rotate-2">
                  COZY VIBES
                </span>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
    <div>
    <div className="flex items-center justify-between">
    <h3 className="font-serif text-2xl font-normal group-hover:text-tangerine transition-colors">Home &amp; Living</h3>
    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
    </div>
    <p className="font-sans text-xs text-ink/70 mt-2 leading-relaxed">
                    Supremely soft checker throws, cast bronze vessels, ambient lamps, and mood-setting incense.
                  </p>
    </div>
    <span className="mt-4 font-mono-display text-[11px] font-bold text-tangerine uppercase tracking-wider">
                  Explore the collection →
                </span>
    </div>
    </Link>
    <Link className="group relative flex flex-col bg-white border-2 border-ink hard-shadow transition-all hover:-translate-y-1 hover:hard-shadow-lg" href="/collections/essentials">
    <div className="relative aspect-square w-full overflow-hidden bg-sage/10 border-b-2 border-ink">
    <Photo photo={photos["essentials"]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <span className="absolute top-3 left-3 bg-tangerine text-white border-2 border-ink px-2.5 py-1 font-mono-display text-xs font-bold uppercase tracking-wider hard-shadow-sm sticker-rotate-1">
                  DAILY HEROES
                </span>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
    <div>
    <div className="flex items-center justify-between">
    <h3 className="font-serif text-2xl font-normal group-hover:text-cobalt transition-colors">Everyday Essentials</h3>
    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
    </div>
    <p className="font-sans text-xs text-ink/70 mt-2 leading-relaxed">
                    Fancy Italian toothpaste, French bath cubes, indestructible diner glassware, and beechwood kitchen tools.
                  </p>
    </div>
    <span className="mt-4 font-mono-display text-[11px] font-bold text-tangerine uppercase tracking-wider">
                  Explore the collection →
                </span>
    </div>
    </Link>
    <Link className="group relative flex flex-col bg-white border-2 border-ink hard-shadow transition-all hover:-translate-y-1 hover:hard-shadow-lg" href="/collections/vintage">
    <div className="relative aspect-square w-full overflow-hidden bg-melon/30 border-b-2 border-ink">
    <Photo photo={photos["vintage"]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <span className="absolute top-3 left-3 bg-bubblegum text-ink border-2 border-ink px-2.5 py-1 font-mono-display text-xs font-bold uppercase tracking-wider hard-shadow-sm sticker-rotate-3">
                  ONE-OF-A-KIND
                </span>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
    <div>
    <div className="flex items-center justify-between">
    <h3 className="font-serif text-2xl font-normal group-hover:text-brick transition-colors">Vintage &amp; Found</h3>
    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
    </div>
    <p className="font-sans text-xs text-ink/70 mt-2 leading-relaxed">
                    70s Italian ceramic trays, funky Scandinavian crystal, and wild retro lamps found on hunting trips.
                  </p>
    </div>
    <span className="mt-4 font-mono-display text-[11px] font-bold text-tangerine uppercase tracking-wider">
                  Explore the collection →
                </span>
    </div>
    </Link>
    </div>
    </section>
  );
}

export function JustLanded() {
  return (
    <section className="w-full border-t-2 border-b-2 border-ink bg-cream-muted/50 py-16" id="just-catalogued">
    <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
    <div>
    <div className="flex items-center gap-2 mb-2">
    <span className="w-3 h-3 rounded-full bg-tangerine"></span>
    <span className="font-mono-display text-xs uppercase tracking-widest font-bold text-tangerine">
                    FRESH ON THE SHELVES
                  </span>
    </div>
    <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink">
                  Just Landed in the Shop
                </h2>
    <p className="font-sans text-ink/75 text-sm mt-1">
                  Unboxed this week, photographed in raking morning sun, ready to ship to your living room.
                </p>
    </div>
    <FreshFilters />
    </div>
    <FreshGrid />
    <div className="mt-12 text-center">
    <Link className="inline-flex items-center gap-3 bg-white hover:bg-canary text-ink px-8 py-3.5 border-2 border-ink font-mono-display text-xs uppercase tracking-widest font-bold hard-shadow transition-all" href="/shop">
    <span>VIEW ALL OBJECTS IN THE SHOP</span>
    <span className="material-symbols-outlined text-base">east</span>
    </Link>
    </div>
    </div>
    </section>
  );
}

export function Everyday() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20" id="everyday-edit">
    <div className="bg-forest text-cream border-2 border-ink p-4 sm:p-8 md:p-12 hard-shadow-lg relative overflow-hidden">
    <div className="absolute -top-6 -right-6 w-32 h-32 bg-canary rounded-full flex items-center justify-center text-ink font-mono-display font-bold text-xs uppercase rotate-12 border-2 border-ink shadow-md hidden sm:flex">
    <span className="text-center px-2">CHORE UPGRADES</span>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
    <div className="lg:col-span-5 space-y-4">
    <span className="bg-tangerine text-white px-3 py-1 font-mono-display text-xs font-bold uppercase tracking-wider border border-cream inline-block">
                  REVERENCE FOR THE BORING
                </span>
    <h2 className="font-serif text-4xl sm:text-5xl font-light text-cream leading-tight">
                  The things you <br/>
    <span className="italic font-normal text-canary">actually use</span> every day.
                </h2>
    <p className="font-sans text-sm sm:text-base text-cream/80 leading-relaxed">
                  Why should a toilet brush look like medical equipment? Why can&apos;t dish washing feel like high design? We source workhorse essentials with serious aesthetic pedigree so doing the laundry doesn&apos;t bum you out.
                </p>
    <div className="pt-2">
    <Link className="inline-flex items-center gap-2 bg-canary text-ink px-6 py-3 font-mono-display text-xs uppercase font-bold tracking-wider border-2 border-ink hard-shadow-sm hover:bg-white transition-colors" href="/collections/essentials">
    <span>SHOP DOMESTIC NECESSITIES</span>
    <span className="material-symbols-outlined text-sm">east</span>
    </Link>
    </div>
    </div>
    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-cream text-ink border-2 border-ink p-3 hard-shadow flex flex-col justify-between">
    <div>
    <div className="aspect-square w-full bg-cream-muted border-2 border-ink overflow-hidden mb-3">
    <Photo photo={photos["japanese-kitchen-shears"]} className="w-full h-full object-cover" />
    </div>
    <span className="font-mono-display text-[10px] font-bold text-tangerine uppercase">SEKI, JAPAN</span>
    <h4 className="font-serif text-base font-normal mt-0.5 leading-snug">Sharp Japanese Kitchen Shears</h4>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-ink/20 pt-2 font-mono-display text-xs font-bold">
    <span>$48</span>
    <AddButton slug="japanese-kitchen-shears" className="bg-ink hover:bg-tangerine text-white px-2 py-1 text-[10px] font-mono-display uppercase transition-colors">ADD</AddButton>
    </div>
    </div>
    <div className="bg-cream text-ink border-2 border-ink p-3 hard-shadow flex flex-col justify-between">
    <div>
    <div className="aspect-square w-full bg-cream-muted border-2 border-ink overflow-hidden mb-3">
    <Photo photo={photos["marseille-olive-soap"]} className="w-full h-full object-cover" />
    </div>
    <span className="font-mono-display text-[10px] font-bold text-cobalt uppercase">MARSEILLE</span>
    <h4 className="font-serif text-base font-normal mt-0.5 leading-snug">Giant Olive Soap 300g Cube</h4>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-ink/20 pt-2 font-mono-display text-xs font-bold">
    <span>$16</span>
    <AddButton slug="marseille-olive-soap" className="bg-ink hover:bg-tangerine text-white px-2 py-1 text-[10px] font-mono-display uppercase transition-colors">ADD</AddButton>
    </div>
    </div>
    <div className="bg-cream text-ink border-2 border-ink p-3 hard-shadow flex flex-col justify-between">
    <div>
    <div className="aspect-square w-full bg-cream-muted border-2 border-ink overflow-hidden mb-3">
    <Photo photo={photos["fluted-diner-sugar-shaker"]} className="w-full h-full object-cover" />
    </div>
    <span className="font-mono-display text-[10px] font-bold text-tangerine uppercase">OHIO FOUNDRY</span>
    <h4 className="font-serif text-base font-normal mt-0.5 leading-snug">Fluted Diner Sugar Shaker</h4>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-ink/20 pt-2 font-mono-display text-xs font-bold">
    <span>$14</span>
    <AddButton slug="fluted-diner-sugar-shaker" className="bg-ink hover:bg-tangerine text-white px-2 py-1 text-[10px] font-mono-display uppercase transition-colors">ADD</AddButton>
    </div>
    </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export function Vintage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12" id="vintage">
    <div className="border-2 border-ink bg-white p-4 sm:p-6 lg:p-10 hard-shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
    <div className="lg:col-span-7 relative">
    <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-cream-muted">
    <Photo photo={photos["memphis-clock-and-lamp"]} className="w-full h-full object-cover" />
    <div className="absolute top-4 left-4 bg-canary text-ink border-2 border-ink font-mono-display text-xs font-bold px-3 py-1 hard-shadow-sm sticker-rotate-2">
                  FOUND IN MILAN, ITALY
                </div>
    <div className="absolute bottom-4 right-4 bg-ink text-white font-mono-display text-xs font-bold px-3 py-1.5 border border-white">
                  ONLY 1 EXISTS
                </div>
    </div>
    </div>
    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
    <div>
    <div className="flex items-center gap-2 mb-2">
    <span className="w-2.5 h-2.5 rounded-full bg-bubblegum"></span>
    <span className="font-mono-display text-xs uppercase font-bold tracking-widest text-brick">
                    VINTAGE TREASURE NO. 881
                  </span>
    </div>
    <h3 className="font-serif text-3xl sm:text-4xl font-light text-ink leading-tight">
                  1982 Memphis Studio Desk Clock &amp; Verdigris Task Lamp
                </h3>
    <p className="font-sans text-sm text-ink/80 mt-3 leading-relaxed">
                  We found this in the studio of an architect in the Tortona design district. Original mechanism ticking smoothly, enameled Memphis hands, and just enough patina to prove it survived the glory days of Italian postmodernism.
                </p>
    <div className="mt-6 border-2 border-ink bg-cream p-3 sm:p-4 font-mono-display text-xs space-y-2 [&>div]:gap-3 [&>div>span:last-child]:text-right">
    <div className="flex justify-between">
    <span className="text-ink/60 uppercase">Origin:</span>
    <span className="font-bold">Milan, c. 1982</span>
    </div>
    <div className="flex justify-between">
    <span className="text-ink/60 uppercase">Status:</span>
    <span className="font-bold text-cobalt">Cleaned, Rewired &amp; Tested</span>
    </div>
    <div className="flex justify-between">
    <span className="text-ink/60 uppercase">Rarity:</span>
    <span className="font-bold text-tangerine">Zero duplicates</span>
    </div>
    <div className="flex justify-between pt-2 border-t border-ink/20">
    <span className="text-ink uppercase font-bold">Price:</span>
    <span className="font-bold text-base text-ink">$380</span>
    </div>
    </div>
    </div>
    <div className="flex items-stretch gap-2 sm:gap-3">
    <AddButton slug="memphis-clock-and-lamp" className="flex-1 min-w-0 bg-brick hover:bg-ink text-white py-3.5 px-2 sm:px-6 font-mono-display text-xs uppercase tracking-wider font-bold border-2 border-ink hard-shadow-sm transition-colors flex items-center justify-center gap-2">
    <span className="material-symbols-outlined text-sm">shopping_bag</span>
    <span>CLAIM THIS PIECE ($380)</span>
    </AddButton>
    <Link className="shrink-0 min-w-11 px-2 sm:p-3.5 border-2 border-ink hover:bg-canary transition-colors flex items-center justify-center" href="/collections/vintage" aria-label="More vintage">
    <span className="material-symbols-outlined text-lg">explore</span>
    </Link>
    </div>
    </div>
    </div>
    </section>
  );
}

export function Drop() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12" id="the-drop">
    <div className="bg-melon/30 border-2 border-ink p-4 sm:p-8 lg:p-12 hard-shadow-lg relative overflow-hidden">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 pb-8 border-b-2 border-ink">
    <div className="max-w-xl">
    <div className="inline-flex items-center gap-2 bg-tangerine text-white px-3 py-1 font-mono-display text-xs font-bold uppercase tracking-widest border border-ink mb-3 sticker-rotate-1">
    <span className="w-2 h-2 rounded-full bg-canary animate-ping"></span>
                  DROP 07: COLLECTION PREVIEW
                </div>
    <h2 className="font-serif text-4xl sm:text-5xl font-light text-ink">
                  The Chrome &amp; Cobalt Study
                </h2>
    <p className="font-sans text-sm sm:text-base text-ink/80 mt-2 leading-relaxed">
                  28 ultra-limited solitary objects celebrating slick industrial tubular chrome slammed against hand-glazed Yves Klein ultramarine ceramics.
                </p>
    </div>
    <div className="bg-white border-2 border-ink p-5 hard-shadow text-center w-full sm:w-auto sm:min-w-[240px]">
    <p className="font-mono-display text-[11px] font-bold uppercase text-ink/70 tracking-widest">DROP STATUS</p>
    <p className="font-serif text-4xl font-normal text-tangerine my-1">Preview</p>
    <p className="font-mono-display text-[10px] text-ink font-bold uppercase">RELEASE DATE TO BE ANNOUNCED</p>
    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <div className="bg-white border-2 border-ink p-3 hard-shadow group">
    <div className="relative aspect-square bg-cream overflow-hidden border-2 border-ink mb-3">
    <Photo photo={photos["chrome-espresso"]} className="w-full h-full object-cover filter blur-[2px] group-hover:blur-none transition-all duration-300" />
    <div className="absolute inset-0 bg-cobalt/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
    <span className="bg-white/90 border border-ink text-ink font-mono-display text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1">
    <span className="material-symbols-outlined text-xs">lock</span> PREVIEW
                    </span>
    </div>
    </div>
    <h4 className="font-serif text-base font-normal">Italian Chrome Espresso Butler</h4>
    <p className="font-mono-display text-xs text-tangerine font-bold mt-1">Est. $110 • Edition of 6</p>
    </div>
    <div className="bg-white border-2 border-ink p-3 hard-shadow group">
    <div className="relative aspect-square bg-cream overflow-hidden border-2 border-ink mb-3">
    <Photo photo={photos["cobalt-taper"]} className="w-full h-full object-cover filter blur-[2px] group-hover:blur-none transition-all duration-300" />
    <div className="absolute inset-0 bg-cobalt/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
    <span className="bg-white/90 border border-ink text-ink font-mono-display text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1">
    <span className="material-symbols-outlined text-xs">lock</span> PREVIEW
                    </span>
    </div>
    </div>
    <h4 className="font-serif text-base font-normal">Cobalt Sculptural Ring Taper</h4>
    <p className="font-mono-display text-xs text-tangerine font-bold mt-1">Est. $65 • Edition of 12</p>
    </div>
    <div className="bg-white border-2 border-ink p-3 hard-shadow group">
    <div className="relative aspect-square bg-cream overflow-hidden border-2 border-ink mb-3">
    <Photo photo={photos["aluminum-paperweight"]} className="w-full h-full object-cover filter blur-[2px] group-hover:blur-none transition-all duration-300" />
    <div className="absolute inset-0 bg-cobalt/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
    <span className="bg-white/90 border border-ink text-ink font-mono-display text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1">
    <span className="material-symbols-outlined text-xs">lock</span> PREVIEW
                    </span>
    </div>
    </div>
    <h4 className="font-serif text-base font-normal">Brutalist Aluminum Paperweight</h4>
    <p className="font-mono-display text-xs text-tangerine font-bold mt-1">Est. $44 • Edition of 8</p>
    </div>
    </div>
    <div className="bg-white border-2 border-ink p-4 sm:p-6 hard-shadow flex flex-col lg:flex-row items-center justify-between gap-4">
    <div className="space-y-1 text-center md:text-left">
    <p className="font-mono-display text-sm font-bold uppercase text-ink flex items-center justify-center md:justify-start gap-1.5">
    <span className="material-symbols-outlined text-base text-cobalt">sms</span>
                  GET DROP UPDATES VIA SMS
                </p>
    <p className="font-sans text-xs text-ink/70">
                  Try the signup in this storefront preview.
                </p>
    </div>
    <PreviewForm kind="tel" className="flex w-full lg:w-auto flex-col sm:flex-row items-stretch gap-2">
    <input className="min-w-0 w-full sm:flex-1 lg:w-60 px-3 sm:px-4 py-2 text-base sm:text-xs font-mono-display bg-cream border-2 border-ink focus:bg-white" placeholder="+1 (212) 000-0000" required aria-label="Phone number" type="tel"/>
    <button className="min-h-11 bg-cobalt hover:bg-tangerine text-white px-5 py-2 font-mono-display text-xs uppercase tracking-wider font-bold border-2 border-ink transition-colors whitespace-nowrap" type="submit">
                  NOTIFY ME
                </button>
    </PreviewForm>
    </div>
    </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
    <div className="bg-canary border-2 border-ink p-4 sm:p-8 md:p-14 hard-shadow-lg text-center relative">
    <div className="max-w-3xl mx-auto space-y-4">
    <span className="font-mono-display text-xs font-bold uppercase tracking-widest text-ink/70 border-b-2 border-ink pb-1">
                WHY WE&apos;RE HERE
              </span>
    <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink leading-tight">
                “A home composed purely of beige perfection lacks a heartbeat. You need one strange lamp, one ridiculous candle, and soap that makes you smile in the dark.”
              </blockquote>
    <p className="font-mono-display text-xs uppercase tracking-widest font-bold text-ink/80 pt-2">
                — THE GENERAL EDIT GANG
              </p>
    </div>
    </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mb-8">
    <div className="bg-cream-muted border-2 border-ink p-4 sm:p-8 lg:p-12 hard-shadow grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
    <div className="md:col-span-6 space-y-3">
    <div className="flex flex-wrap items-center gap-2">
    <span className="bg-tangerine text-white font-mono-display text-[10px] font-bold uppercase px-2 py-0.5 border border-ink">
                  SUNDAY MORNINGS ONLY
                </span>
    <span className="font-mono-display text-xs text-ink/60 uppercase font-bold">NO SPAM EVER</span>
    </div>
    <h3 className="font-serif text-3xl sm:text-4xl font-light text-ink">
                A little something worth opening with your morning coffee.
              </h3>
    <p className="font-sans text-sm text-ink/75 leading-relaxed">
                Secret garage sale maps, newly restored vintage lighting drops, recipes we cook with our olive oil, and design essays with zero pretension.
              </p>
    </div>
    <div className="md:col-span-6">
    <PreviewForm kind="email" className="space-y-3">
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
    <input className="min-w-0 flex-1 px-4 py-3 bg-white text-base sm:text-xs font-mono-display border-2 border-ink placeholder:text-ink/50 hard-shadow-sm" placeholder="your.favorite.email@here.com" required aria-label="Email address" type="email"/>
    <button className="bg-ink hover:bg-tangerine text-white font-mono-display text-xs uppercase tracking-wider font-bold px-6 py-3 border-2 border-ink hard-shadow-sm transition-colors whitespace-nowrap" type="submit">
                    JOIN THE EDIT
                  </button>
    </div>
    <p className="font-mono-display text-[10px] text-ink/60 uppercase">
                  By joining you agree to occasionally get very excited about a stainless steel pepper mill.
                </p>
    </PreviewForm>
    </div>
    </div>
    </section>
  );
}
