import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

/**
 * LEAVE - DETAILS>CERTIFICATIONS Screen Test Suite
 * 
 * This test suite covers the comprehensive testing of the DETAILS>CERTIFICATIONS screen
 * as specified in User Story requirements 3.7.001 through 3.7.008.
 * 
 * Test Coverage:
 * - Page header and structure validation
 * - Grid display with all required columns
 * - Row expansion functionality with three sections
 * - Filter and pagination functionality
 * - Data format validation
 * - Scroll to top functionality
 * - Data-driven testing scenarios
 */

test.describe('LV Certifications - Page Structure and Header', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to a disability claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(6);
    });

    test('Validate Certifications Page Header and Structure - Req 3.7.001', async ({ certifications }) => {
        // Navigate to Certifications tab
        await certifications.navigateToCertificationsTab();
        
        // Validate page header
        await certifications.validateCertificationsPageHeader();
        
        // Validate grid structure with all required columns
        await certifications.validateGridStructure();
        
        // Validate certification count display
        await certifications.validateCertificationCountDisplay();
    });

    test('Validate Grid Columns and Data Format - Req 3.7.001', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate grid structure
        await certifications.validateGridStructure();
        
        // Validate data format for first row
        await certifications.validateGridRowDataFormat(0);
        
        // Get and validate row count
        const rowCount = await certifications.getGridRowCount();
        expect(rowCount, 'Should have at least one certification row').toBeGreaterThan(0);
    });

    test('Validate Certification Count Display Format - Req 3.7.005', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate certification count format
        await certifications.validateCertificationCountDisplay();
        
        // Get actual count and validate format
        const count = await certifications.getCertificationCount();
        expect(count, 'Certification count should be greater than 0').toBeGreaterThan(0);
    });
});

test.describe('LV Certifications - Row Expansion Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
    });

    test('Validate Row Expansion with Certification Section - Req 3.7.002', async ({ certifications, view }) => {
        await view.SearchClaimByCriteria(6);
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate certification section is visible
        await certifications.validateCertificationSectionFields(0);
        
        // Validate date formats in certification section
        await certifications.validateDateFormatInExpandedSections(0, 'certification');
    });

    test('Validate Clarification Section Visibility Logic - Req 3.7.003', async ({ certifications, view }) => {
        await view.SearchClaimByCriteria(6);
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate clarification section visibility logic
        await certifications.validateClarificationSectionVisibility(0);
    });

    test('Validate Intermittent Absence Frequency Section - Req 3.7.004', async ({ certifications, view }) => {
        await view.SearchClaimByCriteria(7);
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate intermittent absence frequency section
        await certifications.validateIntermittentAbsenceFrequencySection(0);
    });

    test('Validate Complete Expanded Row Data - Req 3.7.002-3.7.004', async ({ certifications, view }) => {
        await view.SearchClaimByCriteria(7);
        await certifications.navigateToCertificationsTab();
        
        // Validate complete expanded row data
        await certifications.validateExpandedRowCompleteData(0);
        await certifications.collapseCertificationRow(0);
        
    });

    test('Validate Row Collapse Functionality', async ({ certifications, view, page }) => {
        await view.SearchClaimByCriteria(7);
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Collapse the row
        await certifications.collapseCertificationRow(0);
        
        // Validate sections are hidden
        const certificationSection = page.locator('//div[contains(@class, "certification-section")]');
        await expect(certificationSection, 'Certification section should be hidden after collapse').toBeHidden();
    });
});

test.describe('LV Certifications - Filter and Search Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(7);
    });

    test('Validate Filter Functionality - Req 3.7.005', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test filtering by different criteria
        const filterTests = [
            { type: 'Status', value: 'Complete' },
            { type: 'Relationship', value: 'Self' },
            { type: 'Reason', value: 'Lorem ipsum dolor sit ame' }
        ];
        
        for (const filterTest of filterTests) {
            await certifications.filterCertifications(filterTest.type, filterTest.value);
        }
    });

    test('Validate Filter Results Display', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Get initial count
        const initialCount = await certifications.getCertificationCount();
        
        // Apply filter
        await certifications.filterCertifications('Status', 'Complete', false);
        
        // Validate filtered results
        const filteredCount = await certifications.getCertificationCount();
        expect(filteredCount, 'Filtered count should be less than or equal to initial count').toBeLessThanOrEqual(initialCount);
    });

    test('Validate Clear Filter Functionality', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Get initial count
        const initialCount = await certifications.getCertificationCount();
        
        // Apply filter and clean it
        await certifications.filterCertifications('Status', 'Complete', true);
        
        // Validate all results are shown again
        const finalCount = await certifications.getCertificationCount();
        expect(finalCount, 'Count should match initial count after clearing filter').toBe(initialCount);
    });
});

test.describe('LV Certifications - Pagination Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(8);
    });

    test('Validate Pagination Controls Display - Req 3.7.006', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate pagination controls
        await certifications.validatePaginationControls();
    });

    test('Validate Next Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Check if pagination is available
        const paginationSection = certifications.getPaginationSection();
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            // Validate we're on a different page
            let currentPageNumber = await certifications.getCurrentPageNumber();
            await certifications.navigateToNextPage();
            let nextPageNumber = await certifications.getCurrentPageNumber();
            expect(currentPageNumber, `Page number should change after navigation. Initial Page [${currentPageNumber}], Actual Page [${nextPageNumber}]`).not.toBe(nextPageNumber);
        }
    });

    test('Validate Previous Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Check if pagination is available
        const paginationSection = certifications.getPaginationSection();
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            let currentPageNumber = await certifications.getCurrentPageNumber();
            await certifications.navigateToNextPage();
            await certifications.navigateToPreviousPage();
            
            // Validate we're back to the first page
            let nextPageNumber = await certifications.getCurrentPageNumber();
            expect(currentPageNumber, `Page number should be the same after navigation. Initial Page [${currentPageNumber}], Actual Page [${nextPageNumber}]`).toBe(nextPageNumber);
        }
    });

    test('Validate Specific Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Check if pagination is available
        const paginationSection = certifications.getPaginationSection();
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            // Navigate to page 2
            let pageToSelect = 2;
            await certifications.navigateToSpecificPage(pageToSelect);
            
            // Validate we're on page 2
            let nextPageNumber = await certifications.getCurrentPageNumber();
            expect(pageToSelect.toString(), `Page number should be Page [${pageToSelect}], Actual Page [${nextPageNumber}]`).toBe(nextPageNumber.toString());
        }
    });
});

