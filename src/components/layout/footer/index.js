import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './footer.module.css';

import LogoCrystallize from 'ui/icons/logo-crystallize';
import { useTranslation } from 'next-i18next';

import { useSettings } from 'components/settings-context';

import { Outer, Logo, NavList, Powered, Socials } from './styles';

export default function Footer() {
  const { t } = useTranslation('common');
  const { mainNavigation } = useSettings();

  return (
    <Outer>
      <Logo>
        <Link href="/">
          <img src="/static/logo.png" alt="Blooms on bridge logo" />
        </Link>
        <Socials>
          <a
            className={styles.externalLink}
            href="https://www.facebook.com/bloomsonbridge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            className={styles.externalLink}
            href="https://www.instagram.com/bloomsonbridge/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </Socials>
      </Logo>

      <NavList>
        <h5>{t('menu')}</h5>
        {mainNavigation?.map((category) => (
          <li key={category.path}>
            <Link href={category.path}>{category.name}</Link>
          </li>
        ))}
      </NavList>
      <Powered>
        <p>&copy; Blooms on Bridge {new Date().getFullYear()}</p>
        <p>15 Bridge Street, Benalla, Victoria, 3672</p>
        <p>Call: 03 5762 5588</p>
      </Powered>
    </Outer>
  );
}
