import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';

export class CustomClaimHeader extends BasePage {
    private readonly name = "Custom Claim Header Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Dynamic Locator Methods for Claim Header Elements
    //--------------------------------------------------------------------------------------------

    private getClaimFieldLocator(fieldName: string): Locator {
        const lowerFieldName = fieldName.toLowerCase();
        const locatorField = `//app-claim-header//div[contains(@class, 'tw-justify-between') and div[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowerFieldName}')]]//div[contains(@class, 'tw-text')]`;
        return this.page.locator(locatorField);
    }

    private getHeaderLabelName(fieldName: string): Locator {
        return this.getClaimFieldLocator(fieldName).nth(0);
    }

    private getClaimFieldValue(fieldName: string): Locator {
        return this.getClaimFieldLocator(fieldName).nth(1);
    }

    getClaimFieldValueLocator(fieldName: string): Locator {
        return this.getClaimFieldValue(fieldName);
    }

    private get startIcon(): Locator {
        return this.page.getByRole('link', { name: 'Watching click to remove from watchlist'});
    }

    private get pencilIcon(): Locator {
        return this.page.locator('a[aria-label="Pencil for configure header"]');
    }

    //--------------------------------------------------------------------------------------------
    // Dynamic Field Selection Methods
    //--------------------------------------------------------------------------------------------
    
    private getFieldItem(fieldName: string): Locator {
        return this.page.locator(`//div[contains(@class, "field-item") and contains(., "${fieldName}")]`);
    }

    private get availableListRoot(): Locator {
        return this.page.locator('(//ul[contains(@class, "cdk-listbox")])[1]');
    }
    private get selectedListRoot(): Locator {
        return this.page.locator('(//ul[contains(@class, "cdk-listbox")])[2]');
    }

    private getFieldInAvailableList(fieldName: string): Locator {
        return this.availableListRoot.getByRole('option', { name: fieldName });
    }

    private getFieldInSelectedList(fieldName: string): Locator {
        return this.selectedListRoot.getByRole('option', { name: fieldName, exact: true });
    }    

    //--------------------------------------------------------------------------------------------
    // LOB-Specific Claim Header Locators (Disability and Leave)
    //--------------------------------------------------------------------------------------------

    private get customizeHeaderPopup(): Locator {
        return this.page.locator('//div[@role="dialog" and (contains(., "Configure disability header") or contains(., "Configure leave header"))]');
    }

    private get customizeHeaderTitle(): Locator {
        return this.page.locator('//*[text()="Configure disability header" or text()="Configure leave header"]');
    }

    // Leave-specific locators
    private get leaveCustomizeHeaderPopup(): Locator {
        return this.page.locator('//div[@role="dialog" and contains(., "Configure leave header")]');
    }

    private get leaveCustomizeHeaderTitle(): Locator {
        return this.page.locator('//*[text()="Configure leave header"]');
    }

    private get availableFieldsList(): Locator {
        return this.availableListRoot.locator('li');
    }

    private get selectedFieldsList(): Locator {
        return this.selectedListRoot.locator('li');
    }

    private get saveButton(): Locator {
        return this.page.getByRole('button', { name: 'Save' });
    }

    private get cancelButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    private get restoreDefaultsButton(): Locator {
        return this.page.getByRole('button', { name: 'Restore defaults' });
    }

    private get moveUpButton(): Locator {
        return this.page.getByRole('button', { name: 'Move up' });
    }

    private get moveDownButton(): Locator {
        return this.page.getByRole('button', { name: 'Move down' });
    }

    private get removeFieldButton(): Locator {
        return this.page.getByRole('button', { name: 'From from selected' });
    }

    private get addFieldButton(): Locator {
        return this.page.getByRole('button', { name: 'Add to selected' });
    }

