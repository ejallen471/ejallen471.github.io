// File purpose: initialise the diving map and keep its location data separate from the page markup.

class DiveMap {
    constructor(elementId, diveSpots) {
        this.elementId = elementId;
        this.diveSpots = diveSpots;
        this.map = null;
        this.markerLayer = null;
        this.markersById = new Map();
        this.activeRegion = 'All';
        this.controlsElement = null;
        this.siteListElement = null;
        this.statusElement = null;
        this.regionColours = {
            Scotland: '#1f6f8b',
            England: '#7b6d3a',
            Tenerife: '#b14b3a'
        };
    }

    initialise() {
        if (!window.L) {
            return;
        }

        this.map = L.map(this.elementId, {
            center: [0, 0],
            zoom: 2,
            scrollWheelZoom: false
        });

        this.addBaseTiles();
        this.addInterface();
        this.markerLayer = L.layerGroup().addTo(this.map);
        this.renderMarkers();
        this.fitToMarkers();
        this.restrictBounds();
    }

    addBaseTiles() {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            minZoom: 2,
            maxZoom: 19,
            noWrap: true
        }).addTo(this.map);
    }

    addInterface() {
        const mapContainer = document.getElementById(this.elementId).parentElement;
        const panel = document.createElement('div');
        panel.className = 'mapPanel';

        this.controlsElement = document.createElement('div');
        this.controlsElement.className = 'mapControls';

        this.statusElement = document.createElement('p');
        this.statusElement.className = 'mapStatus';

        this.siteListElement = document.createElement('div');
        this.siteListElement.className = 'mapSiteList';

        panel.appendChild(this.controlsElement);
        panel.appendChild(this.statusElement);
        panel.appendChild(this.siteListElement);
        mapContainer.insertAdjacentElement('afterend', panel);

        this.renderControls();
        this.renderSiteList();
    }

    renderControls() {
        const regions = ['All', ...new Set(this.diveSpots.map((spot) => spot.region))];
        this.controlsElement.replaceChildren();

        regions.forEach((region) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = region;
            button.className = region === this.activeRegion ? 'isActive' : '';
            button.addEventListener('click', () => this.setRegion(region));
            this.controlsElement.appendChild(button);
        });

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'Reset view';
        resetButton.addEventListener('click', () => this.fitToMarkers());
        this.controlsElement.appendChild(resetButton);
    }

    setRegion(region) {
        this.activeRegion = region;
        this.renderControls();
        this.renderMarkers();
        this.renderSiteList();
        this.fitToMarkers();
    }

    renderMarkers() {
        this.markerLayer.clearLayers();
        this.markersById.clear();

        this.filteredSpots().forEach((spot) => {
            const marker = L.marker([spot.lat, spot.lng], {
                icon: this.createMarkerIcon(spot.region),
                title: spot.name
            }).bindPopup(this.popupContent(spot));

            marker.on('click', () => this.setActiveSite(spot.id));
            marker.addTo(this.markerLayer);
            this.markersById.set(spot.id, marker);
        });
    }

    renderSiteList() {
        const spots = this.filteredSpots();
        this.statusElement.textContent = spots.length + ' dive sites shown';
        this.siteListElement.replaceChildren();

        spots.forEach((spot) => {
            const button = document.createElement('button');
            const name = document.createElement('strong');
            const region = document.createElement('span');

            button.type = 'button';
            button.dataset.siteId = spot.id;
            name.textContent = spot.name;
            region.textContent = spot.region;
            button.appendChild(name);
            button.appendChild(region);
            button.addEventListener('click', () => this.focusSite(spot.id));
            this.siteListElement.appendChild(button);
        });
    }

    createMarkerIcon(region) {
        const colour = this.regionColours[region] || '#333333';

        return L.divIcon({
            className: 'diveMarker',
            html: '<span style="background-color: ' + colour + '"></span>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    }

    popupContent(spot) {
        return '<div class="mapPopup"><strong>' + spot.name + '</strong><span>' + spot.region + '</span></div>';
    }

    focusSite(siteId) {
        const spot = this.diveSpots.find((diveSpot) => diveSpot.id === siteId);
        const marker = this.markersById.get(siteId);

        if (!spot || !marker) {
            return;
        }

        this.map.flyTo([spot.lat, spot.lng], Math.max(this.map.getZoom(), 9), {
            duration: 0.8
        });
        marker.openPopup();
        this.setActiveSite(siteId);
    }

    setActiveSite(siteId) {
        this.siteListElement.querySelectorAll('button').forEach((button) => {
            button.classList.toggle('isActive', button.dataset.siteId === siteId);
        });
    }

    filteredSpots() {
        if (this.activeRegion === 'All') {
            return this.diveSpots;
        }

        return this.diveSpots.filter((spot) => spot.region === this.activeRegion);
    }

    fitToMarkers() {
        const markers = Array.from(this.markersById.values());

        if (markers.length === 0) {
            return;
        }

        const group = L.featureGroup(markers);
        this.map.fitBounds(group.getBounds().pad(0.2), {
            maxZoom: 9
        });
    }

    restrictBounds() {
        const bounds = L.latLngBounds([[-85, -180], [85, 180]]);
        this.map.setMaxBounds(bounds);
    }
}

const diveSpots = [
    { id: 'stAbbs', lat: 55.8987, lng: -2.1303, name: 'St Abbs Harbour', region: 'Scotland' },
    { id: 'aFrames', lat: 56.0000, lng: -4.8000, name: 'A-Frames Dive Site', region: 'Scotland' },
    { id: 'prestonhill', lat: 56.0272, lng: -3.3831, name: 'Prestonhill Quarry', region: 'Scotland' },
    { id: 'fortWilliam', lat: 56.7196, lng: -5.2304, name: 'Fort William (PH33 6SE)', region: 'Scotland' },
    { id: 'carnochBay', lat: 56.6804, lng: -5.1327, name: 'Carnoch Bay', region: 'Scotland' },
    { id: 'capernwray', lat: 54.1371, lng: -2.7232, name: 'Capernwray Diving Centre', region: 'England' },
    { id: 'lasVistas', lat: 28.0650, lng: -16.7340, name: 'Las Vistas', region: 'Tenerife' },
    { id: 'laPinta', lat: 28.0803, lng: -16.7350, name: 'La Pinta', region: 'Tenerife' },
    { id: 'abades', lat: 28.1420, lng: -16.4390, name: 'Playa de Abades', region: 'Tenerife' },
    { id: 'fonsalia', lat: 28.1891, lng: -16.8230, name: 'Fonsalia', region: 'Tenerife' },
    { id: 'playaSanJuan', lat: 28.1801, lng: -16.8130, name: 'Playa San Juan', region: 'Tenerife' },
    { id: 'radazul', lat: 28.4015, lng: -16.3250, name: 'Playa de Radazul', region: 'Tenerife' },
    { id: 'tabaiba', lat: 28.4016, lng: -16.3311, name: 'Tabaiba', region: 'Tenerife' },
    { id: 'elBalito', lat: 28.1390, lng: -16.7910, name: 'El Balito', region: 'Tenerife' },
    { id: 'alcala', lat: 28.2010, lng: -16.8295, name: 'Alcalá', region: 'Tenerife' }
];

const divingMap = new DiveMap('diveMap', diveSpots);
divingMap.initialise();
