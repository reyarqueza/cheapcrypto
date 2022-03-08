import React from 'react';

export default function (props) {
  return (
    <div>
      <h1>Barebones Isomorphic Template</h1>
      <p>This page is Server Side Rendered with its initial redux state via Server Side Redux.</p>
      <p>
        Dummy text from redux state: <em>{props.dummyText}</em>
      </p>
      <p>It is then hydrated by React so that client side SPA takes over.</p>
      <p>In lighthouse, you'll start off with all 100s across the board.</p>

      <img
        width={441}
        height={562}
        alt="lighthouse all 100"
        sizes="(max-width: 882px) 100vw, 882px"
        srcSet="
images/lighthouse-large_esehnw_c_scale,w_200.webp 200w,
images/lighthouse-large_esehnw_c_scale,w_882.webp 882w"
        src="images/lighthouse-large_esehnw_c_scale,w_200.webp"
      />
    </div>
  );
}