    private get errorRequiredMessage(): Locator {
        return this.page.locator('//*[contains(text(), " Error: Required ")]');
    }


    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Claim Header Elements are Visible')
    async validateDefaultClaimHeaderFieldsAreVisible() {
        await expect(this.getHeaderLabelName('Status'), '"Status" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Opened'), '"Opened" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('First absence'), '"First absence" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Closed'), '"Closed" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Reopened'), '"Reopened" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Examiner'), '"Examiner" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Client #'), '"Client #" label should be visible').not.toBeVisible();
        await expect(this.getHeaderLabelName('Client name'), '"Client name" label should be visible').not.toBeVisible();
        await expect(this.getHeaderLabelName('Last worked'), '"Last worked" label should be visible').not.toBeVisible();
    }

    @step('Validate Specific Field Value')
    async validateSpecificFieldValue(fieldName: string, expectedValue: string) {
        const fieldValue = this.getClaimFieldValue(fieldName);
        await expect(fieldValue, `${fieldName} field value should be "${expectedValue}"`).toHaveText(expectedValue);
    }

    @step('Validate Field is Visible')
    async validateFieldIsVisible(fieldName: string, includeValue: boolean = true) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        const fieldValue = this.getClaimFieldValue(fieldName);
        await expect(fieldLabel, `${fieldName} field label should be visible`).toBeVisible();
        if(includeValue){
            await expect.soft(fieldValue, `${fieldName} field value should be visible`).toBeVisible();
        }
    }

    @step('Validate Field is Not Visible')
    async validateFieldIsNotVisible(fieldName: string) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        await expect(fieldLabel, `${fieldName} field label should not be visible`).not.toBeVisible();
    }

    @step('Validate Default Disability Claim Header Fields')
    async validateDefaultDisabilityClaimHeaderFields() {
        // Validate default fields are visible
        await this.validateFieldIsVisible('Status');
        await this.validateFieldIsVisible('Opened');
        await this.validateFieldIsVisible('First absence');
        await this.validateFieldIsVisible('Closed');
        await this.validateFieldIsVisible('Reopened');
        await this.validateFieldIsVisible('Examiner');
        
        // Validate additional fields are not visible by default
        await this.validateFieldIsNotVisible('Client #');
        await this.validateFieldIsNotVisible('Client name');
        await this.validateFieldIsNotVisible('Last worked');
    }

    @step('Validate Default Leave Claim Header Fields')
    async validateDefaultLeaveClaimHeaderFields() {
        // Validate default fields are visible for Leave claims
        await this.validateFieldIsVisible('Status');
        await this.validateFieldIsVisible('Case Type');
        await this.validateFieldIsVisible('Date Begin');
        await this.validateFieldIsVisible('Date End');
        await this.validateFieldIsVisible('Examiner');
        
        // Validate additional fields are not visible by default
        await this.validateFieldIsNotVisible('Examiner phone number');
        await this.validateFieldIsNotVisible('Work state/province');
        await this.validateFieldIsNotVisible('Relationship');
        await this.validateFieldIsNotVisible('Caring for');
        await this.validateFieldIsNotVisible('Gender');
        await this.validateFieldIsNotVisible('Hours worked in last 12 months');
        await this.validateFieldIsNotVisible('Months of service');
        await this.validateFieldIsNotVisible('Phone #');
        await this.validateFieldIsNotVisible('Spouse at same client');
        await this.validateFieldIsNotVisible('SSN');
        await this.validateFieldIsNotVisible('Contract #');
        await this.validateFieldIsNotVisible('Client');
    }

    @step('Validate Status Color Coding')
    async validateStatusColorCoding(status: string) {
        const fieldLabel = this.getHeaderLabelName('Status');
        const fieldValue = this.getClaimFieldValue('Status');
        
        await expect(fieldLabel, 'Status box should be visible').toBeVisible();
        await expect(fieldValue, 'Status value should be visible').toBeVisible();
        
        // Validate color coding based on status
        if (status.toLowerCase().includes('open') || status.toLowerCase().includes('reopen')) {
            await expect.soft(fieldValue, 'Open/Reopen status should have green color').toHaveCSS('background-color', 'rgb(10, 133, 125)');
        } else if (status.toLowerCase().includes('closed')) {
            await expect.soft(fieldValue, 'Closed status should have red color').toHaveCSS('background-color', 'rgb(210, 40, 40)');
        } else if (status.toLowerCase().includes('incident')) {
            await expect.soft(fieldValue, 'Incident status should have yellow color').toHaveCSS('background-color', 'rgb(228, 217, 60)');
        }
    }

    @step('Validate Date Format')
    async validateDateFormat(fieldName: string) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        const fieldValue = this.getClaimFieldValue(fieldName);
        
        await expect(fieldLabel, 'Status box should be visible').toBeVisible();
        await expect(fieldValue, 'Status value should be visible').toBeVisible();

        const dateText = await fieldValue.textContent();
        const dateTrimmed = dateText?.trim();

        // Validate MM/DD/YYYY format
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        await fieldValue.highlight();
        expect(dateTrimmed, `${fieldName} should be in MM/DD/YYYY format`).toMatch(dateRegex);
    }

    @step('Validate Examiner Name Format')
    async validateExaminerNameFormat() {
        const examinerValue = this.getClaimFieldValue('Examiner');
        const examinerText = await examinerValue.textContent();
        
        // Should display FIRST and LAST NAME, not be a hyperlink
        //expect(examinerText, 'Examiner should display first and last name').toMatch(/^[A-Za-z]+ [A-Za-z]+$/);
        expect(examinerText?.trim(), 'Examiner should display first and last name').toMatch(/^[A-Za-z]+(\s+[A-Za-z]+)+$/);
        
        // Should not be a hyperlink
        const examinerLink = this.page.locator('//app-claim-header//div[div[contains(text(), "Examiner")]]//a');
        await expect(examinerLink, 'Examiner should not be a hyperlink').not.toBeVisible();
    }

    @step('Wait Customization Popup to be Hidden')
    async waitCustomizationToBeHidden() {
        await expect(this.customizeHeaderPopup, 'Customization popup should be hidden').toBeHidden();
    }

    @step('Validate Customization Popup is Open')
    async validateCustomizationPopupIsOpen() {
        await expect(this.customizeHeaderPopup, 'Customization popup should be visible').toBeVisible();
        await expect(this.customizeHeaderTitle, 'Popup title should be "Configure disability header"').toBeVisible();
    }

    @step('Validate Leave Customization Popup is Open')
    async validateLeaveCustomizationPopupIsOpen() {
        await expect(this.leaveCustomizeHeaderPopup, 'Leave customization popup should be visible').toBeVisible();
        await expect(this.leaveCustomizeHeaderTitle, 'Popup title should be "Configure leave header"').toBeVisible();
    }

    @step('Validate Customization Popup is Closed')
    async validateCustomizationPopupIsClosed() {
        await expect(this.customizeHeaderPopup, 'Customization popup should not be visible').not.toBeVisible();
    }

    @step('Validate Field Order in Header')
    async validateFieldOrderInHeader(expectedOrder: string[]) {
        const headerFields = this.page.locator('//app-claim-header//div[contains(@class, "tw-flex tw-justify-between")]');
        const fieldCount = await headerFields.count();
        
        expect(fieldCount, `Expected ${expectedOrder.length} fields, found ${fieldCount}`).toBe(expectedOrder.length);
        for (let i = 0; i < expectedOrder.length; i++) {
            const fieldLabel = headerFields.nth(i).locator('//div[contains(@class, "tw-items-top")]');
            await expect.soft(fieldLabel, `Field at position ${i + 1} should be "${expectedOrder[i]}"`).toHaveText(expectedOrder[i]);
        }
    }

    @step('Validate Maximum Fields Limit')
    async validateMaximumFieldsLimit() {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        
        expect(fieldCount, 'Maximum 10 fields should be allowed').toBeLessThanOrEqual(10);
    }

    
    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Click Star Icon from Watchlist')
    async clickStarIcon() {
        await expect(this.startIcon, 'Star Icon from Watchlist should be visible').toBeVisible();
        await this.startIcon.click();
    }

    @step('Click Pencil Icon to configure header')
    async clickPencilIcon() {
        await expect(this.pencilIcon, 'Pencil icon should be visible').toBeVisible();
        await this.pencilIcon.click();
    }

    @step('Open Customization Popup')
    async openCustomizationPopup() {
        await this.clickPencilIcon();
        await this.validateCustomizationPopupIsOpen();
    }

    @step('Open Leave Customization Popup')
    async openLeaveCustomizationPopup() {
        await this.clickPencilIcon();
        await this.validateLeaveCustomizationPopupIsOpen();
    }

    @step('Close Customization Popup')
    async closeCustomizationPopup() {
        await this.cancelButton.click();
        await this.validateCustomizationPopupIsClosed();
    }

    @step('Save Customization Changes')
    async saveCustomizationChanges() {
        await this.saveButton.click();
        await this.validateCustomizationPopupIsClosed();
        await this.waitCustomizationToBeHidden();
    }

    @step('Add Field to Header')
    async addFieldToHeader(fieldName: string) {
        //Select Field from available list
        const fieldInAvailable = this.getFieldInAvailableList(fieldName);
        await expect(fieldInAvailable, `Field "${fieldName}" should be available for selection`).toBeVisible();
        await fieldInAvailable.click();
        await this.addFieldButton.click();
        
        // Validate field is now in selected list
        await expect(this.getFieldInSelectedList(fieldName), `Field "${fieldName}" should be in selected list`).toBeVisible();
    }

    @step('Remove Field from Header')
    async removeFieldFromHeader(fieldName: string) {
        const fieldInSelected = await this.getFieldInSelectedList(fieldName);
        await expect(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        await fieldInSelected.click(); // Select the field
        await this.removeFieldButton.click();
        
        // Validate field is now in available list
        await expect(this.getFieldInAvailableList(fieldName), `Field "${fieldName}" should be in available list`).toBeVisible();
    }

    @step('Move Field Up in Order')
    async moveFieldUpInOrder(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        
        await expect(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        await fieldInSelected.click(); // Select the field
        await this.moveUpButton.click();
    }

    @step('Move Field Down in Order')
    async moveFieldDownInOrder(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        
        await expect(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        await fieldInSelected.click(); // Select the field
        await this.moveDownButton.click();
    }

    @step('Restore Default Fields')
    async restoreDefaultFields() {
        await expect(this.restoreDefaultsButton, 'Restore Defaults button should be visible').toBeVisible();
        await this.restoreDefaultsButton.click();
        await this.delay(3000);
        
        // Validate default fields are restored
        //if(validateFields){
        //    await this.validateDefaultDisabilityClaimHeaderFields();
        //}
    }

    @step('Customize Header with Fields')
    async customizeHeaderWithFields(fieldsToAdd: string[], fieldsToRemove: string[] = [], restoreDefaultFields = true, saveChanges = true) {
        // Restore Defaults Options
        await this.openCustomizationPopup();
        if( restoreDefaultFields ){ 
            await this.restoreDefaultFields(); 
        }
        
        // Add fields
        for (const field of fieldsToAdd) {
            await this.addFieldToHeader(field);
        }
        
        // Remove fields
        for (const field of fieldsToRemove) {
            await this.removeFieldFromHeader(field);
        }
        
        if(saveChanges){
            await this.saveCustomizationChanges();
        }
    }

    @step('Customize Leave Header with Fields')
    async customizeLeaveHeaderWithFields(fieldsToAdd: string[], fieldsToRemove: string[] = [], restoreDefaultFields = true, saveChanges = true) {
        // Restore Defaults Options
        await this.openLeaveCustomizationPopup();
        if( restoreDefaultFields ){ 
            await this.restoreDefaultFields(); 
        }
        
        // Add fields
        for (const field of fieldsToAdd) {
            await this.addFieldToHeader(field);
        }
        
        // Remove fields
        for (const field of fieldsToRemove) {
            await this.removeFieldFromHeader(field);
        }
        
        if(saveChanges){
            await this.saveCustomizationChanges();
        }
    }

    @step('Reorder Header Fields')
    async reorderHeaderFields(fieldName: string, direction: 'up' | 'down') {
        await this.openCustomizationPopup();
        
        if (direction === 'up') {
            await this.moveFieldUpInOrder(fieldName);
        } else {
            await this.moveFieldDownInOrder(fieldName);
        }
        
        await this.saveCustomizationChanges();
    }

    @step('Validate At Least One Field Selected')
    async validateAtLeastOneFieldSelected() {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        
        expect(fieldCount, 'At least one field must be selected').toBeGreaterThan(0);
    }

    @step('Validate Field is Available for Selection')
    async validateFieldIsAvailableForSelection(fieldName: string) {
        const fieldInAvailable = this.getFieldInAvailableList(fieldName);
        await expect(fieldInAvailable, `Field "${fieldName}" should be available for selection`).toBeVisible();
    }

    @step('Validate Field is Selected')
    async validateFieldIsSelected(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        await expect(fieldInSelected, `Field "${fieldName}" should be selected`).toBeVisible();
    }

    @step('Validate Field is Not Selected')
    async validateFieldIsNotSelected(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        await expect(fieldInSelected, `Field "${fieldName}" should not be selected`).not.toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Status Check Methods
    //--------------------------------------------------------------------------------------------

    @step('Get Current Header Field Order')
    async getCurrentHeaderFieldOrder(): Promise<string[]> {
        const headerFields = await this.page.locator('//app-claim-header//div[contains(@class, "tw-justify-between")]//div[not(contains(@class, "insert")) and contains(@class, "tw-text-balance")]').all();
        const fieldOrder: string[] = [];
        
        for (const field of headerFields){
            const fieldText = await field.textContent();
            if (fieldText) {
                fieldOrder.push(fieldText.trim());
            }
        }

        return fieldOrder;
    }

    @step('Get Available Fields List')
    async getAvailableFieldsList(): Promise<string[]> {
        const availableFields = this.availableFieldsList;
        const fieldCount = await availableFields.count();
        const fields: string[] = [];
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldText = await availableFields.nth(i).textContent();
            if (fieldText) {
                fields.push(fieldText.trim());
            }
        }
        
        return fields;
    }

    @step('Get Selected Fields List')
    async getSelectedFieldsList(): Promise<string[]> {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        const fields: string[] = [];
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldText = await selectedFields.nth(i).textContent();
            if (fieldText) {
                fields.push(fieldText.trim());
            }
        }
        
        return fields;
    }

    @step('Error Required: At least one field selected')
    async errorRequiredMessageIsVisible() {
        await expect(this.errorRequiredMessage, 'Error Required: At least one field selected should be visible').toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Leave-Specific Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Leave Status Color Coding')
    async validateLeaveStatusColorCoding(status: string) {
        const fieldLabel = this.getHeaderLabelName('Status');
        const fieldValue = this.getClaimFieldValue('Status');
        
        await expect(fieldLabel, 'Status box should be visible').toBeVisible();
        await expect(fieldValue, 'Status value should be visible').toBeVisible();
        
        // Validate color coding based on Leave status
        if (status.toLowerCase().includes('open')) {
            await expect.soft(fieldValue, 'Open status should have green color').toHaveCSS('background-color', 'rgb(10, 133, 125)');
        } else if (status.toLowerCase().includes('closed')) {
            await expect.soft(fieldValue, 'Closed status should have red color').toHaveCSS('background-color', 'rgb(210, 40, 40)');
        }
    }

    @step('Validate Leave Case Type Format')
    async validateLeaveCaseTypeFormat() {
        const caseTypeValue = this.getClaimFieldValue('Case Type');
        const caseTypeText = await caseTypeValue.textContent();
        
        // Validate Case Type format (e.g., Intermittent, Continuous, Reduced Work Schedule)
        expect(caseTypeText?.trim(), 'Case Type should display valid format').toMatch(/^(Intermittent|Continuous|Reduced Work Schedule)$/);
    }

    @step('Validate Leave Date Format')
    async validateLeaveDateFormat(fieldName: string) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        const fieldValue = this.getClaimFieldValue(fieldName);
        
        await expect(fieldLabel, `${fieldName} field should be visible`).toBeVisible();
        await expect(fieldValue, `${fieldName} value should be visible`).toBeVisible();

        const dateText = await fieldValue.textContent();
        const dateTrimmed = dateText?.trim();

        // Validate MM/DD/YYYY format
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        await fieldValue.highlight();
        expect(dateTrimmed, `${fieldName} should be in MM/DD/YYYY format`).toMatch(dateRegex);
    }

    @step('Validate Leave Examiner Name Format')
    async validateLeaveExaminerNameFormat() {
        const examinerValue = this.getClaimFieldValue('Examiner');
        const examinerText = await examinerValue.textContent();
        
        // Should display FIRST and LAST NAME, not be a hyperlink
        expect(examinerText?.trim(), 'Leave Examiner should display first and last name').toMatch(/^[A-Za-z]+(\s+[A-Za-z]+)+$/);
        
        // Should not be a hyperlink
        const examinerLink = this.page.locator('//app-claim-header//div[div[contains(text(), "Examiner")]]//a');
        await expect(examinerLink, 'Leave Examiner should not be a hyperlink').not.toBeVisible();
    }

    @step('Validate Leave Breadcrumbs Display')
    async validateLeaveBreadcrumbsDisplay(claimNumber: string) {
        // Try multiple possible breadcrumb locators
        const breadcrumbSelectors = [
            '//div[contains(@class, "breadcrumb")]',
            '//div[contains(@class, "breadcrumbs")]',
            '//nav[contains(@class, "breadcrumb")]',
            '//nav[contains(@class, "breadcrumbs")]',
            '//div[contains(@class, "tw-flex") and contains(., "View")]',
            '//div[contains(text(), "View")]'
        ];
        
        let breadcrumbs: Locator | null = null;
        for (const selector of breadcrumbSelectors) {
            const locator = this.page.locator(selector);
            if (await locator.isVisible()) {
                breadcrumbs = locator;
                break;
            }
        }
        
        expect(breadcrumbs, 'Breadcrumbs should be visible').not.toBeNull();
        
        // Validate breadcrumb format: "View / Claim Number"
        if (breadcrumbs) {
            const breadcrumbText = await breadcrumbs.textContent();
            expect(breadcrumbText, 'Breadcrumbs should display "View / Claim Number" format').toMatch(/View\s*\/\s*.*/);
            
            // Validate View is a hyperlink - try multiple approaches
            const viewLinkSelectors = [
                'a[contains(text(), "View")]',
                'a[contains(., "View")]',
                '//a[contains(text(), "View")]',
                '//button[contains(text(), "View")]'
            ];
            
            let viewLink: Locator | null = null;
            for (const selector of viewLinkSelectors) {
                const link = breadcrumbs.locator(selector);
                if (await link.isVisible()) {
                    viewLink = link;
                    break;
                }
            }
            
            expect(viewLink, 'View should be a hyperlink').not.toBeNull();
        }
    }

    @step('Validate Leave Employee Information Display')
    async validateLeaveEmployeeInformationDisplay(employeeId: string, employeeName: string) {
        // Validate Employee ID display
        const employeeIdField = this.page.locator(`//div[contains(text(), "Employee ID:")]`);
        await expect(employeeIdField, 'Employee ID should be visible').toBeVisible();
        
        // Validate Employee Name display (format = First Last)
        const employeeNameField = this.page.locator(`//div[contains(text(), "${employeeName}")]`);
        await expect(employeeNameField, 'Employee Name should be visible').toBeVisible();
        
        // Validate name format (First Last, both capitalized)
        expect(employeeName, 'Employee name should be in First Last format').toMatch(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/);
    }

    @step('Validate Leave Line of Business Display')
    async validateLeaveLineOfBusinessDisplay(lobText: string) {
        const lobField = this.page.locator(`//div[contains(text(), "${lobText}")]`);
        await expect(lobField, 'Line of Business should be visible').toBeVisible();
        
        // Validate it's displayed in gray font and left justified
        const lobStyle = await lobField.evaluate(el => window.getComputedStyle(el));
        expect(lobStyle.color, 'Line of Business should be in gray font').toMatch(/rgb\(128,\s*128,\s*128\)|gray/);
    }

    @step('Validate Leave Claim Number Display')
    async validateLeaveClaimNumberDisplay(claimNumber: string) {
        const claimNumberField = this.page.locator(`//div[contains(text(), "${claimNumber}")]`);
        await expect(claimNumberField, 'Claim Number should be visible').toBeVisible();
        
        // Validate it's displayed in bold and larger font
        const claimStyle = await claimNumberField.evaluate(el => window.getComputedStyle(el));
        expect(claimStyle.fontWeight, 'Claim Number should be bold').toBe('bold');
        
        // Validate star icon is present for watchlist
        const starIcon = this.page.locator('//a[contains(@aria-label, "Watching") or contains(@aria-label, "watchlist")]');
        await expect(starIcon, 'Star icon for watchlist should be visible').toBeVisible();
        
        // Validate glasses icon is present
        const glassesIcon = this.page.locator('//button[contains(@aria-label, "Search") or contains(@class, "search")]');
        await expect(glassesIcon, 'Glasses icon for search should be visible').toBeVisible();
    }

    @step('Validate Leave Additional Fields Format')
    async validateLeaveAdditionalFieldsFormat() {
        // Validate specific field formats for Leave claims
        const fieldFormats = {
            'Examiner phone number': /^\d{3}-\d{3}-\d{4}\s+X\d{5}$/,
            'Work state/province': /^[A-Z]{2}$/,
            'Phone #': /^\d{3}-\d{3}-\d{4}$/,
            'Hours worked in last 12 months': /^\d+\.?\d*$/,
            'Months of service': /^\d+$/,
            'Spouse at same client': /^(Yes|No)$/
        };

        for (const [fieldName, format] of Object.entries(fieldFormats)) {
            if (await this.getHeaderLabelName(fieldName).isVisible()) {
                const fieldValue = this.getClaimFieldValue(fieldName);
                const fieldText = await fieldValue.textContent();
                expect(fieldText?.trim(), `${fieldName} should match expected format`).toMatch(format);
            }
        }
    }

    @step('Validate Leave SSN Masking')
    async validateLeaveSSNMasking() {
        const ssnField = this.getClaimFieldValue('SSN');
        const ssnText = await ssnField.textContent();
        
        // Validate SSN is masked (format: XXX-XX-XXXX)
        expect(ssnText?.trim(), 'SSN should be masked').toMatch(/^\*{3}-\*{2}-\*{4}$/);
        
        // Validate eye icon is present for unmasking
        const eyeIcon = this.page.locator('//button[contains(@aria-label, "unmask") or contains(@class, "eye")]');
        await expect(eyeIcon, 'Eye icon for SSN unmasking should be visible').toBeVisible();
    }

    @step('Click View Hyperlink')
    async clickViewHyperlink() {
        // Try multiple approaches to find and click the View link
        const viewLinkSelectors = [
            '//a[contains(text(), "View")]',
            '//button[contains(text(), "View")]',
            '//div[contains(@class, "breadcrumb")]//a[contains(text(), "View")]',
            '//div[contains(@class, "breadcrumbs")]//a[contains(text(), "View")]'
        ];
        
        let viewLink: Locator | null = null;
        for (const selector of viewLinkSelectors) {
            const link = this.page.locator(selector).first();
            if (await link.isVisible()) {
                viewLink = link;
                break;
            }
        }
        
        expect(viewLink, 'View hyperlink should be visible').not.toBeNull();
        if (viewLink) {
            await viewLink.click();
        }
    }

    getSSNEyeIconLocator(): Locator {
        return this.page.locator('//button[contains(@aria-label, "unmask") or contains(@class, "eye")]');
    }

}
