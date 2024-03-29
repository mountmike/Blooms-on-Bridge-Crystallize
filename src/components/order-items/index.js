import React from 'react';

import AttributeList from 'components/attribute-list';
import { useTranslation } from 'next-i18next';

import { useBasket } from 'components/basket';

import {
  Item,
  ItemAmount,
  ItemImage,
  ItemInfo,
  ItemName,
  Items,
  ItemQuantity,
  ItemPrice,
  ItemQuantityChanger
} from './styles';

function OrderItem({ item }) {
  const { t } = useTranslation(['common', 'basket']);
  const basket = useBasket();

function increment() {
  basket.actions.incrementItem(item);
}

function decrement() {
  basket.actions.decrementItem(item);
}

function remove() {
  basket.actions.removeItem(item);
}


  if (item.sku.startsWith('--voucher--')) {
    return (
      <Item>
        <ItemInfo>
          <ItemName>{t('basket:vouchers.title')}</ItemName>
          <p>{item.name}</p>
        </ItemInfo>
        <ItemAmount>
          <ItemPrice>
            {t('price', {
              value: item.price?.gross ?? 0,
              currency: item.price?.currency
            })}
          </ItemPrice>
        </ItemAmount>
      </Item>
    );
  }

  return (
    <Item>
      {item.imageUrl ? (
        <ItemImage src={item.imageUrl} alt={item.name} sizes="50vw" />
      ) : (
        item.images?.[0] && (
          <ItemImage {...item.images[0]} alt={item.name} sizes="50vw" />
        )
      )}
      <ItemInfo>
        <ItemName>{item.name}</ItemName>
        {item.attributes ? (
          <AttributeList attributes={item.attributes} />
        ) : (
          <p>{item.sku}</p>
        )}
      </ItemInfo>
      <ItemAmount>
        { !item.sku.startsWith('delivery') &&
          <ItemQuantity>
            {item.quantity} x{' '}
            {t('price', {
              value: item.price?.gross ?? 0,
              currency: item.price?.currency
            })}
          </ItemQuantity>
        }
        <ItemPrice>
          {t('price', {
            value: (item.price?.gross ?? 0) * item.quantity,
            currency: item.price?.currency
          })}
        </ItemPrice>
      </ItemAmount>
      { !item.sku.startsWith('delivery') &&
        <ItemQuantityChanger>
          {item.quantity > 1 ?
            <button
                onClick={decrement}
                type="button"
              >
                -
              </button>
            :
            <button
                onClick={remove}
                type="button"
              >
                -
              </button>
          }
            <ItemQuantity>{item.quantity}</ItemQuantity>
            <button onClick={increment} type="button">
              +
            </button>
          </ItemQuantityChanger>
        }
    </Item>
  );
}

export default function OrderItems({ cart }) {
  return (
    <Items>
      {cart.map((item) => (
        <OrderItem key={item.sku} item={item} />
      ))}
    </Items>
  );
}
