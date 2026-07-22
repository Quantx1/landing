> **DRAFT — for review by a SEBI-registered legal/compliance professional before publication. This is a template, not legal advice. All [PLACEHOLDER] items must be completed.**

# Quant X — Privacy Policy

Last updated: [PLACEHOLDER: date]

This Privacy Policy explains how **[PLACEHOLDER: confirm registered legal entity — e.g. "Quant X Technologies Private Limited"]** (**"Quant X"**, **"we"**, **"us"**, **"our"**), the operator of the **Quant X** platform, website, and mobile/web applications available at **quantx.app** (collectively, the **"Platform"**), collects, uses, stores, shares, and protects the personal data of individuals who access or use the Platform (**"you"**, **"your"**, or a **"Data Principal"**).

We are committed to handling your personal data responsibly and in accordance with the **Digital Personal Data Protection Act, 2023 ("DPDP Act")** and the rules issued under it, the **Information Technology Act, 2000** together with the **Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules")**, and other applicable Indian laws.

Please read this Policy together with our **Terms of Service** and any product-specific notices shown to you inside the Platform.

---

## 1. Who We Are and Scope of This Policy

**1.1 Data Fiduciary.** For the purposes of the DPDP Act, the Data Fiduciary responsible for your personal data is:

- **Legal entity:** [PLACEHOLDER: confirm registered legal entity]
- **CIN:** [PLACEHOLDER: Corporate Identity Number]
- **GSTIN:** [PLACEHOLDER: GST Identification Number]
- **Registered office:** [PLACEHOLDER: registered office address]
- **Website:** quantx.app

**1.2 What Quant X is.** Quant X is an AI-assisted stock-market **analytics, education, and tooling** platform for Indian markets (NSE/BSE). It provides machine-learning signal engines, an AI copilot/chat assistant, stock and options screeners, backtesting, paper trading (free, with virtual funds), and **optional** live trading that is executed **only on your own broker account** via broker OAuth (Zerodha / Upstox / Angel One).

**1.3 What Quant X is not (for context on data handling).** Quant X is **not** currently registered with the Securities and Exchange Board of India ("SEBI") as a Research Analyst or Investment Adviser and holds no exchange algo empanelment. The Platform provides informational, analytical, and educational tools only; its outputs are not investment advice or a guarantee of returns. Quant X **does not hold, custody, or handle your funds or securities** — those always remain within your own broker account. This context matters for your privacy because we do **not** collect the categories of financial-custody data that a broker or a funds-handling intermediary would. (See our Terms of Service and disclaimers for the full regulatory position.)

**1.4 Scope.** This Policy applies to all personal data we process when you visit quantx.app, create an account, or use any feature of the Platform. It does **not** apply to the independent privacy practices of your broker, third-party websites, or any service we link to but do not operate.

---

## 2. Definitions

For ease of reference:

- **"Personal Data"** means any data about an individual who is identifiable by or in relation to such data, as defined under the DPDP Act.
- **"Processing"** means any operation performed on personal data, including collection, storage, use, sharing, disclosure, or erasure.
- **"Data Principal"** means the individual to whom the personal data relates (that is, you).
- **"Data Fiduciary"** means the entity that determines the purpose and means of processing (that is, Quant X).
- **"Data Processor" / "Sub-Processor"** means a third party that processes personal data on our behalf and under our instructions (for example, our cloud hosting provider).
- **"Broker Tokens"** means the OAuth access tokens, refresh tokens, and related credentials issued by your broker that authorise the Platform to act on your instructions within your broker account.
- **"Consent Manager"** has the meaning given under the DPDP Act (a person registered with the Data Protection Board who enables Data Principals to give, manage, review, and withdraw consent).

---

## 3. Personal Data We Collect

We collect only the data we need to operate the Platform, secure it, and comply with law. The categories are:

**3.1 Account data.** Name, email address, mobile number, hashed password (or authentication provider identifier if you sign in via a third-party identity provider), chosen username/display name, profile preferences, subscription tier (Free / Pro / Elite), and communication preferences.

