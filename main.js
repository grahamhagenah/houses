const HOUSES_PER_SECTION = 5;

const sections = [
  {
    id: 'section-1',
    label: 'Victorian',
    title: 'A Living Archive',
    paragraphs: [
      'These homes represent over a century of architectural character—triple-deckers, Victorians, and colonials that have sheltered generations of families in one of Greater Boston\'s most vibrant communities.',
      'Walk down any street in Somerville and you\'ll encounter a rich tapestry of wooden facades, ornate porches, and colorful paint schemes that reflect the diverse immigrants and working families who built this city.',
      'From the grand Victorians near Tufts University to the iconic triple-deckers of Davis Square, each neighborhood tells its own story through architecture that has endured decades of change while maintaining its distinctive character.'
    ]
  },
  {
    id: 'section-2',
    label: 'Triple-Decker',
    title: 'Street by Street',
    paragraphs: [
      'Beyond the well-known squares and transit corridors, Somerville\'s residential streets hold some of the city\'s most quietly remarkable architecture. These are not showpieces—they are homes that have simply endured.',
      'Each block tells a different story. A row of Italianates on one street gives way to a cluster of two-families on the next. Paint colors change, porches are added and removed, but the bones remain. Somerville\'s housing stock is, in many ways, the most honest record of the city\'s history.',
      'Here are five more addresses—drawn from different corners of the city—that speak to that continuity.'
    ]
  },
  {
    id: 'section-3',
    label: 'Queen Anne',
    title: 'Ornament & Character',
    paragraphs: [
      'The Queen Anne style arrived in Somerville during the 1880s and left an indelible mark on its hillside streets. Characterized by asymmetrical facades, wraparound porches, and an exuberant mix of surface textures, these homes were built for a newly prosperous merchant class eager to display their status.',
      'Spindle-work, patterned shingles, and decorative gables distinguish these houses from their plainer neighbors. Many have survived largely intact, their ornamental woodwork preserved by owners who understood what they had.',
      'These five homes represent some of the finest remaining examples of the style in the city.'
    ]
  },
  {
    id: 'section-4',
    label: 'Colonial Revival',
    title: 'A Return to Order',
    paragraphs: [
      'By the turn of the twentieth century, the exuberance of the Queen Anne had given way to a quieter sensibility. The Colonial Revival looked backward—to the symmetry and restraint of early American architecture—as a corrective to Victorian excess.',
      'In Somerville, these homes typically feature centered doorways with transom lights, double-hung windows arranged in careful rows, and modest but dignified facades. They were built by families who valued permanence over spectacle.',
      'The five homes here speak to that tradition—understated, well-proportioned, and still standing after more than a century.'
    ]
  }
];

function buildSections() {
    const container = document.getElementById('sections-container');
    sections.forEach(section => {
        const el = document.createElement('section');
        el.className = 'map-section';
        el.id = section.id;

        const introText = document.createElement('div');
        introText.className = 'intro-text';

        const kicker = document.createElement('p');
        kicker.className = 'section-kicker';
        kicker.textContent = section.label;
        introText.appendChild(kicker);

        const h2 = document.createElement('h2');
        h2.textContent = section.title;
        introText.appendChild(h2);

        section.paragraphs.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            introText.appendChild(p);
        });

        const houseDisplay = document.createElement('div');
        houseDisplay.className = 'house-display';
        houseDisplay.id = `house-display-${section.id}`;

        el.appendChild(introText);
        el.appendChild(houseDisplay);
        container.appendChild(el);
    });
}

function buildNav() {
    const nav = document.getElementById('section-nav');
    sections.forEach(section => {
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.dataset.target = section.id;

        const dot = document.createElement('span');
        dot.className = 'nav-dot';

        const label = document.createElement('span');
        label.className = 'nav-label';
        label.textContent = section.label;

        item.appendChild(dot);
        item.appendChild(label);
        nav.appendChild(item);

        item.addEventListener('click', () => {
            document.getElementById(section.id).scrollIntoView({ behavior: 'instant' });
        });
    });

    new IntersectionObserver(([entry]) => {
        nav.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 }).observe(document.querySelector('.hero'));
}

