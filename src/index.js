const app = require('./app');
const connect = require('./db/connection');

const PORT = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
