# MACH Technology Transformation

**AKA 'Project MATT'** (previously known as 'UXL Project')

*April 2026*

---

## Contents

1. [Executive Summary](#executive-summary)
2. [Discovery Phase Summary](#discovery-phase-summary)
3. [One BSAVA](#one-bsava)
4. [Native App Replacement](#native-app-replacement)
5. [Workato Integration](#workato-integration)
6. [Conclusion](#conclusion)

---

## Executive Summary

Timberyard were initially engaged to carry out a six week discovery phase for a website refresh and front end build. However, the process quickly revealed the extent of the technology change required, including a centralised product catalogue and federated search functionality.

The outcome of the discovery phase was a clearly defined MACH architecture with existing technology (Ingenta, Swoogo and Brightspace) retained for key elements of the customer experience such as the BSAVA Library.

Further to the discovery phase, which included a PWA in scope, requirements for a Native App replacement have been submitted as well as the need for integration to Workato. These have been reviewed and a mini discovery phase carried outside of the initial discovery scope.

This document serves to outline our approach and delivery plan for the three workstreams:

1. **Technology transformation**
2. **Native App replacement**
3. **Workato integration**

> Delays post discovery have increased the risk to the timeline.

---

## Discovery Phase Summary

### Our Process

| Phase | Description |
|-------|-------------|
| **Discover** | Through a series of workshops, we discovered strengths and weaknesses and mapped the customer journey flows, features, and identified journey friction elements. Evaluation of the tech stack supporting the customer journeys and its future scalability. |
| **Define** | Requirements and feature definition. Customer journeys, CX design and User Stories. Product validation and sign off. Team mobilisation. Governance set up and running. |
| **Develop** | Development of the BSAVA site. Defined and approved in the previous phase; during this implementation phase we leverage best practices in agile software development from design to deployment. |

**Discover outputs:**
- Current state and stakeholder analysis
- Customer journey/process map and key pain points and opportunities
- Overview of technical stack and data management throughout customer journey flow
- Technical challenges and considerations, including alignment to broader transformation

**Define outputs:**
- Alignment on key scope and experience to be delivered in Phase 1
- Create PoC for demo
- Ready to mobilise resources for successful delivery with governance, ways of working, and reporting mechanisms
- Define KPIs and measurable outcomes to track progress and ensure impact

**Develop outputs:**
- Development of agreed requirements
- Project management and stakeholder demos
- Management of risk, budget, schedule and resourcing
- Test management and UAT (User Acceptance Testing)

### Discovery Workshops

The discovery workshops helped us surface current strengths and weaknesses by mapping the customer journey flows, features, and data quality as well as evaluate the tech stack that supports customer journeys and assess its future scalability.

**Customer Process Review:**
- UX review/audit of current customer process design (and any data available)
- Map business process to supporting systems and technical architecture
- Identify strengths and weakness in customer experience including internal stakeholders' assessment, competitor benchmarking and expert review
- Identify value creation opportunities

**Tech Stack Discovery:**
- Overview of current architecture and platform
- Review current technical integrations including CRM and external/3rd party integration and recommend changes/improvements
- Options for advancement platform to support aligned and improved customer experience ambitions and data quality
- This workstream remains aligned to the customer journey mapping one

### Headline Findings

| Area | Now | Future |
|------|-----|--------|
| **UX** | Journey fragmentation; Search & navigation issues; Inconsistent product metadata and taxonomy; Hard to syndicate product content across channels | Easier and seamless journeys; Single product truth, taxonomy, and governance; Centralised repository and taxonomy/classification; Helpful search |
| **CMS** | Rigid content models, limited reuse; Developer dependency for routine changes; Workflow constraints (review, approval, scheduling); Inconsistent content governance | Structured content modelling and component library; Role-based workflow and approvals; API-first integration with commerce and PIM; Multi-channel publishing readiness |
| **E-commerce** | Checkout friction and cart complexity; Pricing and discount rules hard to manage; Limited bundling and subscription support; Analytics integration and experimentation limited | Unified cart, consistent and relevant pricing (member/non-member); Bundles and promotions engine; Reliable payments and order flows; Instrumentation for funnel analytics |

### Discovery Conclusions

**Considerations:**
- Data migration complexity (products, content, SEO)
- Integration instability across CMS, commerce, PIM, CRM, identity
- Member disruption at go-live (journeys, pricing, login)
- Scope creep / decision delays impacting September delivery
- Capability constraints (product, data stewardship, content ops)

**Proposals:**
- Deliver a member-first UX supported by composable CMS + commerce + PIM
- Lead with taxonomy and data governance; build reusable CMS components
- Iterate through MVP to optimisation within a 12-sprint delivery plan

**Mitigations:**
- PIM-first approach; phased migration waves; parallel run where required
- Integration testing from Sprint 5; automated regression tests
- Go-live readiness gates; hypercare with clear KPIs and escalation
- Governance with decision SLAs; disciplined backlog management
- Defined roles/RACI; training and change plan

> *This is a growth and capability enablement investment (not a technology refresh), whose objective is to deliver a unified member-first experience underpinned by modern content and product data foundations with a streamlined technology platform.*

**Next Steps:**
1. Approval from BSAVA for Timberyard to mobilise and commence delivery phase asap
2. Concurrently, delivery phase SOW to be submitted for signature
3. Provide summarised version of this deck for board presentation content (where required)

---

## One BSAVA

### Context

A unified, member-first platform is required to unlock growth.

| Problem | Solution | Outcome |
|---------|----------|---------|
| Fragmented journeys and systems | Single login (SSO) | Seamless journeys |
| Limited discoverability and search | Federated search | Increased usage |
| Commerce and data constraints | Single source of truth | Stronger commercial performance |

> Current fragmentation is driving friction, inefficiency, and lost revenue.

### Expected Gains

- **Improved navigation and access**
- **Higher conversion and AOV**
- **Reduced operational overhead**

### Composable Architecture (MACH) Overview

An expanded architecture is required to provide extended functionality and services to support a mobile app and future propositions.

| Principle | Description |
|-----------|-------------|
| **Microservices** | A modern architecture that enables full agility across your technical teams |
| **API first** | 100% API-centric means you can consume any functionality and integrate with partners |
| **Cloud-native** | Multi-tenant, cloud native platform is always available and can manage peak load periods |
| **Headless** | A fully flexible, custom-built frontend that lets you create the customer experience you want |

### Benefits of Composable Architecture

- Different services can be developed and maintained independently — creating more flexible and modular e-commerce systems
- Different services can be scaled up or down independently on demand, allowing the system to handle fluctuating traffic
- Better integration with other systems and third-party tools, enabling a more seamless user experience
- Developers can use the programming language they are most familiar with without relying on costly specialists
- Enables rapid iteration and the ability to make changes quickly, making it easier to respond to changing market conditions

### Target Architecture

**Key principles considered:**
- **Composable architecture:** flexibility, faster change, lower vendor lock-in risk
- **PIM as backbone:** taxonomy, governance, and syndication to CMS and commerce. Shared taxonomy powering search and navigation
- **Operational model:** clear ownership, decision SLAs, and measurable outcomes
- **API-first;** avoid point-to-point sprawl
- **Instrumentation** embedded for analytics
- **Future facing:** flexible and scalable for future requirements

**Core capabilities:**
- Unified search
- Single checkout
- Consistent pricing and bundling

### Progressive Web App (PWA)

> *A PWA is a type of application software built with web technologies (HTML, CSS, JavaScript) that delivers a native-like experience on any device. They are web-based, installable, work offline, and provide fast, secure, and engaging experiences similar to mobile apps, but without needing an app store.*

| Current State | Strategic Shift | Benefits |
|---------------|----------------|----------|
| Separate platform with duplicated functionality | Single platform across desktop, tablet, and mobile | Faster time to market and continuous improvement |
| Higher maintenance overhead (iOS, Android, releases) | No app store dependency (instant access via browser) | Reduced development and operational cost |
| Limited flexibility for rapid iteration | Centralised updates with no user downloads | Consistent "One BSAVA" experience across all channels |
| | Fully integrated with CMS, commerce, and identity | Margin and revenue protection (no app store fees) |

**Future optionality:**
- Progressive Web App enhancements (offline, push notifications)
- Native apps can be layered later if required
- Integrated calculator capability

### Delivery Plan

A 12-sprint delivery plan enables go-live within six months with parallel workstreams, early integration testing, and clear milestones.

```
March     April      May        June       July       August     Sept
  |----------|----------|----------|----------|----------|----------|
  Mobilise   Platform   Product &  E-Commerce Unified   Data       Go
  Arch.      setup      content    capability UX        Migration  live
  alignment             integration                     & UAT
             |                     |                    |          |
             Architecture          Commerce             Unified    Go-live
             approved              ready                UX live
```

- **Foundation validated (end April):** taxonomy, data models, core integrations defined
- **End-to-end functional flow in staging (end June):** CMS + PIM + commerce connected
- **Production-ready (end August):** UAT complete, migration complete, go-live checklist signed off
- **Go-live and hypercare (September):** monitored stabilisation and benefits tracking

**Key risks** are understood and can be mitigated through phased migration, testing and readiness gates, and strong governance.

### Delivery Team

| Name | Role |
|------|------|
| Marco | Project Lead |
| Tim | Solutions Architect |
| Sam | UX Lead |
| Kate | Senior UX |
| Mark | Tech Lead / Developer |
| Franz | Senior Developer |
| Lynette | Senior Developer |
| Graeme | Analytics Specialist |
| Chelsea | SEO Specialist |

---

## Native App Replacement

### Revised Proposal

- Replace existing app alongside core MACH transformation project
- Leverage new architecture and shared platform with website
- Deliver focused member experience including SSO (core project dependency)
- Enable future scalability for additional scope and functionality
- Potential for implementation cost benefit versus bespoke/standalone app build

> **Executive overview:** This is a delivery of an app with a differentiated and reduced functionality versus the progressive web app (PWA) and with a native wrapper in order to replace the existing app in the Apple App Store and Google Play Store. The new native app will leverage the MACH architecture being put in place in the technology transformation delivery.

### Overview Plan

**Objectives:**
- Replace existing app via upgrade
- Reuse shared platform with website
- Introduce modern authentication
- Deliver focused, high-utility experience

**Delivery Model:**
- 1 UX/Product Designer
- 1 Full-stack Developer
- Light QA / DevOps support
- Heavy reuse of website components

**Sprint Breakdown:**

| Sprints | Focus |
|---------|-------|
| S1–2 | Definition & setup |
| S3–6 | Core build (auth, dashboard, navigation) |
| S7–9 | Feature layer (reference, formulary, calculators) |
| S10–11 | Native wrapping & compliance |
| S12 | Release & migration |

### Feature Scope (Deliberately Limited)

- Member dashboard
- Selected reference materials
- Formulary
- Clinical calculators
- Notifications
- **No transactions or purchasing**

### Authentication Strategy

- Legacy identity retired
- Credentials migrated to new platform
- Users retain existing login
- Session refresh required
- MFA encouraged at login

### Architecture

**Layered View:**

| Layer | Components |
|-------|------------|
| **Client** | Mobile app + browser |
| **Application** | Shared UI layer |
| **API** | Auth, content, member services |
| **Integration** | CMS, CRM, events |
| **Infrastructure** | Cloud + CI/CD |

**Role of Native Wrapper:**
- App store distribution
- Push notifications
- Secure token storage
- Deep linking
- Minimal platform-specific code

**Data Flow:**
1. User logs in via identity provider
2. Token issued (JWT)
3. Frontend calls APIs with token
4. APIs fetch data from CMS/CRM
5. Response rendered in mobile/web UI

### Considerations

**Migration & Replacement:**
- Existing app updated in place
- No re-registration required
- Users log in with existing credentials
- Legacy app retired post-launch

**Key Risks:**
- Scope creep threatens timeline
- Dependency on website delivery
- Identity migration issues
- App store compliance delays

**Mitigation Approach:**
- Strict feature control
- Parallel build with abstraction
- Early authentication testing
- Store compliance reviewed early

**Success Criteria:**
- Successful app store release
- User migration via upgrade
- Stable authentication
- Core tools actively used
- No reliance on legacy systems

### Technical Addendum

System architecture for native app replacement delivery alongside the new website.

**What this addendum contains:**
- A C4-style view of the target architecture
- Key runtime flows for login, content refresh, and notifications
- A sprint-aligned backlog for delivery

```
App (iOS) ──┐                              ┌── Workato
             ├── Shared App Layer ── API ──┤
App (Android)┘         │                    ├── IdP
                       │                    ├── CRM
                    Website                 ├── CMS
                                            └── XML (Formulary)
```

> Workato integration workstream to be run by Timberyard alongside native app replacement and MACH transformation workstreams.

### System Context

Member-facing channels sit on top of a single application layer, with Workato coordinating downstream systems.

- **Member** — Uses the app for quick-reference content, formulary, calculators, and alerts
- **BSAVA team** — Publishes content, manages member data, and monitors migration and adoption
- **Digital experience layer** — Single source of user experience. Mobile remains deliberately narrower than the website.
- **Workato** — Recipes coordinate sync, events, notifications, and migration.

### Container View

The native shell stays thin. Business rules live in the shared application and service layer. Workato handles orchestration, retries, and event routing.

| Component | Responsibilities |
|-----------|-----------------|
| **iOS / Android native shell** | Packaging, secure storage, and notifications only |
| **Website browser client** | Full experience |
| **Shared application layer** | Mobile-first UI, content cache, navigation, calculator logic, session state |
| **API / BFF layer** | Token validation, profile aggregation |
| **Identity provider** | Same credentials, MFA uplift |
| **Workato** | Recipes, retries, routing |

> Keep application logic out of Workato. Use recipes for orchestration only.

### Key Runtime Flows

**1. Sign in and profile hydrate:**
1. App or website sends username and password to Identity provider
2. Identity provider returns token; user is prompted to enable MFA on refreshed session
3. API / BFF validates token and requests member profile
4. Workato recipe hydrates profile from CRM and writes any deltas back
5. Shared application layer renders dashboard and stores secure session state

**2. Content publish and cache refresh:**
1. Editor publishes new content in CMS
2. CMS event triggers Workato recipe
3. Recipe maps category and entitlement rules
4. Application cache is invalidated; metadata is refreshed
5. Updated content appears in app and website without manual release

**3. Event to push notification:**
1. Event or account signal lands from CRM, CMS, or Events service
2. Workato applies audience, timing, and preference rules
3. Message payload is assembled and logged
4. Push service delivers alert to mobile device
5. Member opens app directly into the relevant screen

### Delivery Backlog Summary

| ID | Recipe | Trigger and Target | Priority | Sprint | Acceptance |
|----|--------|--------------------|----------|--------|------------|
| R1 | Legacy user migration | Batch import to Identity + CRM map | P1 | 1–3 | 95%+ migrated cleanly |
| R2 | Credential / MFA uplift | First login event to MFA campaign | P1 | 2–4 | Prompt shown on refreshed session |
| R3 | Member profile sync | CRM change to profile cache | P1 | 3–5 | Profile delta applied <5 min |
| R4 | Login hydrate | Sign-in to API dashboard context | P1 | 4–6 | Dashboard loads in one pass |
| R5 | CMS publish refresh | CMS publish to app cache | P2 | 6–7 | Content visible without manual action |
| R6 | Formulary entitlement sync | CRM tier to access rules | P2 | 6–8 | Correct access by member type |
| R7 | Events to push alert | Events feed to push service | P2 | 7–9 | Alert arrives and deep-links |
| R8 | Exception queue | Any failed recipe to ops queue | P1 | 8–10 | Replay available with audit trail |
| R9 | Delivery telemetry | Recipe events to monitoring | P2 | 9–10 | Operational dashboard live |
| R10 | Preference sync | Opt-in changes to push prefs | P3 | 10–12 | Preferences honoured within 5 min |

> Estimated programme effort: app delivery 12 sprints in parallel with the website.

---

## Workato Integration

### Overview

Workato serves as the integration and orchestration layer across the composable stack, connecting digital, operational, payment, and finance platforms through event-driven workflows, data transformation, and controlled downstream handoff.

It does not act as a system of record or runtime customer-experience layer. Instead, it coordinates the movement of approved business events between **PIMCore, Contentful, Commerce Layer, Swoogo, Stripe, Salesforce, FinDock, Sage**, and legacy systems — ensuring each platform remains responsible for its own domain while avoiding point-to-point integration sprawl.

### Business Case

| Area | Detail |
|------|--------|
| **Current challenges** | Fragmentation across systems, manual processes, and scalability constraints limiting productivity and increasing error rates |
| **Proposed solution** | Workato is a low-code, enterprise-grade integration platform capable of unifying applications, orchestrating workflows, and enabling faster time to value |
| **Business impact** | Reduced operational overheads, improved data consistency, faster process execution, and stronger cross-functional collaboration |
| **Implementation approach** | Phased rollout with prioritised use cases, a clear governance model, and defined success metrics |

### Proposal

**Scope:**
- Establish Workato as the orchestration layer across the composable stack
- Standardise approved business events, transformations, and downstream handoff
- Reduce point-to-point integration sprawl while preserving domain ownership
- Lean team (1 developer)

**Platforms in scope:** PIMcore, Contentful, Commerce Layer, Swoogo, Stripe, Salesforce, FinDock, Sage, and legacy systems.

**Deliverables:** integration operating model, target architecture, event catalogue, recipe backlog, and phased implementation plan.

> **Confirmation sought:** Confirm Workato as the integration and orchestration backbone, plus a phased implementation over 12 sprints with governance, observability, and cutover controls.

### Executive Summary

**Why now:**
- Multiple domain platforms require controlled event exchange
- Direct integrations are costly, brittle, and hard to govern
- The target stack needs one orchestration layer, not another system of record

**What Workato does:**
- Subscribes to approved events from domain systems
- Transforms payloads into standard schemas
- Routes actions to authorised downstream systems
- Applies retries, alerting, and audit traceability

**What Workato does NOT do:**
- Does not hold master data
- Does not serve end-user runtime experiences
- Does not replace CRM, CMS, commerce, or finance platforms
- Does not bypass domain ownership

**Expected outcome:** A scalable integration backbone with governed events, faster delivery of change, lower support cost, and a clear path away from point-to-point interfaces.

### Recipe Roadmap

> **Rule of thumb:** If a recipe starts to own business logic, we move that logic back into the application or API layer.

| Wave | Sprints | Recipes |
|------|---------|---------|
| **Wave 1** — Launch critical | 1–6 | R1: Legacy user migration | R2: Credential and MFA uplift trigger | R3: Member profile sync | R4: Login hydrate |
| **Wave 2** — Launch complete | 6–10 | R5: CMS publish refresh | R6: Formulary entitlement sync | R7: Events to push alert |
| **Wave 3** — Harden and observe | 10–12 | R8: Reconciliation and exception queue | R9: Delivery telemetry | R10: Preference sync |

### System Context

> **Principle:** Every participating platform stays authoritative for its own domain. Workato coordinates approved business events and downstream handoff; it does not own the source data.

**Connected domains:**
- Digital channels
- Content and product
- Commerce and events
- CRM and payments ops
- Finance
- Legacy estate

**Workato capabilities:** Event orchestration, transformation, routing, monitoring.

### Container View

> **Control model:** All integrations are recipe-mediated. Direct cross-domain system connections are prohibited unless explicitly exempted through architecture governance.

| Layer | Components |
|-------|------------|
| **Channels** | Web, Mobile, Internal tools |
| **API / Application layer** | Runtime business services |
| **Workato recipes** | Event intake, Transformation, Routing, Retry / DLQ |
| **Observability** | Logs, Alerts, Run audit |
| **Secrets / Config** | Connections, Environment settings |
| **Connected platforms** | PIMcore, Contentful, Commerce Layer, Swoogo, Stripe, Salesforce, FinDock, Sage, Legacy |

### Event Lifecycle and Control Points

| Step | Action |
|------|--------|
| **1. Emit** | Authoritative source publishes approved business event |
| **2. Validate** | Recipe validates schema, identity, and mandatory attributes |
| **3. Transform** | Payload mapped to canonical event model |
| **4. Route** | Downstream actions selected by event type and policy |
| **5. Confirm** | Success, retry, or dead-letter outcome recorded |

**Mandatory controls:** Idempotency keys, Structured error handling, Correlation IDs, Payload versioning

**Operational outputs:** Run logs, Alert events, Replay path, Audit trail by recipe and business event

### Work Streams and Priority Use Cases

| Domain | Use Cases |
|--------|-----------|
| **Identity & Membership** | User create/update, Membership status, Consent attributes, Authentication enrichment |
| **Commerce & Payment** | Order lifecycle, Payment authorisation, Settlement handoff, Refund and failure events |
| **Events** | Registration, Attendance status, Capacity updates, Post-event sync |
| **Content & Product** | Content publish, Product data changes, Cache invalidation, Search index triggers |
| **Finance** | Ledger postings, Payment reconciliation, Gift aid / donation handling, Exception queues |

### Implementation Plan

| Phase | Sprints | Focus |
|-------|---------|-------|
| Foundation | 1–2 | Tenant setup, Environment model, Connection hardening, Event standards, Recipe governance |
| Identity & CRM | 3–4 | Salesforce profile sync, User create/update, Consent model, Error queues |
| Commerce & Payment | 5–7 | Commerce Layer orders, Stripe payment outcomes, FinDock handoff, Refund handling |
| Content & Product | 8–9 | Contentful publish, PIMcore updates, Cache invalidation, Downstream notifications |
| Events & Finance | 10–11 | Swoogo registration, Attendance updates, Sage postings, Exception management |
| Cutover & Hardening | 12 | Runbook, Monitoring thresholds, Replay test, Hypercare handoff |

### Operating Model, Governance, and Controls

**Roles:**
- Integration product owner
- Workato lead / architect
- Domain platform SMEs
- QA / release manager
- Support and service operations

**Design Controls:**
- Canonical event definitions
- Connection and credential policy
- Naming standards
- Recipe review board
- Change approval gates

**Run Controls:**
- Alert routing by severity
- Dead-letter review cadence
- Replay procedures
- Operational dashboards
- Support ownership by domain

### Key Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Unclear source-of-truth boundaries | Define system ownership before build; enforce in event catalogue |
| Recipe sprawl and inconsistent patterns | Introduce review board, templates, and naming standards |
| Weak observability at launch | Mandatory alerting, dead-letter queues, and run dashboards in MVP |
| Legacy interfaces behave unpredictably | Use facade pattern, throttling, and controlled cutover windows |
| Overly broad first release | Sequence by business value and isolate non-essential recipes to later waves |

---

## Conclusion

This is a **growth and capability enablement investment** (not a technology refresh as initially outlined), whose objective is to deliver a unified member-first experience underpinned by modern content and product data foundations with a streamlined technology platform.

The programme will move BSAVA from a fragmented digital estate — where members face friction in search, navigation, and checkout — to a **single, member-first platform** built on modern, composable architecture.

As a result, BSAVA will be **future facing** and positioned to scale, launch new propositions, and respond quickly to future member needs with a more agile and resilient digital platform.

---

*Jason Coppin — CEO — +44 (0)7976 080575 — jason@timberyardcommerce.com*

*Marco Potesta — Client & Delivery Lead — +44 (0)7788 292590 — marco.potesta@timberyardcommerce.com*
