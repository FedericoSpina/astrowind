"use client";

import { useEffect, useState } from "react";
import { supabase } from "src/utils/supabase.js";
import ProjectAlbums from "./Album.jsx";

export default function AlbumSupabase() {
  const [albums, setAlbums] = useState([]); // Solo carga los covers inicialmente

  useEffect(() => {
    async function fetchCovers() {
      const { data: folderData, error: folderError } = await supabase
        .storage
        .from("steel")
        .list("", { limit: 100 });

      if (folderError) {
        console.error("❌ Error listando carpetas:", folderError);
        return;
      }

      const albumsData = await Promise.all(
        folderData.map(async (folder) => {  // ✅ Ahora pasamos (folder)
          const { data: imageData, error: imageError } = await supabase
            .storage
            .from("steel")
            .list(folder.name, { limit: 100 });

          if (imageError) {
            console.error(`❌ Error listando imágenes en ${folder.name}:`, imageError);
            return null;
          }

          return { title: folder.name, images: [] }; // 🔹 Agregar 'images' como array vacío
        })
      );



      // Buscar los covers
      const updatedAlbums = await Promise.all(
        albumsData.map(async (album) => {
          const { data: imageData, error: imageError } = await supabase
            .storage
            .from("steel")
            .list(album.title, { limit: 100 });

          if (imageError) {
            console.error(`❌ Error listando imágenes en ${album.title}:`, imageError);
            return album;
          }

          // Filtrar las imágenes y buscar el cover
          const imageUrls = imageData.map((file) => {
            const publicUrl = supabase.storage
              .from("steel")
              .getPublicUrl(`${album.title}/${file.name}`).data.publicUrl;

            return { src: publicUrl, thumb: publicUrl };
          });



          // Buscar cover.webp o usar la primera imagen
          const cover = imageUrls.find((img) => img.src.includes("cover.webp"))?.src || imageUrls[0]?.src || "";

          return { ...album, cover, images: imageUrls || [] }; // 🔹 Asegurar que images sea un array
        })
      );

      setAlbums(updatedAlbums);
    }

    fetchCovers();
  }, []);

  // Función para cargar imágenes de un álbum cuando se hace clic
  const loadAlbumImages = async (albumTitle) => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.title === albumTitle && !album.loaded
          ? { ...album, loaded: true } // Marcar como cargado
          : album
      )
    );

    const { data: imageData, error: imageError } = await supabase
      .storage
      .from("steel")
      .list(albumTitle, { limit: 100 });

    if (imageError) {
      console.error(`❌ Error cargando imágenes en ${albumTitle}:`, imageError);
      return;
    }

    // Convertir archivos en URLs públicas
    const imageUrls = imageData.map((file) => {
      const publicUrl = supabase.storage
        .from("steel")
        .getPublicUrl(`${albumTitle}/${file.name}`).data.publicUrl;
      return { src: publicUrl, thumb: publicUrl };
    });

    setAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.title === albumTitle
          ? { ...album, images: imageUrls }
          : album
      )
    );
  };

  if (!albums.length) {
    return <div className="lightgallery container mb-12 mx-auto motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-200">
        Cargando proyectos...
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mt-3 mx-6"></div>
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-md mt-3"></div>
          </div>
        ))}
      </div>
    </div>

  }

  return <ProjectAlbums albums={albums} loadAlbumImages={loadAlbumImages} />;
}
