"use client";

import { useRef } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default function ProjectAlbums({ albums }) {
  const galleryRefs = useRef([]);

  const onInit = (detail, albumIndex) => {
    if (detail && detail.instance) {
      galleryRefs.current[albumIndex] = detail.instance;
    } else {
      console.warn(`⚠️ No se pudo inicializar LightGallery para el álbum ${albumIndex}`);
    }
  };
  

  const openGallery = (albumIndex) => {
    if (galleryRefs.current[albumIndex]) {
      galleryRefs.current[albumIndex].openGallery(0);
    } else {
      console.warn(`🚨 La galería en el índice ${albumIndex} no está lista todavía.`);
    }
  };
  

  return (
    <div className="lightgallery container mb-12 mx-auto motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-200">Proyectos realizados recientemente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album, albumIndex) => (
          <div key={albumIndex}>
            <div
              className="rounded-lg cursor-pointer hover:bg-gray-100 hover:text-primary transition duration-500 dark:hover:bg-gray-800"
              onClick={() => openGallery(albumIndex)}
            >
              <h3 className="font-semibold text-center mb-2 pt-3">{album.title}</h3>
              <img
                src={album.cover}
                alt={`Imagen de ${album.title}`}
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
            </div>

            {/* Separate LightGallery instance for each project */}
            {album.images?.length > 0 && (
              <LightGallery
                onInit={(detail) => onInit(detail, albumIndex)}
                dynamic
                dynamicEl={album.images}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="hidden"
                mode="lg-fade"
                thumbnail={true}
                pager={true}
                download={false}
                zoom={true}
                mobileSettings={{
                  thumbnail: true,
                  controls: false,
                  showCloseIcon: true,
                  download: false,
                  rotate: false,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
