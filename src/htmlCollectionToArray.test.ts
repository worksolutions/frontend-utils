import { htmlCollectionToArray } from "./htmlCollectionToArray";
import { isArray } from "./is";

function makeChildElement(text: string) {
  const div = document.createElement("div");
  div.innerText = text;
  return div;
}

test("Convert HTML Collection to Array", function () {
  const parent = document.createElement("div");
  parent.appendChild(makeChildElement("1"));
  parent.appendChild(makeChildElement("2"));
  parent.appendChild(makeChildElement("3"));

  const htmlElements = htmlCollectionToArray(parent.children);

  expect(isArray(htmlElements)).toBe(true);
  expect(isArray(parent.children)).toBe(false);
  expect(htmlElements.length).toBe(3);

  parent.appendChild(makeChildElement("4"));

  expect(htmlElements.length).toBe(3);
});
