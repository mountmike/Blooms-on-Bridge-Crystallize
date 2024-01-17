import ContentTransformer from 'ui/content-transformer';
import { H3 } from 'ui';
import styles from './paragraph.module.css';
import Image from 'next/image';

import { Outer, Title, Body, Text, Media, Temp, TitleOverlay } from './styles';
import Images from '../images';
import Videos from '../videos';
import { useEffect, useState } from 'react';

const Paragraph = ({
  body,
  title,
  images,
  videos,
  headingComponent: HeadingComponent = H3
}) => {
  // const [currentHeroImg, setCurrentHeroImg] = useState(null)
  const hasText = !!body?.json?.length;
  const hasMedia = !!images || !!videos;
  const isHomePage = title?.text === 'Blooms on Bridge, Benalla';

  // useEffect(() => {
  //   if (hasMedia) {
  //     setCurrentHeroImg(images[0].url)

  //     let index = 0

  //     setInterval(() => {
  //       if (index < images.length - 1) {
  //         index++
  //         setCurrentHeroImg(images[index].url)
  //       } else {
  //         index = 0
  //         setCurrentHeroImg(images[index].url)
  //       }
  //     }, 15000)
  //   }
  // }, [])

  return (
    <Outer $media={hasMedia} $text={hasText}>
      {isHomePage ? (
        <header className={styles.container}>
          <div className={styles.overlayContainer}>
            <div className={styles.imgContainer}>
              <Image
                src="/static/logo_white.png"
                width={150}
                height={150}
                alt="Blooms on Bridge logo"
              />
            </div>

            <div className={styles.textContainer}>
              <h2 className={styles.overlayH2}>{title?.text}</h2>
              <h3 className={styles.overlayH3}>
                {body.json[0].children[0].textContent}
              </h3>
              {/* <button className={styles.button}>Shop by occasion</button> */}
            </div>
          </div>
        </header>
      ) : (
        <Text>
          {!!title && title?.text && (
            <Title>
              <HeadingComponent>{title?.text}</HeadingComponent>
            </Title>
          )}

          {hasText && (
            <Body>
              <ContentTransformer json={body.json} />
            </Body>
          )}
        </Text>
      )}

      {hasMedia && (
        <>
          {isHomePage ? (
            <Media>
              {/* <img
                src={currentHeroImg}
                width="100%"
              ></img> */}
              <Images images={images} />
              <Videos videos={videos} />
            </Media>
          ) : (
            <Media>
              <Images images={images} />
              <Videos videos={videos} />
            </Media>
          )}
        </>
      )}
    </Outer>
  );
};

export default Paragraph;
