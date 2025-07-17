import express from 'express';
import userRoutes from './User/user.router';
import venueRoutes from './Venues/venue.router';
import eventRoutes from './Events/event.router';
import paymentRoutes from './payments/payments.router';
import customerSupportRoutes from './customerSupport/customerSupport.router';



const app = express();
const PORT = 8083;
// 
// Middleware
app.use(express.json());

// Routes
app.use('/api/support', customerSupportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Event Booking API');
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
