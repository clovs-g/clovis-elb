# ElBaker E-commerce Platform

A comprehensive e-commerce platform for Sweet Temptations Bakery built with React, TypeScript, and Supabase.

## Features

### Frontend
- **Modern React Application**: Built with TypeScript and Vite
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Catalog**: Browse products by category with search and filtering
- **Shopping Cart**: Add items to cart with size variations
- **Order Management**: Complete checkout process with delivery options
- **Gallery**: Image gallery with category filtering
- **Admin Panel**: Comprehensive admin interface for managing the bakery

### Backend
- **Supabase Database**: PostgreSQL database with Row Level Security
- **Authentication**: JWT-based authentication for customers and admins
- **API Services**: RESTful API for all operations
- **File Upload**: Image upload and management
- **Order Processing**: Complete order workflow management
- **Analytics**: Dashboard analytics and reporting

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Maps**: React Leaflet
- **Forms**: Native HTML5 with validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elbaker-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy the project URL and anon key
   - Run the database migrations in the Supabase SQL editor

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **Run database migrations**
   - Open Supabase SQL editor
   - Run the migrations in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_seed_data.sql`

6. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Core Tables
- **admin_users**: Admin authentication and management
- **categories**: Product categories
- **products**: Product catalog with variations
- **product_images**: Product image management
- **product_sizes**: Size variations and pricing
- **inventory**: Stock management
- **users**: Customer accounts
- **orders**: Order management
- **order_items**: Order line items
- **gallery_images**: Gallery management
- **cart_items**: Persistent shopping cart

### Security
- Row Level Security (RLS) enabled on all tables
- Admin-only access for management operations
- Public read access for product catalog
- User-specific access for orders and cart

## API Services

### Product Management
- `productAPI.getProducts()` - Get all active products
- `productAPI.getProductBySlug()` - Get single product
- `productAPI.createProduct()` - Admin: Create product
- `productAPI.updateProduct()` - Admin: Update product
- `productAPI.deleteProduct()` - Admin: Delete product

### Order Management
- `orderAPI.createOrder()` - Create new order
- `orderAPI.getOrder()` - Get order details
- `orderAPI.getUserOrders()` - Get user's orders
- `orderAPI.getAllOrders()` - Admin: Get all orders
- `orderAPI.updateOrderStatus()` - Admin: Update order status

### Gallery Management
- `galleryAPI.getGalleryImages()` - Get gallery images
- `galleryAPI.createGalleryImage()` - Admin: Add image
- `galleryAPI.updateGalleryImage()` - Admin: Update image
- `galleryAPI.deleteGalleryImage()` - Admin: Delete image

### Analytics
- `analyticsAPI.getDashboardStats()` - Dashboard statistics
- `analyticsAPI.getSalesAnalytics()` - Sales analytics

## Admin Panel

Access the admin panel at `/admin/login` with:
- **Email**: admin@elbaker.com
- **Password**: admin123

### Admin Features
- **Dashboard**: Overview with key metrics and recent activity
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order status
- **Gallery Management**: Upload and organize gallery images
- **Customer Management**: View customer data and order history
- **Analytics**: Sales reports and performance metrics

## Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

### Database Setup
1. Set up production Supabase project
2. Run migrations in production
3. Configure environment variables
4. Set up proper RLS policies

## Security Considerations

- **Authentication**: JWT-based with secure token handling
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection**: Protected by Supabase's built-in protections
- **XSS Protection**: Input sanitization and CSP headers
- **File Upload**: Validated file types and sizes
- **Rate Limiting**: API rate limiting for admin endpoints

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Performance Optimization

- **Code Splitting**: Lazy loading for admin routes
- **Image Optimization**: Automatic image compression
- **Caching**: Browser caching for static assets
- **Database Indexing**: Optimized database queries
- **CDN**: Use CDN for image delivery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@elbaker.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## Roadmap

### Phase 1 (Current)
- ✅ Basic e-commerce functionality
- ✅ Admin panel
- ✅ Order management
- ✅ Gallery system

### Phase 2 (Next)
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Inventory alerts
- [ ] Customer reviews
- [ ] Loyalty program

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-location support
- [ ] Subscription orders
- [ ] API for third-party integrations

## Database Backups

We rely on Supabase's automated daily backups, but for additional safety an **on-demand dump** script is provided.

```bash
npm run db:backup
```

This runs:

```bash
supabase db dump --db-url "$SUPABASE_DB_URL" --file backups/$(date +%Y-%m-%d_%H-%M-%S).sql
```

Configure `SUPABASE_DB_URL` in your environment (.env.local).  The dumps are pushed to `backups/` (git-ignored).

To restore locally:

```bash
psql "$SUPABASE_DB_URL" < backups/2025-07-07_12-00-00.sql
```