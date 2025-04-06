import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: "Precios",
      links: [
        {
          text: 'Modelos de casas',
          href: getPermalink('/precios#casas'),
        },
        {
          text: 'Calculo de precios',
          href: getPermalink('/calculo'),
        },
        {
          text: 'Preguntas Frecuentes',
          href: getPermalink('/precios#faqs'),
        },
      
      ]

    },
    {
      text: 'Servicios',
      links: [
        /* {
          text: 'Features (Anchor Link)',
          href: getPermalink('/#features'),
        }, */
        {
          text: 'Consultoria y construccion',
          href: getPermalink('/servicios'),
        }
      ],
    },
    { 
      text: 'Politica de transparencia',
      href: getPermalink('/transparencia'),
    },
    {

      text: 'Contacto',
      href: getPermalink('/contacto'),
    },
    {
      text: 'Quienes somos',
      href: getPermalink('/nosotros'),
    },

    {
      text: 'Obras ejecutadas',
      href: getPermalink('/proyectos'),
    }
  ]
};

export const footerData = {
  links: [
    {
      title: 'Nosotros',
      links: [
        { text: 'Sobre nosotros', href: getPermalink('/about') },
      ],
    },
    {
      title: 'Productos y servicios',
      links: [
        { text: 'Consultoria', href: getPermalink('/servicios') },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    {
      title: 'Nuestro impacto en la industria',
      links: [
        { text: 'Proyectos', href: '/blog' },
        { text: 'Clientes', href: '/about' },
      ],
    },
    {
      title: 'Serivicios',
      links: [
        { text: 'Sobre nosotros', href: getPermalink('/about') },
        { text: 'Nuestros proyectos', href: '/' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terminos y condiciones', href: getPermalink('/terms') },
    { text: 'Politica de privacidad', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/construimosensteel' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/construimosensteel' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://onwidget.com/favicon/favicon-32x32.png" alt="onWidget logo" loading="lazy"></img>
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  `,
};
