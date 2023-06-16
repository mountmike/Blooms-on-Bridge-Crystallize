import ContentTransformer from 'ui/content-transformer';
import { H3 } from 'ui';
import styles from './paragraph.module.css'
import Image from 'next/image'

import { Outer, Title, Body, Text, Media, Temp, TitleOverlay } from './styles';
import Images from '../images';
import Videos from '../videos';

const Paragraph = ({
  body,
  title,
  images,
  videos,
  headingComponent: HeadingComponent = H3
}) => {
  const hasText = !!body?.json?.length;
  const hasMedia = !!images || !!videos;
  const isHomePage = title.text === "Blooms on Bridge, Benalla"

  return (
    <Outer $media={hasMedia} $text={hasText}>
      { isHomePage ? 
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
              <h2 className={styles.overlayH2}>{title.text}</h2>
              <h3 className={styles.overlayH3}>{body.json[0].children[0].textContent}</h3>
              {/* <button className={styles.button}>Shop by occasion</button> */}
            </div>
            </div>
        </header>
      :
      <Text>
        {!!title && title.text && (
          <Title>
            <HeadingComponent>{title.text}</HeadingComponent>
          </Title>
          
        )}

        {hasText && (
          <Body>
            <ContentTransformer json={body.json} />
          </Body>
        )}
      </Text>
}
      {hasMedia && (
        <Media>
          <Images images={images} />
          <Videos videos={videos} />
        </Media>
      )}
  
    </Outer>
  
  );
};

export default Paragraph;