**3.2 KYC-lite / identity signals.** We are **not** a broker and do **not** perform full statutory KYC. Where required for account verification, fraud prevention, tax, or subscription billing, we may collect limited identity information such as your name as registered with your broker, city/state, and — only if and where legally necessary — a government identifier or PAN. Any such identifier belongs at [PLACEHOLDER: specify exactly which identifiers, if any, are collected and why]. We do not collect statutory KYC documents on behalf of any broker or exchange.

**3.3 Broker connection data (Broker Tokens).** If you choose to connect a broker (Zerodha / Upstox / Angel One) for portfolio sync or optional live execution, we receive OAuth tokens and, via those tokens, read broker-provided data such as your holdings, positions, order and trade history, available margin, and instrument details necessary to display your portfolio and to route orders you initiate. We connect to brokers via their official OAuth flows and **never ask for or store your broker password or trading PIN.** See Section 4 for how Broker Tokens are secured.

**3.4 Usage and product data.** Features you use, signals viewed, screeners run, backtests configured, watchlists, paper-trading activity (virtual funds only), AI copilot/chat prompts and conversation history, in-app settings, and interaction timestamps.

**3.5 Device and technical data.** IP address, browser type and version, operating system, device identifiers, approximate location derived from IP (city/region level), language settings, referral URL, and diagnostic/crash logs.

**3.6 Payment and subscription data.** For paid tiers (Pro Rs. 999/month, Elite Rs. 1,999/month), billing is handled by our third-party payment gateway [PLACEHOLDER: payment gateway name, e.g. Razorpay / Stripe]. We receive transaction confirmations, subscription status, and limited billing metadata, but **we do not store your full card number, CVV, or bank credentials** — those are handled by the payment gateway under its own PCI-DSS-compliant systems.

**3.7 Communications.** Support tickets, emails, chat messages with our team, feedback, and survey responses.

**3.8 Sensitive personal data.** We aim to minimise sensitive data. To the extent any information we process qualifies as "sensitive personal data or information" under the SPDI Rules (for example, financial information such as payment-instrument details processed by our gateway), we handle it under the heightened protections described in this Policy and applicable law.

We do **not** knowingly collect more data than is necessary for the purposes described in Section 5.

---

## 4. Broker OAuth Tokens — How We Store, Secure, and Use Them

Because Broker Tokens can authorise actions within your brokerage account, we treat them as our most sensitive category of data.

**4.1 Consent-first and revocable.** Connecting a broker is entirely optional. You initiate the connection through the broker's own OAuth screen and grant only the scopes the broker exposes. You can disconnect at any time from within the Platform, and you can additionally revoke access directly from your broker's app/console.

**4.2 Storage and encryption.** Broker Tokens are stored **encrypted at rest** using strong, industry-standard encryption, with encryption keys managed separately from the token store [PLACEHOLDER: name the key-management approach, e.g. cloud KMS]. Tokens are transmitted only over encrypted channels (TLS). Access to the token store is restricted to the minimum systems and personnel required to operate the connection, and is protected by row-level security so that one user's tokens are never accessible in the context of another user's session.

**4.3 Use limited to your instructions.** We use Broker Tokens solely to (a) display your portfolio and account data inside the Platform, and (b) route orders that **you** initiate when you have explicitly enabled optional live trading. We do not use Broker Tokens to trade on your behalf without your action, and hard risk controls (such as stop-loss and target limits and a kill-switch) remain authoritative.

**4.4 We never sell tokens or trade on them for our benefit.** We do **not** sell, rent, license, or share Broker Tokens with advertisers, data brokers, or any third party for their own purposes. We do not use your token-derived holdings or trades to run a proprietary book or to benefit any party other than you.

**4.5 Token lifecycle.** Tokens are refreshed as permitted by the broker, and are **deleted or invalidated** promptly when you disconnect the broker, when they expire, or when you close your account (see Section 8).

---

## 5. Why We Use Your Data and Our Legal Basis

Under the DPDP Act, we process your personal data on the basis of your **consent** and, where applicable, for **certain legitimate uses** permitted by the Act (for example, complying with law, or where you have voluntarily provided data for a specified purpose). Our purposes are:

