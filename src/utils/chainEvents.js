import chain from 'chain-function';

function chainEvents(events, objects) {
  if (!events) return;

  let result = {};

  [].concat(events).forEach(event => {
    let handlers = objects.map(p => p[event]);
    result[event] = chain(...handlers)
  })

  return result
}

export default function mergeWithEvents(events, objects) {
  return Object.assign({}, ...objects, chainEvents(events, objects))
}
