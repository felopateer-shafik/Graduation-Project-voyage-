-- ================================================
-- CLEAN SLATE — Remove duplicates by truncating
-- Run with: spring.sql.init.mode=always (once)
-- ================================================

-- Disable FK checks for truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Clear booking references first
DELETE FROM bookings WHERE flight_id IS NOT NULL OR hotel_id IS NOT NULL OR tour_id IS NOT NULL OR package_id IS NOT NULL;
DELETE FROM package_inclusions;
DELETE FROM day_plans;
DELETE FROM packages;
DELETE FROM wishlist_items;
DELETE FROM price_freezes;

TRUNCATE TABLE flights;
TRUNCATE TABLE hotels;
TRUNCATE TABLE tours;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================
-- FLIGHTS (20 unique flights, no duplicates)
-- ================================================
INSERT INTO flights (airline_name, flight_number, departure_city, departure_city_code, arrival_city, arrival_city_code, departure_time, arrival_time, duration, price, available_seats, stops, cabin_class, aircraft, image_url, amenities, refundable)
VALUES
-- Cairo → Dubai (3 flights)
('EgyptAir',          'MS-901',  'Cairo',    'CAI', 'Dubai',      'DXB', '2026-06-01 06:30:00', '2026-06-01 11:00:00', '3h 30m',  8500.00, 22, 0, 'Economy',     'Boeing 737-800',     'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800', 'Meals,Entertainment',      TRUE),
('Emirates',          'EK-924',  'Cairo',    'CAI', 'Dubai',      'DXB', '2026-06-02 14:00:00', '2026-06-02 18:45:00', '3h 45m', 15200.00, 12, 0, 'Business',    'Airbus A380',        'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800', 'WiFi,Meals,Lounge,Power',  TRUE),
('FlyDubai',          'FZ-610',  'Cairo',    'CAI', 'Dubai',      'DXB', '2026-06-03 22:00:00', '2026-06-04 02:30:00', '3h 30m',  6200.00, 35, 0, 'Economy',     'Boeing 737 MAX 8',   'https://images.unsplash.com/photo-1544016768-982d1554f0b9?w=800', 'Meals',                    FALSE),

-- Dubai → Cairo (2 flights)
('FlyDubai',          'FZ-611',  'Dubai',    'DXB', 'Cairo',      'CAI', '2026-06-05 08:00:00', '2026-06-05 10:15:00', '3h 15m',  5900.00, 28, 0, 'Economy',     'Boeing 737 MAX 8',   'https://images.unsplash.com/photo-1544016768-982d1554f0b9?w=800', 'Meals',                    FALSE),
('Emirates',          'EK-923',  'Dubai',    'DXB', 'Cairo',      'CAI', '2026-06-06 16:30:00', '2026-06-06 18:45:00', '3h 15m', 14800.00,  8, 0, 'Business',    'Boeing 777-300ER',   'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800', 'WiFi,Meals,Lounge,Spa',    TRUE),

-- Cairo → Istanbul (2 flights)
('Turkish Airlines',  'TK-701',  'Cairo',    'CAI', 'Istanbul',   'IST', '2026-06-07 09:00:00', '2026-06-07 12:30:00', '2h 30m',  7200.00, 18, 0, 'Economy',     'Airbus A321neo',     'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800', 'Meals,Entertainment',      TRUE),
('EgyptAir',          'MS-737',  'Cairo',    'CAI', 'Istanbul',   'IST', '2026-06-08 18:00:00', '2026-06-08 21:15:00', '2h 15m',  6800.00, 25, 0, 'Economy',     'Airbus A320',        'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800', 'Meals',                    FALSE),

