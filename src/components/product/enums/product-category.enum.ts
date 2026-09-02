export enum ProductCategoryEnum {
  OTHER = 'OTHER', // Otros (Categoría por defecto)
  SMARTPHONES = 'SMARTPHONES', // Smartphones
  COMPUTING = 'COMPUTING', // Computación y Notebooks
  HOME = 'HOME', // Hogar, Muebles y Jardín
  APPLIANCES = 'APPLIANCES', // Electrodomésticos y Accesorios
  AUTOMOTIVE = 'AUTOMOTIVE', // Automotriz
  FASHION = 'FASHION', // Moda e Indumentaria
  JEWELRY = 'JEWELRY', // Joyas y Relojes
  FOOD = 'FOOD', // Alimentos y Bebidas
  BEVERAGES = 'BEVERAGES', // Alcohol & Cigarros
  SPORTS = 'SPORTS', // Deportes y Fitness
  CAMPING = 'CAMPING', // Pesca y Camping
  GAMES = 'GAMES', // Videojuegos y Consolas
  BOOKS = 'BOOKS', // Libros
  OFFICE = 'OFFICE', // Insumos de Oficina
  TOOLS = 'TOOLS', // Herramientas y Construcción
  TOYS = 'TOYS', // Juguetes & Coleccionables
  BABY = 'BABY', // Bebés
  BEAUTY = 'BEAUTY', // Perfumería & Cosméticos
  HEALTH = 'HEALTH', // Salud y Bienestar
  PETS = 'PETS' // Mascotas y Animales
}

export const ProductCategoryLabel: Record<ProductCategoryEnum, string> = {
  [ProductCategoryEnum.OTHER]: 'Otros (Categoría por defecto)',
  [ProductCategoryEnum.SMARTPHONES]: 'Smartphones',
  [ProductCategoryEnum.COMPUTING]: 'Computación y Notebooks',
  [ProductCategoryEnum.HOME]: 'Hogar, Muebles y Jardín',
  [ProductCategoryEnum.APPLIANCES]: 'Electrodomésticos y Accesorios',
  [ProductCategoryEnum.AUTOMOTIVE]: 'Automotriz',
  [ProductCategoryEnum.FASHION]: 'Moda e Indumentaria',
  [ProductCategoryEnum.JEWELRY]: 'Joyas y Relojes',
  [ProductCategoryEnum.FOOD]: 'Alimentos y Bebidas',
  [ProductCategoryEnum.BEVERAGES]: 'Alcohol & Cigarros',
  [ProductCategoryEnum.SPORTS]: 'Deportes y Fitness',
  [ProductCategoryEnum.CAMPING]: 'Pesca y Camping',
  [ProductCategoryEnum.GAMES]: 'Videojuegos y Consolas',
  [ProductCategoryEnum.BOOKS]: 'Libros',
  [ProductCategoryEnum.OFFICE]: 'Insumos de Oficina',
  [ProductCategoryEnum.TOOLS]: 'Herramientas y Construcción',
  [ProductCategoryEnum.TOYS]: 'Juguetes & Coleccionables',
  [ProductCategoryEnum.BABY]: 'Bebés',
  [ProductCategoryEnum.BEAUTY]: 'Perfumería & Cosméticos',
  [ProductCategoryEnum.HEALTH]: 'Salud y Bienestar',
  [ProductCategoryEnum.PETS]: 'Mascotas y Animales',
}