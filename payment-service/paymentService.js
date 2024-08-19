const { PubSub } = require('@google-cloud/pubsub');
const mysql = require('mysql');

const pubSubClient = new PubSub();
const subscriptionName = 'payment-subscription';

// MySQL database configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'pubsub@123456789',
  database: 'ecommerce',
  port: 3307,
  connectTimeout: 10000
};

function storePayment(orderId) {

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to the MySQL database.');

    const query = 'INSERT INTO payments (order_id, status) VALUES (?, ?) ON DUPLICATE KEY UPDATE status = ?';
    const values = [orderId, 'Processed', 'Processed'];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
      console.log(`Payment processed for order ID: ${orderId}`);
    });

    connection.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
}

function messageHandler(message) {
  const order = JSON.parse(Buffer.from(message.data, 'base64').toString());
  console.log(`Received message: ${order.orderId}, ${order.orderAmount}`);
  storePayment(order.orderId);
  message.ack();
}

pubSubClient.subscription(subscriptionName).on('message', messageHandler);
