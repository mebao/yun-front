import { MebAppPage } from './app.po';

describe('meb-app App', () => {
  let page: MebAppPage;

  beforeEach(() => {
    page = new MebAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
