import Map from 'react-map-gl';
import { Container, Stack } from '@mantine/core';
import 'mapbox-gl/dist/mapbox-gl.css';
export function MapPage() {
  return (
    <Container>
      <Stack align="center">
        <Map
          mapboxAccessToken="pk.eyJ1IjoiaGFudDIiLCJhIjoiY2xsNzY5Y2l4MHZrNjNlb3pudmgycnFhayJ9.bqU_JTNxY8d7CYVZPreMjQ"
          initialViewState={{
            longitude: 28.0,
            latitude: 53.8,
            zoom: 5,
          }}
          style={{
            width: '100vw',
            height: '90vh',
          }}
          mapStyle="mapbox://styles/hant2/cll76chvx00nb01ph0y3q4zri"
          //mapStyle="mapbox://styles/mapbox/dark-v11" нужно потрахать две эти темы между собой и будет ок
        />
      </Stack>
    </Container>
  );
}
