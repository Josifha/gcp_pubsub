const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const topicName = 'orders-topic';

async function publishOrder(order) {
  const dataBuffer = Buffer.from(JSON.stringify(order));
  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Order published with message ID: ${messageId}`);
  } catch (error) {
    console.error(`Error publishing order: ${error.message}`);
  }
}

// Example order
const order = {
  orderId: '12345',
  orderAmount: 100
};

publishOrder(order);
