import { expect,  type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step, test } from '../fixtures/BaseTest';

export class HomePage extends BasePage {
  //--------------------------------------------------------------------------------------------
  // Getter properties 
  //--------------------------------------------------------------------------------------------
  private readonly name = "HomePage";

  private get welcomeMessage(): Locator {
    return this.page.getByRole('heading', { name: 'Welcome!' });
  }

  constructor(page: Page) {
    super(page);
  }


  //--------------------------------------------------------------------------------------------
  // Actions for Page Object Model
  //--------------------------------------------------------------------------------------------

  @step('Validate Home Page is loaded')
  async validateHomePageLoaded() {
    await expect(this.welcomeMessage, 'Welcome Message on Dashboard should be visible').toBeVisible();
  }


  


}