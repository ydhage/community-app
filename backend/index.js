const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();
const { sequelize } = require('./models');
// const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const notificationRoutes = require("./routes/notification");

// मोठं payload allow करा (उदा. 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

// uploads फोल्डर public करा (images serve करण्यासाठी)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/notifications", notificationRoutes);

// DB sync
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB error:', err));

sequelize.sync({ alter: true }) 
  .then(() => console.log('✅ Models synced'));

// DB Sync
// sequelize.sync().then(() => {
//   console.log("✅ Models synced with DB");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
