     

Misr University for Science and Technology

College of Information Technology

A Graduation Project Report Submission in Partial Fulfillment of the Requirements for the award of the degree

Bachelor of Information Technology 

Booking and Reservation System for Flights and Hotels (Voyage (

Submitted by

Alaa Waleed			200016680			CS

Mahmoud Ahmed			200031814			CS

Felopateer Shafik			200046194			CS

Mazen Emad			200026541			CS

Mariam Shabaan			98044				CS

Ibrahim Hesham			200031536			CS

Under Supervision of

Prof.  Dr. Yasser Alhabibi


T.A. Habiba Medhat

T.A. Mayar Mohamed

May 2026



ABSTRACT

The modern travel booking landscape is characterized by fragmentation: travellers must navigate multiple disconnected applications to plan a single trip, switching between flight OTAs, hotel booking platforms, tour ticketing services, currency converters, and itinerary planners. This fragmentation introduces cognitive overhead, price inconsistency risks, and a disjointed post-booking experience.



This graduation project presents **Voyage**, an All-in-One Travel Ecosystem that consolidates flight bookings, hotel reservations, tour ticketing, and bundled package purchasing into a single, cohesive web application. Voyage is distinguished from existing platforms by three novel features: (1) a **Price Freeze financial instrument** that allows travelers to lock a quoted price for 24 hours by paying a small fee, protecting them from market volatility while they deliberate; (2) an **AI-powered Trip Planner** built on Google's Gemini 2.5 Pro LLM with Retrieval-Augmented Generation (RAG), grounding AI outputs in real bookable inventory from the platform's database; and (3) a **tiered Loyalty Rewards Program** (Bronze → Silver → Gold → Platinum) with transparent earning and redemption mechanics backed by an auditable transaction ledger.



The system is built on a three-tier architecture: a React.js (Vite) frontend with Zu stand state management and a Glass morphism design system; a Java Spring Boot 3 backend with Spring Security 6 (JWT-based stateless authentication, Crypt password hashing); and a MySQL 8 relational database with ACID-compliant transactional operations. Additional integrations include Google Cloud Storage for media assets, Google Maps JavaScript API for geographic discovery, Three.js for AR hotel previews, and the Google Gemini API for AI features.

Acknowledgment

Words cannot express my gratitude to my professor and chair of my committee for his invaluable patience and feedback. I also could not have undertaken this journey without my defence committee, who generously provided knowledge and expertise. Additionally, this endeavour would not have been possible without the generous support from our beloved Misr University for Science and Technology.

We are also grateful to our classmates and cohort members, especially our mates in long lectures and hard tasks, for their late-night feedback sessions, and moral support. Thanks, should also go to the librarians, research assistants, and study participants from the university, who impacted and inspired me.

Lastly, we would be remiss in not mentioning our family, parents. Their belief in us has kept our spirits and motivation high during this process.













































































LIST OF Symbols and ABBREVIATIONS



































































































CHAPTER 1: Introduction

Overview 

The digital revolution has fundamentally transformed the way people plan, book, and experience travel. In the past two decades, the global travel industry has migrated almost entirely from physical agencies and telephone reservations to online platforms. According to Statista, online travel agency (OTA) revenue exceeded $450 billion USD globally in 2023, with projections indicating continued growth through 2030 [1]. Despite this meteoric rise, a persistent structural problem remains at the heart of the digital travel experience: fragmentation.



A traveler planning a week-long international trip must typically orchestrate bookings across multiple, entirely separate applications — one for flights, another for hotels, a third for local tours, a currency conversion tool, a separate AI assistant for recommendations, and perhaps a manual spreadsheet for itinerary management. A 2019 Google consumer research study found that the average traveler visits 38 different websites before completing a single travel booking [2]. This fragmented experience is not merely inconvenient; it introduces genuine risks including price inconsistency (seeing different prices for the same hotel across OTAs), missed bundling opportunities, duplicate payment steps, and a disjointed post-booking experience where all confirmation emails, vouchers, and plans exist in separate silos.



Voyage is a graduation project developed at Misr University for Science and Technology (MUST) that proposes and implements a solution to this problem: a fully integrated, AI-powered travel booking and management ecosystem delivered as a single web application. The platform unifies flight search and booking, hotel reservations, tour ticketing, bundled package purchasing, AI-driven trip planning, loyalty rewards, and real-time customer support into one cohesive experience — consolidated under a single user account, transaction history, and design language.









 Motivation

The motivation for Voyage arises from both the observed market gap described above and the technological opportunity created by the maturation of several key technologies:



1.2.1  Large Language Models (LLMs): The public release and API accessibility of state-of-the-art LLMs, particularly Google's Gemini 2.5 Pro, makes it feasible to build a genuinely intelligent trip planning assistant that can reason about budget constraints, travel preferences, and specific inventory availability simultaneously — a capability that was not practically achievable for a student-scale project even five years ago.



1.2.2 Mature Full-Stack Frameworks: Spring Boot 3 and React 18 provide enterprise-grade foundations that allow a small team to build a production-quality system without reinventing common infrastructure components (security, ORM, routing, state management).



1.2.3 Cloud Services:  Google Cloud Storage and the Gemini API provide scalable, pay-per-use infrastructure that makes ambitious features (AI, media storage) accessible at negligible cost during development and demonstration phases.



1.2.4 Academic Context: As a graduation project at the College of Information Technology, MUST, Voyage serves as a vehicle to apply and demonstrate competence across the full spectrum of software engineering: requirements analysis, system design, backend development, frontend development, database design, API integration, security implementation, and testing.











Objectives



The primary and secondary objectives of the Voyage project are as follows:



1.3.1 Primary Objectives



1.3.1.1 Design and implement a unified booking engine that supports flights, hotels, tours, and bundled travel packages within a single, consistent user interface and backend system.



1.3.1.2 Design and implement a Price Freeze financial instrument** that allows authenticated users to lock a quoted inventory price for a defined time window (24 hours) by paying a non-refundable freeze fee, protecting them from price increases while they deliberate.



1.3.1.3 Design and implement an AI-powered Trip Planner that uses Google's Gemini 2.5 Pro API with Retrieval-Augmented Generation (RAG) to generate personalized, database-grounded travel itineraries based on the user's stated preferences, budget, and travel style.



1.3.1.4 Design and implement an AI Customer Support assistant that answers user queries in natural language, grounded by the platform's FAQ database and the authenticated user's own booking history.



1.3.1.5 Design and implement a tiered Loyalty Rewards Program with transparent earning (1 point per $1 USD spent) and redemption (100 points = $1 wallet credit) mechanics, enforced by an auditable transaction ledger.





1.3.2 Secondary Objectives



1.3.2.1 Implement a secure authentication system using JWT access tokens and OTP-based email verification.



1.3.2.2 Implement a Review and Rating system for hotels, tours, and packages, gated by a completed booking requirement.



1.3.2.3 Implement a Wishlist feature enabling users to bookmark any inventory item across all categories.



1.3.2.4 Implement a geographic discovery layer using Country, City, and Landmark data, accessible via both a map view (Google Maps API) and an Explore page.



1.3.2.5 Deliver a production-quality user interface adhering to the "Ethereal Traveler" Glass morphism design system.









1.4 Thesis Structure

The remainder of this report is organized as follows:

Chapter 2:  Related Works: Reviews existing travel booking systems (Booking.com, Airbnb, Expedia, Flyin.com, Trip.com), compares their feature sets with Voyage, and surveys the academic and technical literature on the key technologies employed.

Chapter 3: System Development Methodology: Expands the requirements analysis with full user story documentation, system constraint analysis, and requirement prioritization using the MoSCoW method.

Chapter 4: System Analysis and Design: Presents the complete UML model (context diagram, use case diagram, sequence diagram, class diagram, activity diagram, DFDs), the database schema and ERD, the system architecture, and the UI/UX design system.

Chapter 5: System Implementation: Details the key implementation decisions, code structure, selected code walkthroughs, and third-party integration approaches.

Chapter 6: Results and Validation: Presents the testing strategy, unit test cases, integration test cases, and system-level user acceptance testing results.

Conclusion and Future Work: Summarizes achievements against objectives, discusses limitations, and proposes directions for future work.

















CHAPTER 2: Related Works

2.1  Related Work 

2.1.1 Objectives



2.1.1.1 Booking.com



Booking.com, operated by Booking Holdings Inc. was founded in 1996 in Amsterdam and has grown into the world's largest online accommodation marketplace by volume. Its primary objective is to serve as a comprehensive platform for discovering, comparing, and booking accommodation options across all budget segments worldwide. The platform's secondary objectives include facilitating last-minute bookings, supporting travelers with 24/7 multilingual customer service, and enabling property managers (hosts) to list and manage their inventory through a dedicated extranet portal. Booking.com has expanded beyond accommodation to offer flight bookings, car rentals, and taxi services as part of a broader platform strategy.



2.1.1.2 Airbnb 



Airbnb was founded in 2008 in San Francisco and went public in December 2020. Its founding objective was to democratize travel accommodation by enabling private property owners to rent spare rooms or entire homes to travelers, by passing traditional hospitality infrastructure. Over time, Airbnb has expanded its objectives to include long-term stays (Airbnb for Work, monthly rentals), Airbnb Experiences (guided activities hosted by locals), and Airbnb Rooms (a return to the original shared-room homestay model). The platform's overarching mission is to "create a world where anyone can belong anywhere."



2.1.1.3 Expedia Group 



Expedia Group is the largest online travel conglomerate globally, operating multiple distinct brands including Expedia.com, Hotels.com, Vrbo, Trivago, and Orbitz. The corporate objective of Expedia Group is to provide travelers with access to the full spectrum of travel inventory — flights, hotels, vacation rentals, car rentals, cruises, and activities — through a portfolio of brands targeting different traveler segments. Expedia.com itself targets the "full-service traveler" seeking bundled packages (flight + hotel combinations) with bundle savings.



2.1.1.4 Flyin.com 



Flyin.com is a Saudi Arabian online travel agency, headquartered in Riyadh, that focuses primarily on the Middle Eastern and North African (MENA) travel market. Its primary objective is to serve Arabic-speaking travelers with a bilingual (Arabic and English) platform offering flight search, hotel booking, and travel package purchases tailored to regional travel patterns (e.g., GCC intra-regional travel, Hajj and Umrah packages, Egyptian resort destinations). Flyin.com's secondary objective is to provide competitive pricing specifically for regional routes (Cairo–Riyadh, Dubai–London, etc.) where international OTAs may have less favorable inventory access.



2.1.1.5 Trip.com

Trip.com (formerly Ctrip) is the international brand of Trip.com Group, a Shanghai-based online travel conglomerate that is the dominant OTA in the Chinese market and a significant global player following its acquisition of Skyscanner in 2016. Trip.com's international platform objective is to provide a comprehensive travel marketplace covering flights, hotels, trains, car rentals, and activities for both Chinese outbound travelers and international travelers globally. The platform's specific regional objective is to capture market share in Asia-Pacific, Europe, and increasingly the Middle East.





2.1.2 Development Tools and Technologies



2.1.2.1 Booking.com



Booking.com is built on a highly distributed microservices architecture, with the platform reportedly running thousands of individual services. Key technologies identified from public engineering blogs and architectural disclosures include:



Backend: Java, Perl, and Go for high throughput microservices; Apache Kafka for event streaming; Cassandra and MySQL for distributed and relational data storage respectively.

Frontend: A mix of React.js components and legacy server-rendered pages, with progressive migration to a modern single-page application architecture.

Infrastructure: Custom data centers with CDN acceleration (Fastly and Akamai), Kubernetes orchestration for containerized services.

AI/ML: Internal machine learning pipelines for personalized recommendations, dynamic pricing insights, and fraud detection; integration with external review-analysis NLP models.

Payments: PCI DSS-compliant payment infrastructure supporting over 40 payment methods globally.



2.1.2.2 Airbnb 

Airbnb's engineering culture is well-documented through its public engineering blog (airbnb.io). Key technologies include:



Backend: A service-oriented architecture migrated from a monolithic Ruby on Rails application to Java- and Go-based microservices over a multi-year effort; GraphQL for flexible data fetching between client and server.

Frontend: React.js; Airbnb is notably the creator and maintainer of the Air Table design system and the widely used react-dates library.

Database: MySQL for transactional data; Apache Kafka for event streaming; Amazon S3 for media storage; Elasticsearch for search indexing.

Machine Learning: Extensive ML pipeline for pricing optimization, fraud detection (covering both hosts and guests), search ranking (using gradient boosted trees), and review sentiment analysis.

Infrastructure: Hosted on Amazon Web Services (AWS), with multi-region deployment for global availability.



2.1.2.3 Expedia Group



Expedia Group utilizes a modern, cloud-based technology stack heavily reliant on JVM languages, AI-driven personalization, and microservices architecture to manage its global travel marketplace. The company leverages a "you build it, you run it" approach, with a strong focus on data-driven decision-making and automated, scalable systems.





Backend: Java-based microservices, with significant investment in Apache Kafka for real-time event processing; Oracle and PostgreSQL for relational data at various brand subsidiaries.

Frontend: React.js across most consumer-facing properties after a multi-year modernization effort from legacy JSP-based server rendering.

Search Infrastructure: Apache and Elasticsearch for hotel and flight search indexing; custom availability calendaring systems built on distributed cache layers (Redis, Memcached).

AI/ML: Expedia's AI Lab investments cover recommendation engines (collaborative filtering), price prediction displays ("This price is X% below average"), natural language hotel review summarization, and a conversational travel assistant built on large language models.

Infrastructure: Multi-cloud deployment (AWS and Google Cloud Platform) with global CDN distribution.





2.1.2.4 Flyin.com



Flyin.com's specific technology stack is not publicly disclosed in the level of detail available for publicly listed companies. Based on available developer job postings and public-facing technical analysis:



Backend: Primarily PHP-based backend services (Laravel framework), with Java microservices for high-volume transaction processing.

Frontend: Angular.js for the primary web application, with React Native for mobile applications.

GDS Integration: Amadeus GDS API for live flight inventory, pricing, and seat availability; Sabre GDS as a secondary source for international flights.

Hotel API: Agoda B2B API and Expedia Partner Solutions (EPS) for hotel inventory aggregation.

Payment: Regional payment processor integration (STC Pay, Mada, Visa/Mastercard through Checkout.com) tailored to MENA market payment preferences.





2.1.3 Advantages and Disadvantages



2.1.3.1 Booking.com

 Advantages



Unmatched inventory breadth: Booking.com lists over 29 million accommodation options across 230 countries and territories, making it the go-to platform for travelers seeking obscure or niche accommodations.

Free cancellation model: A significant portion of Booking.com's inventory offers free cancellation, reducing the perceived risk of booking in advance.

Genius loyalty program: The three-tier Genius program (Level 1, Level 2, Level 3) offers increasing discounts (10%, 15%, 20%) for frequent bookers, rewarding repeat usage.

Multilingual support: The platform operates in 43 languages, making it accessible to a global user base.

Verified guest reviews: A "verified reviews only" policy — reviews can only be submitted by guests who have completed a stay — ensures authenticity and trust.

Price Match Guarantee: Booking.com offers to match prices found on competing platforms within a defined window, reducing the need for cross-platform comparison.



Disadvantages



Accommodation-centric: Despite expansion efforts, Booking.com remains predominantly an accommodation platform. Flight booking is handled through a white-label partnership (Kayak/Priceline), and tour/activity booking is minimal. A traveler cannot plan a complete trip — flight + hotel + tours — within a single, integrated workflow.

No Price Freeze: Booking.com does not offer a formal mechanism to lock a quoted price for a deliberation period. Prices change dynamically, and there is no protection against price increases during the user's decision window.

No AI itinerary planner: Booking.com's AI features are primarily limited to search ranking and personalization; there is no conversational AI that generates day-by-day trip itineraries grounded in the platform's inventory.

No unified loyalty currency across booking types: The Genius program applies only to accommodation bookings. There is no single points currency that applies to flights, hotels, and activities in a unified balance.

Complex fee structure: Booking.com charges property owners commission (typically 10–25%), and some properties pass these costs to consumers through non-refundable booking fees, creating pricing opacity.





2.1.3.2 Airbnb

Advantages



Unique property types: Airbnb offers property categories that do not exist on traditional OTAs — treehouses, boats, yurts, entire villas, and artist studios — enabling highly differentiated travel experiences.

Experiences marketplace: Airbnb Experiences allows travelers to book locally hosted activities (cooking classes, city tours, art workshops), partially addressing the activity-booking gap common in hotel-centric OTAs.

Community trust mechanisms: The mutual two-way review system (guests review hosts and hosts review guests), identity verification, and Superhost badge program create a trust infrastructure unique to the peer-to-peer model.

Long-stay flexibility: Monthly pricing discounts (up to 40% in some markets) make Airbnb competitive for digital nomads and extended-stay travelers.

Host empowerment tools: The host dashboard provides pricing analytics, availability calendars, and messaging tools that enable non-professional hosts to manage properties effectively.



Disadvantages



No flight booking: Airbnb does not offer flight search or booking. Travelers must use a separate platform for air travel, eliminating any possibility of integrated flight + accommodation booking.

Inconsistent quality standards: Unlike branded hotel chains, Airbnb properties vary widely in cleanliness, amenity availability, and adherence to advertised descriptions, leading to higher post-stay disappointment rates.

No formal loyalty program: Airbnb eliminated its Superguest program in 2019 and has not replaced it with a meaningful guest loyalty mechanism. Frequent travelers receive no preferential pricing or points accumulation benefits.

Hidden fees: Airbnb's cleaning fees, service fees, and occupancy taxes are often not displayed until the final checkout step, creating a "bill shock" effect where the total price is significantly higher than the listed nightly rate.

No AI trip planning: Airbnb does not offer a conversational AI tool for generating complete trip itineraries. Its AI capabilities are primarily internal (search ranking, pricing recommendations to hosts).





2.1.3.3 Expedia Group

Advantages



Breadth of product types: Unlike Booking.com (accommodation-centric) or Airbnb (P2P accommodation), Expedia genuinely covers flights, hotels, car rentals, activities, and cruises in a single interface.

Bundle pricing incentives: Expedia's "bundle and save" mechanics — combining a flight with a hotel or car — produce genuine discounts (typically 10–20%) compared to booking components separately, providing a financial incentive for trip consolidation.

One Key loyalty program: Expedia's unified loyalty program (launched 2023) consolidates rewards across Expedia, Hotels.com, and Vrbo, so points earned on any brand can be spent on any other. This represents the closest competitor to Voyage's unified loyalty concept.

Price tracking feature: Expedia offers a price tracking feature that alerts users when the price of a saved itinerary changes, partially addressing the price volatility problem.

Strong mobile applications: Expedia's iOS and Android apps have received consistent high ratings for design, speed, and complete features.



Disadvantages



No Price Freeze: Expedia does not offer a formal Price Freeze instrument. The price tracking feature notifies users of changes but does not lock a price for a deliberation period.

AI features are nascent: Expedia's conversational AI ("Romie") launched in beta in 2024 but remains limited in its ability to generate fully grounded, bookable itineraries from real inventory. Integration with actual booking flow is incomplete.

UI complexity: Expedia's interface has grown complex over years of feature additions. The booking flow for bundled packages involves many steps and can be confusing for first-time users.

Market concentration criticism: Expedia's acquisition of Hotels.com, Trivago, Vrbo, and Orbitz has been criticized for reducing apparent competition while consolidating market power, which may result in less favorable pricing than true competition would produce.

Limited in the Middle East market: Expedia's regional inventory coverage in Egypt and the Gulf region is less complete than local alternatives such as Flyin.com, and the platform does not offer Arabic-language content natively.













2.1.3.4 Flyin.com

 Advantages



MENA market specialization: Flyin.com has strong inventory coverage of regional airlines (flynas, Air Arabia, Jazeera Airways, EgyptAir) and MENA hotel properties that international OTAs may not cover adequately.

Bilingual interface: Full Arabic-language support with RTL layout, making the platform accessible to Arabic-speaking travelers who are not comfortable with English-only interfaces.

Regional payment methods: Integration with MENA-specific payment methods (Mada, STC Pay, KNET) that are not supported by international OTAs, reducing friction at checkout for regional users.

Hajj and Umrah packages: Dedicated category for pilgrimage travel packages, a product segment with no equivalent on international OTAs.

Competitive GDS pricing: Direct GDS access (Amadeus/Sabre) provides Flyin.com with live, competitive pricing that may differ favorably from what a consumer-facing OTA can offer after markup.



 Disadvantages



No Price Freeze: Like all reviewed competitors, Flyin.com does not offer a consumer-facing Price Freeze instrument.

No AI-powered trip planning: Flyin.com's search and discovery features are entirely conventional; there is no conversational AI or RAG-based itinerary generation.

No unified loyalty program: Flyin.com does not operate its own loyalty rewards program. Users are directed to individual airline frequent flyer programs for rewards accumulation.

Limited non-flight inventory: Flyin.com's hotel and tour inventory is thin compared to Booking.com or Expedia. The platform's strength is flight bookings; accommodation and activity products are secondary.

Limited English market visibility: While bilingual, Flyin.com has low brand recognition outside the MENA market, limiting its usefulness for international routes originating outside the region.

2.1.3.5 Trip.com

Advantages



Global flight coverage: Following the Skyscanner acquisition, Trip.com has one of the broadest global flight search indices, including low-cost carriers that may not appear on GDS-dependent platforms.

Train and multi-modal bookings: Unique coverage of high-speed rail bookings in China, Japan, and Europe through integration with rail inventory APIs, enabling multi-modal trip planning.

Trip Genie AI assistant: Trip.com launched "Trip Genie" an LLM-powered conversational travel assistant in 2023, demonstrating industry recognition of the value of AI-driven trip planning. This is the closest existing competitor to Voyage's AI Trip Planner.

Competitive pricing for Asia-Pacific routes: Trip.com's direct relationships with Asian carriers and hotels produce competitive pricing for intra-Asian and Asia-Europe routes.

Comprehensive mobile experience: Trip.com's mobile application is highly rated for its feature completeness, including offline access to booking confirmations.



Disadvantages



No Price Freeze: Trip.com does not offer a consumer-facing Price Freeze instrument despite its sophisticated AI capabilities.

Trip Genie limitations: Trip Genie generates itineraries from training data and general knowledge rather than from real-time Trip.com inventory. Recommended hotels in AI-generated itineraries may not be bookable on the platform, limiting the actionability of AI suggestions.

Customer service challenges for international users: Trip.com's customer service quality for English-speaking users outside Asia-Pacific has been rated inconsistently, with reports of difficulty resolving booking issues.

Limited MENA coverage: Trip.com's hotel and flight inventory for the Middle East and North Africa region are thinner than platforms specialized in that market (such as Flyin.com).

No unified loyalty for international users: Trip.com's Star Club loyalty program is primarily designed for the Chinese domestic market. International users accumulate Trip Coins, but the program's benefits are less compelling than for domestic users.





2.2 The proposed System



2.2.1 Objectives and Functionalities



Voyage is proposed as a unified All-in-One Travel Ecosystem that addresses the collective gaps identified across all five reviewed platforms. The system's objectives and functionalities are organized as follows:



Primary Functionalities:



Unified booking engine: A single post booking API endpoint with polymorphic entity design handles bookings for flights, hotels, tours, and bundled travel packages within a single, consistent booking lifecycle (PENDING → CONFIRMED → CANCELLED).



Price Freeze instrument: The POST /price-freeze endpoint creates a Price Freeze entity that records the frozen price, the freeze fee paid, and the 24-hour expiry timestamp. The booking flow honors the frozen Price when a frozen booking is converted to a confirmed booking within the active window.



AI Trip Planner (RAG): A Retrieval-Augmented Generation pipeline (Retrieval Service → Prompt Builder → Gemini Client) grounds Gemini 2.5 Pro outputs in real Voyage inventory. The `POST /ai/trip-plan` endpoint accepts user preferences (budget, travel type, duration, party size, interests) and returns a structured, day-by-day itinerary with specific bookable options.



AI Customer Support: The post AI support endpoint provides a conversational assistant grounded in the platform's FAQ content and the authenticated user's booking history, enabling personalized support without a human agent.



Tiered loyalty program: The Loyalty Service computes tier (BRONZE/SILVER/GOLD/PLATINUM) based on cumulative points, awards 1 point per $1 spent on confirmed bookings, enforces a 500-point minimum redemption threshold, and maintains a full Loyalty Transaction audit ledger.



Booking-gated review: The Review Service validates that a user has confirmed booking for the target item before accepting a review submission, preventing fraudulent reviews.



Geographic discovery: Country, City, and Landmark entities with rich metadata and Google Maps JavaScript API integration enable spatial exploration of destinations.





Technical Functionalities:



JWT-based stateless authentication (Spring Security 6, HS512 algorithm)

OTP email verification for new account registration (6-digit code, 10-minute expiry)

Crypt password hashing (cost factor 12)

Google Cloud Storage integration for profile picture uploads

Glass morphism "Ethereal Traveler" design system (primary: #4F6EF7, Glass morphism layers, Plus Jakarta Sans + Manrope typography)

Responsive layout across desktops, tablets, and mobile breakpoints



2.2.2 Advantages of the Proposed System



Voyage offers the following advantages that are not collectively present in any single reviewed competitor:



All-in-one integration: Flights, hotels, tours, and packages are all bookable within a single authenticated session, with a shared booking history, unified loyalty balance, and consistent UI.



Price Freeze unique to market: No reviewed competitor offers a consumer-facing Price Freeze financial instrument. This feature directly addresses the price volatility problem and provides a competitive differentiator.



Truly grounded AI planning: Unlike Trip Genie (Trip.com), which generates suggestions from training data, Voyage's AI Trip Planner uses RAG to retrieve actual Voyage inventory before constructing the AI prompt. Recommendations are verifiably bookable.



Transparent loyalty mechanics: Voyage's loyalty program uses a simple, transparent earning rate (1 pt/$1) and redemption rate (100 pts=$1) that applies uniformly across all booking types — a level of simplicity and universality not offered by any reviewed platform.



Booking-gated review integrity: The review gate ensures all reviews are from verified customers with real booking history, matching Booking.com's "verified only" standard while applying it uniformly across all inventory types.



AR pre-booking inspection: The Three.js hotel room preview provides a spatial evaluation capability not offered by any reviewed competitor.



Academic rigor and transparency: Unlike commercial platforms, Voyage's architecture, design decisions, and source code are fully documented and auditable, enabling peer review of all technical decisions.











2.3 Comparison between related work & the proposed system





The following table compares Voyage against the five reviewed platforms across fourteen feature dimensions. The comparison uses a three-value scale: Full (complete feature), Partial (limited or incomplete implementation), and None (feature not present).





Notes:

"Partial" for Voyage's Arabic support reflects the English-only current implementation; Arabic (i18n) is listed as a future work item.

"None" for Voyage mobile reflects the web-only scope of the current project; a React Native app is in the future work roadmap.

















































Chapter 3: System Development Methodology



3.1 Software Process Model



Software development methodology defines the structured approach a team uses to plan, execute, and control a software project [1]. The selection of an appropriate process model is one of the most consequential early decisions in a software project, as it determines how requirements are elicited and refined, how development work is organized and sequenced, how quality is assured, and how risk is managed throughout the project lifecycle. Different models — Waterfall, Spiral, Rational Unified Process (RUP), and Agile variants — offer different trade-offs between predictability, flexibility, documentation overhead, and feedback cycle speed.



This chapter describes the software process model adopted for the Voyage project, presents a comprehensive justification for its selection, and documents the project plan in the form of a sprint-based timeline with key milestones.





3.1.1 Software Process Model Name



The Voyage development team adopted an Agile development methodology using the Scrum framework as the primary software process model for this project.



Agile is a family of iterative and incremental software development approaches guided by the values of the Agile Manifesto (Beck et al., 2001) : individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; and responding to change over following a plan. Scrum is the most widely adopted Agile framework, organizing development work into fixed-length iterations called Sprints (typically 1–4 weeks), with defined ceremonies (Sprint Planning, Daily Standups, Sprint Review, Sprint Retrospective) and roles (Product Owner, Scrum Master, Development Team).



3.1.1.1 Overview



In the Scrum framework, all work to be completed is captured in a Product Backlog, a prioritized list of features, user stories, and technical tasks. At the start of each Sprint, the team conducts a Sprint Planning meeting to select a subset of Product Backlog items (the Sprint Backlog) that can be completed within the Sprint duration. During the Sprint, the team holds brief daily synchronization meetings (Daily Scrums) to identify progress and impediments. At the end of the Sprint, a Sprint Review is conducted to demonstrate the working software to stakeholders, followed by a Sprint Retrospective to identify process improvements.



For the Voyage project, the team adopted two-week Sprints over an approximately four-month development period (February 2026 to May 2025), resulting in ten Sprint cycles. Given the academic context, the roles were adapted as follows:



Product Owner  Project supervisors (Dr. Yasser Alhabibi, T.A. Habiba Medhat, T.A. Mayar Mohamed) providing requirements and prioritization guidance.

Scrum Master Team lead (Alaa Waleed) facilitating ceremonies and removing impediments.

Development Team  All six team members rotating ownership of features by module.















The Product Backlog was maintained in a shared project management document (`PLAN.md`), with items tagged by priority (Must Have, Should Have, Could Have, Won't Have — MoSCoW classification) and assigned to specific Sprints during planning.





3.1.1.2 Steps and Phases



The Agile Scrum process for the Voyage project was organized into the following phases and associated activities:



Phase 1: Project Inception (Weeks 1–2)



Activities:

- Stakeholder identification and initial requirements elicitation through team workshops with supervisors

- Domain analysis of five competing travel platforms (documented in Chapter 2)

- Creation of initial Product Backlog with user story prioritization

- Technology stack selection and feasibility assessment (Spring Boot 3, React 18, MySQL 8, Gemini API)

- Repository setup, CI/CD scaffolding (Maven build, npm scripts), database migration tooling

- Definition of Definition of Done (DoD) criteria for all features



Artifacts produced: Initial Product Backlog, Technology Selection Report, Project Charter







Phase 2: Architecture and Foundation (Weeks 3–4, Sprint 1)



Activities:

- Three-tier architecture design (React frontend, Spring Boot backend, MySQL database)

- Database schema design: Entity-Relationship Diagram, table definitions, foreign key relationships

- Spring Security 6 configuration: JWT filter chain, BCrypt password encoder bean, public/protected endpoint mapping

- React.js project scaffolding (Vite, Zustand, React Router v6, Tailwind CSS)

- Google Cloud Storage bucket configuration for media uploads

- Design system establishment: Glass morphism "Ethereal Traveler" color palette, typography, component primitives



Artifacts produced: Architecture Design Document, Initial ERD, Security Configuration, Design System Tokens







Phase 3: Core Authentication and User Management (Weeks 5–6, Sprint 2)



Activities:

- Implementation of User entity with OTP fields (otpCode, otpExpiresAt)

- Registration flow: email validation, BCrypt password hashing, OTP generation, Gmail SMTP integration

- OTP verification flow: time-window validation, account activation, JWT issuance

- JWT Authentication Filter: Bearer token extraction, claims parsing, Spring Security context population

- Login flow: credential validation, JWT generation with 24-hour expiry

- Profile management: GCS upload for profile pictures, profile update endpoint

- User acceptance testing of auth flows against acceptance criteria in Chapter 3 user stories



Artifacts produced: Verified auth API (register, login, verify-OTP, profile), JUnit 5-unit test suite for AUTH Service







Phase 4: Inventory and Discovery (Weeks 7–8, Sprint 3)



Activities:

- Flight entity implementation: search endpoints with multi-parameter filtering (origin, destination, date, cabin class, max stops, max price)

- Hotel entity implementation: search endpoints with amenity and star-rating filters

- Tour entity implementation: category-based filtering, featured tours.

- Country, City, Landmark entity implementation with geographic metadata.

- Google Maps JavaScript API integration on the destination discovery page.

- Database seeding: initial flight/hotel/tour/country/city/landmark records (100+ inventory items).

- Search performance optimization: JPA repository derived queries, database index creation on search fields.







Phase 5: Booking Engine and Transactions (Weeks 9–10, Sprint 4)



Activities:

- Booking entity design: polymorphic nullable FK approach (flight_id, hotel_id, tour_id, package_id), transaction Id generation (@PrePersist VGA-TXN-{UUID8}), booking lifecycle state machine.

- Booking Service @Transactional implementation: inventory availability check, seat/room decrement, loyalty point award, booking confirmation.

- Wallet payment deduction logic.

- My Bookings API: authenticated user booking history retrieval with booking type filtering.

- Booking cancellation: status update to CANCELLED, inventory restoration.







Phase 6 — Price Freeze and Loyalty (Weeks 11–12, Sprint 5)



Activities:

- Price Freeze entity and service: freeze fee validation, 24-hour expiry timestamp, active status management

- Price Freeze booking conversion: honor frozen Price on booking creation within active window, reject expired freezes

- Loyalty Service: tier computation logic (BRONZE/SILVER/GOLD/PLATINUM thresholds), point earning on booking confirmation, REDEEM transaction with 500-point minimum, Loyalty Transaction audit log

- Redemption API: wallet credit transfer, point balance decrement









Phase 7: Reviews, Wishlist, and Packages (Weeks 13–14, Sprint 6)



Activities:

- Review entity with booking eligibility gate: Review Service validates CONFIRMED booking before accepting review

- Unique constraint enforcement: prevent duplicate reviews by the same user for the same item

- Average rating precomputation on each new review

- Wishlist Item entity: polymorphic item type (flight/hotel/tour/package/country/landmark), user-scoped retrieval

- Travel Package entity with Day Plan sub-entity: itinerary structure, package booking flow

- Package detail page: day-by-day itinerary rendering in React









Phase 8: AI Integration (Weeks 15–16, Sprint 7)



Activities:

- Gemini Client: HTTP client for Google Generative Language API (gemini-2.5-pro-preview-05-06 model), API key from environment variable, request/response serialization

- Retrieval Service: structured inventory retrieval from MySQL for RAG context (top hotels by city, top flights by route, tour listings)

- Prompt Builder: Java text block templates for Trip Planner system prompt (injecting retrieved inventory JSON) and Customer Support system prompt (injecting FAQ + booking history)

- Ai Controller: POST /ai/trip-plan, POST /ai/support endpoints, session ID management for multi-turn Trip Planner conversations

- In-memory session store for multi-turn conversation history 

- Three.js AR hotel preview: GLTFLoader for 3D model loading, Orbit Controls for user interaction, embedded in hotel detail page



Artifacts produced: AI API (trip-plan, support), Three.js AR component, RAG pipeline unit tests







Phase 9: Frontend Integration and UI Polish (Weeks 17–18, Sprint 8)



Activities:

- Zustand store integration: use Authentication Store (persist middleware, JWT storage), use Wishlist Store, use Booking Store

- Axios interceptor: automatic Bearer token injection, 401 → logout redirect

- Glass morphism component library: Glass Card, Glass Modal, Glass Button, Hero Section

- Trip Planner Page: chat-style UI with preference form, streaming response display, session continuity

- Full page implementation: Home, Flights Search, Hotels Search, Tours, Packages, Deals, Destinations, Profile, Wishlist, Booking History, Loyalty Dashboard, AI Support Chat

- Responsive layout testing across Chrome/Firefox/Edge at 375px, 768px, 1024px, 1440px breakpoints









Phase 10: Testing and Documentation (Weeks 19–22, Sprints 9–10)



Activities:

- JUnit 5 + Mockito unit test completion for all service classes (AUTH Service, Booking Service, Loyalty Service, Price Freeze Service, Review Service)

- @SpringBootTest + H2 integration test suite completion

- Postman collection assembly: 63 test cases across all API modules with automated assertions

- Manual User Acceptance Testing: 20 scenarios executed against acceptance criteria from Chapter 3

- Security testing: JWT forgery, SQL injection via parameterized queries, CORS validation, password exposure check

- Performance testing: Apache JMeter load test at 50 concurrent users

- Full report documentation: Chapters 1–7 + Appendices









3.1.1.3 Strengths of the Agile Scrum Model



- Adaptability to change requirements: The iterative Sprint structure enabled the team to incorporate feedback from supervisors at the end of each Sprint Review before the next sprint began. For example, the decision to add a dedicated AI Customer Support endpoint (in addition to the Trip Planner) emerged from a Sprint 6 review feedback session and was incorporated into Sprint 7 without disrupting the plan.



- Early risk mitigation: By building working software incrementally (authentication first, then inventory, then bookings, then AI), the team identified technical risks early. The decision to use a backend proxy for the Gemini API (rather than direct browser calls) was made in Sprint 1 after identifying that browser-direct API calls would expose the API key in client-side code.



- Continuous stakeholder engagement: Regular Sprint Reviews with supervisors ensured academic rigor requirements (IEEE citation format, UML completeness, testing strategy documentation) were surfaced early and addressed iteratively rather than discovered as deficiencies at the final submission.



- Working software at end of each Sprint: Every Sprint concluded with a deployable increment of the system. This meant the team always had a functional demo available, which was important for demonstrating progress at mid-project check-ins.



- Team ownership and motivation: The feature-assignment model (rotating ownership by module) gave each team member clear accountability for specific Sprint Backlog items, reducing ambiguity about who was responsible for what.







3.1.1.4 Weaknesses of the Agile Scrum Model



-Documentation pressure: Agile's bias toward working software over comprehensive documentation creates tension in an academic context where extensive documentation is a primary deliverable. The team addressed this by dedicating Sprints 9–10 specifically to documentation, which risked leaving documentation as an afterthought.



-Difficulty with distributed team coordination: The six-member team worked partly remotely, and the Daily Standup ceremony proved difficult to sustain at daily frequency. The team adapted by switching to asynchronous daily updates via a shared messaging channel, which was less effective for identifying blockers promptly.



-Scope creep risk: the flexibility of Agile makes it easy to add new items to the Product Backlog mid-project. The team added Three.js AR preview and the Deals/Recommendations pages mid-project; while both were delivered, they increased Sprint 8 scope significantly.



Estimation uncertainty: Story point estimation by a team with varying experience levels (some members more experienced in backend, others in frontend) led to some Sprint Backlog overcommitments in Sprints 3–5. The team corrected this in Sprint 6 by adopting a more conservative velocity target.



Testing integration: Agile's principle of continuous testing was imperfectly implemented: most formal test writing was deferred to Sprints 9–10 rather than being written in parallel with feature development. This created a brief period of testing debt before the final submission.





3.1.1.5 Why We Used This Model



The Agile Scrum methodology was selected over alternative models for the following specific reasons:



-Reason 1 Evolving requirements: In the early stages of the project, the exact feature set was not fully defined. Supervisors provided high-level objectives (unified booking, AI features, loyalty program) but left the specific implementation details to the team. The Waterfall model, which requires complete requirements specification before development begins, would have forced premature commitment to implementation details that changed as the team's understanding matured.



-Reason 2 Novel features with technical uncertainty: The Price Freeze mechanism and the RAG-based AI Trip Planner had no direct precedent in the team's prior experience. Agile's iterative approach allowed the team to prototype and validate each novel feature within a two-week spike before committing to full implementation.



-Reason 3 Team size and co-location: The six-member team size is well-suited to Scrum, which is typically recommended for teams of 3–9 members. The small team size enabled the informal coordination and rapid decision-making that Agile requires.



-Reason 4 Academic semester timeline: A five-month development window with fixed milestones (mid-project review, final submission) maps naturally to a Sprint-based plan. The Sprint boundaries served as natural checkpoints that aligned with academic calendar deadlines.



-Reason 5 Availability of modern tooling: The team's familiarity with Git (feature branches per Sprint), Maven/npm for build automation, and Postman for API testing made the tooling requirements of Agile (continuous integration, automated testing, frequent deployment) achievable without significant tooling overhead.





3.2 Project Plan (Gantt Chart)



































































































Chapter 4: System Analysis and Design





4.1 System Domain

The system operates within the global Travel and Tourism domain, specifically targeting the digital booking and itinerary management sector. It addresses the fragmentation of modern travel planning by consolidating flight bookings, hotel reservations, and tour ticketing into a single "All-in-One Travel Ecosystem".

The system distinguishes itself by integrating Financial Technology (Fintech) features, such as "Price Freezing" to mitigate market volatility, and Immersive Technology, utilizing Augmented Reality (AR) to provide spatial previews of accommodations and landmarks. The target audience includes travelers seeking a streamlined experience, moving away from using multiple disjointed applications to plan a single trip.

4.2 Requirements Specification

4.2.1 Functional Requirements

The system shall provide the following core functionalities, organized by module:

User Management & Personalization

The system shall allow users to register and authenticate securely using JWT-based login.

The system shall categorize users into loyalty tiers (Silver, Gold, Platinum) based on their activity.

The system shall provide a "Mood Recommender" to suggest destinations based on the user's travel vibe.

Integrated Booking Engine

The system shall allow users to search for and filter flights and hotels in real-time.

The system shall enable a "Price Freeze" feature, allowing users to pay a small fee to lock current prices for a set duration.

The system shall allow users to book private and group tours with digital ticketing.

Immersive & Logistics Features

The system shall automatically generate a synced itinerary timeline via the "Smart Planner".

Payment & Support

The system shall support multi-currency checkout flows.

The system shall provide an AI-driven chatbot for 24/7 language translation and currency conversion assistance.

4.2.2 Non-Functional Requirements

The system shall adhere to the following quality standards:

Security: All transactions must be encrypted using SSL/TLS, and user sessions must be managed via stateless Spring Security authentication.

Performance: Search results shall load in under 3 seconds using Redis Caching.

Availability: The system shall aim for 99.9% uptime.

Scalability: The architecture (React + Spring Boot + MySQL) shall support high concurrency.

Data Integrity: The database shall ensure ACID compliance to prevent data loss.



4.3 UML Diagrams

4.3.1 Context Modelling

4.3.1.1 Context Diagram

The Context Diagram depicts the high-level interaction between the Online Booking System for Flights and Hotels and external entities. The system acts as a central processing unit (Process 0) interacting with key entities, including Users, Admins, Airline/Hotel APIs, and the Payment Gateway.

(Note: context diagram corresponds to DFD level 0 in the references that was reviewed)



















































































4.3.2 Interaction Modelling

4.3.2.1 Use Case Description

This diagram shows who interacts with the Booking System and what they can do. It has 5 main actors (users) and many specific action actors.

The Guest (Left Side): This is a new visitor. They can only View Landing Page, Search for Flights/Hotels, and Select Deals. To do anything else, they must Login/Signup.

The User (Left Side): This is a logged-in customer. They have the most power. They can:

Book: Confirm bookings for flights, hotels, or tours.

Manage: View history, edit info, and cancel bookings.

Unique Features: Use Loyalty Points for discounts or Initiate Freezing to lock a price for later.

Interact: Write reviews or chat with support.

The admin (Right Side): The manager. They approve bookings, cancellations, and money reservations. They also update flight/hotel details in the system.

Customer Support (Right Side): Human agents who help users and solve issues the system can't handle automatically.

Chat Bot (Right Side): An automated helper that answers simple questions instantly.

Payment Gateway (Right Side): An external banking system that handles the actual money transfer when a user selects Make Payment.



4.3.2.2 Use Case Diagram

The Use Case Diagram visualizes the functional requirements by linking actors to system processes. It highlights the Guest role (Search, View Deals) versus the authenticated User role (Initiate Freezing, Confirm Booking, Use Loyalty Points).

















4.3.2.3 Sequence Diagram

The Sequence Diagram details the chronological flow of logic for a booking inquiry. It traces the message flow from the Guest to the Chatbot, through the Booking System for availability checks, and finally to the Payment entity for confirmation.











4.3.3 Structural Modelling

4.3.3.1 Class Diagram

The Class Diagram illustrates the static structure of the system. Key classes include User (and its subclass Guest), Flight, Hotel, and Booking. The diagram defines attributes (e.g., loyalty points) and methods (e.g., check availability).

















4.3.4 Behavioural Modelling

4.3.4.1 Data-Driven Modelling

Data-driven models are defined as models built using machine and statistical learning algorithms based on data, which are typically employed for classification, regression, or prediction purposes to assist in decision making. The quality of these models depends significantly on the quality of the data used.

4.3.4.1.1 Activity Diagram

The Activity Diagram maps the user workflow. It shows the decision points where a user chooses between "Normal Booking," "Freezing," or selecting a "Deal/Package." It visualizes the parallel flows for login checks and the final convergence at the "Confirm Booking" step.











4.3.4.1.2 DFD Level 0

The Level 0 Data Flow Diagram corresponds to the Context Diagram, illustrating the primary system boundary and its interactions with the User, Admin, and External APIs (Airline, Hotel, Payment).





4.3.4.1.3 DFD Level 1

The Level 1 Data Flow Diagram provides a detailed decomposition of the booking process, splitting it into four distinct subsystems: Flight Reservation, Hotel Reservation, AI Recommendations, and Payment Processing.







4.3.4.1.4 Data Dictionary





4.3.5 Data Modelling

4.3.5.1 Database Schema

The physical database scheme includes the following primary tables:

Users: Stores email, password, full name, and loyalty tier.

Inventory: Separate tables for Flights, Hotels (includes AR model URL), and Tours.

Bookings: Tables for Flight Bookings and Hotel Bookings, linking users to inventory.

Price Freezes: Stores frozen price and expiry time.

4.3.5.1 Entity-Relationship Diagram

The ERD (Figure 4-8) details the relationships between entities, such as the One-to-Many relationship between Users and Bookings, and the One-to-One relationship between a Booking and a Price Freeze record.









4.4 System Architecture

The system follows a Client-Server Architecture utilizing a Microservices-inspired approach:

Client Side: Developed using React.js for a responsive web interface and Three.js for rendering AR 3D models.

Server Side: Built with Java Spring Boot 3, handling business logic, authentication (Spring Security + JWT), and API integrations.

Database: MySQL is used for persistent relational data storage (Users, Bookings), while Redis is employed for caching search results and managing temporary "Price Freeze" states.

4.5 UI/UX Design

The user interface implements a "Glass morphism" design language to ensure a modern, clean aesthetic. The user flow is streamlined into four stages: Discovery (Landing Page & Mood Recommender), Planning (Trip Planner), Booking (Results & Details with AR views), and Management (Profile & History).













































Chapter 5: System Implementation

5.1 Used Technologies, Tools & Programming Languages



This chapter documents the implementation of the Voyage system, covering the technologies and tools used during development, the key algorithms that underpin the system's novel features, the dataset used to populate the system with demonstration data, and annotated code snapshots from the most significant implementation components. The chapter is organized to follow the architectural layers defined in Chapter 4: backend (Spring Boot), frontend (React.js), AI integration, and database seeding.



All code presented in this chapter reflects the actual implementation in the Voyage repository. Variable names, method signatures, and annotation usage are drawn directly from the source files.



5.1.1 Programming Languages



- Java 17 (LTS)

Java 17 is the primary backend programming language. Java 17 was chosen as it is the current Long-Term Support release of the Java platform and is the minimum version required by Spring Boot 3.x. Key Java 17 features used in the Voyage backend include:



- Text blocks (Java 15+, finalized in 17): Used extensively in Prompt Builder to write multi-line AI prompt strings without escape characters.

- Records (Java 16+): Considered for DTO (Data Transfer Object) classes, though traditional classes with Lombok were preferred for compatibility with Jackson serialization.

- Sealed interfaces: Not used in this project, but relevant for future type-safe booking item discrimination.

- Pattern matching for instance of: Used in exception handler logic for type-safe error response construction.



-JavaScript / TypeScript

The Voyage frontend is written in JavaScript (ES2022) using React.js 18. TypeScript was considered but not adopted to reduce the learning curve for team members with less frontend experience. Modern JavaScript features used include:



- Async/await for all API calls via Axios

- Destructuring assignment for Zustand store hooks

- Optional chaining (?) for safe navigation of nested API response objects

- Template literals for dynamic class Name construction (Tailwind utility class composition)

- ES Modules (import/export) throughout the frontend codebase



-SQL (MySQL 8 dialect)

MySQL-compatible SQL is used for:

- Database schema definition (CREATE TABLE statements via Spring Boot's spring.jpa.hibernate.ddl-auto=update)

- Seed data insertion (INSERT statements in data.sql executed on startup)

- Performance index creation (executed via schema.sql or Flyway migration in production)



5.2 Used Algorithms



5.2.1 BCrypt Password Hashing Algorithm



BCrypt is an adaptive password hashing algorithm based on the Blowfish cipher, designed to be computationally expensive to resist brute-force and GPU-accelerated dictionary attacks . The algorithm incorporates a cost factor (work factor) that determines the number of iterations performed: the actual iteration count is 2^cost, so cost factor 12 (used in Voyage) performs 4,096 hash iterations.



BCrypt produces a 60-character hash string that encodes the algorithm identifier, cost factor, salt, and hash value:



$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

│  │  │ 

│  │  │  22-char base64-encoded salt + 31-char hash           

│  │  └─ Cost factor = 12                                      

│  └──── BCrypt version = 2a                                 

└─────── Algorithm identifier                                  





Why BCrypt over SHA-256:

SHA-256 is a general-purpose cryptographic hash function optimized for speed — a GPU can compute billions of SHA-256 hashes per second, making it unsuitable for password hashing. BCrypt is intentionally slow: at cost factor 12, it takes ~250ms to compute a single hash on modern hardware, making brute-force attacks approximately 10^9× more expensive than SHA-256 .



Implementation in Voyage: 



java

@Bean

public PasswordEncoder passwordEncoder() {

    return new BCryptPasswordEncoder;

}

```



The `BCryptPasswordEncoder` is defined as a Spring bean and injected into `AuthService` where it is used for both hashing during registration and verification during login:



java

// During registration:

String hashedPassword = passwordEncoder.encode(rawPassword);

user.setPassword(hashedPassword);



// During login:

if (!passwordEncoder.matches(rawPassword, user.getPassword())) {

    throw new BadCredentialsException("Invalid email or password");

}

```



5.2.2 JWT Generation and Validation Algorithm



JSON Web Tokens (JWT) are used in Voyage for stateless authentication. Each JWT consists of three Base64URL-encoded sections separated by dots: Header, Payload (Claims), and Signature .



Header:

json

{ "alg": "HS512", "typ": "JWT" }





Payload (Claims):

json

{

  "sub": "user@example.com",

  "iat": 1733000000,

  "exp": 1733086400

}



- `sub` (subject): the user's email address

- `iat` (issued at): Unix timestamp of token creation

- `exp` (expiry): `iat` + 86,400 seconds (24 hours)



Signature:



HMACSHA512(

  base64url(header) + "." + base64url(payload),

  secretKey

)





The secret key is a 256-bit (32-byte) random string stored in `application.properties` as `jwt.secret`, which is loaded from an environment variable at runtime.



Validation algorithm (executed in `JwtAuthenticationFilter` on every authenticated request):

1. Extract the `Authorization: Bearer <token>` header

2. Remove the "Bearer " prefix to isolate the token string

3. Parse the token using `Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token)`

4. If the signature is invalid → `SignatureException` → HTTP 401

5. If the token is expired → `ExpiredJwtException` → HTTP 401

6. Extract `sub` (email), load `UserDetails` from database

7. Create `UsernamePasswordAuthenticationToken`, set in `SecurityContextHolder`



5.2.3 Loyalty Tier Computation Algorithm



The loyalty tier is a derived state computed from the user's cumulative `loyaltyPoints` balance. The computation algorithm is deliberately simple and synchronous — tier is recomputed and stored on every point balance change, trading write overhead for constant-time read performance (no tier computation needed when reading user data).



Tier thresholds:



BRONZE:   0 ≤ points < 1,000

SILVER:   1,000 ≤ points < 5,000

GOLD:     5,000 ≤ points < 15,000

PLATINUM: points ≥ 15,000





Algorithm (implemented in `LoyaltyService.recomputeTier`):



java

private LoyaltyTier recomputeTier(int points) {

    if (points >= 15000) return LoyaltyTier.PLATINUM;

    if (points >= 5000)  return LoyaltyTier.GOLD;

    if (points >= 1000)  return LoyaltyTier.SILVER;

    return LoyaltyTier.BRONZE;

}





The method is called after every `awardPoints` or `redeemPoints` operation:



java

user.setLoyaltyPoints(newBalance);

user.setTier(recomputeTier(newBalance));

userRepository.save(user);

```



Point earning rate: 1 point per $1.00 spent (integer rounding using `Math.floor`):

java

int pointsToAward = (int) Math.floor(booking.getTotalPrice());





Redemption rate: 100 points = $1.00 wallet credit:

java

double walletCredit = pointsToRedeem / 100.0;





5.2.4 Price Freeze Temporal Validity Algorithm



The Price Freeze expiry check is a time-comparison algorithm executed at booking conversion time:



java

public boolean isFreezeActive(PriceFreeze freeze) {

    return freeze.isActive() && LocalDateTime.now().isBefore(freeze.getExpiresAt());

}





The `expiresAt` timestamp is set at freeze creation time:

java

freeze.setExpiresAt(LocalDateTime.now().plusHours(24));





This algorithm must be executed within the same `@Transactional` context as the booking creation to prevent a time-of-check/time-of-use (TOCTOU) race condition where the freeze expires between the validity check and the booking creation.



5.2.5 RAG Retrieval Algorithm



The Retrieval-Augmented Generation (RAG) retrieval algorithm queries the Voyage MySQL database to build a structured context object that is injected into the AI prompt. The algorithm operates in three parallel retrieval steps:





Input: UserPreferences { destination, budget, duration, travelType }



Step 1: Hotel retrieval

  → HotelRepository.findTop5ByCityOrderByRatingDesc(destination)

  → Returns: List<Hotel> (name, pricePerNight, rating, amenities)



Step 2: Flight retrieval

  → FlightRepository.findTop5ByArrivalCityOrderByPriceAsc(destination)

  → Returns: List<Flight> (airline, flightNumber, price, cabinClass)



Step 3: Tour retrieval

  → TourRepository.findTop5ByLocationContainingOrderByRatingDesc(destination)

  → Returns: List<Tour> (title, price, duration, category)



Output: InventoryContext {

  hotels: [serialized hotel data],

  flights: [serialized flight data],

  tours: [serialized tour data]

}

```



The `InventoryContext` is serialized to JSON and injected into the system prompt before the user message, ensuring the LLM's recommendations are grounded in actual, bookable inventory from the Voyage database.



---



5.3 Dataset





The Voyage system uses a structured seed dataset to populate the demonstration environment with realistic travel inventory. The dataset is loaded from a `data.sql` file that executes automatically when the Spring Boot application starts (when `spring.jpa.hibernate.ddl-auto=create-drop` or `update` is configured). The dataset does not represent real market data; prices, availability, and schedules are illustrative values designed to demonstrate system functionality.





5.3.1 Sample Seed Data



Sample Flight records:



```sql

INSERT INTO flights (airline_name, flight_number, departure_city, departure_city_code,

    arrival_city, arrival_city_code, departure_time, arrival_time,

    duration, price, available_seats, stops, cabin_class, aircraft)

VALUES

  ('EgyptAir', 'MS777', 'Cairo', 'CAI', 'London', 'LHR',

   '2025-12-20 10:00:00', '2025-12-20 15:30:00',

   '5h 30m', 420.00, 120, 0, 'ECONOMY', 'Boeing 787'),



  ('Emirates', 'EK123', 'Dubai', 'DXB', 'Paris', 'CDG',

   '2025-12-21 14:00:00', '2025-12-21 18:45:00',

   '7h 45m', 680.00, 45, 0, 'BUSINESS', 'Airbus A380'),



  ('Turkish Airlines', 'TK701', 'Cairo', 'CAI', 'Istanbul', 'IST',

   '2025-12-22 08:30:00', '2025-12-22 12:45:00',

   '4h 15m', 310.00, 200, 0, 'ECONOMY', 'Boeing 737 MAX');

```



Sample Hotel records:



```sql

INSERT INTO hotels (name, city, location, price_per_night, rating, review_count,

    available_rooms, stars, amenities, latitude, longitude, discount)

VALUES

  ('Kempinski Nile Hotel', 'Cairo', 'Garden City, Cairo, Egypt',

   185.00, 4.7, 2341, 15, 5,

   'Pool,Spa,WiFi,Restaurant,Bar,Fitness Center,Concierge',

   30.0444, 31.2357, 15),



  ('Burj Al Arab Jumeirah', 'Dubai', 'Jumeirah Beach Road, Dubai, UAE',

   1200.00, 4.9, 8902, 5, 5,

   'Private Beach,Helipad,Butler Service,Pool,Spa,Multiple Restaurants',

   25.1412, 55.1853, 0),



  ('Hotel Le Marais', 'Paris', '3rd Arrondissement, Paris, France',

   220.00, 4.5, 1567, 20, 4,

   'WiFi,Breakfast Included,Concierge,Air Conditioning',

   48.8566, 2.3522, 10);

```



Sample Country records:



```sql

INSERT INTO countries (name, code, continent, description, currency, language, timezone, popular)

VALUES

  ('Egypt', 'EG', 'Africa',

   'Home to ancient wonders including the Great Pyramids, the Sphinx, and the Valley of the Kings. Egypt offers a unique blend of ancient history and modern Mediterranean culture.',

   'Egyptian Pound (EGP)', 'Arabic', 'Africa/Cairo', true),



  ('United Arab Emirates', 'AE', 'Asia',

   'A federation of seven emirates known for ultramodern architecture, luxury shopping, and the world’s tallest building. The UAE has transformed from a pearl-diving economy to a global tourism hub.',

   'UAE Dirham (AED)', 'Arabic', 'Asia/Dubai', true),



  ('France', 'FR', 'Europe',

   'The world''s most visited country, home to the Eiffel Tower, world-class cuisine, and the Loire Valley châteaux. France receives over 90 million visitors annually.',

   'Euro (EUR)', 'French', 'Europe/Paris', true);

```







5.4 Code Snapshots



This section presents annotated code snapshots from the most significant implementation components of the Voyage backend and frontend.



5.4.1 Backend: Security Configuration



The following code snapshot shows the Spring Security 6 configuration class that establishes the JWT filter chain, CSRF policy, session management, and endpoint authorization rules:



```java

// SecurityConfig.java

@Configuration

@EnableWebSecurity

@RequiredArgsConstructor

public class SecurityConfig {



    private final JwtAuthenticationFilter jwtAuthFilter;

    private final UserDetailsService userDetailsService;



    @Bean

    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

            .csrf(AbstractHttpConfigurer::disable)         // CSRF disabled: JWT replaces CSRF tokens

            .sessionManagement(session ->

                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Public endpoints: browsable without authentication

                .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()

                .requestMatchers(HttpMethod.GET,

                    "/flights/**", "/hotels/**", "/tours/**",

                    "/countries/**", "/cities/**", "/landmarks/**",

                    "/packages/**", "/recommendations/**", "/reviews/**"

                ).permitAll()

                .requestMatchers(HttpMethod.POST, "/ai/**").permitAll()

                // All other endpoints require authentication

                .anyRequest().authenticated()

            )

            .authenticationProvider(authenticationProvider())

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();

    }



    @Bean

    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;

    }



    @Bean

    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder(12);

    }



    @Bean

    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)

            throws Exception {

        return config.getAuthenticationManager();

    }

}

```



5.4.2 Backend: JWT Authentication Filter



The `JwtAuthenticationFilter` intercepts every HTTP request, extracts the JWT from the Authorization header, validates it, and populates the Spring Security context:



```java

// JwtAuthenticationFilter.java

@Component

@RequiredArgsConstructor

public class JwtAuthenticationFilter extends OncePerRequestFilter {



    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;



    @Override

    protected void doFilterInternal(HttpServletRequest request,

                                    HttpServletResponse response,

                                    FilterChain filterChain)

            throws ServletException, IOException {



        final String authHeader = request.getHeader("Authorization");



        // Skip filter if no Bearer token present

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            return;

        }



        final String jwt = authHeader.substring(7);  // Remove "Bearer " prefix

        final String userEmail = jwtService.extractUsername(jwt);



        // Only authenticate if user is not already authenticated in this request

        if (userEmail != null &&

                SecurityContextHolder.getContext().getAuthentication() == null) {



            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);



            if (jwtService.isTokenValid(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =

                    new UsernamePasswordAuthenticationToken(

                        userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(

                    new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);

            }

        }



        filterChain.doFilter(request, response);

    }

}

```



5.4.3 Backend: User Registration with OTP



The registration flow creates a user record, generates a cryptographically random OTP, and sends it via Gmail SMTP:



```java

// AuthService.java (registration method)

@Transactional

public AuthResponse register(RegisterRequest request) {

    // Check email uniqueness

    if (userRepository.existsByEmail(request.getEmail())) {

        throw new EmailAlreadyExistsException("Email already registered");

    }



    // Generate 6-digit OTP

    String otp = String.format("%06d", new SecureRandom().nextInt(999999));



    User user = User.builder()

        .fullName(request.getFullName())

        .email(request.getEmail())

        .password(passwordEncoder.encode(request.getPassword()))

        .emailVerified(false)

        .otpCode(otp)

        .otpExpiresAt(LocalDateTime.now().plusMinutes(10))

        .loyaltyPoints(0)

        .tier(LoyaltyTier.BRONZE)

        .walletBalance(BigDecimal.ZERO)

        .build();



    userRepository.save(user);



    // Send OTP email via Gmail SMTP

    SimpleMailMessage message = new SimpleMailMessage();

    message.setTo(request.getEmail());

    message.setSubject("Voyage — Verify Your Email");

    message.setText("Your verification code is: " + otp +

                    "\n\nThis code expires in 10 minutes.");

    mailSender.send(message);



    return AuthResponse.builder()

        .message("Registration successful. Please check your email for the OTP.")

        .build();

}

```



5.4.4 Backend: Booking Engine with @Transactional



The booking service demonstrates ACID transaction management — all operations (inventory check, decrement, payment deduction, loyalty award) execute atomically:



```java

// BookingService.java

@Transactional

public BookingResponse createBooking(BookingRequest request, String userEmail) {

    User user = userRepository.findByEmail(userEmail)

        .orElseThrow(() -> new ResourceNotFoundException("User not found"));



    Booking booking = new Booking();

    booking.setUser(user);

    booking.setBookingDate(LocalDateTime.now());

    booking.setStatus(BookingStatus.CONFIRMED);



    BigDecimal totalPrice;



    // Polymorphic inventory handling

    if (request.getFlightId() != null) {

        Flight flight = flightRepository.findById(request.getFlightId())

            .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));



        // Availability check

        if (flight.getAvailableSeats() < request.getPassengerCount()) {

            throw new InsufficientInventoryException("Insufficient seats available");

        }



        // Atomic inventory decrement

        flight.setAvailableSeats(flight.getAvailableSeats() - request.getPassengerCount());

        flightRepository.save(flight);



        totalPrice = flight.getPrice().multiply(

            BigDecimal.valueOf(request.getPassengerCount()));

        booking.setFlight(flight);



    } else if (request.getHotelId() != null) {

        Hotel hotel = hotelRepository.findById(request.getHotelId())

            .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));



        if (hotel.getAvailableRooms() < 1) {

            throw new InsufficientInventoryException("No rooms available");

        }



        hotel.setAvailableRooms(hotel.getAvailableRooms() - 1);

        hotelRepository.save(hotel);



        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        totalPrice = hotel.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        booking.setHotel(hotel);

    }

    // ... similar branches for tour and package



    // Wallet payment deduction

    if (user.getWalletBalance().compareTo(totalPrice) < 0) {

        throw new InsufficientBalanceException("Insufficient wallet balance");

    }

    user.setWalletBalance(user.getWalletBalance().subtract(totalPrice));

    booking.setTotalPrice(totalPrice);

    booking.setPaid(true);



    Booking savedBooking = bookingRepository.save(booking);



    // Award loyalty points

    loyaltyService.awardPoints(user, totalPrice);



    return BookingResponse.builder()

        .transactionId(savedBooking.getTransactionId())

        .confirmationCode(savedBooking.getConfirmationCode())

        .totalPrice(totalPrice)

        .status(BookingStatus.CONFIRMED)

        .build();

}

```



5.4.5 Backend: Loyalty Service



The loyalty service manages point earning, tier computation, and point redemption:



```java

// LoyaltyService.java

@Service

@RequiredArgsConstructor

public class LoyaltyService {



    private final UserRepository userRepository;

    private final LoyaltyTransactionRepository transactionRepository;



    private static final int SILVER_THRESHOLD  = 1000;

    private static final int GOLD_THRESHOLD    = 5000;

    private static final int PLATINUM_THRESHOLD = 15000;

    private static final int MIN_REDEMPTION    = 500;

    private static final int POINTS_PER_DOLLAR = 100; // for redemption



    @Transactional

    public void awardPoints(User user, BigDecimal bookingTotal) {

        int points = bookingTotal.intValue(); // 1 point per $1

        int newBalance = user.getLoyaltyPoints() + points;



        user.setLoyaltyPoints(newBalance);

        user.setTier(recomputeTier(newBalance));

        userRepository.save(user);



        LoyaltyTransaction tx = LoyaltyTransaction.builder()

            .user(user)

            .delta(points)

            .reason(LoyaltyReason.EARN_BOOKING)

            .createdAt(LocalDateTime.now())

            .build();

        transactionRepository.save(tx);

    }



    @Transactional

    public RedemptionResponse redeemPoints(User user, int pointsToRedeem) {

        if (pointsToRedeem < MIN_REDEMPTION) {

            throw new ValidationException("Minimum redemption is 500 points");

        }

        if (user.getLoyaltyPoints() < pointsToRedeem) {

            throw new ValidationException("Insufficient loyalty points");

        }



        double walletCredit = pointsToRedeem / (double) POINTS_PER_DOLLAR;

        int newBalance = user.getLoyaltyPoints() - pointsToRedeem;



        user.setLoyaltyPoints(newBalance);

        user.setTier(recomputeTier(newBalance));

        user.setWalletBalance(

            user.getWalletBalance().add(BigDecimal.valueOf(walletCredit)));

        userRepository.save(user);



        LoyaltyTransaction tx = LoyaltyTransaction.builder()

            .user(user)

            .delta(-pointsToRedeem)  // Negative delta for redemption

            .reason(LoyaltyReason.REDEEM)

            .createdAt(LocalDateTime.now())

            .build();

        transactionRepository.save(tx);



        return RedemptionResponse.builder()

            .pointsRedeemed(pointsToRedeem)

            .walletCreditAdded(walletCredit)

            .newPointsBalance(newBalance)

            .newTier(user.getTier())

            .build();

    }



    private LoyaltyTier recomputeTier(int points) {

        if (points >= PLATINUM_THRESHOLD) return LoyaltyTier.PLATINUM;

        if (points >= GOLD_THRESHOLD)     return LoyaltyTier.GOLD;

        if (points >= SILVER_THRESHOLD)   return LoyaltyTier.SILVER;

        return LoyaltyTier.BRONZE;

    }

}

































































































Chapter 6: Results and Validation



 6.1 Application Screen Shots



This chapter presents the results of the Voyage system implementation through the Lense: Application Screenshots, visual evidence of the functional system across all major feature areas.



 

This section documents each major feature of the Voyage application through screenshots. The screenshots below represent the actual running system captured from the development environment (React frontend at localhost:5173, Spring Boot backend at localhost:8080, MySQL database populated with seed data).





6.1.1 Screenshot List and Descriptions



Screenshot 1 Home Page (Hero Section)







The Voyage home page showing the full-width hero section with background travel imagery, the floating Glass morphism search panel with tabs for Flights/Hotels/Tours/Packages, and the navigation bar with logo.









Screenshot 2 Flight Search Results









The flight search results page showing a list of flight cards with filter sidebar on the left. Each card shows airline logo, flight number, departure/arrival times, duration, stops, price, and "Book" / "Freeze Price" buttons.



Screenshot 3 Hotel Detail Page 





































































The hotel detail page showing the hotel image gallery at top, booking form in the right column (check-in/check-out date pickers, price summary, Book Now button)



Screenshot 4 AI Trip Planner























The AI Trip Planner page showing the preference form on the left (destination, budget, duration, party size, interests’ checkboxes) and the generated day-by-day itinerary on the right, displayed in a chat bubble style with "Voyage AI" avatar.







Screenshot 5 My Bookings Page





































The My Bookings page shows a timeline-style list of booking cards. Each card shows: booking type icon (plane/hotel/tour), destination, dates, transaction ID, total price, status badge (CONFIRMED in green / CANCELLED in red / PENDING in amber), and a "Cancel" button for CONFIRMED bookings.









Screenshot 6 User Profile Page

































































Screenshot 7 Destinations Discovery with Google Maps















































The Destinations page showing country cards in a grid layout and a Google Maps panel showing hotel and landmark markers for the selected destination.





  Chapter 7: Conclusion and Future Work

7.1 Conclusion





This report has presented the complete software engineering lifecycle of Voyage: An AI-Powered Booking & Travel Management System developed as a graduation project at the College of Information Technology, Misr University for Science and Technology.



7.1 Achievement of Objectives



The project has successfully achieved all primary and secondary objectives defined in Chapter 1.



Primary Objective 1 Unified Booking Engine: 

Voyage delivers a single-platform booking experience encompassing flights, hotels, tours, and bundled travel packages. The `Booking` entity's polymorphic design — using nullable foreign keys (`flight_id`, `hotel_id`, `tour_id`, `package_id`) rather than JPA inheritance — accommodates all four booking types within a single database table and a single API endpoint (`POST /bookings`). Booking lifecycle management (PENDING → CONFIRMED → CANCELLED) and inventory decrement atomicity are guaranteed by Spring's `@Transactional` semantics, ensuring that no booking can be confirmed without a corresponding successful inventory check and wallet deduction within the same ACID transaction.



Primary Objective 2 Price Freeze Financial Instrument:

 The Price Freeze mechanism is implemented as a first-class financial instrument with no direct equivalent in any of the five surveyed competing platforms. The `PriceFreeze` entity records the frozen price, freeze fee, and expiry timestamp. The service layer enforces temporal validity using a time-comparison algorithm executed within the booking transaction. The booking flow honors the `frozenPrice` within the active 24-hour window regardless of any market price changes that occur during the deliberation period. This feature directly addresses Problem 2 (Price Volatility Risk) identified in Chapter 1.



Primary Objective 3 AI-Powered Trip Planner (RAG): 

The Gemini 2.5 Pro-powered Trip Planner implements Retrieval-Augmented Generation through a three-component pipeline: `RetrievalService` → `PromptBuilder` → `GeminiClient`. Real Voyage inventory (hotels, flights, tours) is retrieved from MySQL and injected into the AI prompt before the user message is sent to the Gemini API. This grounding ensures that AI recommendations reference actual, bookable items with real prices — a capability demonstrated to be superior to the training-data-only approach used by Trip.com's TripGenie competitor. Multi-turn conversation support (via session IDs and in-memory conversation history) enables iterative plan refinement.



Primary Objective 4 AI Customer Support: 

The AI support assistant integrates the platform's FAQ content and the authenticated user's booking history as context, delivering personalized, grounded responses to common travel queries. The backend-proxy architecture (`POST /ai/support`) ensures the Gemini API key is never exposed in client-side JavaScript, satisfying the security requirement FR-51.



Primary Objective 5-Tiered Loyalty Rewards Program: 

The four-tier loyalty program (Bronze → Silver → Gold → Platinum) with transparent earning (1 pt/$1) and redemption (100 pts=$1) mechanics is fully implemented and backed by an auditable `LoyaltyTransaction` ledger. The tier recomputation algorithm runs synchronously with every point balance change, ensuring the displayed tier is always current without requiring a separate computation step at read time. The minimum redemption threshold (500 points) protects against micro-redemption abuse.



Secondary Objectives: 

All six secondary objectives have been implemented and validated through UAT:

- JWT + OTP authentication with BCrypt password hashing (Objective 6) ✓

- Booking-gated reviews with duplicate prevention (Objective 7) ✓

- Polymorphic wishlist supporting all inventory types (Objective 8) ✓

- Geographic discovery with Countries/Cities/Landmarks (Objective 9) ✓

- Google Maps integration on the destinations page (Objective 9) ✓

- Glassmorphism "Ethereal Traveler" UI design system (Objective 11) ✓













7.1.2 Technical Contributions



The Voyage project demonstrates the practical application of several advanced software engineering patterns that are not commonly taught in isolation in academic curricula, but which are essential in industry practice:



Retrieval-Augmented Generation (RAG) for grounding LLM outputs*in domain-specific, real-time database content — bridging the gap between generic AI capabilities and the actionable recommendations required in a commercial booking context.



Polymorphic entity design using nullable foreign keys as a pragmatic alternative to JPA inheritance for a multi-type booking model, trading a minor amount of column sparsity for significantly simpler query patterns and JPA configuration.



Backend-proxy AI integration pattern for secure LLM API access from web applications — ensuring that API keys for paid/rate-limited services are never exposed in client-side code or browser network traffic.



Tiered loyalty program with synchronously derived state storing the computed tier on the User entity rather than computing it at read time, trading a small amount of write overhead for constant-time tier reads. This pattern scales better than on-read computation for systems with high read-to-write ratios (typical of OTA platforms).



JWT-based stateless authentication with Spring Security 6's modern lambda API demonstrating the practical transition from the deprecated `WebSecurityConfigurerAdapter` pattern to the `SecurityFilterChain` bean approach required by Spring Boot 3.



7.1.3 Summary



Voyage represents a comprehensive demonstration of full-stack software engineering applied to a commercially relevant domain. The system integrates academic principles (UML modeling, formal requirements specification, V-model-inspired testing) with industry-standard technologies (Spring Boot 3, React 18, JWT, MySQL 8, Gemini AI, Google Cloud Storage) to produce a system that is not only theoretically sound but practically functional and demonstrable.



The Price Freeze mechanism and the RAG-based AI Trip Planner are differentiating innovations that elevate Voyage beyond a standard CRUD booking application, demonstrating the team's ability to design and implement non-trivial system features that require careful consideration of financial logic, temporal state management, and AI engineering constraints (budget, rate limits, prompt design).





7.1.4 Limitations



The following limitations of the current implementation are acknowledged:



Limitation 1 Simulated Inventory:

Flight, hotel, and tour data is static seed data rather than real-time data from airline GDS (Global Distribution System) APIs or hotel Property Management System (PMS) integrations. Prices and availability do not reflect actual current market conditions. This limits the system's practical utility for real travel planning but is entirely appropriate for an academic demonstration within the CON-05 budget constraint.



Limitation 2 Simulated Payments:

No actual monetary transactions occur. The system models payment as a deduction from an in-system wallet balance, which is pre-loaded with seed data. Integration with a live payment gateway (Stripe, PayPal, or a regional processor such as Paymob for the Egyptian market) is required for production deployment and would introduce PCI DSS compliance considerations that are beyond the scope of this project.



Limitation 3 No OTP Brute-Force Lockout:

The OTP verification system does not lock a user's account after repeated failed OTP submissions. A malicious actor could automate OTP guessing (10^6 possible 6-digit codes) without being blocked, though the 10-minute expiry window limits the practical attack surface. This is documented as security gap SEC-09 in Chapter 6 and is a High-priority item in the Future Work roadmap.



Limitation 4 In-Memory AI Session Store:

Multi-turn Trip Planner conversation sessions are stored in a Java `HashMap` in the backend process heap memory. This state is lost on application restart and is not shared between horizontally scaled instances. For a production multi-instance deployment behind a load balancer, this design would cause session continuity failures.









Limitation 5 English-Only Interface:

No internationalization (i18n) has been implemented. Arabic language support relevant given the MUST academic context and the regional travel market that platforms like Flyin.com serve — is deferred to a future version.



Limitation 6 No Real-Time Price Change Notifications:

The Price Freeze mechanism and the Wishlist feature do not notify users when prices change after they have saved an item or after a freeze expires. Real-time push notifications would require WebSocket integration or a scheduled background job, which was not implemented within the project timeline.









7.2 Future Work

























































































 

REFERENCES

Books: 

[1] I. Sommerville, *Software Engineering*, 10th ed. Hoboken, NJ: Pearson Education, 2016. ISBN: 978-0133943030.



[2] E. Yourdon, *Modern Structured Analysis*. Englewood Cliffs, NJ: Prentice-Hall, 1989. ISBN: 0-13-598632-8.



[3] M. Fowler, *Patterns of Enterprise Application Architecture*. Boston, MA: Addison-Wesley, 2002. ISBN: 978-0321127426.



[4] C. Walls, *Spring Boot in Action*. Shelter Island, NY: Manning Publications, 2016. ISBN: 978-1617292545.



[5] M. Cohn, *User Stories Applied: For Agile Software Development*. Boston, MA: Addison-Wesley, 2004. ISBN: 978-0321205681.



[6] K. Wiegers and J. Beatty, *Software Requirements*, 3rd ed. Redmond, WA: Microsoft Press, 2013. ISBN: 978-0735679665.



[7] D. Buhalis and R. Law, "Progress in information technology and tourism management: 20 years on and 10 years after the Internet — The state of eTourism research," *Tourism Management*, vol. 29, no. 4, pp. 609–623, 2008.



[8] Ian Sommerville, "Software Engineering" Pearson, 10th Edition, ISBN: 978-0133943030, 2015.





Journals or Periodicals: 

[1] Statista, "Online travel market statistics & facts," 2024

[2] Booking Holdings Inc., "Annual Report 2023," Investor Relations, 2024 

[3] Airbnb, "Airbnb 2023 Annual Report," Investor Relations, 2024 





URL: 



[1]	Spring Boot Reference Documentation — Pivotal/VMware, 2026	https://spring.io/projects/spring-boot

[2]	React – The Library for Web and Native User Interfaces — Meta, 2026	https://react.dev

[3]	Zustand — Bear necessities for state management in React — GitHub, 2024	https://github.com/pmndrs/zustand

[4]	Gemini API Reference — Google AI for Developers, 2025	https://ai.google.dev/api

[5]	Google Cloud Storage Documentation — Google Cloud, 2024	https://cloud.google.com/storage/docs

[6]	MySQL 8.0 Reference Manual: The InnoDB Storage Engine — Oracle, 2025	https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html

[7]	three.js – JavaScript 3D Library — Three.js Organization, 2026	https://threejs.org

[8]	Google Maps JavaScript API — Google Developers, 2025	https://developers.google.com/maps/documentation/javascript

[9]	JUnit 5 User Guide — JUnit.org, 2026	https://junit.org/junit5/docs/current/user-guide/

[10]	Postman — API Development Environment — Postman Inc., 2024	https://www.postman.com

[11]	Levels in Data Flow Diagrams (DFD) — GeeksforGeeks, 2026	https://www.geeksforgeeks.org/levels-in-data-flow-diagrams-dfd/



[12] "Spring Boot Reference Documentation," Pivotal Software / VMware, 2024. Available: https://spring.io/projects/spring-boot



[13] Meta Open Source, "React – The Library for Web and Native User Interfaces," 2024. Available: https://react.dev



[14] "Zustand — Bear necessities for state management in React," GitHub, 2024. [Online]. Available: https://github.com/pmndrs/zustand



[15] Google, "Gemini API Reference," Google AI for Developers, 2024. [Online]. Available: https://ai.google.dev/api



[16] "Google Cloud Storage Documentation," Google Cloud, 2024. [Online]. Available: https://cloud.google.com/storage/docs



[17] Oracle, "MySQL 8.0 Reference Manual: The InnoDB Storage Engine," Oracle Corporation, 2024. [Online]. Available: https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html



[18] "three.js – JavaScript 3D Library," Three.js Organization, 2024. [Online]. Available: https://threejs.org



[19] "Google Maps JavaScript API," Google Developers, 2024. [Online]. Available: https://developers.google.com/maps/documentation/javascript



[20] "JUnit 5 User Guide," JUnit.org, 2024. [Online]. Available: https://junit.org/junit5/docs/current/user-guide/



[21] "Postman — API Development Environment," Postman Inc., 2024. [Online]. Available: https://www.postman.com



[22] "Levels in Data Flow Diagrams (DFD)," GeeksforGeeks, 2024. [Online]. Available: https://www.geeksforgeeks.org/levels-in-data-flow-diagrams-dfd/



[23] "Booking.com," [Online]. Available: https://www.booking.com



[24] "Agoda," [Online]. Available: https://www.agoda.com



[25] "Flyin.com," [Online]. Available: https://www.flyin.com



[26] "Expedia," [Online]. Available: https://www.expedia.com



[27] "Airbnb," [Online]. Available: https://www.airbnb.com



[28] "Trip.com," [Online]. Available: https://www.trip.com



[29] Booking Holdings Inc., "Annual Report 2023," Booking Holdings Investor Relations, 2024.







الملخص	

 يتسم مشهد حجز السفر الحديث بالتشتت، حيث يتعين على المسافرين التنقل بين تطبيقات متعددة غير متصلة لتخطيط رحلة واحدة، متنقلين بين وكالات السفر الإلكترونية للرحلات الجوية، ومنصات حجز الفنادق، وخدمات حجز تذاكر الرحلات السياحية، ومحولات العملات، ومخططات مسارات الرحلات. يُؤدي هذا التشتت إلى زيادة العبء المعرفي، ومخاطر عدم اتساق الأسعار، وتجربة ما بعد الحجز غير المترابطة.



يقدم مشروع التخرج هذا Voyage وهو نظام متكامل للسفر يجمع بين حجوزات الطيران، وحجوزات الفنادق، وحجز تذاكر الرحلات السياحية، وشراء الباقات السياحية في تطبيق ويب واحد متكامل. يتميز Voyage عن المنصات الحالية بثلاث ميزات مبتكرة: أداة مالية لتثبيت السعر** تُمكّن المسافرين من تثبيت سعر مُحدد لمدة 24 ساعة مقابل رسوم رمزية، مما يحميهم من تقلبات السوق أثناء تفكيرهم في الحجز؛ مخطط رحلات مدعوم بالذكاء الاصطناعي** مبني على منصة جوجل Gemini 2.5 Pro LLM مع تقنية Retrieval-Augmented Generation (RAG)، مما يربط مخرجات الذكاء الاصطناعي بوحدات الحجز الفعلية المتاحة في قاعدة بيانات المنصة؛ و(3) برنامج مكافآت ولاء متعدد المستويات (برونزي ← فضي ← ذهبي ← بلاتيني) بآليات شفافة لكسب المكافآت واستردادها، مدعومة بسجل معاملات قابل للتدقيق.



يعتمد النظام على بنية ثلاثية الطبقات: واجهة أمامية React.js (Vite) مع إدارة حالة Zu stand ونظام تصميم Glass morphism؛ وواجهة خلفية Java Spring Boot 3 مع Spring Security 6 (مصادقة بدون حالة قائمة على JWT، وتشفير كلمات المرور Crypt)؛ وقاعدة بيانات علائقية MySQL 8 مع عمليات معاملات متوافقة مع معايير ACID. تشمل التكاملات الإضافية Google Cloud Storage للأصول الإعلامية، وواجهة برمجة تطبيقات Google Maps JavaScript للاكتشاف الجغرافي، وThree.js لمعاينات الفنادق بتقنية الواقع المعزز، وواجهة برمجة تطبيقات Google Gemini لميزات الذكاء الاصطناعي.





جامعة مصر للعلوم والتكنولوجيا 

كلية تكنولوجيا المعلومات

تقرير مقدم كمتطلب مشروع التخرج للحصول على درجة البكالوريوس في تكنولوجيا المعلومات 

نظام حجز للرحلات الجوية والفنادق

مقدم من

ألاء وليد                                       200016680                                قسم علوم حاسب 

محمود أحمد                                    20003181                                قسم علوم حاسب

فيلوباتير شفيق                               200046194                                 قسم علوم حاسب

مازن عماد                                   200026541                                 قسم علوم حاسب

مريم شعبان                                          98044                                 قسم علوم حاسب

إبراهيم هشام                                 200031536                                قسم علوم حاسب

تحت إشراف

ا.د./ ياسر الحبيبي


 حبيبة مدحت/م

 ميار محمد/م
مايو / ٢٠٢6