| # | Purpose | Typical data used | Legal basis |
|---|---------|-------------------|-------------|
| 5.1 | Create and manage your account and subscription | Account, payment, KYC-lite | Consent; performance of the service you requested |
| 5.2 | Provide analytics tools — signals, screeners, backtests, paper trading, AI copilot | Usage, account, device | Consent |
| 5.3 | Display your portfolio and, if you enable it, execute orders you initiate on your own broker account | Broker connection data, Broker Tokens | Consent (explicit, per-connection) |
| 5.4 | Process payments for paid tiers | Payment/subscription data | Consent; performance of the service |
| 5.5 | Secure the Platform, prevent fraud/abuse, and debug | Device, usage, logs | Consent; legitimate uses (security, fraud prevention) |
| 5.6 | Provide customer support | Communications, account | Consent |
| 5.7 | Improve and develop features and models | Usage (aggregated/de-identified where feasible) | Consent |
| 5.8 | Send service and, where you opt in, marketing communications | Account, communication preferences | Consent (marketing is opt-in and withdrawable) |
| 5.9 | Comply with legal, tax, and regulatory obligations and respond to lawful requests | As required | Legal obligation / compliance with law |

**5.10 No sale of personal data.** We do not sell your personal data.

**5.11 AI copilot inputs.** Prompts and conversations you submit to the AI copilot/chat are processed to generate responses and may be temporarily transmitted to the LLM sub-processor(s) that power the assistant (see Section 7). Do not paste passwords, one-time PINs, or unrelated sensitive personal data into the chat.

---

## 6. Consent and Your Choices

**6.1 How we obtain consent.** We ask for your consent through clear, plain-language notices at the point of collection — for example, when you register, when you connect a broker, or when you opt in to marketing. Your consent is **free, specific, informed, unconditional, and unambiguous**, given by a clear affirmative action, as required by the DPDP Act.

**6.2 Notice.** At or before the time we seek consent, we provide a notice describing the personal data to be collected, the purpose, how you can exercise your rights, and how you can complain to the Data Protection Board of India.

**6.3 Withdrawing consent.** You may withdraw your consent at any time, as easily as you gave it, through your account settings or by contacting our Data Protection contact (Section 14). Withdrawal does not affect the lawfulness of processing done before withdrawal. If you withdraw consent necessary to provide a feature (for example, broker connection), we may no longer be able to offer that feature.

**6.4 Consent Managers.** Where available and where you choose, you may manage your consent through a registered Consent Manager under the DPDP Act.

**6.5 Granular controls.** You can control broker connections, marketing opt-ins, and certain cookie/analytics preferences independently, so declining one does not force you to accept others.

---

## 7. Sharing and Disclosure of Personal Data

We share personal data only as described below, and only with parties bound by appropriate confidentiality and data-protection obligations.

**7.1 Brokers.** When you connect a broker or place an order, relevant instructions and data are exchanged with your chosen broker (Zerodha / Upstox / Angel One) via their official APIs. Your relationship with your broker is governed by the broker's own terms and privacy policy.

**7.2 Sub-processors (infrastructure and service providers).** We rely on trusted vendors who process data on our behalf under contract and solely on our instructions, including:

- **Cloud hosting and infrastructure:** [PLACEHOLDER: e.g. Vercel, Supabase, Railway, cloud region]
- **Database and storage:** [PLACEHOLDER: e.g. managed Postgres / object storage provider]
- **Payment gateway:** [PLACEHOLDER: e.g. Razorpay / Stripe]
- **AI/LLM providers powering the copilot:** [PLACEHOLDER: e.g. LLM gateway / model providers]
- **Analytics and product telemetry:** [PLACEHOLDER: e.g. analytics provider]
- **Email/communications:** [PLACEHOLDER: e.g. transactional email provider]
- **Error monitoring/logging:** [PLACEHOLDER: e.g. error-tracking provider]

A current list of material sub-processors is available on request from our Data Protection contact (Section 14).

**7.3 Analytics.** We use analytics to understand usage and improve the Platform. Where feasible we use aggregated or de-identified data. You can limit certain analytics through your cookie/tracking preferences (Section 12).

**7.4 Legal and safety disclosures.** We may disclose personal data where required by law, regulation, court order, or a lawful request from a government or regulatory authority, or where necessary to protect the rights, safety, or property of Quant X, our users, or the public, or to enforce our Terms.

