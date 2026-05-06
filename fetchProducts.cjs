const fs = require('fs');
const https = require('https');

https.get('https://invina-wines-api.vercel.app/api/wines', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body).data;
    let tsContent = `export interface Product {
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
      tsContent += `  {
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
    tsContent += `];\n`;
    
    // Remove InVina text
    tsContent = tsContent.replace(/InVina/g, 'Bodega Premium');
    
    fs.writeFileSync('src/data/products.ts', tsContent);
    console.log('Successfully updated products.ts with full API details');
  });
});
