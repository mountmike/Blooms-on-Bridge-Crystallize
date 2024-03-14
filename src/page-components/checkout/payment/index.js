/* eslint-disable react/display-name */
import { loadStripe } from '@stripe/stripe-js';
import { useBasket } from 'components/basket';

import ServiceApi from 'lib/service-api';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import styled from 'styled-components';
import { Button } from 'ui';

import {
  CheckoutFormGroup,
  ErrorMessage,
  FootNote,
  Input,
  InputGroup,
  Label,
  PaymentProvider,
  SectionHeader,
  TextArea
} from '../styles';

import AddressSearch from './AddressSearch';
import Delivery from './Delivery';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const StripeCheckout = dynamic(() => import('./stripe'));
const KlarnaCheckout = dynamic(() => import('./klarna'));
const VippsCheckout = dynamic(() => import('./vipps'));
const MollieCheckout = dynamic(() => import('./mollie'));
const PaypalCheckout = dynamic(() => import('./paypal'));

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Inner = styled.div``;

export default function Payment() {
  const { t } = useTranslation(['checkout', 'customer']);
  const router = useRouter();
  const { basketModel, actions } = useBasket();
  // const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(null);
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    deliveryDate: '',
    addresses: [
      {
        type: 'billing',
        email: '',
        phone: '',
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        suburb: '',
        territory: '',
        postcode: ''
      },
      {
        type: 'delivery',
        email: '',
        phone: '',
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        suburb: '',
        territory: '',
        postcode: ''
      }
    ]
  });
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [isReadyForStripe, setIsReadyForStripe] = useState(false);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      );
    }
  }, []);

  useEffect(() => {
    let { cart } = basketModel;
    let currentDeliveryMethod = cart.filter((product) =>
      product.sku.startsWith('delivery')
    );

    const removeAllDeliveryMethods = () => {
      currentDeliveryMethod.map((product) => {
        actions.removeItem({
          sku: product.sku,
          path: '/deliveryfees/delivery'
        });
      });
    };

    if (currentDeliveryMethod) {
      removeAllDeliveryMethods();
    }

    if (deliveryMethod === 'collect') {
      actions.addItem({
        sku: 'delivery-pickup-from-shop',
        path: '/deliveryfees/delivery'
      });
      return;
    }

    if (deliveryMethod === 'deliveryInTown') {
      actions.addItem({
        sku: 'delivery-in-town',
        path: '/deliveryfees/delivery'
      });
      return;
    }

    if (deliveryMethod === 'deliveryOutsideTown') {
      actions.addItem({
        sku: 'delivery-outside-town',
        path: '/deliveryfees/delivery'
      });
      return;
    }
  }, [deliveryMethod, actions, basketModel]);

  const handleFormInput = (e) => {
    const newCustomer = { ...customer };
    const form = e.target.closest('form');
    const { value, name } = e.target;

    if (e.target.id === 'addressSearch') {
      return;
    }

    if (form.name === 'customer') {
      newCustomer[name] = value;
      setCustomer(newCustomer);
    }

    if (form.name === 'delivery') {
      newCustomer.addresses[1][name] = value;
      setCustomer(newCustomer);
    }
  };

  const paymentConfig = useQuery('paymentConfig', () =>
    ServiceApi({
      query: `
      {
        paymentProviders {
          stripe {
            enabled
          }
          klarna {
            enabled
          }
          mollie {
            enabled
          }
          vipps {
            enabled
          }
          paypal {
            enabled
          }
        }
      }
    `
    })
  );

  // Handle locale with sub-path routing
  let multilingualUrlPrefix = '';
  if (window.location.pathname.startsWith(`/${router.locale}/`)) {
    multilingualUrlPrefix = '/' + router.locale;
  }

  const { firstName, lastName, email, phone, notes, deliveryDate } = customer;
  const deliveryAddress = customer.addresses[1];

  const [error, setError] = useState('');

  const handleStripeForm = () => {
    const collectionFields = [firstName, lastName, email, phone];
    const deliveryFields = [
      firstName,
      lastName,
      email,
      phone,
      deliveryAddress.email,
      deliveryAddress.phone,
      deliveryAddress.streetNumber,
      deliveryAddress.streetName,
      deliveryAddress.suburb,
      deliveryAddress.territory,
      deliveryAddress.postcode
    ];

    if (deliveryMethod === 'collect') {
      if (collectionFields.filter((field) => !field).length > 0) {
        setError('Please fill in all fields before proceeding.');
        return;
      }
    } else if (deliveryMethod.startsWith('delivery')) {
      if (deliveryFields.filter((field) => !field).length > 0) {
        setError('Please fill in all fields before proceeding.');
        return;
      }
    }

    setIsReadyForStripe(true);
  };

  function getURL(path) {
    return `${location.protocol}//${location.host}${multilingualUrlPrefix}${path}`;
  }

  /**
   * The checkout model shared between all the payment providers
   * It contains everything needed to make a purchase and complete
   * an order
   */
  const isDelivery = deliveryMethod?.startsWith('delivery');
  const checkoutModel = {
    basketModel,
    customer: {
      firstName,
      lastName,
      email,
      phone,
      notes,
      deliveryDate,
      addresses: [
        {
          type: 'billing',
          email,
          phone
        },
        {
          type: 'delivery',
          email: isDelivery ? deliveryAddress.email : null,
          phone: deliveryAddress.phone,
          unitNumber: deliveryAddress.unitNumber,
          streetNumber: deliveryAddress.streetNumber,
          streetName: isDelivery
            ? deliveryAddress.streetName
            : 'IN STORE PICKUP',
          suburb: deliveryAddress.suburb,
          territory: deliveryAddress.territory,
          postcode: deliveryAddress.postcode
        }
      ]
    },
    confirmationURL: getURL(`/confirmation/{crystallizeOrderId}?emptyBasket`),
    checkoutURL: getURL(`/checkout`),
    termsURL: getURL(`/terms`)
  };

  const paymentProviders = [
    {
      name: 'stripe',
      color: '#6773E6',
      logo: '/static/stripe-logo.png',
      render: () => (
        <PaymentProvider>
          <StripeCheckout
            checkoutModel={checkoutModel}
            onSuccess={(crystallizeOrderId) => {
              router.push(
                checkoutModel.confirmationURL.replace(
                  '{crystallizeOrderId}',
                  crystallizeOrderId
                )
              );
              scrollTo(0, 0);
            }}
          />
        </PaymentProvider>
      )
    },
    {
      name: 'klarna',
      color: '#F8AEC2',
      logo: '/static/klarna-logo.png',
      render: () => (
        <PaymentProvider>
          <KlarnaCheckout
            checkoutModel={checkoutModel}
            basketActions={actions}
            getURL={getURL}
          />
        </PaymentProvider>
      )
    },
    {
      name: 'vipps',
      color: '#fff',
      logo: '/static/vipps-logo.png',
      render: () => (
        <PaymentProvider>
          <VippsCheckout
            checkoutModel={checkoutModel}
            basketActions={actions}
            onSuccess={(url) => {
              if (url) window.location = url;
            }}
          />
        </PaymentProvider>
      )
    },
    {
      name: 'mollie',
      color: '#fff',
      logo: '/static/mollie-vector-logo.png',
      render: () => (
        <PaymentProvider>
          <MollieCheckout
            checkoutModel={checkoutModel}
            basketActions={actions}
            onSuccess={(url) => {
              if (url) window.location = url;
            }}
          />
        </PaymentProvider>
      )
    },
    {
      name: 'paypal',
      color: '#fff',
      logo: '/static/paypal-logo.png',
      render: () => (
        <PaymentProvider>
          <PaypalCheckout
            checkoutModel={checkoutModel}
            basketActions={actions}
            onSuccess={(crystallizeOrderId) => {
              router.push(
                checkoutModel.confirmationURL.replace(
                  '{crystallizeOrderId}',
                  crystallizeOrderId
                )
              );
              scrollTo(0, 0);
            }}
          ></PaypalCheckout>
        </PaymentProvider>
      )
    }
  ];

  const enabledPaymentProviders = [];
  if (!paymentConfig.loading && paymentConfig.data) {
    const { paymentProviders } = paymentConfig.data.data;
    if (paymentProviders.klarna.enabled) {
      enabledPaymentProviders.push('klarna');
    }
    if (paymentProviders.mollie.enabled) {
      enabledPaymentProviders.push('mollie');
    }
    if (paymentProviders.vipps.enabled) {
      enabledPaymentProviders.push('vipps');
    }
    if (paymentProviders.stripe.enabled) {
      enabledPaymentProviders.push('stripe');
    }
    if (paymentProviders.paypal.enabled) {
      enabledPaymentProviders.push('paypal');
    }
  }

  return (
    <Inner>
      <CheckoutFormGroup>
        <SectionHeader>Billing Details</SectionHeader>
        <form noValidate onChange={handleFormInput} name="customer">
          <Row>
            <InputGroup>
              <Label htmlFor="firstname">{t('customer:firstName')}</Label>
              <Input
                name="firstName"
                type="text"
                defaultValue={firstName}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="lastname">{t('customer:lastName')}</Label>
              <Input
                name="lastName"
                type="text"
                defaultValue={lastName}
                required
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="email">{t('customer:email')}</Label>
              <Input name="email" type="email" defaultValue={email} required />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="phone">{t('customer:phone')}</Label>
              <Input name="phone" type="number" defaultValue={phone} required />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="notes">extra details</Label>
              <TextArea
                name="notes"
                type="text"
                defaultValue={customer.notes}
                maxlength="50"
              />
            </InputGroup>
          </Row>
        </form>
      </CheckoutFormGroup>

      <h1>
        {'Delivery Options'}
        <FootNote>
          We can deliver to Benalla, Wangaratta, Shepperton, Violet Town, Euroa
          & Mansfield.
        </FootNote>
        <FootNote>
          If you are outside of these towns, give us a call for possible
          options.
        </FootNote>
      </h1>

      {deliveryMethod?.startsWith('delivery') && (
        <CheckoutFormGroup>
          <SectionHeader>Delivery Details</SectionHeader>
          <form noValidate onChange={handleFormInput} name="delivery">
            <Row>
              <InputGroup>
                <Label htmlFor="firstname">recipient first name</Label>
                <Input
                  name="firstName"
                  type="text"
                  defaultValue={firstName}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="lastname">recipient last name</Label>
                <Input
                  name="lastName"
                  type="text"
                  defaultValue={lastName}
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="recipientemail">recipient email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={deliveryAddress.email}
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="recipientphone">recipient phone</Label>
                <Input
                  name="phone"
                  type="number"
                  defaultValue={deliveryAddress.phone}
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="address">{t('customer:address')}</Label>
                <AddressSearch customer={customer} setCustomer={setCustomer} />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  name="unitNumber"
                  type="number"
                  defaultValue={deliveryAddress.unitNumber}
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="streetNumber">Street Number</Label>
                <Input
                  name="streetNumber"
                  type="text"
                  defaultValue={deliveryAddress.streetNumber}
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="streetName">Street Name</Label>
                <Input
                  name="streetName"
                  defaultValue={deliveryAddress.streetName}
                  type="text"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="suburb">City/Town</Label>
                <Input
                  name="suburb"
                  defaultValue={deliveryAddress.suburb}
                  type="text"
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label htmlFor="territory">State</Label>
                <Input
                  name="territory"
                  defaultValue={deliveryAddress.territory}
                  type="text"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  name="postcode"
                  defaultValue={deliveryAddress.postcode}
                  type="number"
                  required
                />
              </InputGroup>
            </Row>
          </form>
        </CheckoutFormGroup>
      )}
      <CheckoutFormGroup>
        <Delivery
          postcode={deliveryAddress.postcode}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          isReadyForStripe={isReadyForStripe}
          setCustomer={setCustomer}
        />
      </CheckoutFormGroup>

      {/* <Voucher /> */}
      {/* <CheckoutFormGroup withUpperMargin>
        <div>
          <SectionHeader>{t('choosePaymentMethod')}</SectionHeader>
          {paymentConfig.loading ? (
            <Spinner />
          ) : (
            <div>
              {enabledPaymentProviders.length === 0 ? (
                <i>{t('noPaymentProvidersConfigured')}</i>
              ) : (
                <PaymentProviders>
                  <PaymentSelector>
                    {enabledPaymentProviders.map((paymentProviderName) => {
                      const paymentProvider = paymentProviders.find(
                        (p) => p.name === paymentProviderName
                      );
                      if (!paymentProvider) {
                        return (
                          <small>
                            {t('paymentProviderNotConfigured', {
                              name: paymentProviderName
                            })}
                          </small>
                        );
                      }

                      return (
                        <PaymentButton
                          key={paymentProvider.name}
                          color={paymentProvider.color}
                          type="button"
                          selected={
                            selectedPaymentProvider === paymentProvider.name
                          }
                          onClick={() =>
                            setSelectedPaymentProvider(paymentProvider.name)
                          }
                        >
                          <img
                            src={paymentProvider.logo}
                            alt={t('paymentProviderLogoAlt', {
                              name: paymentProvider.name
                            })}
                          />
                        </PaymentButton>
                      );
                    })}

                    
                  </PaymentSelector>

                  {paymentProviders
                    .find((p) => p.name === selectedPaymentProvider)
                    ?.render()}
                </PaymentProviders>
              )}
            </div>
          )}
        </div>
      </CheckoutFormGroup> */}

      {deliveryMethod && !isReadyForStripe && (
        <CheckoutFormGroup>
          <Button onClick={handleStripeForm}>Add credit card details</Button>
          <ErrorMessage>{error}</ErrorMessage>
        </CheckoutFormGroup>
      )}

      {isReadyForStripe && (
        <PaymentProvider>
          <SectionHeader>{'Payment Options'}</SectionHeader>
          <StripeCheckout
            checkoutModel={checkoutModel}
            onSuccess={(crystallizeOrderId) => {
              router.push(
                checkoutModel.confirmationURL.replace(
                  '{crystallizeOrderId}',
                  crystallizeOrderId
                )
              );
              scrollTo(0, 0);
            }}
          />
        </PaymentProvider>
      )}
    </Inner>
  );
}
