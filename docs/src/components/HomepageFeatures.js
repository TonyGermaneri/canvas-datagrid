import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'High Performance',
    Svg: require('../../static/img/high-performance.svg').default,
    description: (
      <>
        Canvas Datagrid is built on top of the HTML5 canvas element, this allows
        for extremely fast rendering of large datasets. Canvas Datagrid is ideal
        for displaying and manipulating large sets of data, such as financial or
        scientific data. The library utilizes various performance optimization
        techniques such as virtual rendering, to ensure smooth scrolling and
        responsive user interactions.
      </>
    ),
  },
  {
    title: 'Customizable',
    Svg: require('../../static/img/customizable.svg').default,
    description: (
      <>
        Canvas Datagrid provides a wide range of customization options, allowing
        you to easily adjust the look and feel of the grid to match your
        application's design. This includes options to change the color scheme,
        font, and cell sizes, as well as advanced customization options such as
        custom cell renderers and editors.
      </>
    ),
  },
  {
    title: 'Interactive',
    Svg: require('../../static/img/interactive.svg').default,
    description: (
      <>
        Canvas Datagrid provides a wide range of interactive features that allow
        users to easily navigate, sort and filter the data as well as the
        ability to select and edit cells. Additionally, the library also
        provides support for keyboard shortcuts, making it easy for users to
        perform common actions quickly and efficiently.
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
