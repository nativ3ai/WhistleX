-- WhistleX intel rating ledger
-- This SQL schema tracks upvotes and downvotes for whistleblower intel submissions.

CREATE TABLE whistle_intel (
    intel_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    poster_address CHAR(42) NOT NULL,
    pool_contract_address CHAR(42) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE intel_ratings (
    rating_id UUID PRIMARY KEY,
    intel_id UUID NOT NULL REFERENCES whistle_intel(intel_id) ON DELETE CASCADE,
    voter_address CHAR(42) NOT NULL,
    vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
    rationale TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (intel_id, voter_address)
);

CREATE MATERIALIZED VIEW intel_rating_totals AS
SELECT
    i.intel_id,
    i.title,
    COALESCE(SUM(r.vote), 0) AS score,
    COUNT(CASE WHEN r.vote = 1 THEN 1 END) AS upvotes,
    COUNT(CASE WHEN r.vote = -1 THEN 1 END) AS downvotes,
    MAX(r.recorded_at) AS last_activity
FROM whistle_intel i
LEFT JOIN intel_ratings r ON r.intel_id = i.intel_id
GROUP BY i.intel_id, i.title;

-- Example seed data for demo environments
INSERT INTO whistle_intel (intel_id, title, poster_address, pool_contract_address) VALUES
    ('27f7e8c1-9ca1-4bc4-bc8f-f6bf9a739c71', 'GTA VI Release Date', '0x8c92f178af5343a2b67c59de4c668ca0b6a7de11', '0x140f2eb50c9d702aa34673b482f90edb6c93f212'),
    ('8c7a2e2a-a8ec-4d7a-8ba4-5a0e7d30a9a2', 'Barron Trump''s Real ETH Wallet', '0xa573be1080c9598d7f81e3d4f4fb21a78a0f9c54', '0x906d7897ad3a507ee2d567b9c73f623f660ab102'),
    ('bda8af5d-ff55-465d-9d4f-5865f0d0ca8f', 'Apple AR Glasses Price', '0xc9135f94d308bb487a9ce2f17f23ef20cb0474e6', '0x6f6bd91c93e4d7134cf1fb6cc9a06423e14fcb11');

INSERT INTO intel_ratings (rating_id, intel_id, voter_address, vote, rationale) VALUES
    ('6dd4917d-f2f2-4b25-a0ee-4d9c5a6ef4f4', '27f7e8c1-9ca1-4bc4-bc8f-f6bf9a739c71', '0x15f3e8ad6b2bffb309e7d0906dcb91b60464cc44', 1, 'Credible leak history'),
    ('a0cb86fb-58a9-41cb-97a1-4d24a6be9d5b', '27f7e8c1-9ca1-4bc4-bc8f-f6bf9a739c71', '0x9f31ed49bdbd1d74e5c097b1b4bc91f90a7bc9b2', 1, 'Matching insider chatter'),
    ('d30bc72c-764b-41c9-87cf-b6f38d3b81be', '8c7a2e2a-a8ec-4d7a-8ba4-5a0e7d30a9a2', '0x7c6e2f114d1294de9c0bff00660f73088f9a0d77', 1, 'Wallet traces cross-confirmed'),
    ('cb9e1153-7d5c-46c4-9aa7-b3f14b194fb1', '8c7a2e2a-a8ec-4d7a-8ba4-5a0e7d30a9a2', '0x6b4f38de2227c7d2fb12a9d305bd46ce73f5e12a', -1, 'Awaiting second signature'),
    ('9f7f7bfb-36f7-47b0-a8ae-efc4f69dcb3b', 'bda8af5d-ff55-465d-9d4f-5865f0d0ca8f', '0x4433a0125de902c17c7515af24a93240e57711d6', 1, 'Supplier corroboration');
