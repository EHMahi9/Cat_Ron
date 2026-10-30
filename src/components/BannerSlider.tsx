"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, Compass } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    badge: "Welcome to BookNook",
    title: "Discover Stories That Ignite Your Imagination",
    text: "Explore thousands of books across classic fiction, cutting-edge science, deep history, and children's adventures. Add, borrow, and read freely.",
    buttonText: "Browse Books",
    image: "https://images.unsplash.com/photo-1507842229458-57754f15d19d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "Smart Community Library",
    title: "Borrow With One Click & Return Anytime",
    text: "Our seamless borrowing system tracks available copies in real time. Choose your next read and enjoy free, frictionless knowledge sharing.",
    buttonText: "Browse Books",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "Share The Joy Of Reading",
    title: "Contribute Your Collection to Fellow Readers",
    text: "Have books sitting on your shelf? Add them to BookNook and let eager readers borrow and appreciate your beloved literature.",
    buttonText: "Browse Books",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function BannerSlider() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl shadow-xl my-6 sm:my-8 border border-slate-200 dark:border-slate-800">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={900}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-[460px] sm:h-[520px] lg:h-[580px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
              {/* Dual gradient overlay for readable text */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
              <div className="absolute inset-0 bg-slate-950/30" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center">
              <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-xs sm:text-sm font-medium text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{slide.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight font-serif">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl">
                  {slide.text}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-102 transition-all"
                  >
                    <Compass className="w-5 h-5" />
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/add-book"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
                  >
                    <BookOpen className="w-5 h-5 text-indigo-300" />
                    <span>Add New Book</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