**7.5 Business transfers.** If Quant X is involved in a merger, acquisition, financing, reorganisation, or sale of assets, personal data may be transferred as part of that transaction, subject to this Policy and applicable law; we will notify you of any material change in how your data is handled.

**7.6 No sale or unlicensed redistribution.** We do not sell personal data. We also do not redistribute unlicensed exchange data; live/real-time market data is shown only from your own connected broker feed or a licensed source.

---

## 8. Data Retention

**8.1 Retention principle.** We keep personal data only for as long as necessary to fulfil the purposes in Section 5, to comply with legal, tax, and accounting obligations, to resolve disputes, and to enforce our agreements — after which we delete or de-identify it.

**8.2 Illustrative periods.**

- **Account data:** retained while your account is active and for a reasonable period after closure to meet legal/audit needs [PLACEHOLDER: specify period, e.g. 7 years for financial/tax records where applicable].
- **Broker Tokens:** deleted or invalidated promptly on disconnection, expiry, or account closure (Section 4.5).
- **Payment/billing records:** retained as required by tax and accounting law [PLACEHOLDER: specify period].
- **AI copilot conversations:** retained per your settings and our operational needs [PLACEHOLDER: specify period]; you may delete saved conversations from within the Platform.
- **Logs and device data:** retained for a limited security/diagnostic window [PLACEHOLDER: specify period].

**8.3 Account closure.** When you close your account, we delete or de-identify your personal data within a reasonable period, except where retention is required by law or for the establishment, exercise, or defence of legal claims.

---

## 9. How We Secure Your Data

**9.1 Technical and organisational measures.** We implement reasonable security practices and procedures appropriate to the risk, including:

- **Encryption in transit** (TLS) for data moving between you, the Platform, brokers, and sub-processors.
- **Encryption at rest** for sensitive data, including Broker Tokens, with separated key management.
- **Row-level security (RLS)** and access controls so that each user's data is isolated and accessible only in that user's authenticated context.
- **Least-privilege access** for personnel, with access to production data restricted, logged, and reviewed.
- **Authentication safeguards** such as hashed passwords and support for strong authentication.
- **Monitoring, logging, and vulnerability management** to detect and respond to incidents.

**9.2 Your role.** Please keep your account credentials confidential, use a strong unique password, enable available security features, and never share one-time PINs or broker credentials with anyone (including anyone claiming to be from Quant X — we will never ask for them).

**9.3 Personal data breach.** No system is perfectly secure. In the event of a personal data breach, we will take remedial action and notify the Data Protection Board of India and affected Data Principals as required under the DPDP Act and applicable rules.

---

## 10. Your Rights as a Data Principal

Subject to the DPDP Act and applicable law, you have the right to:

**10.1 Access** — obtain a summary of the personal data we process about you and the processing activities and identities of those with whom it has been shared.

**10.2 Correction and updating** — request correction of inaccurate or misleading data, and completion or updating of incomplete or out-of-date data.

**10.3 Erasure** — request erasure of your personal data where it is no longer necessary for the purpose for which it was collected, unless retention is required by law.

**10.4 Withdraw consent** — withdraw consent at any time (Section 6.3).

**10.5 Grievance redressal** — have your grievances addressed by us in the first instance (Section 14), and escalate to the Data Protection Board of India if unsatisfied.

**10.6 Nominate** — nominate another individual to exercise your rights in the event of your death or incapacity, in the manner prescribed under the DPDP Act.

**10.7 How to exercise.** Submit requests to our Data Protection contact (Section 14). We may need to verify your identity before acting. We will respond within the timelines required by law. Most requests are free; we may decline or charge a reasonable fee only where a request is manifestly unfounded, excessive, or repetitive, as permitted by law.

---

## 11. Cookies and Similar Technologies

**11.1 What we use.** We use cookies, local storage, and similar technologies to keep you signed in, remember preferences, secure the Platform, and understand usage.

**11.2 Categories.**
- **Strictly necessary** — required for login, security, and core functionality; these cannot be switched off.
- **Preference** — remember settings such as theme and layout.
- **Analytics/performance** — help us understand and improve usage; subject to your choices.

