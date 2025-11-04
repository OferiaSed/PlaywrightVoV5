# Accommodation Test Cases - Duplicate Analysis Report

## Summary
This report analyzes all accommodation test cases across the test suite to identify duplicates.

## Files Analyzed
1. `tests/specs/accommodations/accommodations-details.spec.ts` (Main test file - 1033 lines)
2. `tests/specs/DS-details-general.spec.ts` (Secondary test file - 409 lines)

---

## DUPLICATE TEST CASES IDENTIFIED

### 1. **Requirement 3.4.001 - Required Menu Items Validation**

#### DUPLICATE #1: Validate Required Menu Items
- **File 1**: `accommodations-details.spec.ts` line 52
  - Test: `'Req 3.4.001 - Validate all required dropdown menu items are present'`
  - Validates: All required menu items + menu order
  
- **File 2**: `DS-details-general.spec.ts` line 34
  - Test: `'Validate Details tab contains required dropdown menu items - User Story 3.4.001'`
  - Validates: All required menu items
  
**Status**: **DUPLICATE** - Same functionality, different test names

---

### 2. **Requirement 3.4.002 - Excluded Menu Items**

#### DUPLICATE #2: Validate All Excluded Items
- **File 1**: `accommodations-details.spec.ts` line 112
  - Test: `'Req 3.4.002 - Validate all excluded menu items are NOT displayed'`
  - Validates: All excluded items comprehensively
  
- **File 2**: `DS-details-general.spec.ts` line 51
  - Test: `'Validate excluded menu items are NOT displayed for accommodation claims - User Story 3.4.002'`
  - Validates: All excluded items + individual validations
  
**Status**: **DUPLICATE** - Same functionality with slight variations in implementation

---

### 3. **Requirement 3.4.003 - Financials Tab Exclusion**

#### DUPLICATE #3: Financials Tab Not Displayed for JURIS
- **File 1**: `accommodations-details.spec.ts` line 130
  - Test: `'Req 3.4.003 - Validate Financials tab is NOT displayed for JURIS Accommodations'`
  
- **File 2**: `DS-details-general.spec.ts` line 64
  - Test: `'Validate Financials tab is NOT displayed for JURIS Accommodations - User Story 3.4.003'`
  
**Status**: **DUPLICATE** - Identical test functionality

#### DUPLICATE #4: Financials Tab Exclusion with Claim Type
- **File 1**: `accommodations-details.spec.ts` line 135
  - Test: `'Req 3.4.003 - Validate Financials tab exclusion with claim type verification'`
  
- **File 2**: `DS-details-general.spec.ts` line 64 (in same test)
  - Also validates: `validateFinancialsTabExclusionForAccommodations('JURIS Accommodation')`
  
**Status**: **PARTIAL DUPLICATE** - Same validation called in different test contexts

---

### 4. **Requirement 3.4.4.001 - Custom Fields**

#### DUPLICATE #5: Custom Fields is Last Option
- **File 1**: `accommodations-details.spec.ts` line 176
  - Test: `'Req 3.4.4.001 - Validate Custom Fields is the last option in dropdown menu'`
  
- **File 2**: `DS-details-general.spec.ts` line 42
  - Test: `'Validate Custom Fields is the last option in dropdown menu - User Story 3.4.4.001'`
  
**Status**: **DUPLICATE** - Identical test functionality

#### DUPLICATE #6: Custom Fields Sections Validation
- **File 1**: `accommodations-details.spec.ts` line 181
  - Test: `'Req 3.4.4.001 - Validate Custom Fields page displays both Fields and HR Data sections'`
  
- **File 2**: `DS-details-general.spec.ts` line 82
  - Test: `'Validate Custom Fields page displays Fields and HR Data sections - User Story 3.4.4.001'`
  
**Status**: **DUPLICATE** - Identical test functionality

#### DUPLICATE #7: Alternative Claim Numbers Not Present
- **File 1**: `accommodations-details.spec.ts` line 187
  - Test: `'Req 3.4.4.001 - Validate Alternative Claim Numbers are NOT used for accommodation claims'`
  
- **File 2**: `DS-details-general.spec.ts` line 88
  - Test: `'Validate Alternative Claim Numbers are not used for accommodation claims - User Story 3.4.4.001'`
  
**Status**: **DUPLICATE** - Identical test functionality

#### DUPLICATE #8: Custom Fields Security Validation
- **File 1**: `accommodations-details.spec.ts` line 195
  - Test: `'Req 3.4.4.001 - Validate Custom Fields security with different user roles'`
  - Uses Excel data-driven approach with CustomFieldsData sheet
  
- **File 2**: `DS-details-general.spec.ts` line 135
  - Test: `'Validate Custom Fields functionality with different user roles'`
  - Uses Excel data-driven approach with CustomFieldsData sheet
  
**Status**: **DUPLICATE** - Same data-driven test with same Excel sheet

---

### 5. **Data-Driven Testing**

#### DUPLICATE #9: Data-Driven Test Across Multiple Accommodation Claims
- **File 1**: `accommodations-details.spec.ts` line 251
  - Test: `'E2E - Data-driven test across multiple accommodation claim types'`
  - Uses AccommodationClaims Excel sheet
  
