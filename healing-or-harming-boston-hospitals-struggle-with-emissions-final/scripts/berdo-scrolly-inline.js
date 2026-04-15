(function () {
    if (typeof mapboxgl === 'undefined' || typeof scrollama === 'undefined' || typeof config === 'undefined') {
        return;
    }

    var scrollyRoot = document.getElementById('berdo-scrolly');
    var storyRoot = document.getElementById('berdo-scrolly-story');
    if (!scrollyRoot || !storyRoot) {
        return;
    }

    var alignments = {
        left: 'berdo-align-left',
        center: 'berdo-align-center',
        right: 'berdo-align-right',
        full: 'berdo-align-full'
    };

    var layerTypes = {
        fill: ['fill-opacity'],
        line: ['line-opacity'],
        circle: ['circle-opacity', 'circle-stroke-opacity'],
        symbol: ['icon-opacity', 'text-opacity'],
        raster: ['raster-opacity'],
        'fill-extrusion': ['fill-extrusion-opacity'],
        heatmap: ['heatmap-opacity']
    };

    var features = document.createElement('div');
    features.id = 'berdo-scrolly-features';

    var header = document.createElement('div');
    header.className = 'berdo-scrolly-header';

    if (config.title) {
        var title = document.createElement('h1');
        title.textContent = config.title;
        header.appendChild(title);
    }

    if (config.subtitle) {
        var subtitle = document.createElement('h2');
        subtitle.textContent = config.subtitle;
        header.appendChild(subtitle);
    }

    if (config.byline) {
        var byline = document.createElement('p');
        byline.textContent = config.byline;
        header.appendChild(byline);
    }

    if (header.childElementCount > 0) {
        storyRoot.appendChild(header);
    }

    if (config.legend && Array.isArray(config.legend.items) && config.legend.items.length > 0) {
        var legend = document.createElement('div');
        legend.className = 'berdo-scrolly-legend';

        if (config.legend.title) {
            var legendTitle = document.createElement('h3');
            legendTitle.textContent = config.legend.title;
            legend.appendChild(legendTitle);
        }

        var legendList = document.createElement('ul');
        legendList.className = 'berdo-scrolly-legend-list';

        config.legend.items.forEach(function (item) {
            var legendItem = document.createElement('li');
            legendItem.className = 'berdo-scrolly-legend-item';

            var swatch = document.createElement('span');
            swatch.className = 'berdo-scrolly-legend-swatch';
            swatch.style.backgroundColor = item.color;
            legendItem.appendChild(swatch);

            var label = document.createElement('span');
            label.textContent = item.label;
            legendItem.appendChild(label);

            legendList.appendChild(legendItem);
        });

        legend.appendChild(legendList);
        scrollyRoot.appendChild(legend);
    }

    config.chapters.forEach(function (chapterConfig, idx) {
        var step = document.createElement('div');
        step.id = chapterConfig.id;
        step.className = 'berdo-scrolly-step ' + (alignments[chapterConfig.alignment] || 'berdo-align-center');

        if (chapterConfig.hidden) {
            step.classList.add('is-hidden');
        }
        if (idx === 0) {
            step.classList.add('active');
        }

        var card = document.createElement('div');
        card.className = 'berdo-scrolly-step-card';

        if (chapterConfig.title) {
            var cardTitle = document.createElement('h3');
            cardTitle.textContent = chapterConfig.title;
            card.appendChild(cardTitle);
        }

        if (chapterConfig.image) {
            var image = new Image();
            image.src = chapterConfig.image;
            image.style.display = 'block';
            image.style.maxWidth = '100%';
            image.style.height = 'auto';
            image.style.margin = '16px auto';
            card.appendChild(image);
        }

        if (chapterConfig.description) {
            var cardDesc = document.createElement('p');
            cardDesc.innerHTML = chapterConfig.description;
            card.appendChild(cardDesc);
        }

        step.appendChild(card);
        features.appendChild(step);
    });

    storyRoot.appendChild(features);

    if (config.footer) {
        var footer = document.createElement('div');
        footer.className = 'berdo-scrolly-footer';
        var footerText = document.createElement('p');
        footerText.innerHTML = config.footer;
        footer.appendChild(footerText);
        storyRoot.appendChild(footer);
    }

    mapboxgl.accessToken = config.accessToken;
    var map = new mapboxgl.Map({
        container: 'berdo-scrolly-map',
        style: config.style,
        center: config.chapters[0].location.center,
        zoom: config.chapters[0].location.zoom,
        bearing: config.chapters[0].location.bearing,
        pitch: config.chapters[0].location.pitch,
        interactive: false,
        projection: config.projection
    });

    var marker = null;
    if (config.showMarkers) {
        marker = new mapboxgl.Marker({ color: config.markerColor || '#3FB1CE' })
            .setLngLat(config.chapters[0].location.center)
            .addTo(map);
    }

    var symbolLayerVisibility = null;
    var matepLabelMarker = null;
    var chapterPointMarker = null;

    function hideAllLabels() {
        var style = map.getStyle();
        if (!style || !Array.isArray(style.layers)) {
            return;
        }

        if (!symbolLayerVisibility) {
            symbolLayerVisibility = {};
            style.layers.forEach(function (layer) {
                if (layer.type === 'symbol') {
                    var visibility = map.getLayoutProperty(layer.id, 'visibility');
                    symbolLayerVisibility[layer.id] = visibility || 'visible';
                }
            });
        }

        style.layers.forEach(function (layer) {
            if (layer.type === 'symbol') {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
            }
        });
    }

    function getChapterMarkerCoordinates(chapter) {
        if (!chapter || !chapter.pointMarker) {
            return null;
        }

        if (Array.isArray(chapter.pointMarker.coordinates)) {
            return chapter.pointMarker.coordinates;
        }

        if (chapter.pointMarker.layer) {
            return getLayerCenterCoordinates(chapter.pointMarker.layer, chapter.location && chapter.location.center);
        }

        return null;
    }

    function showMatepLabelMarker(chapter) {
        var labelCoordinates = getChapterMarkerCoordinates(chapter) || [-71.104963, 42.337412];
        var labelText = (chapter && chapter.pointMarker && chapter.pointMarker.title) || 'Medical Area Total Energy Plant';

        if (!matepLabelMarker) {
            var labelEl = document.createElement('div');
            labelEl.className = 'matep-only-label';
            labelEl.textContent = labelText;

            matepLabelMarker = new mapboxgl.Marker({
                element: labelEl,
                anchor: 'left',
                offset: [14, -10]
            })
                .setLngLat(labelCoordinates);
        } else {
            matepLabelMarker.getElement().textContent = labelText;
            matepLabelMarker.setLngLat(labelCoordinates);
        }

        matepLabelMarker.addTo(map);
    }

    function restoreAllLabels() {
        if (symbolLayerVisibility) {
            Object.keys(symbolLayerVisibility).forEach(function (layerId) {
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(layerId, 'visibility', symbolLayerVisibility[layerId]);
                }
            });
            symbolLayerVisibility = null;
        }

        if (matepLabelMarker) {
            matepLabelMarker.remove();
        }
    }

    function hideChapterPointMarker() {
        if (chapterPointMarker) {
            chapterPointMarker.remove();
            chapterPointMarker = null;
        }
    }

    function extendBoundsFromGeometry(bounds, geometry) {
        if (!geometry || !geometry.coordinates) {
            return;
        }

        function visit(coords) {
            if (!Array.isArray(coords) || coords.length === 0) {
                return;
            }

            if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
                bounds.extend([coords[0], coords[1]]);
                return;
            }

            coords.forEach(visit);
        }

        visit(geometry.coordinates);
    }

    function getGeometryCenter(geometry) {
        var bounds = new mapboxgl.LngLatBounds();
        extendBoundsFromGeometry(bounds, geometry);
        if (bounds.isEmpty()) {
            return null;
        }

        var center = bounds.getCenter();
        return [center.lng, center.lat];
    }

    function getDistanceSquared(a, b) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        return (dx * dx) + (dy * dy);
    }

    function getLayerCenterCoordinates(layerId, referenceCoordinates) {
        if (!layerId || !map.getLayer(layerId)) {
            return null;
        }

        var features = map.queryRenderedFeatures({ layers: [layerId] });
        if (!features || features.length === 0) {
            return null;
        }

        var featureCenters = features
            .map(function (feature) {
                return getGeometryCenter(feature.geometry);
            })
            .filter(function (coords) {
                return Array.isArray(coords);
            });

        if (featureCenters.length === 0) {
            return null;
        }

        if (!Array.isArray(referenceCoordinates)) {
            return featureCenters[0];
        }

        var nearest = featureCenters[0];
        var nearestDistance = getDistanceSquared(nearest, referenceCoordinates);
        featureCenters.slice(1).forEach(function (coords) {
            var distance = getDistanceSquared(coords, referenceCoordinates);
            if (distance < nearestDistance) {
                nearest = coords;
                nearestDistance = distance;
            }
        });

        return nearest;
    }

    function showChapterPointMarker(chapter) {
        hideChapterPointMarker();

        if (!chapter || !chapter.pointMarker) {
            return;
        }

        var markerLngLat = getChapterMarkerCoordinates(chapter);
        if (!markerLngLat) {
            return;
        }

        var markerEl = document.createElement('div');
        markerEl.className = 'chapter-point-marker';
        if (chapter.pointMarker.title) {
            markerEl.title = chapter.pointMarker.title;
            markerEl.setAttribute('aria-label', chapter.pointMarker.title);
        }

        chapterPointMarker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
            .setLngLat(markerLngLat)
            .addTo(map);
    }

    window.showOnlyMATEPLabel = function (chapter) {
        hideAllLabels();
        showMatepLabelMarker(chapter);
    };

    function getLayerPaintType(layerId) {
        var layer = map.getLayer(layerId);
        if (!layer) {
            return null;
        }
        return layerTypes[layer.type];
    }

    function setLayerOpacity(layerConfig) {
        var paintProps = getLayerPaintType(layerConfig.layer);
        if (!paintProps) {
            return;
        }

        paintProps.forEach(function (prop) {
            var options = {};
            if (layerConfig.duration) {
                var transitionProp = prop + '-transition';
                options = { duration: layerConfig.duration };
                map.setPaintProperty(layerConfig.layer, transitionProp, options);
            }
            map.setPaintProperty(layerConfig.layer, prop, layerConfig.opacity, options);
        });
    }

    var scroller = scrollama();

    map.on('load', function () {
        if (!config.use3dTerrain) {
            map.setTerrain(null);
        }

        if (config.use3dTerrain) {
            map.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 14
            });

            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            map.addLayer({
                id: 'sky',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });
        }

        scroller
            .setup({
                step: '#berdo-scrolly .berdo-scrolly-step',
                offset: 0.5,
                progress: true,
                container: storyRoot
            })
            .onStepEnter(function (response) {
                var chapterIndex = config.chapters.findIndex(function (chap) {
                    return chap.id === response.element.id;
                });

                if (chapterIndex < 0) {
                    return;
                }

                var chapter = config.chapters[chapterIndex];
                if (chapter.id !== 'fourth-chapter') {
                    restoreAllLabels();
                }

                hideChapterPointMarker();

                var chapterLocation = {
                    center: chapter.location.center,
                    zoom: chapter.location.zoom,
                    bearing: chapter.location.bearing,
                    pitch: chapter.location.pitch,
                    essential: true
                };

                if (chapter.rotateAnimation) {
                    map.once('moveend', function () {
                        var rotateNumber = map.getBearing();
                        map.rotateTo(rotateNumber + 180, {
                            duration: 30000,
                            essential: true,
                            easing: function (t) {
                                return t;
                            }
                        });
                    });
                }

                response.element.classList.add('active');
                map[chapter.mapAnimation || 'flyTo'](chapterLocation);

                map.once('moveend', function () {
                    showChapterPointMarker(chapter);
                });

                if (marker) {
                    marker.setLngLat(chapter.location.center);
                }

                if (Array.isArray(chapter.onChapterEnter) && chapter.onChapterEnter.length > 0) {
                    chapter.onChapterEnter.forEach(setLayerOpacity);
                }

                if (chapter.callback && typeof window[chapter.callback] === 'function') {
                    window[chapter.callback](chapter);
                }

                if (config.auto) {
                    var nextChapter = (chapterIndex + 1) % config.chapters.length;
                    map.once('moveend', function () {
                        var nextEl = document.querySelector('[data-scrollama-index="' + nextChapter.toString() + '"]');
                        if (nextEl) {
                            nextEl.scrollIntoView();
                        }
                    });
                }
            })
            .onStepExit(function (response) {
                var chapter = config.chapters.find(function (chap) {
                    return chap.id === response.element.id;
                });

                response.element.classList.remove('active');
                if (chapter && Array.isArray(chapter.onChapterExit) && chapter.onChapterExit.length > 0) {
                    chapter.onChapterExit.forEach(setLayerOpacity);
                }

                if (chapter && chapter.id === 'fourth-chapter') {
                    restoreAllLabels();
                }

                if (chapter && chapter.pointMarker) {
                    hideChapterPointMarker();
                }
            });

        if (config.auto) {
            var first = document.querySelector('[data-scrollama-index="0"]');
            if (first) {
                first.scrollIntoView();
            }
        }
    });
    
})();
