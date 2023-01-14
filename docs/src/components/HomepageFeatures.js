import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'High Performance',
    Svg: require('../../static/img/high-performance.svg').default,
    description: (
      <>
        Canvas-datagrid is an extremely fast library for large datasets,
        particularly for financial or scientific data, and uses performance
        optimization for smooth scrolling and responsive interactions.
      </>
    ),
  },
  {
    title: 'Customizable',
    Svg: require('../../static/img/customizable.svg').default,
    description: (
      <>
        Canvas-datagrid offers a wide range of customization options to match
        your application's design, including color scheme, font, cell sizes and
        custom cell renderers and editors.
      </>
    ),
  },
  {
    title: 'Interactive',
    Svg: require('../../static/img/interactive.svg').default,
    description: (
      <>
        Canvas-datagrid provides interactive features like navigation, sorting,
        filtering, cell selection, editing and keyboard shortcuts making it easy
        for users to perform common actions
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
