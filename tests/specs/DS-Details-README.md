# Accommodation Details General Information - Test Implementation

## Overview

This test implementation provides comprehensive automated testing for the Details General Information functionality specifically for accommodation claims as specified in User Story requirements 3.4.001, 3.4.002, 3.4.003, and 3.4.4.001.

## Files Created/Modified

### 1. Page Objects
- **`tests/pages/DetailsPage.ts`** - New page object for accommodation Details functionality
- **`tests/pages/ViewPage.ts`** - Enhanced with `searchSpecificClaim()` method
- **`tests/pages/LoginPage.ts`** - Enhanced with `performLoginWithRole()` method

### 2. Test Specifications
- **`tests/specs/DS-details-general.spec.ts`** - Comprehensive test suite for accommodation Details functionality

### 3. Fixtures
- **`tests/fixtures/BaseTest.ts`** - Updated to include DetailsPage fixture

### 4. Test Data Documentation
- **`test-data/DS-Details-Excel-Data-Structure.md`** - Excel data structure specification

## Test Coverage

### User Story Requirements Coverage

#### 3.4.001 - Details Tab Dropdown Menu Items
- ✅ Validates presence of required menu items: Accommodations, Time Tracking, Contacts, Custom Fields
- ✅ Validates menu item accessibility and functionality
- ✅ Validates Custom Fields is the last option in the dropdown

#### 3.4.002 - Excluded Menu Items for Accommodation Claims
- ✅ Validates exclusion of: Benefit Plan, Medical, Legal, Appeals, Tender, Plan Summary
- ✅ Individual validation for each excluded item
- ✅ Comprehensive exclusion validation for accommodation claims

#### 3.4.003 - Financials Tab Exclusion for JURIS Accommodations
- ✅ Validates Financials tab is not displayed for JURIS Accommodations
- ✅ Validates Financials tab presence for non-JURIS claims
- ✅ Claim type-specific validation

#### 3.4.4.001 - Custom Fields Functionality
- ✅ Validates Custom Fields page displays Fields and HR Data sections
- ✅ Validates security and permissions
- ✅ Validates Alternative Claim Numbers are not present for accommodation claims
- ✅ Validates Custom Fields uses same security as other accommodation claims

### Test Types Implemented

#### 1. Functional Testing
- Core functionality validation
- Menu navigation testing
- Custom Fields integration testing
- Security and permissions testing

#### 2. Data-Driven Testing
- Excel-based test data management
- Multiple claim type testing
- User role-based testing
- Environment-specific testing

#### 3. Performance Testing
- Details tab loading performance
- Dropdown menu response time
- Load testing with multiple iterations
- Performance threshold validation

#### 4. Cross-Browser Testing
- Chromium, Firefox, and WebKit compatibility
- Browser-specific screenshot capture
- Consistent behavior validation

#### 5. Error Handling and Edge Cases
- Network interruption testing
- Rapid user interaction testing
- Invalid claim type handling
- Permission-based error handling

#### 6. Accessibility Testing
- Keyboard navigation validation
- Screen reader attribute testing
- ARIA compliance validation

#### 7. Visual Regression Testing
- Screenshot-based validation
- UI consistency testing
- Visual baseline establishment

#### 8. Integration Testing
- End-to-end workflow validation
- Claim status-based testing
- Component integration testing

## Test Execution

### Prerequisites
1. **Excel Test Data**: Ensure `C:\DataVoV\DataDriverVovQA.xlsx` exists with required worksheets
2. **Test Environment**: Configure environment settings in `config/environments.ts`
3. **User Permissions**: Ensure test users have appropriate permissions for different roles

### Running Tests

#### Run All Details Tests
```bash
npx playwright test tests/specs/DS-details-general.spec.ts
```

#### Run Specific Test Groups
```bash
# Core functionality tests
npx playwright test tests/specs/DS-details-general.spec.ts -g "Core Functionality"

# Performance tests
npx playwright test tests/specs/DS-details-general.spec.ts -g "Performance Testing"

# Cross-browser tests
npx playwright test tests/specs/DS-details-general.spec.ts -g "Cross-Browser Testing"
```

#### Run with Specific Browser
```bash
npx playwright test tests/specs/DS-details-general.spec.ts --project=chromium
npx playwright test tests/specs/DS-details-general.spec.ts --project=firefox
npx playwright test tests/specs/DS-details-general.spec.ts --project=webkit
```