function handleParallax() {
    const scrollY = window.scrollY;
    const row1 = document.getElementById('street-row-1');
    const row2 = document.getElementById('street-row-2');
    const row3 = document.getElementById('street-row-3');
    const heroContent = document.querySelector('.hero-content');

    heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
    row1.style.transform = `translateY(${scrollY * 0.12}px)`;
    row2.style.transform = `translateY(${scrollY * 0.06}px)`;
    row3.style.transform = `translateY(${scrollY * 0.02}px)`;

    const scrollDelta = scrollY - prevScrollY;
    document.querySelectorAll('.intro-section').forEach((section, i) => {
        const body = section.querySelector('.intro-body');
        if (!body) return;
        if (introOffsets[i] === undefined) introOffsets[i] = 0;
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            const progress = (window.innerHeight - rect.bottom) / (window.innerHeight + rect.height);
            const p = Math.max(0, Math.min(1, progress));
            const counteract = Math.sin(p * Math.PI) * 0.72;
            introOffsets[i] += scrollDelta * counteract;
        }
        const maxOffset = (section.offsetHeight - body.offsetHeight) / 2;
        introOffsets[i] = Math.max(-maxOffset, Math.min(maxOffset, introOffsets[i]));
        body.style.transform = `translateY(${introOffsets[i]}px)`;
    });
    prevScrollY = scrollY;

    // Highway: scroll-tied translateY so it rises from below naturally
    const highway = document.querySelector('.highway-divider');
    const wrapper = document.querySelector('.intro-highway-wrapper');
    const allSections = document.querySelector('.all-sections-wrapper');
    if (highway && wrapper && allSections) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const allSectionsRect = allSections.getBoundingClientRect();
        if (wrapperRect.top > 0) {
            // Wrapper entering: highway rises from below tied to scroll
            const progress = Math.max(0, Math.min(1, 1 - wrapperRect.top / window.innerHeight));
            highway.style.transform = `translateY(${(1 - progress) * 100}%)`;
        } else if (allSectionsRect.top < window.innerHeight) {
            // All-sections entering: highway scrolls off screen upward at page speed
            const exit = Math.max(0, Math.min(1, 1 - allSectionsRect.top / window.innerHeight));
            highway.style.transform = `translateY(-${exit * window.innerHeight}px)`;
        } else {
            highway.style.transform = 'translateY(0)';
        }
    }

    // Update active nav item
    let current = null;
    sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = s.id;
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.target === current);
    });

    if (mobileLabelReady) {
        const mobileLabel = document.getElementById('mobile-section-label');
        if (mobileLabel) {
            const section = sections.find(s => s.id === current);
            mobileLabel.textContent = section ? section.label : '';
            mobileLabel.classList.toggle('visible', !!current);
        }
    }
}

let mobileLabelReady = false;
let prevScrollY = window.scrollY;
const introOffsets = [];

function populateStreets(houseImages) {
    const rows = [
        document.getElementById('street-row-1'),
        document.getElementById('street-row-2'),
        document.getElementById('street-row-3'),
    ];
    const totalHomes = 18;

    rows.forEach((row, rowIndex) => {
        for (let i = 0; i < totalHomes; i++) {
            const img = document.createElement('img');
            img.src = houseImages[(i + rowIndex * 3) % houseImages.length];
            img.alt = 'House in Greater Boston';
            row.appendChild(img);
        }
    });
}

const mapStyle = {
    version: 8,
    sources: {
        'carto': {
            type: 'raster',
            tiles: [
                'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png',
                'https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '© CARTO © OpenStreetMap contributors'
        }
    },
    layers: [{ id: 'carto', type: 'raster', source: 'carto', minzoom: 0, maxzoom: 19 }]
};

let sharedMap;

function initSharedMap(allHouseData) {
    sharedMap = new maplibregl.Map({
        container: 'map',
        style: mapStyle,
        center: [-71.0995, 42.3876],
        zoom: 12,
        attributionControl: false,
        padding: { top: 20, bottom: 20, left: 40, right: 40 }
    });

    sharedMap.on('load', () => {
        setTimeout(() => sharedMap.resize(), 100);
        sharedMap.scrollZoom.disable();
        sharedMap.boxZoom.disable();
        sharedMap.doubleClickZoom.disable();
        sharedMap.touchZoomRotate.disableRotation();
        document.getElementById('map-zoom-in').addEventListener('click', () => sharedMap.zoomIn());
        document.getElementById('map-zoom-out').addEventListener('click', () => sharedMap.zoomOut());
        sharedMap.addSource('active-house', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'Point', coordinates: [allHouseData[0].lng, allHouseData[0].lat] } }
        });
        sharedMap.addLayer({
            id: 'active-house-dot',
            type: 'circle',
            source: 'active-house',
            paint: {
                'circle-radius': 8,
                'circle-color': '#000',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
                'circle-opacity': 1,
                'circle-opacity-transition': { duration: 250 },
                'circle-stroke-opacity': 1,
                'circle-stroke-opacity-transition': { duration: 250 }
            }
        });
    });
}

