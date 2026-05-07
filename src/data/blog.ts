export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  link?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "tendencias-naturales-2026",
    title: "EL AUGE DE LOS VINOS DE BAJA INTERVENCIÓN EN 2026",
    excerpt: "Los consumidores buscan cada vez más la pureza del terroir a través de métodos naturales y orgánicos.",
    content: `La industria del vino está viviendo una transformación hacia lo natural. En 2026, los vinos de "baja intervención" han pasado de ser un nicho a una tendencia dominante en las mesas más exclusivas. 

Este enfoque prioriza el respeto por el ciclo biológico de la vid, el uso de levaduras indígenas y la mínima adición de sulfitos. El resultado son vinos con una identidad vibrante y una expresión del suelo mucho más marcada. 

Bodega Premium se suma a esta filosofía seleccionando viñas que cuidan el ecosistema y entregan productos honestos.`,
    imageUrl: "https://images.unsplash.com/photo-1510850431481-7a2ba518b5c2?auto=format&fit=crop&q=80&w=800",
    date: "06 mayo 2026",
    author: "Decanter (Info) / Unsplash (Img)",
    link: "https://www.decanter.com/"
  },
  {
    id: "brasil-mercado-clave-2026",
    title: "BRASIL SE CONSOLIDA COMO EL MOTOR DEL VINO CHILENO",
    excerpt: "Las cifras de exportación confirman que el mercado brasileño es hoy el principal destino del vino embotellado.",
    content: `Chile ha encontrado en Brasil su aliado más estratégico. Según los últimos reportes de Vinos de Chile, el consumo de cepas como Cabernet Sauvignon y Carmenere ha crecido un 15% en las principales ciudades brasileñas.

Este fenómeno se debe a una mayor cultura del vino y a la excelente relación precio-calidad que ofrecen las bodegas chilenas. Para Bodega Premium, esto representa una oportunidad de seguir expandiendo nuestra selección de exportación, trayendo a tu mesa los mismos estándares que hoy triunfan en Sao Paulo y Río de Janeiro.`,
    imageUrl: "https://images.unsplash.com/photo-1543412849-246ee9b7ce0e?auto=format&fit=crop&q=80&w=800",
    date: "05 mayo 2026",
    author: "Vinos de Chile (Info) / Unsplash (Img)",
    link: "https://www.vinosdechile.cl/"
  },
  {
    id: "antinori-en-chile-2026",
    title: "ANTINORI EN CHILE: UNA CENA, MUCHAS DEFINICIONES",
    excerpt: "Renzo Cotarella lideró en Haras de Pirque una experiencia que cruza vino, cocina y estrategia global.",
    content: `Renzo Cotarella, gerente general de la mítica casa italiana Antinori, visitó Chile para profundizar en la estrategia de Haras de Pirque. La cena, servida a los pies de los Andes, fue un manifiesto sobre la importancia del detalle y el equilibrio entre cocina y vino.

Cotarella destacó que el vino italiano y el chileno de alta gama comparten una resiliencia única ante los mercados globales cambiantes. "Todo se trata de equilibrio", señaló, mientras se degustaban las nuevas añadas de Albis y Pitío.`,
    imageUrl: "https://www.wip.cl/wp-content/uploads/2026/04/Albis_2022-476x440.jpg",
    date: "04 mayo 2026",
    author: "WiP.cl",
    link: "https://www.wip.cl/antinori-en-chile-una-cena-muchas-definiciones/"
  },
  {
    id: "sostenibilidad-hidirica-2026",
    title: "GESTIÓN HÍDRICA: INNOVACIÓN EN EL VALLE DE COLCHAGUA",
    excerpt: "Nuevas tecnologías de riego con IA permiten ahorrar hasta un 40% de agua en los viñedos.",
    content: `Ante el desafío del cambio climático, las viñas chilenas están liderando la adopción de Inteligencia Artificial para el riego. Sensores de humedad en tiempo real y análisis satelital permiten entregar a cada parra exactamente lo que necesita.

Esta eficiencia no solo cuida el recurso hídrico, sino que mejora la calidad de la uva al evitar el estrés innecesario. Bodega Premium prioriza en su catálogo a productores que implementan estas tecnologías sustentables.`,
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800",
    date: "03 mayo 2026",
    author: "iAgua (Info) / Unsplash (Img)",
    link: "https://www.iagua.es/"
  },
  {
    id: "copa-rota-yungay-2026",
    title: "LA COPA ROTA REGRESA A BARRIO YUNGAY",
    excerpt: "Festival reúne 18 viñas independientes con degustación ilimitada el 9 de mayo en Santiago.",
    content: `El próximo 9 de mayo, Casona Compañía será el epicentro del vino independiente. La Copa Rota vuelve con 18 proyectos vitivinícolas que priorizan el oficio y la cercanía. 

El evento es una oportunidad única para conocer a los productores y descubrir botellas que no llegan a los supermercados tradicionales. Una feria familiar, pet-friendly y llena de cultura local en el corazón de Santiago.`,
    imageUrl: "https://www.wip.cl/wp-content/uploads/2026/04/CopaRota_mayo2026-e1777580984807-476x440.jpg",
    date: "02 mayo 2026",
    author: "WiP.cl",
    link: "https://www.wip.cl/la-copa-rota-regresa-a-barrio-yungay/"
  },
  {
    id: "carmenere-londres-2026",
    title: "EL CARMENERE CHILENO BRILLA EN LONDRES",
    excerpt: "En las últimas catas de la capital británica, el Carmenere fue destacado como la joya sofisticada de Sudamérica.",
    content: `Críticos de Wine Spectator y Decanter han puesto sus ojos nuevamente en el Carmenere chileno. Durante la London Wine Fair, las muestras del Valle de Rapel y Peumo destacaron por su suavidad tánica y notas a especias negras.

"Es la alternativa perfecta para quienes buscan complejidad sin la astringencia de un Cabernet joven", comentan los expertos. En Bodega Premium tenemos una selección especial de Carmenere Gran Reserva esperándote.`,
    imageUrl: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&q=80&w=800",
    date: "01 mayo 2026",
    author: "Wine Spectator (Info) / Unsplash (Img)",
    link: "https://www.winespectator.com/"
  },
  {
    id: "fiesta-vino-patrimonial-maule-2026",
    title: "FIESTA DEL VINO PATRIMONIAL EN LONCOMILLA",
    excerpt: "Evento gratuito en San Javier destaca tradiciones del Maule con cepas ancestrales como la uva País.",
    content: `San Javier celebró su identidad con la Fiesta del Vino Patrimonial. Pequeños productores del secano interior mostraron el potencial de variedades ancestrales que han sobrevivido por siglos sin riego. 

Este evento refuerza la importancia de mantener viva la tradición vitivinícola chilena y el valor de las cepas que cuentan la historia de nuestro territorio.`,
    imageUrl: "https://www.wip.cl/wp-content/uploads/2026/04/Fiesta-del-Vino-Patrimonial-de-San-Javier-de-Loncomilla-Sernatur-Maule-476x440.jpg",
    date: "30 abril 2026",
    author: "WiP.cl",
    link: "https://www.wip.cl/fiesta-del-vino-patrimonial-llega-a-loncomilla/"
  },
  {
    id: "enoturismo-vr-2026",
    title: "ENOTURISMO 360°: VISITA LA BODEGA DESDE TU CASA",
    excerpt: "Bodega Premium implementa tecnología de Realidad Virtual para tours interactivos en sus procesos.",
    content: `La digitalización llega al mundo del vino. Pronto podrás recorrer nuestros viñedos y salas de barricas desde la comodidad de tu smartphone. 

Este proyecto busca acercar el proceso de producción a todos nuestros clientes, permitiéndoles entender el viaje de la uva desde la planta hasta la botella. Una experiencia educativa y sensorial pionera en la venta directa.`,
    imageUrl: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&q=80&w=800",
    date: "29 abril 2026",
    author: "Tech Wine (Info) / Unsplash (Img)",
    link: "https://www.bodegapremium.cl/"
  },
  {
    id: "maridaje-fusion-2026",
    title: "MARIDAJE FUSIÓN: VINOS VARIETALES Y COMIDA ASIÁTICA",
    excerpt: "Descubre cómo nuestra línea Varietales SALE acompaña perfectamente platos especiados y frescos.",
    content: `¿Quién dijo que el vino tinto no va con comida tailandesa? Nuestro Merlot Varietal, con su cuerpo ligero y notas frutales, es el compañero ideal para un Pad Thai. 

Por otro lado, nuestro Sauvignon Blanc resalta la frescura de un buen ceviche o sushi. Atrévete a experimentar con nuestra guía de maridaje moderno y aprovecha nuestras ofertas por caja.`,
    imageUrl: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800",
    date: "28 abril 2026",
    author: "Gastronomía & Cía (Info) / Unsplash (Img)",
    link: "https://gastronomiaycia.republica.com/"
  }
];
