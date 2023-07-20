import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'next-i18next';
import { responsive, H3 } from 'ui';

const Outer = styled.div`
  width: 400px;

  p {
    margin-bottom: 0.5rem;
  }

  ${responsive.xs} {
    width: 100%;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 16px;
`;

const BillingDetails = ({ order }) => {
  const [isDelivery, setIsDelivery] = useState(false)

  useEffect(() => {
    if (order.cart.filter(product => product.sku === "delivery-pickup-from-shop")) {
      setIsDelivery(true)
    }
  }, [order])

  const { t } = useTranslation('customer');
  const { email } = order.customer.addresses?.[0] || {};
  const { phone } = order.customer.addresses?.[0] || {};
  const address = order.customer.addresses[0] || {};
  const deliveryDate = order.customer.addresses?.[1].phone || "none";
  const addressString = `${address.street ? address.street : ""} ${address.street2} ${address.city} ${address.state}` || "none";
  const customerNotes = order.meta || "none"


  return (
    <Outer>
      <Inner>
        <H3>Billing Details</H3>
        <p>
          {t('name')}:{' '}
          <strong>
            {order.customer.firstName} {order.customer.lastName}
          </strong>
        </p>
        <p>
          {t('email')}: <strong>{email}</strong>
        </p>
        <p>
          {t('phone')}: <strong>{phone}</strong>
        </p>
        <p>
          {t('notes')}: <strong>{customerNotes}</strong>
        </p>
        
      </Inner>
      { isDelivery ?
      <Inner>
        <H3>Delivery Details</H3>
        <p>
          {t('requested delivery date')}:{' '}
          <strong>
            {deliveryDate}
          </strong>
        </p>
        <p>
          {t('address')}:{' '}
          <strong>
            { addressString}
          </strong>
        </p>
      </Inner>
      :
      <Inner>
        <H3>Pickup Details</H3>
        <p>
          {t('Requested pickup date')}:{' '}
          <strong>
            {deliveryDate}
          </strong>
        </p>
        <p>
          {t('Shop Address')}:{' '}
          <strong>
          15 Bridge Street, Benalla, Victoria, 3672
          </strong>
        </p>
      </Inner>
      }
    </Outer>
  );
};

export default BillingDetails;
