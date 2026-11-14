#!/usr/bin/env node
/**
 * Build and verify assets/bgCatalog.json for the Live2D viewer background selector.
 *
 * Usage:
 *   node scripts/build-bg-catalog.js           # Build assets/bgCatalog.json from local ma-re-data
 *   node scripts/build-bg-catalog.js --verify  # Verify assets/bgCatalog.json schema (and local files if present)
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(REPO, 'assets', 'bgCatalog.json');
const BG_ROOT = path.join(REPO, 'assets', 'ma-re-data', 'resource', 'image_native', 'bg');

const BROKEN_WEB_EXPORTS = new Set([
    'web_0001.ExportJson',
    'web_ev_1078_21531.ExportJson',
]);

const QUEST_TOP_HOME_FILES = [
    'bg_map_11011.ExportJson',
    'bg_map_11012.ExportJson',
    'bg_map_11013.ExportJson',
];

const SOLID_BACKGROUNDS = [
    { id: 'solid:gray', label: 'Default Gray', hex: '#999999', color: 0x999999 },
    { id: 'solid:green', label: 'Green Screen', hex: '#00ff00', color: 0x00ff00 },
    { id: 'solid:chroma-green', label: 'Chroma Green', hex: '#00b140', color: 0x00b140 },
    { id: 'solid:chroma-blue', label: 'Chroma Blue', hex: '#0047bb', color: 0x0047bb },
    { id: 'solid:black', label: 'Black', hex: '#000000', color: 0x000000 },
    { id: 'solid:white', label: 'White', hex: '#ffffff', color: 0xffffff },
];

// Multi-location / multi-scene prefixes where digit suffixes represent distinct scenes rather than time of day.
const NON_TIME_PREFIXES = new Set([
    '2064', '2070', '2101', '2102', '2118', '2137', '2155', '2167', '2192', '2401', '3109',
]);

// Verified official English overrides from Magia Exedra (getDollhouse2dBackgroundMstList.json).
const EXEDRA_PREFIX_OVERRIDES = {
    '1102': 'Shinsei Ward - Residential Area',
    '1104': 'Shinsei Ward - Path',
    '1105': 'Coordinator - Living Area',
    '1106': 'Coordinator - Shop Area',
    '1107': 'Kamihama University Affiliated School - Gate',
    '1202': 'Mizuna Ward - Street',
    '1205': 'Mizuna Shrine - Gate',
    '1206': 'Mizuna Shrine - Grounds',
    '1207': "Mizuna Girls' Academy - Gate",
    '1208': "Mizuna Girls' Academy - Grounds",
    '1301': 'Sankyo Ward - Shopping Center',
    '1302': 'Sankyo Ward - Street',
    '1303': 'Sankyo Ward - Path',
    '1305': 'Sankyoin Academy - Gate',
    '1306': 'Sankyoin Academy - Grounds',
    '1309': 'Natsume Books',
    '1311': "Emily's Counseling Room",
    '1312': 'Suitoku Shopping Center',
    '1316': "Ashita's",
    '1402': 'Chuo Ward - Street',
    '1404': 'Chuo Ward - Path',
    '1405': 'Radio Tower - Observation Deck',
    '1409': 'Chuo Academy - Gate',
    '1504': 'Sakae Ward - Street',
    '1508': "Kanagi's Maid Cafe",
    '1509': 'Sakae Academy - Gate',
    '1511': 'Sakae Ward - 1090 Tower Front',
    '1608': 'Kosho Academy - Gate',
    '1614': 'Kosho Ward - Electric Town',
    '1704': 'Daito Ward - Path',
    '1705': 'Daito Ward - Lake',
    '1713': 'Daito Ward - Ferris Wheel Entrance',
    '1714': 'Chelation Land',
    '1717': 'Daito Academy - Gate',
    '1803': 'Minagi Liberty Academy - Gate',
    '1804': 'Minagi Ward - Street',
    '1906': 'Mountain Trail - Halfway Point',
    '1907': 'Hokuyo Ward - Observation Deck',
    '1908': 'Hotel Fendt Hope - Room',
    '1909': 'Eternal Sakura Tree',
    '1920': 'Hotel Fendt Hope - Hall',
    '2002': 'Neighboring City - Intersection',
    '2003': 'Neighboring City - Sidewalk',
    '2006': 'Mitakihara Middle School - Passage',
    '2007': '15th-Century France - Forest',
    '2008': '15th-Century France - Rural Town',
    '2009': '15th-Century France - Tourelles Fortress',
    '2010': '15th-Century France - Camp',
    '2011': '15th-Century France - Fortress - Outside',
    '2012': '15th-Century France - Cathedral - Inside',
    '2013': '15th-Century France - Prison',
    '2016': "Madoka's Place - Madoka's Room",
    '2019': 'Mitakihara Middle School - Roof',
    '2020': 'Mitakihara Middle School - Classroom',
    '2021': 'Mitakihara Middle School - Gate',
    '2025': 'Private Beach',
    '2045': 'Movie Theater',
    '2047': 'Seaside Mountain Trail',
    '2051': 'Cave',
    '2052': 'Futatsugi City - Unfinished Building',
    '2053': 'Snow Dome',
    '2056': 'Waterpark - Waterslide',
    '2057': 'Waterpark - Lounge Area',
    '2059': 'Waterpark - Indoor Pool',
    '2060': 'Waterpark - Poolside',
    '2104': 'Shopping Mall',
    '2107': 'Residence - Room',
    '2108': 'Generic Living Room',
    '2114': 'Little Park',
    '2115': 'Back Alley',
    '2116': 'Unfinished Building',
    '2120': 'Mikazuki Villa - Living Room',
    '2121': 'Banbanzai - Inside',
    '2124': 'Kamihama Shopping Center',
    '2126': 'Mikazuki Villa - Kitchen',
    '2127': 'Banbanzai - Outside',
    '2133': 'Cafe Terrace',
    '2140': 'Shopping Mall - Shopfronts',
    '2141': 'Apparel Shop',
    '2142': 'Big Park',
    '2146': 'Manor - Parlor',
    '2147': 'Manor - Room',
    '2148': 'Office',
    '2151': 'Library',
    '2153': 'Western-Style Building - Inside',
    '2156': 'City Rooftops (Green)',
    '2159': 'Back Alley 2',
    '2161': 'Event Space',
    '2163': 'Train Car',
    '2164': 'Cemetery',
    '2169': 'Mikazuki Villa - Outside',
    '2172': 'Takarazaki Station Entrance',
    '2173': 'Community Center - Outside',
    '2174': 'Community Center - Room',
    '2301': "Homura's Room",
    '2302': 'Station Platform',
    '2303': 'Arcade',
    '2305': 'Mitakihara School Road',
    '2307': 'Fast Food Shop',
    '2308': "Mami's Place - Kitchen",
    '2310': 'Church',
    '2311': 'Bus Stop',
    '2312': 'Overpass',
    '2314': "Homura's Hospital Room",
    '2316': "Mabayu's Room",
    '2317': 'Café Récompense - Outside',
    '2318': 'Café Récompense - Inside',
    '2321': 'Hospital - Roof',
    '2322': 'Rebellion Watertop Cafe',
    '2323': 'Top of Bridge',
    '2325': 'Rebellion 4-Way Intersection',
    '3112': '15th-Century Castle Town',
    '3113': "Oriko's Father's Study",
    '46403': 'Charlotte Arena (Chocolate Witch)',
    '46602': 'Bovine Witch Arena',
};

// Embedded durable fallback for Tumblr BG Index entries (so script works standalone without .task/).
const FALLBACK_TUMBLR_ENTRIES = {
    '1101': 'Shinsei panorama',
    '1102': 'Shinsei residential street',
    '1104': 'Shinsei tiled path',
    '1105': 'Mitama’s shop (back room)',
    '1106': 'Mitama’s shop',
    '1107': 'Kamihama University (front gate)',
    '1108': 'Kamihama University (back field)',
    '1109': 'Construction site (incl. Sapphire Lips labyrinth)',
    '1110': 'Blossom flower shop',
    '1112': 'Crescent House, main lounge',
    '1113': 'Crescent House, computer lab',
    '1114': 'Crescent House, living room',
    '1115': 'Crescent House, Iroha’s room',
    '1201': 'Mizuna castle town',
    '1202': 'Mizuna residential street',
    '1204': 'Mizuna road',
    '1205': 'Mizuna Shrine (gate)',
    '1206': 'Mizuna Shrine (interior)',
    '1207': 'Mizuna Girls’ Academy (front gate)',
    '1208': 'Mizuna Girls’ Academy (back field)',
    '1209': 'Art museum',
    '1210': 'Ryuushinkan dojo',
    '1211': 'Mizuna Castle',
    '1212': 'Mizuna Ward (New Year / Year of the Dragon)',
    '1301': 'Suitoku shopping center',
    '1302': 'Sankyou street 1 (near grocery store)',
    '1303': 'Sankyou street 2 (near candy store)',
    '1304': 'Sankyou side street',
    '1305': 'Sankyou Educational Academy (front gate)',
    '1306': 'Sankyou Educational Academy (back field)',
    '1307': 'Sewer tunnel',
    '1308': 'Sewer clearing (incl. Pearl Eye labyrinth)',
    '1309': 'Natsume Books',
    '1310': 'Suitoku public bath',
    '1311': 'Emily’s Counseling Room',
    '1312': 'Sankyou shops',
    '1313': 'Suitoku Temple (exterior)',
    '1314': 'Suitoku Temple (interior)',
    '1315': 'Cherry tree park',
    '1316': 'Ashitaya candy shop',
    '1401': 'Chuuou panorama',
    '1402': 'Chuuou main intersection',
    '1403': 'Chuuou highway',
    '1404': 'Chuuou sidewalk',
    '1405': 'Radio tower outskirts',
    '1406': 'Radio tower cabin',
    '1407': 'Cyberspace',
    '1408': 'Helipad',
    '1409': 'Chuuou Academy (front gate)',
    '1410': 'Chuuou Academy (rooftop field)',
    '1411': 'Puella Care trailer (exterior)',
    '1412': 'Puella Care trailer (interior)',
    '1413': 'Chuuou main intersection - additional variants',
    '1501': 'Sakae panorama (upwards camera)',
    '1502': 'Sakae intersection',
    '1504': 'Sakae shopping street',
    '1505': 'Kamihama Memorial Archive',
    '1506': 'Memory Museum (incl. Ruby Navel labyrinth)',
    '1507': 'Memory Museum hallway',
    '1508': 'Kanagi’s cafe',
    '1509': 'Sakae Integrated Academy (front gate)',
    '1510': 'Sakae Integrated Academy (back field)',
    '1511': 'Sakae panorama (head-on camera)',
    '1512': 'Alina’s Atelier',
    '1601': 'Koushou cable car station',
    '1602': 'Koushou intersection',
    '1604': 'Koushou side street',
    '1605': 'Old trainyard',
    '1606': 'Chiaki bento shop',
    '1607': 'Ikumi’s cafe',
    '1608': 'Koushou School (front gate)',
    '1610': 'Yayoi factory',
    '1611': 'Amane Bamboo',
    '1612': 'Promised Blood warehouse (exterior)',
    '1613': 'Promised Blood warehouse (interior)',
    '1614': 'Koushou electric town',
    '1615': 'Subway tunnels',
    '1701': 'Daitou river bridge',
    '1702': 'Daitou apartment complex',
    '1704': 'Daitou street',
    '1705': 'Lake facing Ferris wheel',
    '1706': 'Daitou apartment hallway',
    '1707': 'Daitou apartment stairwell',
    '1708': 'Daitou apartment mini-mall',
    '1709': 'Daitou apartment park',
    '1710': 'Daitou apartment roof',
    '1711': 'Daitou apartment interior',
    '1712': 'Abandoned theme park site (incl. Aquamarine Heels labyrinth)',
    '1713': 'Foot of Ferris wheel',
    '1714': 'Chelation Land',
    '1715': 'Daitou shrine',
    '1716': 'Daitou festival stalls',
    '1717': 'Daitou Academy (front gate)',
    '1719': 'Neo Magius auditorium (exterior)',
    '1720': 'Neo Magius auditorium (interior)',
    '1721': 'Kamihama Penitentiary (incl. Garnet Pinky labyrinth)',
    '1722': 'Kamihama Penitentiary underground',
    '1801': 'Minaminagi waterside cafe',
    '1802': 'Minaminagi waterfront sidewalk',
    '1803': 'Minaminagi Free Academy (front gate)',
    '1804': 'Minaminagi waterside road',
    '1805': 'Waterfront fountain park',
    '1806': 'Minaminagi container port (incl. Diamond Hair labyrinth)',
    '1808': 'Kamihama Aquarium (Folklore of 0 hideout)',
    '1809': 'Minaminagi Ward (Event / Special Stage)',
    '1810': 'Second-hand clothes market',
    '1811': 'Minagi Sea hotel exterior',
    '1812': 'Nachtmärchen house exterior',
    '1813': 'Nachtmärchen house interior',
    '1901': 'Hokuyou panorama (w/ Saint Lilliana Academy)',
    '1902': 'Hokuyou residential street',
    '1904': 'Hokuyou side street',
    '1905': 'Mirror mansion',
    '1906': 'Mountain trail',
    '1907': 'Mountain viewing platform',
    '1908': 'Hotel Fendt Hope room',
    '1909': 'Eternal Sakura tree',
    '1910': 'Touka’s computer lab',
    '1911': 'Eve’s chapel',
    '1912': 'Hotel Fendt Hope jail cell',
    '1913': 'Forest clearing / former Fendt Hope site',
    '1914': 'Radio telescope',
    '1915': 'Radio telescope field',
    '1916': 'Hotel Fendt Hope basement',
    '1917': 'Hotel Fendt Hope hallways',
    '1918': 'Hotel Fendt Hope exterior (incl. Turquoise Ears labyrinth)',
    '1919': 'Hotel Fendt Hope stairwell',
    '1920': 'Hotel Fendt Hope lobby (w/ Soldier Bear)',
    '1921': 'Hotel Fendt Hope secret passage',
    '1922': 'Walnuts',
    '1923': 'Walnuts kitchen',
    '1924': 'Roof (site of the Magius’ wish)',
    '1925': 'Touka’s room',
    '1926': 'Saint Liliana Academy (front gate)',
    '1927': 'Saint Liliana Academy (back garden)',
    '1928': 'Hokuyou Special Stage (1928)',
    '1929': 'Moo-Moo Farm',
    '1930': 'Forest thicket',
    '1931': 'Satomi Medical Center exterior',
    '1932': 'Hokuyou lakeside street (incl. Opal Neck labyrinth)',
    '1933': 'Former Fendt Hope site - additional variants',
    '2001': 'Iroha and Ui’s bedroom',
    '2002': 'Neighboring city intersection',
    '2003': 'Neighboring city side street',
    '2004': 'Neighboring city industrial site',
    '2005': 'Azalea House',
    '2006': 'Mitakihara school hallway',
    '2007': '15th-century Europe woodland',
    '2008': '15th-century Europe village',
    '2009': '15th-century Europe castle',
    '2010': '15th-century Europe camp',
    '2011': '15th-century Europe fortress bridge',
    '2012': '15th-century Europe chapel',
    '2013': '15th-century Europe dungeon',
    '2014': 'Mitakihara hospital roof',
    '2015': 'Chocolate shoppe',
    '2016': 'Madoka’s bedroom',
    '2017': 'Mami’s living room',
    '2018': 'Sky (OG series, end of timeline 4)',
    '2019': 'Mitakihara school roof',
    '2020': 'Mitakihara school classroom',
    '2021': 'Mitakihara school front gate',
    '2022': 'Neighboring city sidewalk (incl. Yuna/Iroha mindscapes)',
    '2023': '15th-century France map',
    '2024': 'FM Kamihama studio',
    '2025': 'Beaches',
    '2026': 'Beachside trees',
    '2027': 'Shrine forest',
    '2028': 'Seaside cliff',
    '2029': 'Beachside inn exterior',
    '2030': 'Beachside inn interior',
    '2031': 'Ocean',
    '2032': 'Fishing spot',
    '2033': 'Octopus House',
    '2034': 'Grotto',
    '2035': 'Summer festival stalls',
    '2036': 'Summer festival stage',
    '2037': 'Kyuubey in the window',
    '2038': 'Classroom (diary flashback)',
    '2039': 'City wreckage (site of Madoka’s wish)',
    '2040': 'Madoka’s magic circle',
    '2041': 'Outer space',
    '2042': 'Madoka dimension',
    '2043': 'Riko’s dream (landscape)',
    '2044': 'Riko’s dream (crowd)',
    '2045': 'Nagisa movie theater still',
    '2046': 'Neighboring city intersection',
    '2047': 'Wooded path near beach',
    '2048': 'Gravel beach',
    '2049': 'Deep forest path',
    '2050': 'Forest pond',
    '2051': 'Cavern',
    '2052': 'Futatsugi City construction site',
    '2053': 'Snowglobe',
    '2054': 'Rocky beach shore',
    '2055': 'Lighthouse',
    '2056': 'Water park (slides)',
    '2057': 'Water park (cafe)',
    '2058': 'Water park (kids’ pool)',
    '2059': 'Water park (indoor pool)',
    '2060': 'Water park (show stage)',
    '2061': 'Dragon Palace Aquarium (exterior)',
    '2062': 'Dragon Palace Aquarium (courtyard)',
    '2063': 'Halloween Castle labyrinth',
    '2064': 'Angels on the Road locations',
    '2065': 'Tamaki residence',
    '2066': '“Mr. Purrs-a-lot” set',
    '2067': 'Tangled-Up Ruins labyrinth',
    '2068': 'Seabed',
    '2069': 'Cemetery Banquet labyrinth',
    '2070': 'Hotaru’s dreamscapes',
    '2071': 'Bygone Dream castle grounds',
    '2072': 'Medieval Japanese armory',
    '2073': 'Medieval Japanese audience chamber',
    '2074': 'Medieval Japanese town',
    '2075': 'Grass plain',
    '2076': 'Morgue',
    '2077': 'Dream fog (Grief corrosion)',
    '2078': 'River w/ drifting flowers',
    '2079': 'Sunflower field',
    '2080': 'Anime train interior',
    '2081': 'Anime train platform',
    '2082': 'Cafe BIG WAVES interior',
    '2083': 'Cafe BIG WAVES exterior',
    '2084': '5th Anniversary gemstones BG',
    '2085': 'Fire/ice illusion town',
    '2086': 'Fire/ice illusion caves',
    '2087': 'Snowfield',
    '2088': 'Special Event Backdrop (2088)',
    '2101': 'Hospital interiors (group 1)',
    '2102': 'School interiors',
    '2103': 'Arcade',
    '2104': 'Shopping mall (escalators)',
    '2106': 'Train station (turnstiles)',
    '2107': 'Generic bedroom',
    '2108': 'Generic living room',
    '2109': 'Supermarket',
    '2110': 'Concert',
    '2111': 'Fast-food joint',
    '2112': 'Convenience store exterior',
    '2113': 'Riverbank',
    '2114': 'Playground / Festival stalls',
    '2115': 'Back alley 1 (OG series episode 5)',
    '2116': 'Under-construction building',
    '2117': 'City skyline',
    '2118': 'Mirrors interiors (incl. Nanoha arenas)',
    '2119': 'Mikazuki Villa (Iroha’s bedroom)',
    '2120': 'Mikazuki Villa (living room)',
    '2121': 'Banbanzai (interior)',
    '2122': 'Restaurant',
    '2123': 'Hotel bedroom',
    '2124': 'Kamihama shopping street',
    '2125': 'Dream fog (incl. Kazumi event BG)',
    '2126': 'Mikazuki Villa (kitchen)',
    '2127': 'Banbanzai (exterior)',
    '2128': 'Halloween theatre',
    '2129': 'Run-down house',
    '2130': 'Alina’s cube Labyrinth / Dark clouds (Atelier event)',
    '2131': 'Mifuyu’s illusion desert',
    '2132': 'Dance studio',
    '2133': 'Outdoor cafe terrace',
    '2134': 'School gymnasium',
    '2135': 'Bird’s-eye view of Kamihama',
    '2137': 'Hospital interiors (group 2)',
    '2138': 'Dilapidated building hideout',
    '2139': 'Underpass',
    '2140': 'Shopping mall (upstairs boutiques)',
    '2141': 'Clothing store',
    '2142': 'Park clearing w/ benches',
    '2144': 'Traditional house (interior)',
    '2145': 'Mifuyu’s room',
    '2146': 'Posh house (living room)',
    '2147': 'Posh house (bedroom)',
    '2148': 'Office',
    '2149': 'Sakae Integrated Academy art studio',
    '2150': 'Futatsugi City bridges',
    '2151': 'Library',
    '2153': 'Western mansion (interior)',
    '2154': 'Western mansion (exterior garden)',
    '2155': 'School interiors (night + Uwasa variants)',
    '2156': 'City rooftops 1 (green rooftop)',
    '2157': 'City rooftops 2 (gray rooftop)',
    '2158': 'City rooftops 3 (rooftop rooms & pipes)',
    '2159': 'Back alley 2 (Rebellion-esque)',
    '2160': 'Back alley 3 (Takarazaki)',
    '2161': 'Live show stage',
    '2162': 'Nayuta’s residence (kitchen)',
    '2163': 'Train car interior',
    '2164': 'Graveyard',
    '2165': 'Kamihama Big Sight (exterior)',
    '2166': 'Kamihama Big Sight (interior)',
    '2167': 'School interiors (Mizuna school festival variants)',
    '2168': 'Karaoke room',
    '2169': 'Mikazuki Villa (exterior)',
    '2170': 'Train station (platform)',
    '2171': 'Mikazuki Villa (past interior)',
    '2172': 'Takarazaki train station',
    '2173': 'Youth community center (exterior)',
    '2174': 'Youth community center (interior)',
    '2175': 'Apartment living room',
    '2176': 'Apartment entryway',
    '2177': 'School classrooms (Christmas)',
    '2178': 'Ryou’s newspaper club room',
    '2179': 'Apartment exterior',
    '2180': 'Hospital staff area',
    '2181': 'Riverbed w/ bridge',
    '2182': 'Waterfall basin',
    '2183': 'Broadcast studio',
    '2184': 'Shed',
    '2185': 'Prep room',
    '2186': 'City skyline (Arc 2 Chapter 10)',
    '2187': 'Car interior (Arc 2 Chapter 12)',
    '2188': 'Auto-Purification System dome',
    '2189': 'Kamihama Student Association Halloween event (exterior)',
    '2190': 'Kamihama Student Association Halloween event (interior)',
    '2191': 'Futatsugi Halloween torii road',
    '2192': 'Hospital interiors (group 3)',
    '2193': 'Shii’s orphanage',
    '2194': 'Kamihama Location (2194)',
    '2301': 'Homura’s living room',
    '2302': 'Train platform (OG series episode 8)',
    '2303': 'Dog Drug Reinforcement!!',
    '2304': 'Site of Homura vs. Walpurgisnacht',
    '2305': 'Mitakihara school road',
    '2307': 'Mitakihara food court',
    '2308': 'Mami’s kitchen',
    '2309': 'Mami’s foyer',
    '2310': 'Sakura family church',
    '2311': 'Bus stop (OG series episode 8)',
    '2312': 'Overpass (OG series episode 6)',
    '2313': 'Construction site (OG series, time-stop training)',
    '2314': 'Homura’s hospital room',
    '2315': 'Kyousuke’s hospital room',
    '2316': 'Mabayu’s room',
    '2317': 'Café Récompense exterior',
    '2318': 'Café Récompense interior',
    '2319': 'Red-tinted industrial area (OG series timeline 3)',
    '2320': 'Factory entry gate',
    '2321': 'OG series hospital roof',
    '2322': 'Rebellion watertop cafe',
    '2323': 'Rebellion highway arch top',
    '2324': 'Rebellion Gothic ruins',
    '2325': 'Rebellion alleyway (Sayaka reveal scene)',
    '2326': 'Rebellion cityscape (blimps)',
    '2327': 'Scene 0 green TV',
    '2401': 'Sky backdrops',
    '2402': 'Forest w/ full moon',
    '2403': 'United Kimochi labyrinth',
    '2404': 'Scene 0 dark void',
    '3101': 'Madogatari collab BG',
    '3102': 'Rarity Star chapel',
    '3103': 'Darkness-covered France',
    '3104': 'Coco Ichi',
    '3105': 'Kamiha☆Magica concert',
    '3106': 'Purgatory',
    '3107': 'Site of Darc vs. La Reine',
    '3108': 'Kamihamageddon',
    '3109': 'Pucelle Academy / Palace interior shots',
    '3110': 'Refrigerator',
    '3111': 'Ark of Memory',
    '3112': '15th-century castle town',
    '3113': 'Oriko’s house',
    '3114': 'Oriko’s nightmare',
    '3115': 'MagiRepo Hawai’i vacation',
    '3116': 'MagiRepo throne',
    '3117': 'MagiRepo Kamihama M.V.D.',
    '3118': 'Café LycoReco',
    '3119': 'MagiReco + LycoReco skylines',
    '3120': 'MagiRepo sports day',
    '41043': 'Coalsack',
    '46000': 'Teresa arena',
    '46001': 'Candy arena',
    '46103': 'Zenobia arena',
    '46104': 'Rebecca arena',
    '46105': 'Stacey arena',
    '46106': 'Shin arena',
    '46107': 'Durbar arena',
    '46108': 'Paola arena',
    '46109': 'Lucy arena',
    '46110': 'Etteilla arena',
    '46112': 'Oshiti arena',
    '46113': 'Raspberry arena',
    '46114': 'Boxwood arena',
    '46119': 'Маруся arena',
    '46120': 'Slave of Anima arena',
    '46123': 'Blot arena',
    '46124': 'Ichizo arena',
    '46201': 'Echoes arena',
    '46207': 'Pillar of Tomorrow arena 1',
    '46208': 'Pillar of Tomorrow arena 2',
    '46209': 'Pillar of Tomorrow arena 3',
    '46211': 'Mirrors gateway (regular)',
    '46212': 'Mirrors gateway (Halloween)',
    '46213': 'Mirrors gateway (New Year’s)',
    '46214': 'Mirrors gateway (Charlotte)',
    '46215': 'Mirrors gateway (Christmas)',
    '46400': 'Patricia arena',
    '46401': 'Gertrud arena',
    '46403': 'Charlotte arena',
    '46404': 'Uhrmann arena',
    '46406': 'Albertine arena',
    '46407': 'H.N. Elly arena',
    '46409': 'Elsa Maria arena',
    '46410': 'Isabel arena',
    '46411': 'Patricia arena (sports day ver.)',
    '46412': 'Roberta arena',
    '46413': 'Gisela arena',
    '46414': 'Oktavia arena (rock concert ver.)',
    '46416': 'Homulilly arena / Rebellion sky (dark rainbow)',
    '46417': 'Kriemhild Gretchen (OG series timeline 4 vantage point)',
    '46418': 'Witch Labyrinth Arena (46418)',
    '46500': 'Matasaburo arena',
    '46602': 'Witch of bulls’ arena',
    '46800': 'Little Goat’s Dream arena',
    '46801': 'Little Bear’s Dream arena',
    '47000': 'Huygens area',
    '47001': 'Harold area',
    '47103': 'Zabaii area',
    '47104': 'Joseph area',
    '47105': 'Ekaterina area',
    '47106': 'Kotori area',
    '47107': 'Patan area',
    '47108': 'Bona area',
    '47109': 'Coco area',
    '47112': 'Suzugamori area',
    '47401': 'Anthony area',
    '47403': 'Pyotr area',
    '47408': 'Ulla area',
    '47416': 'Rebellion cocoon castle (Homulilly minions’ area)',
    '49000': 'Teresa arena (ceiling view)',
    '5001': 'Tokime Village',
    '5002': 'Tokime Village side path',
    '5003': 'Tokime Village river bridge',
    '5004': 'Tokime Village ritual stage',
    '5005': 'Tokime Village underground shrine',
    '5006': 'Tokime Village forest shrine',
    '5007': 'Tokime Village house interior',
    '5008': 'Tokime Village mountain top',
    '5101': 'Futatsugi City catacomb',
    '5102': 'Futatsugi City demolition site',
    '5301': 'Yukuni City main street',
    '5302': 'Yukuni City mountain road',
    '5303': 'Yukuni City parking lot',
    '5304': 'Yukuni City traditional street',
    '6001': 'Sacred tree',
    '6002': 'Burning forest',
    '6003': 'Sengoku period house interior',
    '6101': 'Pharaoh’s throne room',
    '6102': 'Alexandria street',
    '6103': 'Desert',
    '6104': 'Canyon',
    '6105': 'Cleopatra’s bedchamber',
    '6201': 'Fjord village',
    '6202': 'Battle of Stamford Bridge',
    '6203': 'Fjord village bedroom',
    '6204': 'Fjord ocean sunset',
    '6301': 'Tibetan monastery',
    '6302': 'Tibetan town',
    '6303': 'Tibetan bedchamber',
    '6304': 'Tibetan grassland',
    '6401': 'Yamataikoku village houses',
    '6402': 'Yamataikoku village paddy',
    '6403': 'Yamataikoku house interior (altar)',
    '6404': 'Yamataikoku house interior',
    '6501': 'Pompeii street',
    '6502': 'Pompeii house interior',
    '6503': 'Pompeii manor courtyard',
    '6504': 'Pompeii temple',
    '6505': 'Pompeii ocean cliff',
    '6506': 'Spacetime rift',
    '9999': 'Summer 2022 “notebook page” BG',
    '9118': 'Shinsei Ward (Battle BG 9118)',
};

// Embedded durable fallback for Fandom Home Backgrounds (JP -> EN/NA).
const FALLBACK_FANDOM_BACKGROUNDS = [
    ['Blue Skies (Default)', '青空 (デフォルト)', 'Blue Skies (Default)'],
    ['A Diary to Write With You', '君と綴る日記', 'My Diary With You'],
    ['New West Ward (Midday)', '新西区 全景(昼)', 'Shinsei Ward Panorama (Day)'],
    ['New West Ward (Evening)', '新西区 全景(夕)', 'Shinsei Ward Panorama (Sunset)'],
    ['New West Ward (Night)', '新西区 全景(夜)', 'Shinsei Ward Panorama (Night)'],
    ['Magical Halloween Theater ~A Magical Girl Troupe for a Day~', 'マジカルハロウィンシアター', 'Halloween Theater'],
    ['We Passed the First of That Day', 'あの日の一番を超えて', 'Reaching a Happier Height'],
    ['Another Daze', 'Another Daze', 'Another Daze'],
    ["The Crescent Moon Manor's Merry Christmas", 'みかづき荘のMerry Christmas', 'Christmas at Mikazuki Villa'],
    ['Happy New Year at the Mizuna Shrine!', '水名神社でHappy New Year！', "New Year's at Mizuna Shrine"],
    ['À La Carte Valentine', 'アラカルトバレンタイン', 'À la Carte Valentines'],
    ['The Chiming Bell that Transcends Time', '時を超えて鳴らす鐘', 'The Maiden of Hope'],
    ['Bye Bye, See You Tomorrow', 'バイバイ、また明日', 'See You Tomorrow'],
    ['The Howa-Howa Girl Tries Her Best!', 'ほわほわ少女頑張る！', 'Wait, You Got It Wrong!'],
    ['FM Kamihama Holy Radio Station', 'FM神浜 Holy Radio Station', 'FM Kamihama'],
    ['Cross Connection', 'CROSS CONNECTION', 'CROSS CONNECTION'],
    ['A Voice From Beyond That Strokes the Ears', '耳を撫でて彼岸の声', 'Voices from Beyond'],
    ['Spurred to Separation', '呼び水となりて綻び', 'Breakpoint'],
    ['Newbie Maid Carefree Kanagi', '駆けだしメイド十七夜', "Let's See What You're Maid Of"],
    ['The Ribbon at the Beach (1)', '波打ち際のリボン①', 'Beachside Bonds Background 1'],
    ['The Ribbon at the Beach (2)', '波打ち際のリボン②', 'Beachside Bonds Background 2'],
    ["The Crescent Moon Manor's Summer Vacation", 'みかづき荘のSummer Vacation', '-'],
    ["Yes, Let's Go to the Baths!", 'うん、水徳湯に行こにう！', "Let's Hit the Suitoku Baths!"],
    ['And From Here On. (1)', 'そしてこれから。①', 'Hereafter ①'],
    ['And From Here On. (2)', 'そしてこれから。②', 'Hereafter ②'],
    ["It's Okay to Be Clumsy", 'ぶきっちょでも いいですから', "It's Okay to Be Clumsy"],
    ['Whereabouts of the Feather', 'Whereabouts of the feather', 'Wings in the Wind'],
    ['Alina Is Coming to Town (1)', 'アリナが街にやってくる①', "Alina is Comin' to Town 1"],
    ['Alina Is Coming to Town (2)', 'アリナが街にやってくる②', "Alina is Comin' to Town 2"],
    ["Mitama and the Delicious New Year's Party", 'みたまと美味しい新年会', "Mitama's Festive Feast"],
    ['Beginning and Eternal', '始まりと永遠と', 'Endless Beginnings'],
    ['Madogatari Exhibition Collaboration', 'MADOGATARI展コラボ', '-'],
    ['Kamihama Rarity Star (1)', '神浜レアリティースター①', '-'],
    ['Kamihama Rarity Star (2)', '神浜レアリティースター②', '-'],
    ['Leaving the Nest Looking Skyward', '巣立ちは空を見上げて', "A Fledgling's First Flight"],
    ['Sayuki Steps Up! (1)', '優希ステップアップ仕る！①', 'Sayuki Steps Up! (1)'],
    ['Sayuki Steps Up! (2)', '優希ステップアップ仕る！②', 'Sayuki Steps Up! (2)'],
    ['The Ephemeral Summer Night', 'うたかたの夏夜', 'One Fleeting Summer Night'],
    ['Rebels from the Land of Everlasting Night', '常夜の国の叛乱者', 'Rebel of a Dawnless Land'],
    ['CoCo ICHI Collab', 'ココイチ コラブ', '-'],
    ['SamaTore! The Summer Treasure that Disappeared into the Fire (1)', 'サマトレ！～火に消えた夏の宝～①', 'Summer Treasures (1)'],
    ['SamaTore! The Summer Treasure that Disappeared into the Fire (2)', 'サマトレ！～火に消えた夏の宝～②', 'Summer Treasures (2)'],
    ['The Green Jasper Diviners (1)', '深碧の巫①', '-'],
    ['The Green Jasper Diviners (2)', '深碧の巫②', '-'],
    ['From New Breath (1)', '新たな息吹より①', '-'],
    ['From New Breath (2)', '新たな息吹より②', '-'],
    ['Dawn of the Shallow Dream (1)', '浅き夢の暁①', '-'],
    ['Dawn of the Shallow Dream (2)', '浅き夢の暁②', '-'],
    ['Dawn of the Shallow Dream (3)', '浅き夢の暁③', '-'],
    ['Crimson Resolve', 'Crimson Resolve', '-'],
    ['Rumors in Disguise', 'Rumors in Disguise', '-'],
    ['Rondo of Oblivion Sleeps for Eternity (1)', '忘却の輪舞曲は久遠に睡る①', '-'],
    ['Rondo of Oblivion Sleeps for Eternity (2)', '忘却の輪舞曲は久遠に睡る②', '-'],
    ['The Page I Write on the Holy Night (1)', '聖夜に刻む１ページ①', '-'],
    ['The Page I Write on the Holy Night (2)', '聖夜に刻む１ページ②', '-'],
    ["Happy New Year's First Festival!", '明けまして初まつり!', '-'],
    ["I'll Keep Waving At You", 'オマエにずっと手を振る', '-'],
    ['Warming Valentine', 'ウォーミングバレンタイン', '-'],
    ['The Mirror World Chocolatier Part 1', '鏡の国のショコラティエPart 1', '-'],
    ['The Mirror World Chocolatier Part 2', '鏡の国のショコラティエPart 2', '-'],
    ['Tracks of Cherry Blossom', '桜の轍', '-'],
    ['Idol Office', 'アイドル事務所', '-'],
    ['KamiFest', '神フェス', '-'],
    ['BokuSoshi!', 'ぼくそし！', '-'],
    ['Trick☆Trouble☆School Festival', 'トリック☆トラブル☆学園祭', '-'],
    ['End of a Legend, the Limits of Light', '伝説の終わり、光の果て', '-'],
    ['Unknown Story (1)', 'アンノウン・ストーリー①', '-'],
    ['Unknown Story (2)', 'アンノウン・ストーリー②', '-'],
    ['Welcome to Uwasa Aquarium', 'ウワサアクアリウムへようこそ', '-'],
    ['Fun At The All Gods Festival! (1)', '全神祭で遊ぼう！①', '-'],
    ['Fun At The All Gods Festival! (2)', '全神祭で遊ぼう！②', '-'],
    ['Mikazuki House (Exterior)', 'みかづき荘・外観', '-'],
    ['Girls in the Hood (1)', 'ガールズ・イン・ザ・フッド①', '-'],
    ['Girls in the Hood (2)', 'ガールズ・イン・ザ・フッド②', '-'],
    ['Deliver to the Beyond, A Piece of Hope', '彼方に届いて希望の一編', '-'],
    ['Halloween Castle of Prayers and Funeral', '祈りと弔いのハロウィン城', '-'],
    ['Angels on the Road', 'Angels on the Road', '-'],
    ['Christmas String', 'Christmas String', '-'],
    ['Memorable Flower', 'Memorable Flower', '-'],
    ['Bittersweet AI Memory', 'Bittersweet AI Memory', '-'],
    ["Where's the JP Horror!?", 'JPラーはどこデスカ!?', '-'],
    ['Dependence Blue', 'ディペンデンスブルー', '-'],
    ['Kamihama Armageddon (1)', '神浜アルマゲドン①', '-'],
    ['Kamihama Armageddon (2)', '神浜アルマゲドン②', '-'],
    ["Mami's Room (10th Anniversary)", 'マミの部屋(10周年記念)', '-'],
    ['Mitakihara Middle School - Rooftop (10th Anniversary)', '見滝原中学校 屋上(10周年記念)', '-'],
    ['Mitakihara Middle School - Classroom (10th Anniversary)', '見滝原中学校 教室(10周年記念)', '-'],
    ['Mitakihara Middle School - Building (10th Anniversary)', '見滝原中学校 校舎(10周年記念)', '-'],
    ['Mitakihara City - Road to School (10th Anniversary)', '見滝原市 通学路(10周年記念)', '-'],
    ['Our Beginning Is a Recurring Dream', 'はじまりは夢を重ねて', '-'],
    ['The Masked Student Council Strikes Back', '仮面生徒会の逆襲', '-'],
    ['The Mirror That Reflects My True Self', '鏡が映すほんとうの私', '-'],
    ['The Legendary Story of the Paper Mulberry Leaf', '梶の葉伝説物語', '-'],
    ['The Call of the Open Sea', 'なだのよびごえ', '-'],
    ['Night Fairytale', 'ナハトメルヒェン', '-'],
    ['Please Yuna-San', 'お願い結菜さん', '-'],
    ['The Great Banquet that Transcends Time', '時を越えた大宴会', '-'],
    ['Moon Viewing Pajama Party', 'ゆらねむパジャマパーティー', '-'],
    ['Only Dreamers (1)', 'Only Dreamers①', '-'],
    ['Only Dreamers (2)', 'Only Dreamers②', '-'],
    ['The Cuddly Despairs', 'The Cuddly Despairs', '-'],
    ['Dream Halloween Festa', 'ドリームハロウィンフェスタ', '-'],
    ['Kagura San Wants to Be Honest', '正直になりたい神楽燦', '-'],
    ["Yukari Miyuri's Current Training!", '遊狩ミユリの現在修行中！', '-'],
    ['Snow Thawing Befana', '雪解けのベファーナ', '-'],
    ['Tokime Clan Tale', '時女拾遺物語', '-'],
    ['Gray Revolution', '灰色革命', '-'],
    ['Homecoming', 'Homecoming', '-'],
    ['The Inheritors of Our Souls', '想いを継ぐものたち', '-'],
    ["Little Bird's Star", "Little Bird's Star", '-'],
    ['Kamihama Spa Adventure', '神浜スパアドベンチャー', '-'],
    ['My Only Salvation', 'My Only Salvation', '-'],
    ['Passion Is Sharp, Love Is Rounded', '恋は△　愛は●', '-'],
    ['Urara, a Secret, and a Farewell Party', 'うららとナイショと送別会', '-'],
    ['Rainbow Colored Summer', '七色夏模様', '-'],
    ['Stardust Mirage', '星屑のミラージュ', '-'],
    ['Closing and Opening Symposium', 'むすんでひらいて座談会', '-'],
    ['Sayonara Storage', 'サヨナラ・ストレージ', '-'],
    ['Magia Day 2022', 'Magia Day 2022', '-'],
    ['Dark Halloween is The Color of Love!?', '闇色ハロウィンは恋の色!?', '-'],
    ['Winter Recollection An Ancient Tale', 'Winter Recollection 古の物語', '-'],
    ['Winter Recollection A Phantom Tale', 'Winter Recollection 幻の物語', '-'],
    ['Battle Maidens of Kamihama Chapter', '神浜の戦神子編', '-'],
    ['Valentine Message', 'バレンタインメッセージ', '-'],
    ['Mirage of Alexandria Chapter', 'アレクサンドリアの蜃気楼編', '-'],
    ["Kamihama MVD Tamaki Iroha's Detective Files", '神浜MVD 環いろはの事件簿', '-'],
    ['Valkyrie of Vik Chapter', 'ヴィークのワルキューレ編', '-'],
    ['Rakshasi of Tibet Chapter', 'チベットのラクシャーシー編', '-'],
    ["A Bouquet for Tomorrow's Happiness", 'あしたの幸せに花束を', '-'],
    ['Family Heir of Yamataikoku Chapter', '邪馬台国の跡目編', '-'],
    ['Summer Pop Festival!', 'サマーポップフェスティバル！', '-'],
    ['Sweetheart of Pax Romana Chapter', 'パクス・ロマーナの恋人編', '-'],
    ["Kagome's Hundred Monsters", 'かごめの百怪波瀾', '-'],
    ['Paradise Shift', 'パラダイスシフト', '-'],
    ['Inami Mitsuru Wants to Be Normal', '「普通」でありたい伊並満', '-'],
    ['Agent Magica', 'Agent Magica', '-'],
    ['Brethren Come Back To Life On Halloween', 'ハロウィンによみがえる同胞たち', '-'],
    ['Memory Drops', 'オモイデ・ドロップス', '-'],
    ['Happy New Year! Dragon Rush!', '明けまして竜突猛進！', '-'],
    ['From There To You', '彼方より、あなたへ', '-'],
    ['Kamihama Big Sports Day', '神浜大運動会', '-'],
    ["Last Bird's Hope", "Last Bird's Hope", '-'],
    ["Alina's Atelier", 'アリナのアトリエ', '-'],
];

// Embedded fallback for temp/localUserData.json BACKGROUND items (file, jpShortDesc, sortKey).
const FALLBACK_USER_BACKGROUNDS = [
    ['web_ev_1003_21028.ExportJson', '君と綴る日記', 1001],
    ['web_ev_1006_21281.ExportJson', 'ハロウィンシアター', 1002],
    ['web_ev_1007_19061.ExportJson', 'あの日の一番を超えて', 1003],
    ['web_ev_1008_21252.ExportJson', 'Another Daze', 1004],
    ['web_ev_1010_13014.ExportJson', 'みかづき荘のMerry Christmas', 1005],
    ['web_ev_1011_12061.ExportJson', '水名神社でHappy New Year！', 1006],
    ['web_ev_1014_20151.ExportJson', 'アラカルトバレンタイン', 1007],
    ['web_ev_1015_20111.ExportJson', '時を超えて鳴らす鐘', 1008],
    ['web_ev_1017_17102.ExportJson', 'バイバイ、また明日', 1009],
    ['web_ev_1019_12091.ExportJson', 'ほわほわ少女頑張る！', 1010],
    ['web_ev_1021_20241.ExportJson', 'FM神浜', 1011],
    ['web_ev_1023_13091.ExportJson', 'CROSS CONNECTION', 1012],
    ['web_ev_1025_21221.ExportJson', '耳を撫でて彼岸の声', 1013],
    ['web_ev_1027_14051.ExportJson', '呼び水となりて綻び', 1014],
    ['web_ev_1028_15081.ExportJson', '駆け出しメイド十七夜', 1015],
    ['web_ev_1030_20271.ExportJson', '波打ち際のリボン①', 1016],
    ['web_ev_1030_20281.ExportJson', '波打ち際のリボン②', 1017],
    ['web_ev_1032_20251.ExportJson', 'みかづき荘のSummerVacation', 1018],
    ['web_ev_1033_13101.ExportJson', 'うん、水徳湯に行こう！', 1019],
    ['web_ev_1033_20411.ExportJson', 'そしてこれから。①', 1020],
    ['web_ev_1033_21207.ExportJson', 'そしてこれから。②', 1021],
    ['web_ev_1038_20431.ExportJson', 'ぶきっちょでもいいですから', 1022],
    ['web_ev_1042_16071.ExportJson', 'Whereabouts of the feather', 1023],
    ['web_ev_1045_15024.ExportJson', 'アリナが街にやってくる①', 1024],
    ['web_ev_1045_21334.ExportJson', 'アリナが街にやってくる②', 1025],
    ['web_ev_1046_17151.ExportJson', 'みたまと美味しい新年会', 1026],
    ['web_ev_1049_23011.ExportJson', '始まりと永遠と', 1027],
    ['web_ev_1051_31011.ExportJson', 'MADOGATARi展コラボ', 1028],
    ['web_ev_1056_31021.ExportJson', '神浜レアリティースター①', 1029],
    ['web_cp_1058_01.ExportJson', '神浜レアリティースター②', 1030],
    ['web_ev_1057_21141.ExportJson', '巣立ちは空を見上げて', 1031],
    ['web_ev_1062_21481.ExportJson', '沙優希ステップアップ仕る！①', 1032],
    ['web_ev_1062_21101.ExportJson', '沙優希ステップアップ仕る！②', 1033],
    ['web_ev_1064_20255.ExportJson', 'うたかたの夏夜', 1034],
    ['web_ev_1065_20121.ExportJson', '常夜の国の叛乱者', 1035],
    ['web_ev_1066_31041.ExportJson', 'ココイチ コラボ', 1036],
    ['web_ev_1067_20481.ExportJson', 'サマトレ！～火に消えた夏の宝～①', 1037],
    ['web_ev_1067_20501.ExportJson', 'サマトレ！～火に消えた夏の宝～②', 1038],
    ['web_ev_1068_50011.ExportJson', '深碧の巫①', 1039],
    ['web_ev_1068_50051.ExportJson', '深碧の巫②', 1040],
    ['web_ev_1069_21421.ExportJson', '新たな息吹より①', 1041],
    ['web_ev_1069_14028.ExportJson', '新たな息吹より②', 1042],
    ['web_ev_1069_18054.ExportJson', '浅き夢の暁①', 1043],
    ['web_ev_1069_21351.ExportJson', '浅き夢の暁②', 1044],
    ['web_ev_1069_15026.ExportJson', '浅き夢の暁③', 1045],
    ['web_ev_1074_20521.ExportJson', 'Crimson Resolve', 1046],
    ['web_ev_1075_21511.ExportJson', 'Rumors in Disguise', 1047],
    ['web_ev_1078_21541.ExportJson', '忘却の輪舞曲は久遠に睡る①', 1048],
    ['web_ev_1078_21532.ExportJson', '忘却の輪舞曲は久遠に睡る②', 1049],
    ['web_ev_1080_13016.ExportJson', '聖夜に刻む１ページ①', 1050],
    ['web_ev_1080_20531.ExportJson', '聖夜に刻む１ページ②', 1051],
    ['web_ev_1082_13017.ExportJson', '明けまして初まつり！', 1052],
    ['web_ev_1085_21131.ExportJson', 'オマエにずっと手を振る', 1053],
    ['web_ev_1086_21144.ExportJson', 'ウォーミングバレンタイン', 1054],
    ['web_ev_1087_46215.ExportJson', '鏡の国のショコラティエ Part1', 1055],
    ['web_ev_1088_46403.ExportJson', '鏡の国のショコラティエ Part2', 1056],
    ['web_ev_1092_19092.ExportJson', '桜の轍', 1057],
    ['web_ev_1093_31052.ExportJson', 'アイドル事務所', 1058],
    ['web_ev_1093_31051.ExportJson', '神フェス', 1059],
    ['web_ev_1097_21651.ExportJson', 'ぼくそし!!', 1060],
    ['web_ev_1099_12074.ExportJson', 'トリック☆トラブル☆学園祭', 1061],
    ['web_ev_1102_20103.ExportJson', '伝説の終わり、光の果て', 1062],
    ['web_ev_1106_20561.ExportJson', 'アンノウン・ストーリー①', 1063],
    ['web_ev_1106_20601.ExportJson', 'アンノウン・ストーリー②', 1064],
    ['web_ev_1107_20611.ExportJson', 'ウワサアクアリウムへようこそ', 1065],
    ['web_ev_1108_21145.ExportJson', '全神祭で遊ぼう！①', 1066],
    ['web_ev_1108_13034.ExportJson', '全神祭で遊ぼう！②', 1067],
    ['web_ev_1108_21691.ExportJson', 'みかづき荘・外観', 1068],
    ['web_ev_1111_13161.ExportJson', 'ガールズ・イン・ザ・フッド①', 1069],
    ['web_ev_1111_13162.ExportJson', 'ガールズ・イン・ザ・フッド②', 1070],
    ['web_ev_1114_21711.ExportJson', '彼方に届いて希望の一編', 1071],
    ['web_ev_1115_20631.ExportJson', '祈りと弔いのハロウィン城', 1072],
    ['web_ev_1119_20641.ExportJson', 'Angels on the Road', 1073],
    ['web_ev_1120_18111.ExportJson', 'Christmas String', 1074],
    ['web_ev_1123_21751.ExportJson', 'Memorable Flower', 1075],
    ['web_ev_1125_20661.ExportJson', 'Bittersweet AI Memory', 1076],
    ['web_ev_1126_20671.ExportJson', 'JPホラーはどこデスカ!?', 1077],
    ['web_ev_1129_19311.ExportJson', 'ディペンデンスブルー', 1078],
    ['web_ev_1130_31082.ExportJson', '神浜アルマゲドン①', 1079],
    ['web_ev_1130_31081.ExportJson', '神浜アルマゲドン②', 1080],
    ['web_cp_20171.ExportJson', 'マミの部屋(10周年記念)', 1081],
    ['web_cp_20191.ExportJson', '見滝原中学校 屋上(10周年記念)', 1082],
    ['web_cp_20201.ExportJson', '見滝原中学校 教室(10周年記念)', 1083],
    ['web_cp_20211.ExportJson', '見滝原中学校 校舎(10周年記念)', 1084],
    ['web_cp_23051.ExportJson', '見滝原市 通学路(10周年記念)', 1085],
    ['web_ev_1132_18095.ExportJson', 'はじまりは夢を重ねて', 1086],
    ['web_ev_1134_31092.ExportJson', '仮面生徒会の逆襲', 1087],
    ['web_ev_1135_13113.ExportJson', '鏡が映すほんとうの私', 1088],
    ['web_ev_1137_12111.ExportJson', '梶の葉伝説物語', 1089],
    ['web_ev_1139_20682.ExportJson', 'なだのよびごえ', 1090],
    ['web_ev_1140_18121.ExportJson', 'ナハトメルヒェン', 1091],
    ['web_ev_1141_16133.ExportJson', 'お願い結菜さん', 1092],
    ['web_ev_1142_20692.ExportJson', '時を越えた大宴会', 1093],
    ['web_cp_20701.ExportJson', 'ゆらねむパジャマパーティー', 1094],
    ['web_ev_1144_19272.ExportJson', 'Only Dreamers①', 1095],
    ['web_ev_1144_20711.ExportJson', 'Only Dreamers②', 1096],
    ['web_ev_1147_31101.ExportJson', 'The Cuddly Despairs', 1097],
    ['web_ev_1148_20702.ExportJson', 'ドリームハロウィンフェスタ', 1098],
    ['web_cp_21741.ExportJson', '正直になりたい神楽燦', 1099],
    ['web_ev_1150_21821.ExportJson', '遊狩ミユリの現在修行中！', 1100],
    ['web_ev_1153_21086.ExportJson', '雪解けのベファーナ', 1101],
    ['web_ev_1154_50083.ExportJson', '時女拾遺物語', 1102],
    ['web_ev_1156_53013.ExportJson', '灰色革命', 1103],
    ['web_ev_1157_23101.ExportJson', 'Homecoming', 1104],
    ['web_ev_1159_31121.ExportJson', '想いを継ぐものたち', 1105],
    ['web_ev_1160_21814.ExportJson', "Little Bird's Star", 1106],
    ['web_ev_1161_31151.ExportJson', '神浜スパアドベンチャー', 1107],
    ['web_ev_1165_31131.ExportJson', 'My Only Salvation', 1108],
    ['web_ev_1167_21461.ExportJson', '恋は△ 愛は●', 1109],
    ['web_ev_1164_21012.ExportJson', 'うららとナイショと送別会', 1110],
    ['web_ev_1170_20831.ExportJson', '七色夏模様', 1111],
    ['web_ev_1171_20841.ExportJson', '星屑のミラージュ', 1112],
    ['web_ev_1172_11131.ExportJson', 'むすんでひらいて座談会', 1113],
    ['web_ev_1173_21184.ExportJson', 'サヨナラ・ストレージ', 1114],
    ['web_ev_1174_31161.ExportJson', 'Magia Day 2022', 1115],
    ['web_ev_1176_21892.ExportJson', '闇色ハロウィンは恋の色!?', 1116],
    ['web_ev_1179_21205.ExportJson', 'Winter Recollection 古の物語', 1117],
    ['web_ev_1180_20851.ExportJson', 'Winter Recollection 幻の物語', 1118],
    ['web_ev_1183_60031.ExportJson', '神浜の戦神子編', 1119],
    ['web_ev_1184_14124.ExportJson', 'バレンタインメッセージ', 1120],
    ['web_ev_1186_61011.ExportJson', 'アレクサンドリアの蜃気楼編', 1121],
    ['web_ev_1189_31171.ExportJson', '神浜MVD 環いろはの事件簿', 1122],
    ['web_ev_1139_20311.ExportJson', 'かごめの百怪波瀾', 1129],
    ['web_ev_1060_21172.ExportJson', '「普通」でありたい伊並満', 1131],
    ['bg_map_11011.ExportJson', '新西区 全景(昼)', 1997],
    ['bg_map_11012.ExportJson', '新西区 全景(夕)', 1998],
    ['bg_map_11013.ExportJson', '新西区 全景(夜)', 1999],
];

// Friendly labels for extra menu, campaign, raid, patrol, and hideout web backgrounds.
const EXTRA_WEB_LABELS = {
    'web_0002.jpg': ['Gacha Top (Arc 1)', 'Menu Background'],
    'web_0010.jpg': ['Archive - Doppel & Enemy Collection', 'Menu Background'],
    'web_0013.ExportJson': ['Team Formation', 'Menu Background'],
    'web_0014.ExportJson': ['Mirrors / Arena', 'Menu Background'],
    'web_0015.ExportJson': ['Archive & Story Collection', 'Menu Background'],
    'web_0016.ExportJson': ["Mitama's Shop", 'Menu Background'],
    'web_0017.ExportJson': ['Gacha Results', 'Menu Background'],
    'web_0018.ExportJson': ['Missions', 'Menu Background'],
    'web_0019.jpg': ['Another Story / Event Quests', 'Menu Background'],
    'web_0020.ExportJson': ['Memoria Management', 'Menu Background'],
    'web_0021.jpg': ['Magical Girl Stories / Sub Quests', 'Menu Background'],
    'web_0022.ExportJson': ['Kamihama Twilight Menu (web_0022)', 'Menu Background'],
    'web_0023.ExportJson': ['Kamihama Night Menu (web_0023)', 'Menu Background'],
    'web_0024.ExportJson': ['Gacha Top (Arc 2)', 'Menu Background'],
    'web_0025.ExportJson': ['Quest Results', 'Menu Background'],
    'web_black.jpg': ['Black Backdrop', 'Menu Transition'],
    'web_11063.ExportJson': ["Mitama's Shop (Event Variant 1)", 'Shop Background'],
    'web_11064.ExportJson': ["Mitama's Shop (Event Variant 2)", 'Shop Background'],
    'web_31083.ExportJson': ['Kamihamageddon (Sumo Campaign)', 'Campaign Background'],
    'web_PuellaHistoria_19093_01.ExportJson': ['Puella Historia (Quest Select)', 'Eternal Sakura Tree'],
    'web_PuellaHistoria_19094_01.ExportJson': ['Puella Historia (Boss Raid)', 'Eternal Sakura Tree'],
    'web_accomplish_page_01.ExportJson': ['Howa-Howa Formation', 'Accomplish Event'],
    'web_accomplish_top_01.ExportJson': ['Howa-Howa Event Top', 'Accomplish Event'],
    'web_cp_1035_01.ExportJson': ['Campaign Top (1035)', 'Campaign Background'],
    'web_cp_1044_01.ExportJson': ['Campaign Top (1044)', 'Campaign Background'],
    'web_cp_1052_01.ExportJson': ['Madogatari Campaign', 'Campaign Background'],
    'web_cp_1078_01.ExportJson': ['Campaign Gacha Lineup (1078)', 'Campaign Background'],
    'web_cp_1094_01.ExportJson': ["New Year's Omikuji Campaign (1094)", 'Daitou Shrine'],
    'web_cp_1112_01.ExportJson': ['Campaign Top (1112)', 'Campaign Background'],
    'web_cp_1180_01.ExportJson': ["New Year's Omikuji Campaign (1180)", 'Daitou Shrine'],
    'web_cp_1277_01.ExportJson': ["New Year's Omikuji Campaign (1277)", 'Daitou Shrine'],
    'web_cp_1349_01.ExportJson': ["New Year's Omikuji Campaign (1349)", 'Daitou Shrine'],
    'web_extermination_map_01.ExportJson': ['Extermination Battle Map', 'Regular Event'],
    'web_extermination_top_01.ExportJson': ['Extermination Battle Top (1)', 'Regular Event'],
    'web_extermination_top_02.ExportJson': ['Extermination Battle Top (2)', 'Regular Event'],
    'web_patrol_page_01.ExportJson': ['Patrol Mission Select (1)', 'Patrol'],
    'web_patrol_page_02.ExportJson': ['Patrol Mission Select (2)', 'Patrol'],
    'web_patrol_page_03.ExportJson': ['Patrol Mission Select (3)', 'Patrol'],
    'web_patrol_top_01.ExportJson': ['Patrol Top (1)', 'Patrol'],
    'web_patrol_top_02.ExportJson': ['Patrol Top (2)', 'Patrol'],
    'web_patrol_top_03.ExportJson': ['Patrol Top (3)', 'Patrol'],
    'web_sub_event_top_01.ExportJson': ['Kimochi Battle Top (1)', 'Regular Event'],
    'web_sub_event_top_02.ExportJson': ['Kimochi Battle Top (2)', 'Regular Event'],
    'web_sub_event_top_03.ExportJson': ['Kimochi Battle Top (3)', 'Regular Event'],
    'web_summermission2021.ExportJson': ['Summer Mission 2021', 'Campaign Background'],
    'web_secondPartLastBattle_21188.ExportJson': ['Arc 2 Final Battle (Mirrors)', 'Story Boss Background'],
    'web_regular_battle_bg_11095.ExportJson': ['Construction Site (Sapphire Lips)', 'Group Battle BG'],
    'web_regular_battle_bg_140260.ExportJson': ['Chuo Main Intersection (Battle)', 'Group Battle BG'],
    'web_regular_battle_bg_15063.ExportJson': ['Memory Museum (Ruby Navel)', 'Group Battle BG'],
    'web_regular_battle_bg_17122.ExportJson': ['Abandoned Theme Park (Aquamarine Heels)', 'Group Battle BG'],
    'web_regular_battle_bg_19186.ExportJson': ['Hotel Fendt Hope (Turquoise Ears)', 'Group Battle BG'],
    'web_regular_battle_bg_19324.ExportJson': ['Hokuyo Lakeside Street (Opal Neck)', 'Group Battle BG'],
    'web_regular_hideout_bg_13133.ExportJson': ['Tokime Clan Hideout (Suitoku Temple)', 'Faction Hideout'],
    'web_regular_hideout_bg_16133.ExportJson': ['Promised Blood Hideout (Warehouse)', 'Faction Hideout'],
    'web_regular_hideout_bg_17201.ExportJson': ['Neo Magius Hideout (Auditorium)', 'Faction Hideout'],
    'web_regular_hideout_bg_18081.ExportJson': ['Folklore of Zero Hideout (Aquarium)', 'Faction Hideout'],
    'web_regular_hideout_bg_21203.ExportJson': ['Kamihama Magia Union Hideout (Mikazuki Villa)', 'Faction Hideout'],
};

function normalizeJp(str) {
    return String(str || '')
        .normalize('NFKC')
        .replace(/[\s\u3000]+/g, '')
        .replace(/[！!]+/g, '!')
        .replace(/[？?]+/g, '?')
        .replace(/[・･]/g, '')
        .replace(/コラボ|コラブ/g, 'コラボ')
        .replace(/行こう|行こにう/g, '行こう')
        .replace(/駆け出し|駆けだし/g, '駆け出し')
        .replace(/沙優希|優希/g, '優希')
        .replace(/JPホラー|JPラー/g, 'JPホラー')
        .toLowerCase();
}

function loadTumblrMap() {
    const map = new Map(Object.entries(FALLBACK_TUMBLR_ENTRIES));
    const tumblrFile = path.join(REPO, '.task', 'tumblr_bg_index.txt');
    if (fs.existsSync(tumblrFile)) {
        const lines = fs.readFileSync(tumblrFile, 'utf8').split(/\r?\n/);
        for (const line of lines) {
            const m = line.match(/^(\d{4,5})\s*-\s*(.+)$/);
            if (!m) continue;
            let val = m[2].trim();
            if (!val || val.startsWith('—') || val === '-') continue;
            val = val.replace(/\s*\(\*only in.*?\)\s*$/i, '').trim();
            if (!map.has(m[1])) map.set(m[1], val);
        }
    }
    return map;
}

function loadFandomMaps() {
    const byNormalizedJp = new Map();
    const register = (en, jp, na) => {
        if (!jp || jp === 'No Data') return;
        const entry = {
            en: en.trim(),
            jp: jp.trim(),
            na: na && na.trim() !== '-' ? na.trim() : null,
        };
        byNormalizedJp.set(normalizeJp(jp), entry);
    };

    for (const [en, jp, na] of FALLBACK_FANDOM_BACKGROUNDS) {
        register(en, jp, na);
    }

    const fandomFile = path.join(REPO, '.task', 'fandom_backgrounds.txt');
    if (fs.existsSync(fandomFile)) {
        const lines = fs.readFileSync(fandomFile, 'utf8').split(/\r?\n/);
        for (const line of lines) {
            const m = line.match(/^Name:\s*(.+?)\s*\|\s*JP Name:\s*(.+?)\s*\|\s*NA Name:\s*(.+?)$/);
            if (m) register(m[1], m[2], m[3]);
        }
    }

    return byNormalizedJp;
}

function loadUserBackgroundItems() {
    const map = new Map();
    for (const [file, shortDescription, sortKey] of FALLBACK_USER_BACKGROUNDS) {
        map.set(file.toLowerCase(), { file, shortDescription, sortKey });
    }

    const ludPath = path.join(REPO, 'temp', 'localUserData.json');
    if (fs.existsSync(ludPath)) {
        const data = JSON.parse(fs.readFileSync(ludPath, 'utf8'));
        for (const u of (data.userItemList || [])) {
            if (u.item?.itemType !== 'BACKGROUND' || !u.item.backgroundImage) continue;
            const file = u.item.backgroundImage;
            map.set(file.toLowerCase(), {
                file,
                shortDescription: u.item.shortDescription || u.item.name || file,
                sortKey: u.item.sortKey ?? 9999,
            });
        }
    }
    return map;
}

function resolveStoryLocationBase(prefix4, fullCode, tumblrMap) {
    if (EXEDRA_PREFIX_OVERRIDES[fullCode]) {
        return { base: EXEDRA_PREFIX_OVERRIDES[fullCode], groupPrefix: fullCode, isExact5: true };
    }
    if (tumblrMap.has(fullCode)) {
        return { base: tumblrMap.get(fullCode), groupPrefix: fullCode, isExact5: true };
    }
    if (EXEDRA_PREFIX_OVERRIDES[prefix4]) {
        return { base: EXEDRA_PREFIX_OVERRIDES[prefix4], groupPrefix: prefix4, isExact5: false };
    }
    if (tumblrMap.has(prefix4)) {
        return { base: tumblrMap.get(prefix4), groupPrefix: prefix4, isExact5: false };
    }

    // Time-stop 48xxx / 494xx -> 46xxx Labyrinth BG
    if (fullCode.startsWith('48') || fullCode.startsWith('494')) {
        const mapped5 = '46' + fullCode.slice(2);
        const mapped4 = '46' + prefix4.slice(2);
        const base = EXEDRA_PREFIX_OVERRIDES[mapped5]
            || tumblrMap.get(mapped5)
            || EXEDRA_PREFIX_OVERRIDES[mapped4]
            || tumblrMap.get(mapped4);
        if (base) {
            return { base: `${base} (Time-Stop)`, groupPrefix: mapped5, isExact5: true };
        }
    }

    // 9xxxx static battle BG conversions
    if (fullCode.startsWith('9')) {
        let mapped5 = null;
        let mapped4 = null;
        if (prefix4.startsWith('90')) mapped4 = '20' + prefix4.slice(2);
        else if (/^9[1-5]/.test(prefix4)) mapped4 = '1' + prefix4.slice(1);
        else if (/^9[6-7]/.test(prefix4)) {
            mapped5 = '4' + fullCode.slice(1);
            mapped4 = '4' + prefix4.slice(1);
        }
        const base = (mapped5 && (EXEDRA_PREFIX_OVERRIDES[mapped5] || tumblrMap.get(mapped5)))
            || (mapped4 && (EXEDRA_PREFIX_OVERRIDES[mapped4] || tumblrMap.get(mapped4)));
        if (base) {
            return {
                base: `${base} (Battle BG)`,
                groupPrefix: mapped5 || mapped4,
                isExact5: Boolean(mapped5),
            };
        }
    }

    return { base: `Story Background ${fullCode}`, groupPrefix: prefix4, isExact5: false };
}

function getStoryVariantLabel(prefix4, digit, variantCount, isExact5) {
    if (isExact5) return '';
    if (NON_TIME_PREFIXES.has(prefix4)) return `Variant ${digit}`;
    if (variantCount <= 1 && digit === '1') return '';
    if (digit === '1') return 'Noon';
    if (digit === '2') return 'Evening';
    if (digit === '3') return 'Night';
    return `Variant ${digit}`;
}

function buildStoryEntries(storyFiles, tumblrMap) {
    const prefixCounts = new Map();
    for (const file of storyFiles) {
        const m = file.match(/^bg_adv_(\d{4})(\d+)\.jpg$/);
        if (m) prefixCounts.set(m[1], (prefixCounts.get(m[1]) || 0) + 1);
    }

    const specialNames = {
        'bg_adv_doppel.jpg': ['Doppel Transformation Backdrop', 'special'],
        'bg_adv_narration.jpg': ['Narration Backdrop', 'special'],
        'bg_adv_red.jpg': ['Red Dramatic Backdrop', 'special'],
    };

    return storyFiles.map((file) => {
        const id = 'story:' + file.replace(/\.jpg$/i, '');
        if (specialNames[file]) {
            const [label, groupPrefix] = specialNames[file];
            return { id, file, label, groupPrefix, variant: '' };
        }

        const m = file.match(/^bg_adv_(\d{4})(\d+)\.jpg$/);
        if (!m) {
            return { id, file, label: file.replace(/\.jpg$/i, ''), groupPrefix: 'other', variant: '' };
        }

        const prefix4 = m[1];
        const digit = m[2];
        const fullCode = prefix4 + digit;
        const { base, groupPrefix, isExact5 } = resolveStoryLocationBase(prefix4, fullCode, tumblrMap);
        const variant = getStoryVariantLabel(prefix4, digit, prefixCounts.get(prefix4) || 1, isExact5);
        const label = variant ? `${base} (${variant})` : base;

        return { id, file, label, groupPrefix, variant };
    });
}

function parsePlistFramesAndSize(xml) {
    const frames = {};
    const framesMatch = xml.match(/<key>frames<\/key>\s*<dict>([\s\S]*?)<\/dict>\s*<key>metadata<\/key>/);
    if (framesMatch) {
        const body = framesMatch[1];
        const re = /<key>([^<]+)<\/key>\s*<dict>([\s\S]*?)<\/dict>/g;
        let m;
        while ((m = re.exec(body)) !== null) {
            const frameName = m[1];
            const d = m[2];
            const getInt = (key) => {
                const km = d.match(new RegExp(`<key>${key}</key>\\s*<integer>(-?\\d+)</integer>`));
                return km ? parseInt(km[1], 10) : undefined;
            };
            let x = getInt('x');
            let y = getInt('y');
            let w = getInt('width');
            let h = getInt('height');
            const rotated = /<key>rotated<\/key>\s*<true\s*\/>/.test(d);
            if (x === undefined) {
                const fm = d.match(/<key>frame<\/key>\s*<string>\{\{(\d+),\s*(\d+)\},\s*\{(\d+),\s*(\d+)\}\}<\/string>/);
                if (fm) {
                    x = parseInt(fm[1], 10);
                    y = parseInt(fm[2], 10);
                    w = parseInt(fm[3], 10);
                    h = parseInt(fm[4], 10);
                }
            }
            if (x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
                frames[frameName] = { x, y, w, h, rotated };
            }
        }
    }

    const metaMatch = xml.match(/<key>metadata<\/key>\s*<dict>([\s\S]*?)<\/dict>/);
    let textureFileName = null;
    let size = null;
    if (metaMatch) {
        const md = metaMatch[1];
        const tm = md.match(/<key>textureFileName<\/key>\s*<string>([^<]+)<\/string>/);
        if (tm) textureFileName = tm[1];
        const sm = md.match(/<key>size<\/key>\s*<string>\{(\d+),\s*(\d+)\}<\/string>/);
        if (sm) size = { w: parseInt(sm[1], 10), h: parseInt(sm[2], 10) };
    }

    return { frames, textureFileName, size };
}

function readPngDimensions(pngPath) {
    const buf = fs.readFileSync(pngPath);
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) {
        throw new Error(`Invalid PNG header: ${pngPath}`);
    }
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function extractPlistCropThumb(dirPath, exportJsonFile) {
    const jsonPath = path.join(dirPath, exportJsonFile);
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Identify any background sprite bones rotated +-90deg in the ExportJson armature.
    const rotatedDisplays = new Set();
    for (const arm of (json.armature_data || [])) {
        for (const bone of (arm.bone_data || [])) {
            const kX = Math.abs(bone.kX || 0);
            if (Math.abs(kX - Math.PI / 2) < 0.05) {
                for (const disp of (bone.display_data || [])) {
                    if (disp.name) rotatedDisplays.add(disp.name);
                }
            }
        }
    }

    const candidates = [];
    for (const cfg of (json.config_file_path || [])) {
        if (!cfg.endsWith('.plist')) continue;
        const plistPath = path.join(dirPath, cfg);
        const xml = fs.readFileSync(plistPath, 'utf8');
        if (!xml.includes('<key>frames</key>')) continue;

        const parsed = parsePlistFramesAndSize(xml);
        const pngFile = parsed.textureFileName || cfg.replace(/\.plist$/i, '.png');
        const pngSize = parsed.size || readPngDimensions(path.join(dirPath, pngFile));

        for (const [frameName, rect] of Object.entries(parsed.frames)) {
            const isRotated = rect.rotated || (rect.w === 768 && rect.h === 1024 && rotatedDisplays.has(frameName));
            candidates.push({
                file: pngFile,
                x: rect.x,
                y: rect.y,
                w: rect.w,
                h: rect.h,
                sheetW: pngSize.w,
                sheetH: pngSize.h,
                rot: isRotated,
                area: rect.w * rect.h,
            });
        }
    }

    candidates.sort((a, b) => b.area - a.area);
    const best = candidates[0];
    if (!best) {
        throw new Error(`No plist sprite frames found for ${exportJsonFile}`);
    }
    return {
        type: 'plistCrop',
        file: best.file,
        x: best.x,
        y: best.y,
        w: best.w,
        h: best.h,
        sheetW: best.sheetW,
        sheetH: best.sheetH,
        rot: best.rot,
    };
}

function buildHomeLabel(file, dir, userItems, fandomByJp, storyByFile, tumblrMap) {
    if (file === 'web_0011.ExportJson') {
        return {
            label: 'Blue Skies (Default)',
            subLabel: 'Default Home Background',
            category: 'home',
            sortOrder: 0,
        };
    }

    const userItem = userItems.get(file.toLowerCase());
    if (userItem) {
        const fandom = fandomByJp.get(normalizeJp(userItem.shortDescription));
        const label = fandom ? fandom.en : userItem.shortDescription;
        const subParts = [];
        if (fandom?.na && fandom.na !== label) subParts.push(`NA: ${fandom.na}`);
        subParts.push(file.replace(/\.(exportjson|jpg)$/i, ''));
        return {
            label,
            subLabel: subParts.join(' • '),
            category: 'home',
            sortOrder: userItem.sortKey ?? 5000,
        };
    }

    if (EXTRA_WEB_LABELS[file]) {
        const [label, context] = EXTRA_WEB_LABELS[file];
        return {
            label,
            subLabel: `${context} • ${file.replace(/\.(exportjson|jpg)$/i, '')}`,
            category: 'extra',
            sortOrder: 10000,
        };
    }

    // Fallback for additional web_ev_<evId>_<bg5> files using event or story location names.
    const evMatch = file.match(/^web_ev_(\d{4})_(\d{5})\.exportjson$/i);
    if (evMatch) {
        const [, evId, bg5] = evMatch;
        let eventName = null;
        for (const item of userItems.values()) {
            if (item.file.toLowerCase().startsWith(`web_ev_${evId}_`)) {
                const fandom = fandomByJp.get(normalizeJp(item.shortDescription));
                eventName = (fandom ? fandom.en : item.shortDescription).replace(/\s*\(\d+\)\s*$/, '');
                break;
            }
        }
        const storyEntry = storyByFile.get(`bg_adv_${bg5}.jpg`);
        const locName = storyEntry
            ? storyEntry.label
            : resolveStoryLocationBase(bg5.slice(0, 4), bg5, tumblrMap).base;
        const label = eventName ? `${eventName} (${locName})` : `Event ${evId} — ${locName}`;
        return {
            label,
            subLabel: `Event Background • ${file.replace(/\.exportjson$/i, '')}`,
            category: 'extra',
            sortOrder: 11000,
        };
    }

    return {
        label: file.replace(/\.(exportjson|jpg)$/i, ''),
        subLabel: dir === 'quest_top' ? 'Quest Map Background' : 'Web Background',
        category: 'extra',
        sortOrder: 12000,
    };
}

function buildHomeEntries(webFiles, storyFiles, tumblrMap, fandomByJp, userItems) {
    const storySet = new Set(storyFiles);
    const storyEntries = buildStoryEntries(storyFiles, tumblrMap);
    const storyByFile = new Map(storyEntries.map((s) => [s.file, s]));

    const rawList = [
        ...webFiles
            .filter((f) => (/\.exportjson$|\.jpg$/i.test(f)) && !BROKEN_WEB_EXPORTS.has(f))
            .map((file) => ({ dir: 'web', file })),
        ...QUEST_TOP_HOME_FILES.map((file) => ({ dir: 'quest_top', file })),
    ];

    const items = rawList.map(({ dir, file }) => {
        const kind = /\.jpg$/i.test(file) ? 'jpg' : 'cocos';
        const id = 'home:' + file.replace(/\.(exportjson|jpg)$/i, '');
        const meta = buildHomeLabel(file, dir, userItems, fandomByJp, storyByFile, tumblrMap);

        let thumb;
        if (kind === 'jpg') {
            thumb = { type: 'webJpg', file };
        } else {
            const match5 = file.match(/(\d{5})\.exportjson$/i);
            const matchedStory = match5 ? `bg_adv_${match5[1]}.jpg` : null;
            if (matchedStory && storySet.has(matchedStory)) {
                thumb = { type: 'story', file: matchedStory };
            } else {
                thumb = extractPlistCropThumb(path.join(BG_ROOT, dir), file);
            }
        }

        return {
            entry: {
                id,
                file,
                dir,
                kind,
                label: meta.label,
                subLabel: meta.subLabel,
                category: meta.category,
                thumb,
            },
            sortOrder: meta.sortOrder,
        };
    });

    items.sort((a, b) => {
        if (a.entry.category !== b.entry.category) {
            return a.entry.category === 'home' ? -1 : 1;
        }
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.entry.file.localeCompare(b.entry.file);
    });

    return items.map((x) => x.entry);
}

function generateCatalog() {
    const storyDir = path.join(BG_ROOT, 'story');
    const webDir = path.join(BG_ROOT, 'web');
    if (!fs.existsSync(storyDir) || !fs.existsSync(webDir)) {
        throw new Error(`Local ma-re-data backgrounds not found at ${BG_ROOT}`);
    }

    const storyFiles = fs.readdirSync(storyDir).filter((f) => /\.jpg$/i.test(f)).sort();
    const webFiles = fs.readdirSync(webDir).sort();

    const tumblrMap = loadTumblrMap();
    const fandomByJp = loadFandomMaps();
    const userItems = loadUserBackgroundItems();

    const story = buildStoryEntries(storyFiles, tumblrMap);
    const home = buildHomeEntries(webFiles, storyFiles, tumblrMap, fandomByJp, userItems);

    const catalog = {
        solid: SOLID_BACKGROUNDS,
        story,
        home,
    };

    fs.mkdirSync(path.dirname(CATALOG_PATH), { recursive: true });
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

    const thumbCounts = home.reduce((acc, item) => {
        acc[item.thumb.type] = (acc[item.thumb.type] || 0) + 1;
        return acc;
    }, {});
    console.log(
        `Generated ${path.relative(REPO, CATALOG_PATH)}: ` +
        `solid=${catalog.solid.length}, story=${catalog.story.length}, home=${catalog.home.length} ` +
        `(thumbs: ${JSON.stringify(thumbCounts)})`
    );
}

function verifyCatalog() {
    if (!fs.existsSync(CATALOG_PATH)) {
        throw new Error(`Missing catalog file: ${CATALOG_PATH}`);
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    const errors = [];

    if (!Array.isArray(catalog.solid) || catalog.solid.length < 4) {
        errors.push('solid must be an array with at least 4 entries');
    } else {
        const solidIds = new Set();
        for (const s of catalog.solid) {
            if (!s.id || !s.label || !s.hex || typeof s.color !== 'number') {
                errors.push(`Invalid solid entry: ${JSON.stringify(s)}`);
            }
            if (solidIds.has(s.id)) errors.push(`Duplicate solid id: ${s.id}`);
            solidIds.add(s.id);
        }
        if (!solidIds.has('solid:gray')) errors.push('Missing solid:gray entry');
        if (!solidIds.has('solid:green')) errors.push('Missing solid:green entry');
    }

    if (!Array.isArray(catalog.story) || catalog.story.length === 0) {
        errors.push('story must be a non-empty array');
    } else {
        const storyIds = new Set();
        const storyFiles = new Set();
        let prevFile = '';
        for (const s of catalog.story) {
            if (!s.id || !s.file || !s.label || typeof s.groupPrefix !== 'string' || typeof s.variant !== 'string') {
                errors.push(`Invalid story entry: ${JSON.stringify(s)}`);
                break;
            }
            if (storyIds.has(s.id)) errors.push(`Duplicate story id: ${s.id}`);
            if (storyFiles.has(s.file)) errors.push(`Duplicate story file: ${s.file}`);
            if (prevFile && s.file.localeCompare(prevFile) < 0) {
                errors.push(`story entries not sorted at ${s.file} after ${prevFile}`);
                break;
            }
            prevFile = s.file;
            storyIds.add(s.id);
            storyFiles.add(s.file);
        }
    }

    if (!Array.isArray(catalog.home) || catalog.home.length === 0) {
        errors.push('home must be a non-empty array');
    } else {
        const homeIds = new Set();
        const homeFiles = new Set();
        for (const h of catalog.home) {
            if (!h.id || !h.file || !['web', 'quest_top'].includes(h.dir) || !['cocos', 'jpg'].includes(h.kind)
                || !h.label || !['home', 'extra'].includes(h.category) || !h.thumb) {
                errors.push(`Invalid home entry: ${JSON.stringify(h)}`);
                break;
            }
            if (BROKEN_WEB_EXPORTS.has(h.file)) {
                errors.push(`Broken ExportJson must be excluded: ${h.file}`);
            }
            if (homeIds.has(h.id)) errors.push(`Duplicate home id: ${h.id}`);
            if (homeFiles.has(h.file)) errors.push(`Duplicate home file: ${h.file}`);
            homeIds.add(h.id);
            homeFiles.add(h.file);

            const t = h.thumb;
            if (!['story', 'webJpg', 'plistCrop'].includes(t.type) || !t.file) {
                errors.push(`Invalid thumb descriptor in ${h.id}: ${JSON.stringify(t)}`);
            } else if (t.type === 'plistCrop') {
                for (const key of ['x', 'y', 'w', 'h', 'sheetW', 'sheetH']) {
                    if (typeof t[key] !== 'number' || Number.isNaN(t[key])) {
                        errors.push(`Invalid plistCrop.${key} in ${h.id}`);
                    }
                }
                if (typeof t.rot !== 'boolean') {
                    errors.push(`Invalid plistCrop.rot in ${h.id}`);
                }
            }
        }
        if (!homeFiles.has('web_0011.ExportJson')) errors.push('Missing default home web_0011.ExportJson');
        for (const qt of QUEST_TOP_HOME_FILES) {
            if (!homeFiles.has(qt)) errors.push(`Missing quest_top home ${qt}`);
        }
    }

    // Cross-check local ma-re-data files when present on disk.
    const storyDir = path.join(BG_ROOT, 'story');
    const webDir = path.join(BG_ROOT, 'web');
    if (fs.existsSync(storyDir) && fs.existsSync(webDir)) {
        const diskStory = new Set(fs.readdirSync(storyDir).filter((f) => /\.jpg$/i.test(f)));
        if (catalog.story.length !== diskStory.size) {
            errors.push(`Story count mismatch: catalog=${catalog.story.length}, disk=${diskStory.size}`);
        }
        for (const s of catalog.story) {
            if (!diskStory.has(s.file)) errors.push(`Missing story file on disk: ${s.file}`);
        }
        for (const h of catalog.home) {
            const bgDir = path.join(BG_ROOT, h.dir);
            const exactFiles = new Set(fs.readdirSync(bgDir));
            if (!exactFiles.has(h.file)) errors.push(`Missing home file on disk (exact case): ${h.dir}/${h.file}`);
            if (h.thumb.type === 'story' && !diskStory.has(h.thumb.file)) {
                errors.push(`Missing story thumb on disk: ${h.thumb.file}`);
            } else if ((h.thumb.type === 'webJpg' || h.thumb.type === 'plistCrop')
                && !new Set(fs.readdirSync(webDir)).has(h.thumb.file)) {
                errors.push(`Missing web thumb on disk: ${h.thumb.file}`);
            }
            if (h.kind === 'cocos') {
                const j = JSON.parse(fs.readFileSync(path.join(bgDir, h.file), 'utf8'));
                for (const cfg of (j.config_file_path || [])) {
                    if (!exactFiles.has(cfg)) errors.push(`Missing ExportJson dep ${cfg} for ${h.file}`);
                    if (cfg.endsWith('.plist') && exactFiles.has(cfg)) {
                        const xml = fs.readFileSync(path.join(bgDir, cfg), 'utf8');
                        if (xml.includes('<key>frames</key>')) {
                            const parsed = parsePlistFramesAndSize(xml);
                            const png = parsed.textureFileName || cfg.replace(/\.plist$/i, '.png');
                            if (!exactFiles.has(png)) errors.push(`Missing plist png ${png} for ${h.file}`);
                        }
                    }
                }
            }
        }
    }

    if (errors.length > 0) {
        console.error('Catalog verification FAILED:');
        for (const err of errors.slice(0, 20)) console.error(' -', err);
        process.exit(1);
    }

    const bytes = fs.statSync(CATALOG_PATH).size;
    console.log(
        `Catalog verification PASSED: ` +
        `solid=${catalog.solid.length}, story=${catalog.story.length}, home=${catalog.home.length} ` +
        `(${(bytes / 1024).toFixed(1)} KB)`
    );
}

const isVerify = process.argv.includes('--verify');
if (isVerify) {
    verifyCatalog();
} else {
    generateCatalog();
}
