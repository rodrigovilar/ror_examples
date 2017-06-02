var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder().build();
var ROOT_URL = 'http://localhost:3000/';
var CLICK_DELAY = 500;

var waitFor = function (condition, timeout, message) {
  driver.wait(until.elementLocated(condition), timeout, message);
  return find(condition, timeout, message);
};

var find = function (condition, timeout, message) {
  return driver.findElement(condition);
};

var clickLink = function (link, title) {
  waitFor(By.xpath('(//a[text()="' + link + '"])[last()]'), 3000, link + ' Link not found').click();
  driver.sleep(CLICK_DELAY);
  if (title) {
    waitFor(By.xpath('//h1[text()="' + title + '"]'), 3000, title + ' Title not found');
  }
}

var checkForm = function () {
  for(var i = 0; i < arguments.length; i++) {
    waitFor(By.xpath('//label[text()="' + arguments[i] + '"]'), 3000, arguments[i++] + ' Label not found');
    waitFor(By.xpath('//input[@id="' + arguments[i] + '"]'), 3000, arguments[i] + ' Input not found');
  }
}

var listingPage = function (url, title) {
  driver.get(url);
  waitFor(By.xpath('//h1[text()="' + title + '"]'), 3000, title + ' Title not found');
  for(var i = 2; i < arguments.length; i++) {
    waitFor(By.xpath('//th[text()="' + arguments[i] + '"]'), 3000, arguments[i] + ' Heading not found');
  }
}

var back = function () {
  driver.sleep(CLICK_DELAY);
  find(By.xpath('//a[text()="Back"]')).click();
  driver.sleep(CLICK_DELAY);
}

var fillForm = function () {
  for(var i = 0; i < arguments.length; i++) { 
    var input = find(By.id(arguments[i++]));
    input.clear();
    input.sendKeys(arguments[i]);
  }
}

var clickButton = function(label) {
  find(By.xpath('//input[@value="' + label + '"]')).click();
  driver.sleep(CLICK_DELAY);
}

var message = function (message) {
  waitFor(By.xpath('//p[text()="' + message + '"]'), 3000, message + ' Message not found');
}

var show = function() {
  for(var i = 0; i < arguments.length; i++) { 
    waitFor(By.xpath('//strong[text()="' + arguments[i] + ':"]'), 3000, arguments[i++] + ': Strong not found');
    waitFor(By.xpath('//p[text()[contains(.,"' + arguments[i] + '")]]'), 3000, arguments[i] + ' P not found');
  }
}

var alertDialog = function() {
 return driver.switchTo().alert();
}
 
var LIST_URL = ROOT_URL + 'books';
var PLURAL_TITLE = 'Books';
var SINGULAR_TITLE = 'Book';

listingPage(LIST_URL, 'Listing ' + PLURAL_TITLE, "Name", "Author");

clickLink('New ' + SINGULAR_TITLE, 'New ' + SINGULAR_TITLE);
checkForm("Name", "book_name", "Author", "book_author");
back();

clickLink('New ' + SINGULAR_TITLE, 'New ' + SINGULAR_TITLE);
fillForm("book_name", "Book 1", "book_author", "Author 1");

clickButton('Create ' + SINGULAR_TITLE);
message(SINGULAR_TITLE + " was successfully created.");
show("Name", "Book 1", "Author", "Author 1");
back();

clickLink('Show');
show("Name", "Book 1", "Author", "Author 1");

clickLink('Edit', 'Editing ' + SINGULAR_TITLE);
checkForm("Name", "book_name", "Author", "book_author");
back();

clickLink('Edit', 'Editing ' + SINGULAR_TITLE);
fillForm("book_name", "Book 2", "book_author", "Author 2");

clickButton('Update ' + SINGULAR_TITLE);
message(SINGULAR_TITLE + " was successfully updated.");
show("Name", "Book 2", "Author", "Author 2");

clickLink('Edit', 'Editing ' + SINGULAR_TITLE);

clickLink('Show');

back();

clickLink('Destroy');
alertDialog().accept();
message(SINGULAR_TITLE + " was successfully destroyed.");

driver.quit();
