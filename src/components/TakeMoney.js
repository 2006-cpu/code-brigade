import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import {useHistory} from 'react-router-dom';
import { getStripe, completedOrder } from '../api/index.js'
// const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_API_KEY



export default function TakeMoney({orderId, token}) {
  const history = useHistory();
  const onToken = (stripeToken) => {
    const stripe = async () => {
      try { 
        if (stripeToken) {
          await getStripe(stripeToken, orderId)
          const complete = await completedOrder(orderId, token)
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
        stripeKey = "pk_test_51HswdxHuqx5U03uj4yQViOm0ih4DJOewXkXfCyeDjD2fLt9SITtRVX1xEox1lOFzJNfQGdtxmBZb5QQ15ym68xzw009QQu1e9j"
        billingAddress
      />
    )
  }