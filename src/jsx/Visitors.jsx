import React, {useEffect} from 'react';
import {Chart, Tooltip} from 'chart.js';
import {ChoroplethController, GeoFeature, ColorScale, ProjectionScale} from 'chartjs-chart-geo';
import * as ChartGeo from 'chartjs-chart-geo';
import {hostInside} from '../host';
import {useQuery} from 'react-query';

import {
  Typography,
  Avatar,
  Stack,
  Card,
  Box,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Container,
  useMediaQuery,
} from '@mui/material';
import {tableCellClasses} from '@mui/material/TableCell';
import {styled} from '@mui/material/styles';

// register controller in chart.js and ensure the defaults are set
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
Chart.register([Tooltip]);

function alternatingRows(Row) {
  return styled(Row)(({theme}) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
}

export default function Visitors() {
  const StyledTableRow = alternatingRows(TableRow);
  const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const isDesktop = useMediaQuery('(min-width:620px)');

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

  const {status, isLoading, error, data} = useQuery('visitCounts', async () => {
    const response = await fetch(`/get-visit-counts`);
    const data = await response.json();
    return data;
  });

  if (isLoading) {
    return (
      <Box m={2}>
        <Stack p={2} direction="row" spacing={1}>
          <LinearProgress />
        </Stack>
      </Box>
    );
  }

  if (error) {
    return 'An error has occurred: ' + error.message;
  }

  const visits = Object.entries(data).map(([key, value]) => ({[key]: value}));

  return (
    <div style={{position: 'relative', height: '100vh', width: '100vw'}}>
      <canvas style={{paddingBottom: '40px'}} id="canvas"></canvas>
      <Stack direction={isDesktop ? 'row' : 'column'}>
        {visits.map((visit, index) => {
          return (
            <Container key={`stack-${index}`} sx={{paddingBottom: '40px'}}>
              <Typography variant="h6" gutterBottom component="h2">
                {Object.keys(visit)[0]}
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {Object.entries(Object.values(visit)[0]).map(([key, value], index) => {
                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">
                            <strong style={{textTransform: 'capitalize'}}>{key}</strong>
                          </StyledTableCell>
                          <StyledTableCell align="center">{value}</StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          );
        })}
      </Stack>
    </div>
  );
}