- **File 2**: `DS-details-general.spec.ts` line 102
  - Test: `'Validate Details functionality across multiple accommodation claim types'`
  - Uses AccommodationClaims Excel sheet
  
**Status**: **DUPLICATE** - Same data-driven test with same Excel sheet and similar logic

---

### 6. **Performance Testing**

#### DUPLICATE #10: Details Tab Loading Performance
- **File 1**: `accommodations-details.spec.ts` line 346
  - Test: `'Performance - Validate Details tab loading performance'`
  
- **File 2**: `DS-details-general.spec.ts` line 172
  - Test: `'Validate Details tab loading performance'`
  
**Status**: **DUPLICATE** - Identical performance test

#### DUPLICATE #11: Details Dropdown Response Time
- **File 1**: `accommodations-details.spec.ts` line 353
  - Test: `'Performance - Validate Details dropdown menu response time'`
  
- **File 2**: `DS-details-general.spec.ts` line 183
  - Test: `'Validate Details dropdown menu response time'`
  
**Status**: **DUPLICATE** - Identical performance test

---

### 7. **Edge Case Testing**

#### DUPLICATE #12: Rapid Menu Interactions
- **File 1**: `accommodations-details.spec.ts` line 315
  - Test: `'Edge Case - Validate Details functionality with rapid menu interactions'`
  - 3 iterations
  
- **File 2**: `DS-details-general.spec.ts` line 261
  - Test: `'Validate Details functionality with rapid user interactions'`
  - 5 iterations, more comprehensive navigation
  
**Status**: **SIMILAR** - Same concept but File 2 is more comprehensive

---

## INTERNAL DUPLICATES (Within accommodations-details.spec.ts)

### 1. **Individual Menu Item Validations vs Comprehensive Validation**

#### DUPLICATE #13: Individual Menu Items Already Covered by Comprehensive Test
- Line 29: `'Req 3.4.001 - Validate Details tab contains Accommodations menu item'`
- Line 37: `'Req 3.4.001 - Validate Details tab contains Time Tracking menu item'`
- Line 42: `'Req 3.4.001 - Validate Details tab contains Contacts menu item'`
- Line 47: `'Req 3.4.001 - Validate Details tab contains Custom Fields menu item'`
- Line 52: `'Req 3.4.001 - Validate all required dropdown menu items are present'` ← **Covers all above**

**Status**: **REDUNDANT** - Individual tests are redundant when comprehensive test exists. However, they may be useful for granular debugging.

#### DUPLICATE #14: Individual Excluded Items Already Covered
- Line 82: `'Req 3.4.002 - Validate Benefit Plan is NOT displayed'`
- Line 87: `'Req 3.4.002 - Validate Medical is NOT displayed'`
- Line 92: `'Req 3.4.002 - Validate Legal is NOT displayed'`
- Line 97: `'Req 3.4.002 - Validate Appeals is NOT displayed'`
- Line 102: `'Req 3.4.002 - Validate Tender is NOT displayed'`
- Line 107: `'Req 3.4.002 - Validate Plan Summary is NOT displayed'`
- Line 112: `'Req 3.4.002 - Validate all excluded menu items are NOT displayed'` ← **Covers all above**

**Status**: **REDUNDANT** - Individual tests are redundant when comprehensive test exists.

---

### 2. **Financials Tab Validation**

#### DUPLICATE #15: Financials Tab Tests Overlap
- Line 130: `'Req 3.4.003 - Validate Financials tab is NOT displayed for JURIS Accommodations'`
- Line 135: `'Req 3.4.003 - Validate Financials tab exclusion with claim type verification'`
- Line 140: `'Req 3.4.003 - Data-driven test for Financials tab exclusion across JURIS Accommodation claims'`

**Status**: **PARTIAL OVERLAP** - Line 135 test calls the same validation as line 130, but line 140 is comprehensive data-driven test that covers both.

---

### 3. **E2E Test Duplication**

#### DUPLICATE #16: E2E Workflow Test
- Line 228: `'E2E - Complete Details workflow for accommodation claim'`
- Line 251: `'E2E - Data-driven test across multiple accommodation claim types'`

**Status**: **SIMILAR** - Line 251 is more comprehensive and data-driven, covering what line 228 does plus more scenarios.

---

### 4. **Custom Fields Tab Validation**

#### DUPLICATE #17: Alternate Numbers Tab Validation
- Line 373: `'Req 3.1.004 - Validate Custom Fields page contains FIELDS, HR FIELDS, and ALTERNATE NUMBERS tabs'`
  - Validates ALTERNATE NUMBERS tab is visible
  
- Line 935: `'Req 3.6.001 - Validate Alternate Numbers tab is accessible for DS claims'`
- Line 939: `'Req 3.6.001 - Validate Alternate Numbers tab table is visible'`

**Status**: **OVERLAP** - Line 373 validates tab exists, lines 935-939 validate tab functionality. However, note that for accommodation claims, Alternate Numbers should NOT be present (line 187 test). This is a **CONTRADICTION**.

