import readBpmnFromFile from './readBpmn';
import graphFromBpmn from './graphFromBpmn';
import testsFromBpmn from './testsFromBpmnGraph';

async function generateTestFromBpmn(file) {
  const bpmn = await readBpmnFromFile(file);
  const graph = graphFromBpmn(bpmn);
  const tests = testsFromBpmn(graph);

  console.log(tests);
  return tests;
}

// eslint-disable-next-line import/prefer-default-export
export { generateTestFromBpmn };
