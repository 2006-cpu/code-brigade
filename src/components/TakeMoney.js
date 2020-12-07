import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import {useHistory} from 'react-router-dom';
import { getStripe, getAllProducts } from '../api/index.js'
const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_API_KEY




export default function TakeMoney({orderId}) {
  const history = useHistory();
  const onToken = (token) => {
    const stripe = async () => {
      try { 
        if (token) {
          await getStripe(token, orderId)
          history.push('/products')
        }
      } catch (error) {
       throw error;
      }
   }
   stripe()
  }

    return (
      <StripeCheckout
        token={onToken}
        stripeKey = {STRIPE_API_KEY}
        billingAddress
      />
    )
  }