---

### 5. **Card Expand/Collapse Validation**

#### DUPLICATE #18: Card State Validation
- Line 398: `'Req 3.2.003 - Validate top card is expanded by default'`
- Line 402: `'Req 3.2.003 - Validate other cards are collapsed by default'`
- Line 406: `'Req 3.2.003 - Validate card header displays category label with chevron icon'`
- Line 418: `'Req 3.2.003 - Validate individual card expand/collapse functionality'`

**Status**: **ACCEPTABLE SEPARATION** - These are logically separate validations even though they test the same feature area.

---

### 6. **Expand All Toggle**

#### DUPLICATE #19: Expand All Toggle Tests
- Line 446: `'Req 3.2.004 - Validate Expand all toggle is visible'`
- Line 450: `'Req 3.2.004 - Validate Expand all toggle expands all cards'`
- Line 456: `'Req 3.2.004 - Validate Expand all toggle collapses all cards'`

**Status**: **ACCEPTABLE SEPARATION** - These test different aspects of the same feature.

---

### 7. **Table Functionality**

#### DUPLICATE #20: Table Validation Tests
- Line 479: `'Req 3.2.005 - Validate Fields tab table columns for Accommodation'`
- Line 491: `'Req 3.2.006 - Validate table default sort on FIELD # column'`
- Line 502: `'Req 3.2.006 - Validate table sort order can be changed by clicking column header'`
- Line 517: `'Req 3.2.006 - Validate table has global filter'`
- Line 528: `'Req 3.2.006 - Validate no results empty state when filter returns no matches'`
- Line 539: `'Req 3.2.006 - Validate field count display format'`

**Status**: **ACCEPTABLE SEPARATION** - These test different aspects of table functionality.

---

### 8. **Save/Reset Button Validation**

#### DUPLICATE #21: Save/Reset Button Tests
- Line 793: `'Req 3.3.003 - Validate Save changes button is visible'`
- Line 797: `'Req 3.3.003 - Validate Save changes displays success toast'`
- Line 819: `'Req 3.3.003 - Validate Reset button is visible'`
- Line 823: `'Req 3.3.003 - Validate Reset button clears unsaved edits'`

**Status**: **ACCEPTABLE SEPARATION** - These test different aspects of the same feature.

---

## POTENTIAL CONTRADICTIONS

### CONTRADICTION #1: Alternate Numbers Tab
- **Line 187**: `'Req 3.4.4.001 - Validate Alternative Claim Numbers are NOT used for accommodation claims'`
  - Expects Alternative Claim Numbers to NOT be present
  
- **Line 373**: `'Req 3.1.004 - Validate Custom Fields page contains FIELDS, HR FIELDS, and ALTERNATE NUMBERS tabs'`
  - Expects ALTERNATE NUMBERS tab to be visible
  
- **Line 935-939**: Tests for Alternate Numbers tab functionality

**Issue**: These tests contradict each other. For accommodation claims, Alternate Numbers should NOT be present, but line 373 and 935-939 test for its presence.

---

## RECOMMENDATIONS

### High Priority - Remove Duplicates

1. **Remove `DS-details-general.spec.ts` entirely** - All tests in this file are duplicates or less comprehensive versions of tests in `accommodations-details.spec.ts`

2. **Keep individual menu item tests** - While redundant, they provide granular debugging capability. Consider marking them as "smoke tests" or moving to a separate file.

3. **Fix Alternate Numbers contradiction** - Remove or fix tests at lines 373, 935-939 that validate Alternate Numbers tab for accommodation claims, as it should not be present.

### Medium Priority - Consolidate

4. **Consolidate Financials tab tests** - Keep only the comprehensive data-driven test (line 140), remove the individual tests (lines 130, 135).

5. **Consolidate E2E tests** - Keep only the data-driven E2E test (line 251), remove the simpler one (line 228).

6. **Review Custom Fields security tests** - Ensure both tests use the same Excel data structure and validation approach.

### Low Priority - Organize

7. **Group related tests** - Consider grouping Expand All toggle tests, Save/Reset tests, etc. into sub-describes for better organization.

8. **Add test tags** - Add tags like `@smoke`, `@integration`, `@performance` to help with test selection.

---

## Statistics

- **Total Test Cases in accommodations-details.spec.ts**: ~90 tests
- **Total Test Cases in DS-details-general.spec.ts**: ~20 tests
- **Identified Duplicates**: 21 duplicate/similar tests
- **Contradictions Found**: 1 (Alternate Numbers tab)
- **Recommendation**: Remove `DS-details-general.spec.ts` entirely (100% duplicate coverage)

---

## Conclusion

The test suite has significant duplication between the two files. The `accommodations-details.spec.ts` file is more comprehensive and should be retained. The `DS-details-general.spec.ts` file should be removed as it only contains duplicate or less comprehensive tests.

Within `accommodations-details.spec.ts`, there are some redundant individual tests, but these may serve a purpose for granular debugging. However, there is a critical contradiction regarding Alternate Numbers tab validation that needs to be resolved.