function initSection({ displayId, images, data, imageOffset }) {
    const display = document.getElementById(displayId);
    const isMobile = window.innerWidth <= 768;

    for (let i = 0; i < data.length; i++) {
        const img = document.createElement('img');
        img.src = images[(i + imageOffset) % images.length];
        img.alt = 'Home in Somerville';
        img.dataset.index = i;
        img.style.cursor = 'pointer';

        if (isMobile) {
            const slide = document.createElement('div');
            slide.className = 'house-slide';
            slide.appendChild(img);
            if (data[i].notes) {
                const note = document.createElement('p');
                note.className = 'house-note';
                note.textContent = data[i].notes;
                slide.appendChild(note);
            }
            img.addEventListener('click', () => {
                display.querySelectorAll('img').forEach(el => el.classList.remove('active'));
                img.classList.add('active');
                updateMap(data[i]);
            });
            display.appendChild(slide);
        } else {
            img.addEventListener('click', () => {
                img.scrollIntoView({ behavior: 'instant', block: 'center' });
                display.querySelectorAll('img').forEach(el => el.classList.remove('active'));
                img.classList.add('active');
                updateMap(data[i]);
            });
            display.appendChild(img);
            if (data[i].notes) {
                const note = document.createElement('p');
                note.className = 'house-note';
                note.textContent = data[i].notes;
                display.appendChild(note);
            }
        }
    }

    if (isMobile) {
        const section = display.closest('.map-section');
        if (section) {
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) updateMap(data[0]);
            }, { threshold: 0.3 }).observe(section);
        }

        const dots = document.createElement('div');
        dots.className = 'house-dots';
        for (let i = 0; i < data.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'house-dot';
            if (i === 0) dot.classList.add('active');
            dots.appendChild(dot);
        }
        display.insertAdjacentElement('afterend', dots);

        display.addEventListener('scroll', () => {
            const center = display.scrollLeft + display.offsetWidth / 2;
            const slides = display.querySelectorAll('.house-slide');
            let closest = 0, minDist = Infinity;
            slides.forEach((slide, i) => {
                const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
                if (dist < minDist) { minDist = dist; closest = i; }
            });
            display.querySelectorAll('img').forEach((img, i) => img.classList.toggle('active', i === closest));
            dots.querySelectorAll('.house-dot').forEach((dot, i) => dot.classList.toggle('active', i === closest));
            updateMap(data[closest]);
        });
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('active', entry.isIntersecting);
                if (entry.isIntersecting) updateMap(data[parseInt(entry.target.dataset.index)]);
            });
        }, { rootMargin: '-35% 0px -35% 0px' });
        display.querySelectorAll('img').forEach(img => observer.observe(img));
    }
}

const easing = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

let currentHouseAddress = null;

function updateMap(house) {
    if (house.address === currentHouseAddress) return;
    currentHouseAddress = house.address;
    const houseInfo = document.querySelector('.house-info');
    houseInfo.classList.remove('house-info-enter');
    houseInfo.classList.add('house-info-exit');
    setTimeout(() => {
        document.getElementById('house-info-address').textContent = house.address.replace(', Somerville', '');
        document.getElementById('house-info-type').textContent = house.square;
        houseInfo.classList.remove('house-info-exit');
        houseInfo.classList.add('house-info-enter');
    }, 180);
    if (sharedMap && sharedMap.getSource('active-house')) {
        sharedMap.getSource('active-house').setData({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [house.lng, house.lat] }
        });
        sharedMap.easeTo({ center: [house.lng, house.lat], zoom: 12, duration: 1800, easing });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    buildSections();
    buildNav();

    const firstKicker = document.querySelector('#section-1 .section-kicker');
    if (firstKicker) {
        new IntersectionObserver(([entry]) => {
            mobileLabelReady = !entry.isIntersecting;
            if (!mobileLabelReady) {
                const mobileLabel = document.getElementById('mobile-section-label');
                if (mobileLabel) mobileLabel.classList.remove('visible');
            }
        }, { threshold: 0 }).observe(firstKicker);
    }

    const [imagesResponse, housesResponse] = await Promise.all([
        fetch('images.json'),
        fetch('houses.json')
    ]);
    const houseImages = await imagesResponse.json();
    const allHouseData = await housesResponse.json();

    populateStreets(houseImages);
    initSharedMap(allHouseData);

    sections.forEach((section, i) => {
        initSection({
            displayId: `house-display-${section.id}`,
            images: houseImages,
            data: allHouseData.slice(i * HOUSES_PER_SECTION, (i + 1) * HOUSES_PER_SECTION),
            imageOffset: i * HOUSES_PER_SECTION
        });
    });

    if (window.innerWidth <= 768) {
        const persistentMap = document.querySelector('.persistent-map');
        const firstDisplay = document.getElementById('house-display-section-1');
        if (firstDisplay) {
            new IntersectionObserver(([entry]) => {
                const visible = entry.isIntersecting || entry.boundingClientRect.top < 0;
                persistentMap.style.opacity = visible ? '1' : '0';
                persistentMap.style.pointerEvents = visible ? 'auto' : 'none';
            }, { threshold: 0 }).observe(firstDisplay);
        }
    }

    window.addEventListener('scroll', handleParallax);
});
