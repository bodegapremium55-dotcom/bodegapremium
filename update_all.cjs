const fs = require('fs');
const https = require('https');

// Helper to fetch data
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
      res.on('error', reject);
    });
  });
}

async function updateAll() {
  console.log('Iniciando actualización de Productos y Noticias...');

  try {
    // 1. ACTUALIZAR PRODUCTOS
    const productsJson = await fetchData('https://invina-wines-api.vercel.app/api/wines');
    const data = JSON.parse(productsJson).data;
    
    let productsTs = `export interface Product {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  imageUrl: string;
  description: string;
  category: string;
  tasting_notes?: string;
  alcohol_percentage?: string;
  vintage?: number | null;
  winery?: string;
  origin_region?: string;
  format?: string;
}

export const products: Product[] = [
`;

    data.forEach(item => {
      const productPrice = item.products && item.products.length > 0 ? parseFloat(item.products[0].price) : 0;
      const formattedPrice = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(productPrice);
      let imageUrl = '';
      if (item.images && item.images.length > 0) {
        const rawUrl = item.images[0].image_url;
        imageUrl = rawUrl.replace('/src/assets/wines/', 'https://tienda.invinawines.cl/images/wines/');
      }
      let units = item.products && item.products.length > 0 ? item.products[0].units_per_box : 6;
      let format = units === 1 ? 'Botella individual' : `Caja de ${units} botellas`;
      
      let desc = (item.description || '').replace(/`/g, '\\`');
      let tasting = (item.tasting_notes || '').replace(/`/g, '\\`');
      
      productsTs += `  {
    id: "${item.id}",
    name: "${item.name}",
    price: ${productPrice},
    formattedPrice: "${formattedPrice}",
    imageUrl: "${imageUrl}",
    description: \`${desc}\`,
    category: "${item.quality_tier || 'Vinos'}",
    tasting_notes: \`${tasting}\`,
    alcohol_percentage: "${item.alcohol_percentage || ''}",
    vintage: ${item.vintage || null},
    winery: "${item.winery || ''}",
    origin_region: "${item.origin_region || ''}",
    format: "${format}"
  },
`;
    });
    productsTs += `];\n`;
    productsTs = productsTs.replace(/InVina/g, 'Bodega Premium');
    fs.writeFileSync('src/data/products.ts', productsTs);
    console.log('✅ Productos actualizados.');

    // 2. ACTUALIZAR NOTICIAS (SCRAPING WIP.CL)
    console.log('Buscando últimas noticias en WiP.cl...');
    const wipHtml = await fetchData('https://wip.cl/');
    
    // Regex simple para extraer artículos (esto depende de la estructura de wip.cl)
    // Buscamos patrones de artículos recientes
    const posts = [];
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    let count = 0;
    
    while ((match = articleRegex.exec(wipHtml)) !== null && count < 9) {
      const content = match[1];
      const titleMatch = content.match(/<h3[^>]*>.*?<a[^>]*>(.*?)<\/a>.*?<\/h3>/);
      const linkMatch = content.match(/<a[^>]*href="(.*?)"/);
      const imgMatch = content.match(/<img[^>]*src="(.*?)"/);
      const excerptMatch = content.match(/<div class="entry-content">([\s\S]*?)<\/div>/) || content.match(/<p>([\s\S]*?)<\/p>/);
      
      if (titleMatch && linkMatch) {
        posts.push({
          id: `news-${count}`,
          title: titleMatch[1].trim().replace(/&#[0-9]+;/g, '').replace(/&nbsp;/g, ' '),
          excerpt: (excerptMatch ? excerptMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 150) + '...' : 'Leer más...'),
          imageUrl: (imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'),
          link: linkMatch[1],
          date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
          author: 'WiP.cl'
        });
        count++;
      }
    }

    if (posts.length > 0) {
      let blogTs = `export interface BlogPost {
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
`;
      posts.forEach(post => {
        blogTs += `  {
    id: "${post.id}",
    title: "${post.title}",
    excerpt: "${post.excerpt}",
    content: "${post.excerpt} Visita la fuente original para leer la noticia completa.",
    imageUrl: "${post.imageUrl}",
    date: "${post.date}",
    author: "${post.author}",
    link: "${post.link}"
  },
`;
      });
      blogTs += `];\n`;
      fs.writeFileSync('src/data/blog.ts', blogTs);
      console.log('✅ Noticias actualizadas automáticamente.');
    } else {
      console.log('⚠️ No se pudieron extraer noticias automáticamente. Revisa la estructura de wip.cl');
    }

    console.log('🚀 Actualización completa.');
  } catch (err) {
    console.error('❌ Error durante la actualización:', err);
  }
}

updateAll();
