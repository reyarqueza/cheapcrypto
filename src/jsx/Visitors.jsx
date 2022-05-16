import React, {useEffect} from 'react';
import {Chart, Tooltip} from 'chart.js';
import {ChoroplethController, GeoFeature, ColorScale, ProjectionScale} from 'chartjs-chart-geo';
import * as ChartGeo from 'chartjs-chart-geo';
import {hostInside} from '../host';

// register controller in chart.js and ensure the defaults are set
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
Chart.register([Tooltip]);

export default function Visitors() {
  useEffect(async () => {
    const countriesByVisitorsResponse = await fetch(`${hostInside()}/get-countries-by-visitors`);
    const countriesByVisitors = await countriesByVisitorsResponse.json();

    const atlasResponse = await fetch('https://unpkg.com/world-atlas/countries-50m.json');
    const data = await atlasResponse.json();

    const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;
    const chart = new Chart(document.getElementById('canvas').getContext('2d'), {
      type: 'choropleth',
      data: {
        labels: countries.map(d => d.properties.name),
        datasets: [
          {
            label: 'Countries',
            data: countriesByVisitors,
          },
        ],
      },
      options: {
        responsive: true,
        showOutline: true,
        showGraticule: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xy: {
            projection: 'mercator',
          },
        },
        aspectRatio: 1,
      },
    });
  });

  return (
    <div style={{position: 'relative', height: '100vh', width: '100vw'}}>
      <canvas id="canvas"></canvas>
    </div>
  );
}