**11.3 Your controls.** You can manage non-essential cookies through our in-product cookie controls where available, and through your browser settings. Blocking some cookies may affect Platform functionality.

**11.4 Do Not Track.** Where a recognised universal opt-out signal is honoured [PLACEHOLDER: state your position on browser Do-Not-Track / Global Privacy Control signals].

---

## 12. Children's Data

**12.1 Age threshold.** The Platform is intended for individuals who are **18 years of age or older**. It is not directed at children.

**12.2 DPDP safeguards.** Consistent with the DPDP Act, we do not knowingly process the personal data of a child (an individual below 18) without verifiable consent of a parent or lawful guardian, and we do not undertake tracking, behavioural monitoring, or targeted advertising directed at children.

**12.3 Removal.** If you believe a child has provided us personal data without appropriate consent, contact us (Section 14) and we will take steps to delete it.

---

## 13. Data Storage Location and Transfers

**13.1 Primary location.** We aim to store and process personal data on infrastructure located in or serving India [PLACEHOLDER: confirm hosting region(s)].

**13.2 Cross-border processing.** Some sub-processors (for example, certain cloud, AI/LLM, or analytics providers) may process data outside India. Where this occurs, we do so in compliance with the DPDP Act and any restrictions notified by the Central Government, and we require appropriate contractual safeguards. [PLACEHOLDER: confirm which sub-processors process data abroad and the safeguards in place.]

---

## 14. Grievance Redressal and Data Protection Contact

We take your concerns seriously. Please contact us first, and we will work to resolve your issue.

**14.1 Grievance Officer / Data Protection Contact.**

- **Name:** [PLACEHOLDER: Grievance Officer / Data Protection Officer name]
- **Designation:** [PLACEHOLDER: e.g. Grievance Officer]
- **Email:** [PLACEHOLDER: grievance@quantx.app]
- **Address:** [PLACEHOLDER: office address for grievances]
- **Response time:** We aim to acknowledge grievances promptly and resolve them within the timelines prescribed under the IT Act, SPDI Rules, and the DPDP Act.

**14.2 Escalation to the Data Protection Board.** If you are not satisfied with our response, you may lodge a complaint with the **Data Protection Board of India** established under the DPDP Act, in the manner it prescribes.

**14.3 Securities-market complaints (SCORES).** For complaints that concern securities-market conduct rather than data privacy, note that Quant X is not a SEBI-registered intermediary and does not hold client funds or securities. Complaints against your broker or a SEBI-registered intermediary may be raised through SEBI's **SCORES** platform (**scores.sebi.gov.in**). Complaints about Quant X's own data-handling should be directed to the Grievance Officer above and, if needed, to the Data Protection Board of India.

---

## 15. Changes to This Policy

**15.1 Updates.** We may update this Policy from time to time to reflect changes in law, technology, or our practices. We will revise the "Last updated" date above and, for material changes, provide additional notice (for example, in-app or by email) as required by law.

**15.2 Continued use.** Your continued use of the Platform after an update takes effect constitutes acceptance of the revised Policy, to the extent permitted by law. Where the change requires fresh consent, we will ask for it.

---

## 16. Governing Law, Jurisdiction, and Contact

**16.1 Governing law.** This Policy is governed by and construed in accordance with the laws of **India**.

**16.2 Jurisdiction.** Subject to any applicable statutory forum (including the Data Protection Board of India), the courts at **[PLACEHOLDER: city]**, India shall have exclusive jurisdiction over disputes arising out of or relating to this Policy.

**16.3 Contact.** For any questions about this Policy or our data practices:

- **[PLACEHOLDER: confirm registered legal entity]**
- **Email:** [PLACEHOLDER: privacy@quantx.app]
- **Registered office:** [PLACEHOLDER: registered office address]
- **Website:** quantx.app

---

*This document is a DRAFT template and must be reviewed and completed by a qualified Indian legal/compliance professional (including, where relevant, a SEBI-registered professional) before publication. Ensure every [PLACEHOLDER] is completed and that the disclosures accurately reflect Quant X's actual data-processing practices and vendor arrangements.*
