---
title: Obra fachada
excerpt: Proyecto fachada de hospital , hecho con steelframe
image: ~/assets/images/San Martin/1.jpeg
tags:
  - astro
  - tailwind css
  - theme
metadata:
  canonical: https://astrowind.vercel.app/how-to-customize-astrowind-to-your-brand


---



## Hecho puramente de steelframe y construccion en seco


<script>
import ImageCarouselText from '~/components/widgets/ImageCarouselText.astro';
const model1 = [
{ src: 'src/assets/images/San Martin/1.jpeg', alt: 'Proyeccion en cad' },
  { src: 'src/assets/images/San Martin/steel1.jpg', alt: 'Steel' },
  { src: 'src/assets/images/San Martin/steel2.jpg', alt: 'Steel2' },
  { src: 'src/assets/images/San Martin/final.jpeg', alt: 'Proyeccion realizada' },
];

<ImageCarouselText
    title="Buenas..."
    content={'Mi nombre es Diego Villanueva, tengo 51 años y llevo mas de 20 años trabajando en la construcción, 10 años en España y el resto en Argentina, con obras en Buenos Aires (especialmente zona norte), el partido de la Costa y Ushuaia'}
    columns={2}
    isDark={false}
    image={model1}
  />

</script>

