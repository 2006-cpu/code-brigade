import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import {useHistory} from 'react-router-dom';
import { getStripe, getAllProducts } from '../api/index.js'
const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_API_KEY
console.log(STRIPE_API_KEY)




export default function TakeMoney({user}) {
  const history = useHistory();
  const onToken = (token) => {
    console.log(token)
    const stripe = async () => {
      try { 
        if (token) {
          await getStripe(token, user.id)
          console.log('anything')
          history.push('/products')
        }
      } catch (error) {
       throw error;
      }
   }
   stripe()
    // fetch('/save-stripe-token', {
    //   method: 'POST',
    //   body: JSON.stringify(token),
    // }).then(response => {
    //   response.json().then(data => {
    //     alert(`We are in business, ${data.email}`);
    //   });
    // });
  }


 
  // ...
 
   
    return (
      // ...
      <StripeCheckout
        token={onToken}
        stripeKey = {STRIPE_API_KEY}
        billingAddress
      />
    )
  }