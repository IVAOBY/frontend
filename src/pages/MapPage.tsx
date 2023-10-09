import * as React from 'react';
import Map from 'react-map-gl';
import {Container} from "@mantine/core";
import 'mapbox-gl/dist/mapbox-gl.css';

export function MapPage() {
    return (
        <Container mt={100}>
            <Map
                mapboxAccessToken='pk.eyJ1IjoiaGFudDIiLCJhIjoiY2xsNzY5Y2l4MHZrNjNlb3pudmgycnFhayJ9.bqU_JTNxY8d7CYVZPreMjQ'
                initialViewState={{
                    longitude: 28.000,
                    latitude: 53.800,
                    zoom: 5
                }}
                style={{maxWidth: 1000, height: 600, borderRadius: "30px"}}
                mapStyle="mapbox://styles/hant2/cll76chvx00nb01ph0y3q4zri"
            />
        </Container>
    );
}