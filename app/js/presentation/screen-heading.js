import { appendTextElement } from "./screen-helpers.js";

export function appendScreenHeading(parent, {
  kicker,
  title,
  titleClassName = "",
}) {
  const documentObject = parent.ownerDocument ?? document;
  const heading = documentObject.createElement("header");
  heading.className = "screen-heading";
  appendTextElement(heading, "p", kicker, "screen-kicker");
  appendTextElement(
    heading,
    "h1",
    title,
    `screen-title${titleClassName ? ` ${titleClassName}` : ""}`,
  );
  parent.append(heading);
  return heading;
}
