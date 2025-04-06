import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({ images = [] }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!images.length) return;

    // Destroy previous Swiper instance if it exists
    if (swiperRef.current) {
      swiperRef.current.destroy();
      swiperRef.current = null;
    }

    swiperRef.current = new Swiper(".swiper-slider", {
      modules: [Navigation, Pagination, Autoplay],
      direction: "horizontal",
      slidesPerView: 1,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, [images]);

  if (!images.length) return null;

  return (
    <section className="flex justify-center">
      <div className="relative w-full max-w-[500px] h-[350px] group">
        <div className="swiper swiper-slider w-full h-full">
          <div className="swiper-wrapper">
            {images.map((image, index) => (
              <div className="swiper-slide flex justify-center items-center" key={index}>
                <img
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-lg bg-white dark:bg-slate-900"
                />

              </div>
            ))}
          </div>
          <div className="swiper-pagination absolute bottom-2 w-full"></div>
          {/* Botón Prev con animación en hover */}
          <div className="swiper-button-prev absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Botón Next con animación en hover */}
          <div className="swiper-button-next absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
