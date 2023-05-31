/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NCsgNArPMt10lH2DBCbz6MrTyYDYDx1QsestUh82hgAAQVIgZukssULdycTU5aZfGaSlyVXTzIU9Rb4TxmqXs8300vJ0ItYiA'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);

    console.log(session);
    // 2) Create checkout form + chanre credir card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    window.location = session.data.session.url;
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
