import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { getStripe } from '../api/index.js'


 
export default class TakeMoney extends React.Component {
  onToken = (token) => {
    console.log(token)
    const stripe = async () => {
      try { 
       console.log(await getStripe(token))
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
 
  render() {
    return (
      // ...
      <StripeCheckout
        token={this.onToken}
        stripeKey = "pk_test_51HswdxHuqx5U03uj4yQViOm0ih4DJOewXkXfCyeDjD2fLt9SITtRVX1xEox1lOFzJNfQGdtxmBZb5QQ15ym68xzw009QQu1e9j"
        // billingAddress
      />
    )
  }
}