# Accommodation Details General Information - Excel Test Data Structure

This document defines the Excel test data structure required for comprehensive testing of the Details General Information functionality specifically for accommodation claims as specified in User Story requirements 3.4.001, 3.4.002, 3.4.003, and 3.4.4.001.

## Excel File Location
**Primary Data Source**: `C:\DataVoV\DataDriverVovQA.xlsx`

## Required Worksheets

### 1. AccommodationDetails Sheet
**Purpose**: Core accommodation Details functionality test data
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `TestCaseID` (String): Unique test case identifier
- `TestDescription` (String): Description of test scenario
- `AccommodationType` (String): Type of accommodation claim (Standard, Premium, JURIS, etc.)
- `ClaimNumber` (String): Specific accommodation claim number for testing
- `ExpectedMenuItems` (String): Semicolon-separated list of expected menu items
- `ExcludedMenuItems` (String): Semicolon-separated list of items that should NOT appear
- `ShowFinancialsTab` (String): TRUE/FALSE - whether Financials tab should be visible
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | TestCaseID | TestDescription | AccommodationType | ClaimNumber | ExpectedMenuItems | ExcludedMenuItems | ShowFinancialsTab | ExpectedResult
1   | 1       | AD-001     | Standard Accommodation Details Menu | Standard Accommodation | AC-12345 | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | TRUE | PASS
1   | 2       | AD-002     | Premium Accommodation Details Menu | Premium Accommodation | AC-12346 | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | TRUE | PASS
1   | 3       | AD-003     | JURIS Accommodation Details | JURIS Accommodation | JA-12347 | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | FALSE | PASS
```

### 2. AccommodationClaims Sheet
**Purpose**: Different accommodation claim types for data-driven testing
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `AccommodationType` (String): Specific accommodation claim type
- `ClaimNumber` (String): Accommodation claim number for testing
- `LineOfBusiness` (String): Line of business description
- `ClaimStatus` (String): Current claim status
- `ExpectedMenuItems` (String): Expected Details menu items
- `ExcludedMenuItems` (String): Items that should be excluded
- `FinancialsTabVisible` (String): TRUE/FALSE for Financials tab visibility
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | AccommodationType | ClaimNumber | LineOfBusiness | ClaimStatus | ExpectedMenuItems | ExcludedMenuItems | FinancialsTabVisible | ExpectedResult
1   | 1       | Standard Accommodation | AC-001 | Accommodation Standard | Open | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | TRUE | PASS
1   | 2       | Premium Accommodation | AC-002 | Accommodation Premium | Pending | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | TRUE | PASS
1   | 3       | Basic Accommodation | AC-003 | Accommodation Basic | Active | Accommodations;Time Tracking;Contacts;Custom Fields | Benefit Plan;Medical;Legal;Appeals;Tender;Plan Summary | TRUE | PASS
```

### 3. JURISAccommodations Sheet
**Purpose**: JURIS Accommodation specific test scenarios
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `ClaimNumber` (String): JURIS accommodation claim number
- `AccommodationType` (String): Type of accommodation
- `ClaimStatus` (String): Current status
- `ExpectedMenuItems` (String): Expected Details menu items
- `FinancialsTabVisible` (String): Should always be FALSE for JURIS
- `CustomFieldsAccess` (String): Level of access to custom fields
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | ClaimNumber | AccommodationType | ClaimStatus | ExpectedMenuItems | FinancialsTabVisible | CustomFieldsAccess | ExpectedResult
1   | 1       | JA-001 | Workplace Modification | Active | Accommodations;Time Tracking;Contacts;Custom Fields | FALSE | Full | PASS
1   | 2       | JA-002 | Schedule Adjustment | Pending | Accommodations;Time Tracking;Contacts;Custom Fields | FALSE | Full | PASS
1   | 3       | JA-003 | Equipment Provision | Closed | Accommodations;Time Tracking;Contacts;Custom Fields | FALSE | ReadOnly | PASS
```

### 4. CustomFieldsData Sheet
**Purpose**: Custom Fields functionality and security testing for accommodation claims
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `UserRole` (String): User role for security testing
- `TestClaimNumber` (String): Accommodation claim number for testing
- `ExpectedAccess` (String): Expected level of access (Full, ReadOnly, None)
- `FieldsVisible` (String): TRUE/FALSE - Fields section visibility
- `HRDataVisible` (String): TRUE/FALSE - HR Data section visibility
- `AlternativeClaimNumbers` (String): Should always be FALSE for accommodation claims
- `EditPermissions` (String): TRUE/FALSE - Edit permissions
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | UserRole | TestClaimNumber | ExpectedAccess | FieldsVisible | HRDataVisible | AlternativeClaimNumbers | EditPermissions | ExpectedResult
1   | 1       | Administrator | AC-001 | Full | TRUE | TRUE | FALSE | TRUE | PASS
1   | 2       | StandardUser | AC-002 | Full | TRUE | TRUE | FALSE | TRUE | PASS
1   | 3       | ReadOnlyUser | AC-003 | ReadOnly | TRUE | TRUE | FALSE | FALSE | PASS
1   | 4       | GuestUser | AC-004 | None | FALSE | FALSE | FALSE | FALSE | PASS
```

