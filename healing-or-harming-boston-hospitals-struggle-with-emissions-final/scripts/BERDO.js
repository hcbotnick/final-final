var config = {
    // style: 'mapbox://styles/mapbox/streets-v12',
    // leave commented to use Mapbox Standard Style
    accessToken: 'pk.eyJ1IjoiaGJvdG5pY2siLCJhIjoiY21uMmlocGUyMTNvbTJxcHhvNWNqaWJyaSJ9.0DJO74tWcRgyHQq3G3i0aw',
    style: 'mapbox://styles/hbotnick/cmmofidyp004r01s19oyacgxp',
    
    //projection: 'equirectangular',
    //Read more about available projections here
    //https://docs.mapbox.com/mapbox-gl-js/example/projections/
    inset: true,
    
    insetPosition: 'bottom-right',
    theme: 'dark',
    use3dTerrain: false, //set true for enabling 3D maps.
    auto: false,
    footer: 'Visualization by Hayes Botnick. Data by the City of Boston.',
    legend: {
        title: 'Energy Star Score',
        items: [
            { color: 'green', label: 'High' },
            { color: '#dba617', label: 'Moderate' },
            { color: 'red', label: 'Low' },
            { color: '#b3b3b3', label: 'No Submission'}
        ]
    },
    chapters: [
        {
            id: 'first-chapter',
            alignment: 'berdo-align-center',
            hidden: false,
           // image: './Houses.png',
                description: 'On this map, buildings with good EnergyStar scores are colored  <span style="background-color: green; color: white; font-family: Montserrat, sans-serif; font-weight: bold; padding: 2px 4px; ">green,</span> those with moderate scores are  <span style="background-color: #dba617; color: white; font-family: Montserrat, sans-serif; font-weight: bold; padding: 2px 4px; ">yellow.</span> The buildings in  <span style="background-color: red; color:white; font-family: Montserrat, sans-serif; font-weight: bold; padding: 2px 4px; ">red</span> have the worst ratings and many of Boston’s hospitals fall in this category, averaging an Energy Star score of 54.',
            location: {
                center: [-71.106781, 42.336131],
                zoom: 13,
                pitch: 60.5,
                bearing: 0
            },
            
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [
                {
                layer: 'MATEP',
                opacity: 0
                }
            ],
            onChapterExit: [
                {
                layer: 'layer-name',
                opacity: 1,
                duration: 5000
                }
            ]
        },
        {
            id: 'second-chapter',
            alignment: 'berdo-align-center',
            hidden: false,
            //title:  'Several medical facilities rank far lower.',
            //image: './hospitalgraphic.png',
            description: 'Several medical facilities rank far lower than that. Brigham and Women’s Faulkner Hospital in Jamaica Plain received a score of 1 out of 100, the lowest possible rating. What many of these hospitals with poor scores have in common is specialized infrastructure, like generators for operating rooms, that draw more power 24 hours a day.',

            location: {
                center: [-71.106781, 42.336131],
                zoom: 15,
                pitch: 75,
                bearing: -9.6
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [
                {
                layer: 'MATEP',
                opacity: 0
                }
            ],
            onChapterExit: [
                {
                layer: 'layer-name',
                opacity: 1,
                duration: 5000
                }
            ]
        },
        {
            id: 'third-chapter',
            alignment: 'berdo-align-center',
            hidden: false,
            //title: 'Boston Children’s Hospital received a score of 18',
            description: 'Boston Children’s Hospital received a score of 18. “Being a hospital, we have so much going on that just happens to be fairly energy-intensive compared with almost any other type of building,” explains Brian Smith, senior manager of energy, building systems, and sustainability.',
            location: {
                center: [-71.104963, 42.337412],
                zoom: 16,
                pitch: 60,
                bearing: -133
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                {
                layer: 'MATEP',
                opacity: 0
                }
            ],
            onChapterExit: [
                {
                layer: 'layer-name',
                opacity: 1,
                duration: 5000
                }
            ]
        },
        {
            id: 'fourth-chapter',
            alignment: 'berdo-align-center',
            hidden: false,
            //title: 'Not all hospitals in Boston fall at the bottom of the rankings.',
            description: 'Children’s and the other hospitals in the Longwood Medical Area draw their power from a common generating plant, MATEP. With its reliance on diesel and other highly polluting energy sources, the plant results in low ratings for the facilities that rely on it for power.',
            location: {
                center: [-71.104963, 42.337412],
                zoom: 15,
                pitch: 0,
                bearing: 0
            },
            pointMarker: {
                layer: 'MATEP',
                coordinates:  [-71.10840, 42.33689],
                title: 'Medical Area Total Energy Plant'
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: 'showOnlyMATEPLabel',
            onChapterEnter: [
                {
                layer: 'MATEP',
                opacity: .5
                }
            ],
            onChapterExit: [
                {
                layer: 'layer-name',
                opacity: 1,
                duration: 5000
                }
            ]
        },
        {
            id: 'fifth-chapter',
            alignment: 'berdo-align-center',
            hidden: false,
            //title: 'Franciscan Children’s Hospital in Brighton received the highest possible score of 100.',
            description:  'Not all hospitals in Boston fall at the bottom of the rankings. Franciscan Children’s Hospital in Brighton received the highest possible score of 100. As a specialized pediatric rehabilitation and behavioral health facility, it does not operate the energy-intensive services of a large acute-care complex. They don’t have an emergency room, and when patients need surgery, they are often sent to other hospitals, like Boston Children’s,” said Leann Canty.',
            location: {
                center: [-71.14353, 42.35003],
                zoom: 16,
                pitch: 64.5,
                bearing: -172
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                {
                layer: 'MATEP',
                opacity: 0
                }
            ],
            onChapterExit: [
                {
                layer: 'layer-name',
                opacity: 1,
                duration: 5000
                }
            ]
        },
    ]}
        
    