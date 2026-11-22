# Ares classification receipts: observed research snapshot

**Recorded:** 2026-11-21  
**Evidence class:** owner-operated local experiment; independently analyzed archive structure and aggregate counters. **Not** an upstream-accepted feature, third-party benchmark, independently labeled evaluation, verified Ares production integration, or proof of autonomous decision quality.

## Source custody

- Input: private archive `batch-classification-20261120(2).zip`. Its bytes are **not published** in this repository.
- ZIP SHA-256: `bd4910f5a44cdb0599be250e6911aee99ae6dfca702c38d5998bf8981b9d894a`.
- Included payload: `home/.../.ares/decision_suggestions/*.json`; archive also includes design and worker documents. Relative paths and source text are intentionally **not reproduced** on the public website.
- This report records a static inspection of that exact archive, not a live run, source-join audit, gold-label evaluation, or independently reproducible public benchmark.

## Archive-level facts

| Observation | Count |
| --- | ---: |
| JSON classification sidecars parsed | 8,069 / 8,069 |
| Distinct sidecar source hashes | 8,069 |
| Distinct model-input hashes | 8,069 |
| Complete six-category score vectors | 8,056 |
| Primary-only gate | 2,922 |
| Escalated-agree gate | 5,134 |
| Model-disagreement gate | 13 |
| `advisory=true` and `candidate_only=true` | 8,069 / 8,069 |
| `mutates_verification_state=false` | 8,069 / 8,069 |

The export's separate `classified: 9,861` count exceeds the number of sidecars by 1,792 and **is not reconciled**. No claim of 9,861 verified classification records is made.

## Model-predicted categories (not gold labels)

| Predicted label | Count |
| --- | ---: |
| Other / unknown | 2,984 |
| Source snapshot | 2,134 |
| Plan | 1,677 |
| Execution receipt | 619 |
| Test output | 516 |
| Diagnostic log | 139 |

Recorded median confidence across the 8,056 scored records was approximately 0.5396. This is a model decision statistic, **not an empirical correctness probability**. The archive uses an up-to-400-character source excerpt; its `source_hash` does not identify whole-file bytes. Original source paths/text and independently verified labels are missing from the sidecars.

The model-escalation process can replace the primary score vector, so the archive cannot be interpreted as a clean controlled 0.8B-versus-4B comparison. Recorded agreement is mostly same-model repeated inference. Per-model raw calls must be preserved separately for valid comparison.

## Reproduction scope and next acceptance gate

A holder of the original ZIP can count JSON sidecars under `/decision_suggestions/`, parse them, group `label` and `gate_reason`, and verify the hash above. Because the input archive remains private, readers can inspect the declared methodology but **cannot independently recalculate these results from publicly hosted bytes**.

Before publishing any accuracy, inference-efficiency, or Ares capability claims: join records to authorized full-source identities; preserve raw per-model predictions; obtain independently adjudicated labels; run matched frozen comparisons; and record verified downstream agent outcomes and cost. Only then promote a measured result with an accessible fixture or sanitized audit bundle.

**Claim permitted today:** Ares-associated local R&D produced a hashed, advisory-only classification archive with 8,069 distinct sidecars, and the archive supports descriptive analysis of predicted artifact categories and uncertainty. It does not establish decision accuracy, productive use by the live Ares agent, cost savings, or superiority to other systems.