-- Cairo → London (2 flights)
('EgyptAir',          'MS-779',  'Cairo',    'CAI', 'London',     'LHR', '2026-06-09 01:30:00', '2026-06-09 06:00:00', '5h 30m', 18500.00, 10, 0, 'Economy',     'Boeing 787-9',       'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800', 'WiFi,Meals,Entertainment', TRUE),
('British Airways',   'BA-154',  'Cairo',    'CAI', 'London',     'LHR', '2026-06-10 11:00:00', '2026-06-10 15:45:00', '5h 45m', 22000.00,  6, 0, 'Economy Plus','Airbus A350',        'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800', 'WiFi,Meals,Power',         TRUE),

-- Cairo → Paris (1 flight)
('Air France',        'AF-503',  'Cairo',    'CAI', 'Paris',      'CDG', '2026-06-11 02:00:00', '2026-06-11 06:30:00', '5h 30m', 19800.00, 14, 0, 'Economy',     'Airbus A350',        'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800', 'Meals,Entertainment,Power',TRUE),

-- Cairo → Hurghada (2 flights)
('EgyptAir',          'MS-321',  'Cairo',    'CAI', 'Hurghada',   'HRG', '2026-06-12 07:00:00', '2026-06-12 08:00:00', '1h 00m',  3200.00, 40, 0, 'Economy',     'Airbus A220',        'https://images.unsplash.com/photo-1583202512511-8ee5a0a0e0e6?w=800', 'None',                     FALSE),
('Air Cairo',         'SM-403',  'Cairo',    'CAI', 'Hurghada',   'HRG', '2026-06-13 19:30:00', '2026-06-13 20:30:00', '1h 00m',  2800.00, 30, 0, 'Economy',     'Airbus A320',        'https://images.unsplash.com/photo-1583202512511-8ee5a0a0e0e6?w=800', 'None',                     FALSE),

-- Cairo → Luxor (1 flight)
('Nile Air',          'NP-101',  'Cairo',    'CAI', 'Luxor',      'LXR', '2026-06-14 05:30:00', '2026-06-14 06:45:00', '1h 15m',  3500.00, 32, 0, 'Economy',     'Airbus A320',        'https://images.unsplash.com/photo-1583202512511-8ee5a0a0e0e6?w=800', 'Meals',                    FALSE),

-- Cairo → Sharm El Sheikh (1 flight)
('Air Cairo',         'SM-401',  'Cairo',    'CAI', 'Sharm El Sheikh','SSH','2026-06-15 10:00:00','2026-06-15 11:00:00','1h 00m',  2900.00, 38, 0, 'Economy',     'Airbus A320',        'https://images.unsplash.com/photo-1583202512511-8ee5a0a0e0e6?w=800', 'None',                     FALSE),

-- Istanbul → Cairo (1 flight)
('Turkish Airlines',  'TK-700',  'Istanbul', 'IST', 'Cairo',      'CAI', '2026-06-16 14:20:00', '2026-06-16 16:35:00', '2h 15m',  7500.00, 20, 0, 'Economy',     'Airbus A321',        'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800', 'Meals,Entertainment',      TRUE),

-- London → Dubai (1 flight)
('Emirates',          'EK-002',  'London',   'LHR', 'Dubai',      'DXB', '2026-06-17 21:00:00', '2026-06-18 07:00:00', '7h 00m', 35000.00,  5, 0, 'First Class', 'Airbus A380',        'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800', 'WiFi,Meals,Spa,Lounge',    TRUE),

-- Cairo → Rome (1 flight)
('EgyptAir',          'MS-791',  'Cairo',    'CAI', 'Rome',       'FCO', '2026-06-18 09:30:00', '2026-06-18 12:45:00', '3h 15m', 12500.00, 16, 0, 'Economy',     'Boeing 737-800',     'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800', 'Meals,Power',              FALSE),

-- Cairo → Jeddah (1 flight)
('Saudia',            'SV-316',  'Cairo',    'CAI', 'Jeddah',     'JED', '2026-06-19 04:00:00', '2026-06-19 06:30:00', '2h 30m',  5500.00, 30, 0, 'Economy',     'Airbus A330',        'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=800', 'Meals,WiFi',               TRUE),

