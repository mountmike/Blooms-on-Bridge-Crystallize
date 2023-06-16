import React from 'react';
import Link from 'next/link';

import LogoCrystallize from 'ui/icons/logo-crystallize';
import { useTranslation } from 'next-i18next';

import { useSettings } from 'components/settings-context';

import { Outer, Logo, NavList, Powered } from './styles';

export default function Footer() {
  const { t } = useTranslation('common');
  const { mainNavigation } = useSettings();

  return (
    <Outer>
      <Link href="/">
        <a aria-label="Logo">
          <Logo>
            <img src="/static/logo.png" alt="" width="56" height="84" />
          </Logo>
        </a>
      </Link>
      <NavList>
        <h5>{t('menu')}</h5>
        {mainNavigation?.map((category) => (
          <li key={category.path}>
            <Link href={category.path}>
              <a>{category.name}</a>
            </Link>
          </li>
        ))}
      </NavList>
      <Powered>
        <p>&copy; Blooms on Bridge {new Date().getFullYear()}</p>
        <p>15 Bridge Street Benalla Victoria 3672 Australia</p>
        <p>Call: 03 5762 5588</p>
      </Powered>
    </Outer>
  );
}
