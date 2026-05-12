# Optimization Report — Acme Wholesale Realty

- **Account ID:** sample_account
- **Data window:** 2026-04-01 to 2026-04-30
- **Generated:** 2026-05-01
- **Recommendations:** 7
- **Estimated monthly impact:** $2,475.00

## Prioritized Recommendations

### 1. [P1] Pause zero-conversion keyword: 'real estate agent near me'

- **Agent:** KeywordAgent
- **Category:** Wasted spend
- **Estimated monthly impact:** $540.00
- **Rationale:** Spent $540.00 across 180 clicks in 2026-04-01 to 2026-04-30 with zero conversions.
- **Action:** Pause keyword 'real estate agent near me' (BROAD) in ad group 'Motivated Sellers' and add as account-level negative.
- **Evidence:** campaign=Wholesale Sellers - Search clicks=180 cost=$540.00

### 2. [P1] Pause zero-conversion keyword: 'how to flip houses'

- **Agent:** KeywordAgent
- **Category:** Wasted spend
- **Estimated monthly impact:** $285.00
- **Rationale:** Spent $285.00 across 95 clicks in 2026-04-01 to 2026-04-30 with zero conversions.
- **Action:** Pause keyword 'how to flip houses' (BROAD) in ad group 'Investor Audience' and add as account-level negative.
- **Evidence:** campaign=Cash Buyers - Search clicks=95 cost=$285.00

### 3. [P2] Shift $20/day from 'Cash Buyers - Search' to 'Brand - Search'

- **Agent:** BudgetAgent
- **Category:** Budget reallocation
- **Estimated monthly impact:** $600.00
- **Rationale:** 'Brand - Search' CPA $49.19; 'Cash Buyers - Search' CPA 16.3x. Reallocate to compound returns.
- **Action:** Reduce daily budget for 'Cash Buyers - Search' by $20 and raise 'Brand - Search' by the same amount. Re-evaluate in 14 days.
- **Evidence:** best=$1180.50/24conv  worst=$2400.00/3conv

### 4. [P2] Exclude region 'San Francisco, CA' from 'Wholesale Sellers - Search'

- **Agent:** GeoAgent
- **Category:** Geo exclusion
- **Estimated monthly impact:** $410.00
- **Rationale:** $410.00 spent in San Francisco, CA with zero conversions during 2026-04-01 to 2026-04-30.
- **Action:** Add 'San Francisco, CA' to the location exclusion list for campaign 'Wholesale Sellers - Search'.
- **Evidence:** campaign=Wholesale Sellers - Search region=San Francisco, CA cost=$410.00

### 5. [P2] Exclude region 'Manhattan, NY' from 'Cash Buyers - Search'

- **Agent:** GeoAgent
- **Category:** Geo exclusion
- **Estimated monthly impact:** $320.00
- **Rationale:** $320.00 spent in Manhattan, NY with zero conversions during 2026-04-01 to 2026-04-30.
- **Action:** Add 'Manhattan, NY' to the location exclusion list for campaign 'Cash Buyers - Search'.
- **Evidence:** campaign=Cash Buyers - Search region=Manhattan, NY cost=$320.00

### 6. [P3] Pause low-CTR ad in 'Motivated Sellers'

- **Agent:** AdCopyAgent
- **Category:** Ad copy underperformer
- **Estimated monthly impact:** $266.00
- **Rationale:** CTR 1.49% vs best ad in ad group 6.00% over 5900 impressions.
- **Action:** Pause ad headlined 'Real Estate Services - Acme Realty' and draft a variant mirroring the top performer's structure.
- **Evidence:** campaign=Wholesale Sellers - Search ad_group=Motivated Sellers clicks=88

### 7. [P3] Pause low-CTR ad in 'Investor Audience'

- **Agent:** AdCopyAgent
- **Category:** Ad copy underperformer
- **Estimated monthly impact:** $54.00
- **Rationale:** CTR 1.09% vs best ad in ad group 6.00% over 1100 impressions.
- **Action:** Pause ad headlined 'Learn Real Estate Investing' and draft a variant mirroring the top performer's structure.
- **Evidence:** campaign=Cash Buyers - Search ad_group=Investor Audience clicks=12

## Agent Coverage

- KeywordAgent: 2 recommendation(s)
- AdCopyAgent: 2 recommendation(s)
- BudgetAgent: 1 recommendation(s)
- GeoAgent: 2 recommendation(s)
