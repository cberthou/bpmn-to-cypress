import fs from 'fs';
import { promisify } from 'util';
import { xml2json } from 'xml-js';

const readFile = promisify(fs.readFile);

async function readBpmnFromFile(filePath) {
  const bpmn = await readFile(filePath);
  const jsonBpmn = xml2json(bpmn);
  return JSON.parse(jsonBpmn);
}

export default readBpmnFromFile;
