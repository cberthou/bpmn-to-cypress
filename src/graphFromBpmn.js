import { flatMap } from 'lodash';

const BPMN_DEF = 'bpmn:definitions';
const BPMN_PROC = 'bpmn:process';
const BPMN_START_EVENT = 'bpmn:startEvent';
const BPMN_OUTGOING = 'bpmn:outgoing';

function getBpmnProcess(bpmn) {
  return bpmn.elements
    .find(({ name }) => name === BPMN_DEF)
    .elements.find(({ name }) => name === BPMN_PROC).elements;
}

function findRootElement(bpmnProcess) {
  return bpmnProcess.find(({ name }) => name === BPMN_START_EVENT);
}

function getNextElementsId(bpmnNode) {
  const outgoing = bpmnNode.elements.filter(
    ({ name }) => name === BPMN_OUTGOING
  );
  return flatMap(outgoing, ({ elements }) => elements.map(({ text }) => text));
}

function findElementById(process, targetId) {
  return process.find(({ attributes: { id } }) => {
    return id === targetId;
  });
}

function findNextElement(process, sequenceFlowId) {
  const sequenceFlow = findElementById(process, sequenceFlowId);
  const nextElementId = sequenceFlow.attributes.targetRef;
  return findElementById(process, nextElementId);
}

function recursiveGraphFromBpmn(process, currentElementId) {
  const currentElement = findElementById(process, currentElementId);
  const outgoingSequenceFlows = getNextElementsId(currentElement);
  const nextElements = outgoingSequenceFlows.map(sequenceFlowId =>
    findNextElement(process, sequenceFlowId)
  );
  return {
    type: currentElement.name,
    id: currentElement.attributes.id,
    nextElements: nextElements.map(({ attributes: { id } }) =>
      recursiveGraphFromBpmn(process, id)
    ),
    name: currentElement.attributes.name,
  };
}

function graphFromBpmn(bpmn) {
  const process = getBpmnProcess(bpmn);
  const startEvent = findRootElement(process);

  const graph = recursiveGraphFromBpmn(process, startEvent.attributes.id);

  return graph;
}

export default graphFromBpmn;
