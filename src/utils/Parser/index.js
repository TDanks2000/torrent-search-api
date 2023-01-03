import parser from "./parser";
import * as handlers from "./handlers";
const Parser = parser.Parser;

const defaultParser = new parser();

handlers.addDefaults(defaultParser);

const addDefaults = handlers.addDefaults;
const addHandler = (handlerName, handler, options) =>
  defaultParser.addHandler(handlerName, handler, options);
const parse = (title) => defaultParser.parse(title);

export { addDefaults, addHandler, parse, Parser };