-- Dubai → London (1 flight)
('Emirates',          'EK-003',  'Dubai',    'DXB', 'London',     'LHR', '2026-06-20 08:00:00', '2026-06-20 12:30:00', '7h 30m', 42000.00,  4, 0, 'Business',    'Boeing 777-300ER',   'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800', 'WiFi,Meals,Lounge,Power',  TRUE);

-- ================================================
-- HOTELS (15 unique hotels, no duplicates)
-- ================================================
INSERT INTO hotels (name, city, location, description, price_per_night, rating, review_count, image_url, images, available_rooms, room_type, amenities, latitude, longitude, stars, bed_type, room_size, `view`, discount, original_price, free_cancellation, loyalty_points, tags)
VALUES
-- Dubai (3 hotels)
('Burj Al Arab Jumeirah',    'Dubai',      'Umm Suqeim 3, Dubai, UAE',                  'The world''s most luxurious hotel, offering iconic sail-shaped architecture and private beach access.',  45000.00, 4.9, 1520, 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800', 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800',  2, 'Royal Suite',         'wifi,pool,spa,gym,butler,private_beach', 25.1412, 55.1852, 5, 'King',  '170 m²', 'Ocean',             0, NULL,     TRUE,  4500, 'Luxury,Exclusive'),
('The Address Boulevard',    'Dubai',      'Downtown Dubai, UAE',                        'Direct access to Dubai Mall and stunning views of the Burj Khalifa.',                                   6400.00, 4.6, 1240, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 12, 'Boulevard Room',      'wifi,pool,gym,restaurant,spa',            25.2010, 55.2743, 5, 'King',  '55 m²',  'Burj Khalifa',     20, 8000.00,  TRUE,   640, 'Downtown,Shopping'),
('Palazzo Versace Dubai',    'Dubai',      'Jaddaf Waterfront, Dubai, UAE',              'A fashion-inspired hotel where every detail is designed by the House of Versace.',                       9800.00, 4.7,  850, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',  8, 'Versace Suite',       'wifi,pool,spa,gym,butler',                25.2255, 55.3421, 5, 'King',  '95 m²',  'Creek View',        0, NULL,     TRUE,   980, 'Luxury,Fashion'),

-- Cairo (2 hotels)
('Kempinski Nile Hotel',     'Cairo',      'Garden City, Cairo, Egypt',                  'A boutique luxury hotel on the Nile offering butler service and panoramic river views.',                 5400.00, 4.6, 1450, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 15, 'Nile Suite',          'wifi,pool,spa,gym,butler',                30.0400, 31.2300, 5, 'King',  '52 m²',  'Nile River',       10, 6000.00,  TRUE,   540, 'Nile View,Boutique'),
('Marriott Mena House',      'Cairo',      'Pyramids Road, Giza, Egypt',                 'Historic hotel with unparalleled views of the Great Pyramids of Giza.',                                  4800.00, 4.8, 2100, 'https://images.unsplash.com/photo-1590490360182-c33d955bc37e?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d955bc37e?w=800', 20, 'Pyramid View Room',   'wifi,pool,spa,restaurant,garden',         29.9870, 31.1340, 5, 'King',  '48 m²',  'Pyramids',          0, NULL,     TRUE,   480, 'Historic,Pyramids'),

-- Istanbul (2 hotels)
('Four Seasons Bosphorus',   'Istanbul',   'Ciragan Cad, Besiktas, Istanbul, Turkey',    'An Ottoman palace on the Bosphorus offering world-class luxury and historical grandeur.',              12000.00, 4.9,  980, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',  6, 'Palace Suite',        'wifi,pool,spa,gym,concierge',             41.0420, 29.0130, 5, 'King',  '65 m²',  'Bosphorus',         0, NULL,     TRUE,  1200, 'Palace,Heritage'),
('Hotel Amira Istanbul',     'Istanbul',   'Sultanahmet, Fatih, Istanbul, Turkey',       'Charming boutique hotel steps from the Blue Mosque and Hagia Sophia.',                                   2800.00, 4.5, 1650, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 14, 'Deluxe Double',       'wifi,restaurant,bar,terrace',             41.0055, 28.9760, 4, 'Queen', '30 m²',  'Old City',         15, 3290.00,  TRUE,   280, 'Boutique,Historic'),

-- London (1 hotel)
('Shangri-La The Shard',     'London',     '31 St Thomas St, London, UK',                'Located in Western Europe''s tallest building, offering floor-to-ceiling views of London.',             15500.00, 4.9, 1240, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',  5, 'Premier Room',        'wifi,pool,gym,spa,bar,room_service',      51.5045, -0.0865, 5, 'King',  '58 m²',  'City Skyline',     10, 17200.00, TRUE,  1550, 'Views,Modern'),

-- Paris (1 hotel)
('The Ritz Paris',           'Paris',      'Place Vendome, Paris, France',               'Classic French elegance in the heart of Paris with legendary service since 1898.',                     18500.00, 4.8,  945, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',  4, 'Executive Room',      'wifi,spa,restaurant,bar,concierge',       48.8675,  2.3294, 5, 'Queen', '50 m²',  'Garden',           10, 20500.00, TRUE,  1850, 'Romantic,Heritage'),

-- Hurghada (1 hotel)
('Steigenberger Al Dau',     'Hurghada',   'Hurghada, Red Sea, Egypt',                   'Premium beachfront resort with private lagoon and world-class diving center.',                          3800.00, 4.7, 2300, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 30, 'Sea View Deluxe',     'wifi,pool,spa,gym,diving_center,beach',   27.1900, 33.8370, 5, 'King',  '42 m²',  'Red Sea',          12, 4320.00,  TRUE,   380, 'Resort,Beach'),

-- Luxor (2 hotels)
('Winter Palace Luxor',      'Luxor',      'Corniche El Nil St, Luxor, Egypt',           'A 19th-century palace on the banks of the Nile, surrounded by lush tropical gardens.',                 5200.00, 4.8,  760, 'https://images.unsplash.com/photo-1590490360182-c33d955bc37e?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d955bc37e?w=800',  7, 'Historical Suite',    'wifi,pool,restaurant,bar,garden',         25.6969, 32.6396, 5, 'King',  '60 m²',  'Nile & Gardens',   12, 5900.00,  TRUE,   520, 'Palace,Royal'),
('Hilton Luxor Resort',      'Luxor',      'New Karnak, Luxor, Egypt',                   'Relax at the edge of the Nile with one of the most beautiful infinity pools in Egypt.',                 3400.00, 4.7, 1890, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 25, 'Deluxe Nile View',    'wifi,pool,spa,gym,bar',                   25.7185, 32.6570, 5, 'Twin',  '48 m²',  'Nile',             10, 3770.00,  TRUE,   340, 'Resort,Infinity Pool'),

-- Sharm El Sheikh (1 hotel)
('Four Seasons Sharm',       'Sharm El Sheikh','South Sinai, Egypt',                     'An Arabian fairy tale on the shores of the Red Sea with world-class diving.',                          11500.00, 4.8, 1120, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 10, 'Beach Villa',         'wifi,pool,spa,gym,diving_center,beach',   27.9620, 34.3910, 5, 'King',  '120 m²', 'Red Sea',          15, 13500.00, TRUE,  1150, 'Resort,Beach'),

-- Alexandria (1 hotel)
('Steigenberger Cecil',      'Alexandria', 'Saad Zagloul Square, Alexandria, Egypt',     'A historic jewel in Alexandria, where royalty and celebrities have stayed for decades.',                 3800.00, 4.5, 2100, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 15, 'Sea View Classic',    'wifi,restaurant,bar,parking',             31.2001, 29.8997, 4, 'Twin',  '35 m²',  'Mediterranean',    15, 4470.00,  TRUE,   380, 'Historic,Sea View');

-- ================================================
-- TOURS (12 unique tours, no duplicates)
-- ================================================
INSERT INTO tours (title, location, description, duration, price, category, difficulty, max_group_size, rating, review_count, image_url, tour_type, featured)
VALUES
('Pyramids of Giza & Sphinx',       'Cairo, Egypt',          'Explore the last standing wonder of the ancient world with a professional Egyptologist guide.',          '4 Hours',  1200.00, 'Culture',    'Easy',     15, 4.9, 3200, 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800', 'GROUP',   TRUE),
('Khan el-Khalili Night Walk',      'Cairo, Egypt',          'Experience the magic of Islamic Cairo after dark. Walk through the 1000-year-old market.',              '3 Hours',   850.00, 'Culture',    'Easy',     10, 4.6,  540, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'GROUP',   FALSE),
('Nile Dinner Cruise',              'Cairo, Egypt',          'Enjoy belly dancing, Tanoura shows, and traditional Egyptian buffet while cruising the Nile.',         '3 Hours',  1200.00, 'Relaxation', 'Easy',     50, 4.3, 1450, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'GROUP',   FALSE),
('Quad Biking at Giza Pyramids',    'Cairo, Egypt',          'Race through the desert on a quad bike with the Great Pyramids as your backdrop.',                    '2 Hours',   950.00, 'Adventure',  'Easy',     12, 4.7,  980, 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800', 'GROUP',   FALSE),
('Valley of the Kings Private',     'Luxor, Egypt',          'Go deep into the tombs of Ramses and Tutankhamun with your own private Egyptologist.',                '5 Hours',  3800.00, 'Culture',    'Moderate',  4, 4.9,  840, 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800', 'PRIVATE', TRUE),
('Abu Simbel Day Trip',             'Aswan, Egypt',          'Travel south to witness the massive rock temples of Ramses II, a masterpiece of ancient engineering.', '9 Hours',  4500.00, 'Culture',    'Moderate', 15, 4.9,  870, 'https://images.unsplash.com/photo-1544906580-03a089069d2a?w=800', 'GROUP',   TRUE),
('Desert Safari & Stargazing',      'Hurghada, Egypt',       'Go off-roading in the Eastern Desert, meet Bedouins, and stargaze with telescopes.',                 '7 Hours',  1800.00, 'Adventure',  'Moderate', 12, 4.7,  420, 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800', 'GROUP',   TRUE),
('Dubai City Tour & Burj Khalifa',  'Dubai, UAE',            'Visit the top of Burj Khalifa, explore Dubai Mall, and cruise Dubai Marina at sunset.',               '8 Hours',  2500.00, 'Culture',    'Easy',     20, 4.8, 1800, 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800', 'GROUP',   TRUE),
('Dubai Desert Safari',             'Dubai, UAE',            'Experience dune bashing, camel riding, BBQ dinner, and traditional entertainment in the desert.',      '6 Hours',  1500.00, 'Adventure',  'Easy',     25, 4.7, 2100, 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800', 'GROUP',   TRUE),
('Istanbul Bosphorus Cruise',       'Istanbul, Turkey',      'Cruise between two continents and see Ottoman palaces, mosques, and the Maiden Tower.',               '3 Hours',   900.00, 'Culture',    'Easy',     30, 4.6, 1500, 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800', 'GROUP',   FALSE),
('Blue Hole Snorkeling Dahab',      'Dahab, Egypt',          'Explore the world-famous Blue Hole with crystal clear water and vibrant coral reefs.',                '6 Hours',  1100.00, 'Adventure',  'Moderate', 15, 4.7,  760, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'GROUP',   TRUE),
('Siwa Oasis 3-Day Expedition',     'Siwa, Egypt',           'Journey to the Great Sand Sea. Visit the Oracle Temple and Cleopatra''s Bath.',                       '72 Hours', 12000.00, 'Adventure',  'Hard',      6, 4.9,  120, 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800', 'PRIVATE', TRUE);