import camelcase from 'camelcase';

function recursiveStagesFromBpmnGraph(bpmnGraph) {
  const { name, type } = bpmnGraph;
  const currentElement =
    type === 'bpmn:startEvent'
      ? { name: 'init', type }
      : { name: camelcase(name), type };

  if (!bpmnGraph.nextElements || bpmnGraph.nextElements.length === 0) {
    return [currentElement];
  }
  return [currentElement].concat(
    recursiveStagesFromBpmnGraph(bpmnGraph.nextElements[0])
  );
}

export default function testsFromBpmnGraph(bpmnGraph) {
  const stages = recursiveStagesFromBpmnGraph(bpmnGraph);

  const namedFunction = name =>
    `function ${name}() {\n    //todo: fill this\n  }`;

  const utilityFunctions = stages.reduce(
    (acc, { name }) => ` ${acc}\n  ${namedFunction(name)}`,
    ''
  );

  const testContent = stages.reduce(
    (acc, { name }) => `${acc}\n    .then(${name})`,
    ''
  );
  const test = `it('should work', () => {
    cy${testContent}
  })`;

  const finalCode = `describe('testCase', () => {
  ${utilityFunctions}
  ${test}
});`;
  return finalCode;
}