### 5. PerformanceTestData Sheet
**Purpose**: Performance testing scenarios and thresholds
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `TestScenario` (String): Performance test scenario description
- `ClaimNumber` (String): Claim for performance testing
- `MaxLoadTime` (Number): Maximum acceptable load time in milliseconds
- `MaxResponseTime` (Number): Maximum acceptable response time in milliseconds
- `IterationCount` (Number): Number of iterations for stress testing
- `ExpectedResult` (String): Expected performance outcome

**Example Data**:
```
Set | DataSet | TestScenario | ClaimNumber | MaxLoadTime | MaxResponseTime | IterationCount | ExpectedResult
1   | 1       | Details Tab Load | AC-001 | 3000 | 1000 | 10 | PASS
1   | 2       | Dropdown Menu Response | AC-002 | 2000 | 800 | 15 | PASS
1   | 3       | Custom Fields Navigation | AC-003 | 4000 | 1500 | 5 | PASS
```

### 6. CrossBrowserData Sheet
**Purpose**: Cross-browser compatibility testing data
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `BrowserName` (String): Browser for testing (chromium, firefox, webkit)
- `ClaimNumber` (String): Test claim number
- `TestFeatures` (String): Features to test in this browser
- `ExpectedBehavior` (String): Expected behavior description
- `ScreenshotRequired` (String): TRUE/FALSE - whether screenshot is needed
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | BrowserName | ClaimNumber | TestFeatures | ExpectedBehavior | ScreenshotRequired | ExpectedResult
1   | 1       | chromium | AC-001 | All Details Features | Standard Behavior | TRUE | PASS
1   | 2       | firefox | AC-001 | All Details Features | Standard Behavior | TRUE | PASS
1   | 3       | webkit | AC-001 | All Details Features | Standard Behavior | TRUE | PASS
```

### 7. ErrorHandlingData Sheet
**Purpose**: Error handling and edge case testing
**Columns**:
- `Set` (Number): Test set identifier
- `DataSet` (Number): Dataset within the set
- `ErrorScenario` (String): Description of error scenario
- `ClaimNumber` (String): Test claim (may be invalid for error testing)
- `ExpectedError` (String): Expected error message or behavior
- `RecoveryAction` (String): Expected recovery mechanism
- `ShouldFailTest` (String): TRUE/FALSE - whether test should fail
- `ExpectedResult` (String): Expected test outcome

**Example Data**:
```
Set | DataSet | ErrorScenario | ClaimNumber | ExpectedError | RecoveryAction | ShouldFailTest | ExpectedResult
1   | 1       | Invalid Accommodation Type | INVALID-001 | Graceful Handling | Show Default Menu | FALSE | PASS
1   | 2       | Network Interruption | AC-001 | Retry Mechanism | Auto Retry | FALSE | PASS
1   | 3       | Insufficient Permissions | AC-002 | Access Denied Message | Redirect to Home | FALSE | PASS
```

## Data Usage Guidelines

### 1. Test Set Organization
- **Set 1**: Basic functionality testing
- **Set 2**: Advanced scenarios and edge cases
- **Set 3**: Performance and load testing
- **Set 4**: Security and permissions testing
- **Set 5**: Cross-browser compatibility testing

### 2. Data Selection Patterns
```typescript
// Example usage in test code
const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');

// Select specific dataset
excelReader.selectDataSet('AccommodationDetails', 1);

// Iterate through test cases
for (let i = 0; i < excelReader.count(); i++) {
    excelReader.useRow(i);
    const accommodationType = excelReader.getValue('AccommodationType');
    const expectedMenuItems = excelReader.getValue('ExpectedMenuItems').split(';');
    // ... test implementation
}
```

### 3. Data Validation Rules
- All accommodation claim numbers must be valid and accessible in the test environment
- Menu items should use exact text matching
- Boolean fields should use TRUE/FALSE (case sensitive)
- Semicolon-separated lists should not have spaces after semicolons
- Performance thresholds should be realistic for the test environment
- Alternative Claim Numbers should always be FALSE for accommodation claims

### 4. Environment-Specific Data
- **QA Environment**: Use QA-specific claim numbers and data
- **PreProd Environment**: Use PreProd-specific claim numbers and data
- **Demo Environment**: Use demo-safe data that doesn't expose sensitive information

## Maintenance Guidelines

### 1. Regular Updates
- Update accommodation claim numbers when test data is refreshed
- Adjust performance thresholds based on environment changes
- Add new accommodation test scenarios as requirements evolve

### 2. Data Integrity
- Validate all accommodation claim numbers exist before test execution
- Ensure user roles have appropriate permissions for accommodation claims
- Verify menu item text matches current UI implementation
- Confirm Alternative Claim Numbers exclusion for accommodation claims

### 3. Version Control
- Track changes to Excel data structure
- Document any modifications to column definitions
- Maintain backward compatibility when possible

This data structure supports comprehensive testing of all Details General Information requirements specifically for accommodation claims while providing flexibility for future enhancements and maintenance.
