import { Page, Locator, Expect, expect } from '@playwright/test';
import { step, test } from '../fixtures/BaseTest';
import { envHelper } from '../../utils/environment';


export class BasePage{
    protected page: Page;
    protected baseUrl: string;
    protected driverFile: string;
    protected driverPath: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = envHelper.getBaseUrl();
        this.driverFile = envHelper.getDataDriver();
        this.driverPath = "C:\\DataVoV\\";
    }

    @step('Delay to wait couple seconds.')
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @step('Navigate to url')
    async goToPage(path: string = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
    }

    @step('Wait for page load')
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    @step('Get Page Title')
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    @step('Get Current Url')
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    
    @step('Select Tab Menu')
    async selectTabMenu(tabName: string, useHover = false): Promise<void> {
        //Select Menu Tab
        let counter = 0;
        const options = tabName.split(';');
        for (const option of options) {
            const tabMenu = await this.page.getByRole('tab', { name: option});
            await expect(tabMenu, `Tab "${option}"should exist and be visible.`).toBeVisible();
            if(useHover && counter == 0){
                await tabMenu.hover();
            }
            else{
                await tabMenu.click();
            }
            await this.waitForPageLoad();
            counter++;
        }
    }


    @step('Dropdown - Multi Select')
    async dropdownMultiSelect(dropdownName: string, optionToSelect: string): Promise<void> {
        if(optionToSelect != ""){
            //Expand Dropdown
            const multiDropdown = await this.page.locator(`//*[label[contains(text(), "${dropdownName}")]]//div[contains(@class, "label-container")]`);
            const collapseButton = await this.page.locator(`//*[label[contains(text(), "${dropdownName}")]]//div[@class="p-multiselect-dropdown"]`);
            const counter = await multiDropdown.count();
            await expect(multiDropdown, `Tab "${dropdownName}"should exist and be visible.`).toBeVisible();
            await multiDropdown.click();
            //Select Options
            const options = optionToSelect.split(';');
            for (const option of options) {
                const element = await this.page.getByRole('option', { name: option, exact: true });
                await expect(element, `Option "${element}"should exist and be visible.`).toBeVisible();
                await element.click();
            }
            await collapseButton.click();
        }
    }

    @step('Input Text Field')
    async inputTextField(element: string, textValue: string, optionToSelect = ""){
        if(textValue != ""){
            //Fill Text Field
            const baseDiv = await this.page.locator('div[class*="tw-items-center tw-px-0.5 tw-w-full"]').filter({ has: this.page.locator(`xpath=//label[contains(text(), '${element}')]`) });
            const inputfield = await baseDiv.locator('input');
            await inputfield.clear();
            await inputfield.fill(textValue);
            
            //Select option if required
            if(optionToSelect != ""){
                const inputButton = await baseDiv.locator('button');
                await inputButton.click();
                const option = await this.page.getByText(optionToSelect);
                await option.click();
            }
        }
    }

    async getDicTableHeaders(){
        const headers = this.page.locator('thead th');
        const count =  await headers.count();
        
    }







}