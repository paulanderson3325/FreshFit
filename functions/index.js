const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const moment = require('moment');

//const logging = require('@google-cloud/logging')();
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

// When a user joins, send an email to the Admin
exports.userJoined = functions.auth.user()
  .onCreate(user => {
    return admin.firestore().collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        const newUser = doc.data();
        const msg = {
          to: 'panderson@tiresoft.com',
          from: 'support@tiresoft.com',
          subject: 'New Auth User',
          html: `Name: ${newUser.firstName} ${newUser.lastName} email: ${user.email}`
        };
        return sgMail.send(msg)
        .then(() => console.log('email sent!'))
        .catch( err => console.log('Error', err));        
      });  
  });

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user()
  .onCreate(async (user) => {
    const customer = await stripe.customers.create({email: user.email});
    return admin.firestore()
      .collection('stripe_customers')
      .doc(user.uid)
      .set({customer_id: customer.id});
  });

// Add a payment source (card) for a user by writing a stripe payment source token to Cloud Firestore
exports.addPaymentSource = functions.firestore
  .document('/stripe_customers/{userId}/tokens/{autoId}')
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (data === null) { return null }
    const token = data.token.id;
    try {
      const snapshot = await admin.firestore()
        .collection('stripe_customers')
        .doc(context.params.userId).get();
      const customer =  snapshot.data().customer_id;
      const response = await stripe.customers.createSource(customer, {source: token});
      await admin.firestore()
        .collection('stripe_customers')
        .doc(context.params.userId)
        .collection('sources')
        .doc(response.fingerprint)
        .set(response, {merge: true});
    } catch(error) {
      await change.after.ref
        .set({'error':userFacingMessage(error)}, { merge:true});
    }  
  });

// Charge the Stripe customer whenever a charge is written to Cloud Firestore
exports.createStripeCharge = functions.firestore
  .document('stripe_customers/{userId}/charges/{autoId}')
  .onCreate(async (snap, context) => {
    try {
      const snapshot = await admin.firestore()
        .collection('stripe_customers')
        .doc(context.params.userId).get();
      const customer =  snapshot.data().customer_id;
      const amount = snap.data().amount;
      const idempotencyKey = context.params.autoId;
      const charge = {amount, currency, customer};
      // Use passed in source otherwise stripe will use the default for the customer
      if (snap.data().source !== null) {
        charge.source = snap.data().source
      }
      const response = await stripe.charges.create(charge, {idempotency_key: idempotencyKey});
      // If the result is successful, write it back to the database
      await snap.ref.set(response, { merge: true });
      return ({'ref':snap.ref.id, 'context':context.params.autoId});
    } catch(error) {
      await snap.ref.set({error:userFacingMessage(error)}, { merge: true });
      return ({'ref':snap.ref.id, 'context':context.params.autoId});
    }  
  });

// Send Customer an Email when a new Order is Created
exports.createOrderEmail = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    //console.log('Order Added', snap.data())

    //const email = doc.data().customer.email
    const email = 'panderson@tiresoft.com'
    const name = snap.data().customer.name
    const deliveryDate = moment(snap.data().deliveryDate).format("dddd, MMMM Do") 
    const deliveryLocation = snap.data().deliveryLocation
    const mealsTotal = snap.data().mealsTotal
    const orderTotal = (snap.data().orderTotal/100).toFixed(2)
    const receiptUrl = snap.data().receiptUrl
    const msg = {
      to: email,
      from: 'support@tiresoft.com',
      subject: 'Fresh Fit Meal Order',
      html: `<p>
        Dear ${name},<br><br>
        Thank you for your order! The ${mealsTotal} meals you ordered<br>
        will be delivered to ${deliveryLocation} on ${deliveryDate}. Your<br>
        credit card was charged ${orderTotal}. You may retrieve a copy<br>
        of your receipt at:<br>
        ${receiptUrl}
      </p>`
    };
    return sgMail.send(msg)
    .then(() => console.log('email sent!'))
    .catch( err => console.log('Error', err));        
  });  


// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth
  .user()
  .onDelete(async (user) => {
    const snapshot = await admin.firestore().collection('stripe_customers').doc(user.uid).get();
    const customer = snapshot.data();
    await stripe.customers.del(customer.customer_id);
    await admin.firestore().collection('stripe_customers').doc(user.uid).delete();
    return admin.firestore().collection('users').doc(user.uid).delete();
  });

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
};