# Accommodations Test Suite

This folder contains comprehensive test cases for Accommodation claims functionality in viaOne 5.

## Test Files

### `accommodations-details.spec.ts`
Comprehensive test suite for Accommodations Details functionality based on the JURIS Accommodations BRD requirements.

## Requirements Coverage

### Requirement 3.4.001 - Details Tab Dropdown Menu Items
**Description**: The Details tab contains the following dropdown sub-menu items:
- Accommodations
- Time Tracking
- Contacts
- Custom Fields

**Test Cases**:
- Individual validation for each required menu item
- Comprehensive validation of all required items
- Menu order validation
- Navigation to each sub-menu item

### Requirement 3.4.002 - Excluded Menu Items
**Description**: The following items will NOT be displayed on the Detail menu list for accommodation claims:
- Benefit Plan
- Medical
- Legal
- Appeals
- Tender
- Plan Summary

**Test Cases**:
- Individual validation for each excluded item
- Comprehensive validation of all excluded items
- Negative testing to verify items are not accessible

### Requirement 3.4.003 - Financials Tab Exclusion
**Description**: The Financials tab will NOT be displayed for JURIS Accommodations as financials do not apply to these claims.

**Test Cases**:
- Validation of Financials tab exclusion for JURIS Accommodations
- Claim type-specific verification
- Data-driven testing across multiple JURIS Accommodation claims

### Requirement 3.4.4.001 - Custom Fields
**Description**: 
- JURIS Accommodations utilize the same Custom Fields page and security as other DS claims
- Custom Fields is the last option on the dropdown menu
- Custom Fields includes Fields and HR Data only (no Alternative Claim Numbers)

**Test Cases**:
- Custom Fields positioning as last menu item
- Fields section validation
- HR Data section validation
- Alternative Claim Numbers exclusion validation
- Security and permissions validation
- Role-based access testing

## Test Organization

### Test Suites
1. **Requirement-Based Suites**: Tests organized by specific requirement numbers
2. **Integration Testing**: End-to-end workflow validation
3. **Negative Testing**: Edge cases and error scenarios
4. **Performance Testing**: Load time and response time validation

### Data-Driven Testing
Tests utilize Excel data files for comprehensive scenario coverage:
- **AccommodationClaims**: Different accommodation claim types
- **JURISAccommodations**: JURIS-specific scenarios
- **CustomFieldsData**: Custom Fields security and permissions testing

## Running Tests

### Run All Accommodations Tests
```bash
npx playwright test tests/specs/accommodations/
```

### Run Specific Requirement Tests
```bash
# Test Requirement 3.4.001
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "3.4.001"

# Test Requirement 3.4.002
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "3.4.002"

# Test Requirement 3.4.003
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "3.4.003"

# Test Requirement 3.4.4.001
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "3.4.4.001"
```

### Run Integration Tests
```bash
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "Integration"
```

### Run Performance Tests
```bash
npx playwright test tests/specs/accommodations/accommodations-details.spec.ts -g "Performance"
```

## Test Data Requirements

### Excel File Location
`C:\DataVoV\DataDriverVovQA.xlsx`

### Required Worksheets
1. **AccommodationDetails** - Core accommodation Details functionality
2. **AccommodationClaims** - Different accommodation claim types
3. **JURISAccommodations** - JURIS-specific test scenarios
4. **CustomFieldsData** - Custom Fields security and permissions

## Key Test Patterns

### Page Object Model
Tests utilize the `DetailsPage` page object from `tests/pages/DetailsPage.ts` for all Details functionality interactions.

### Step Decorators
All page object methods use `@step()` decorators for comprehensive test reporting.

### Data-Driven Approach
Multiple test cases iterate over Excel data sets for comprehensive coverage across different claim types and scenarios.

### Validation Methods
- Individual item validation methods for granular testing
- Comprehensive validation methods for full coverage
- Negative validation methods for exclusion testing

## Notes

- All tests are focused specifically on accommodation claims
- Tests validate that excluded menu items are properly hidden
- Custom Fields tests verify security matches other DS claims
- Alternative Claim Numbers are validated as not present for accommodation claims
- JURIS Accommodation specific tests verify Financials tab exclusion

