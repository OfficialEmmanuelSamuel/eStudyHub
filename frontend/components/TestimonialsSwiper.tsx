"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

type TestimonialsSwiperProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSwiper({
  testimonials,
}: TestimonialsSwiperProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      className="mt-8"
    >
      {testimonials.map((review) => (
        <SwiperSlide key={review.name}>
          <blockquote className="h-full p-6 bg-slate-900  rounded-2xl backdrop-blur-sm">
            <p className="text-slate-200 text-center italic">&ldquo;{review.quote}&rdquo;</p>
            <footer className="mt-4 mb-8 text-sm text-slate-400 text-center">
              {review.name} · {review.role}
            </footer>
          </blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