### Test Data Requirements

#### Required Excel Worksheets
1. **AccommodationDetails** - Core accommodation test scenarios
2. **AccommodationClaims** - Different accommodation claim types
3. **JURISAccommodations** - JURIS-specific scenarios
4. **CustomFieldsData** - Custom Fields and security testing
5. **PerformanceTestData** - Performance testing thresholds
6. **CrossBrowserData** - Browser compatibility data
7. **ErrorHandlingData** - Error scenarios and edge cases

#### Sample Test Data Setup
```typescript
// Example Excel data structure for accommodation claims
Set | DataSet | AccommodationType | ClaimNumber | ExpectedMenuItems
1   | 1       | Standard Accommodation | AC-12345 | Accommodations;Time Tracking;Contacts;Custom Fields
1   | 2       | Premium Accommodation | AC-12346 | Accommodations;Time Tracking;Contacts;Custom Fields
1   | 3       | JURIS Accommodation | JA-12347 | Accommodations;Time Tracking;Contacts;Custom Fields
```

## Key Features

### 1. Dynamic Locator Patterns
```typescript
// Example from DetailsPage.ts
private getMenuItemLocator(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: itemName });
}
```

### 2. Step Decorators for Reporting
```typescript
@step('Validate Details dropdown contains required menu items')
async validateRequiredDetailsMenuItems(): Promise<void> {
    // Implementation with detailed reporting
}
```

### 3. Performance Monitoring
```typescript
@step('Measure Details tab loading performance')
async measureDetailsTabLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.navigateToDetailsTab();
    const endTime = Date.now();
    return endTime - startTime;
}
```

### 4. Comprehensive Error Handling
```typescript
try {
    await details.validateFinancialsTabExclusionForAccommodations('InvalidClaimType');
} catch (error) {
    console.log(`Handled error gracefully: ${error}`);
}
```

## Maintenance Guidelines

### 1. Adding New Test Scenarios
1. Add test data to appropriate Excel worksheet
2. Create new test methods in DetailsPage.ts if needed
3. Add test cases to DS-details-general.spec.ts
4. Update documentation

### 2. Updating Locators
1. Update locators in DetailsPage.ts
2. Test across all browsers
3. Update visual regression baselines if needed

### 3. Performance Threshold Updates
1. Update thresholds in Excel data
2. Monitor performance trends
3. Adjust based on environment changes

### 4. Security Testing Updates
1. Update user role mappings in LoginPage.ts
2. Add new permission scenarios to Excel data
3. Update CustomFieldsData worksheet

## Troubleshooting

### Common Issues

#### 1. Test Data Not Found
**Error**: `Sheet "DetailsGeneral" not found`
**Solution**: Ensure Excel file exists at correct path and contains required worksheets

#### 2. Claim Not Found
**Error**: `Claim DS-12345 should be found`
**Solution**: Update test data with valid claim numbers for your environment

#### 3. Performance Test Failures
**Error**: `Details tab should load within performance threshold`
**Solution**: Check network conditions and adjust thresholds in Excel data

#### 4. Locator Not Found
**Error**: `Details dropdown menu should be visible`
**Solution**: Update locators in DetailsPage.ts to match current UI implementation

### Debug Mode
```bash
# Run with debug mode for detailed logging
npx playwright test tests/specs/DS-details-general.spec.ts --debug

# Run with headed browser for visual debugging
npx playwright test tests/specs/DS-details-general.spec.ts --headed
```

## Reporting

### Test Reports
- HTML reports generated in `playwright-report/`
- Screenshots captured in `test-results/screenshots/`
- Performance metrics logged to console

### Visual Regression
- Baseline images stored in test expectations
- Differences highlighted in reports
- Update baselines with `--update-snapshots` flag

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names with user story references
- Implement proper setup and teardown

### 2. Data Management
- Use Excel for complex test scenarios
- Include inline data for simple cases
- Maintain environment-specific data files

### 3. Error Handling
- Implement comprehensive try-catch blocks
- Use soft assertions for non-critical validations
- Provide meaningful error messages

### 4. Performance
- Monitor test execution times
- Use parallel execution where possible
- Optimize locator strategies

This implementation provides a robust foundation for testing the Details General Information functionality while following established framework patterns and best practices.
