import { v4 as uuidv4 } from 'uuid';

function makeAssembly(name, modules) {
  return {
    id: uuidv4(),
    name: name || 'Unnamed Assembly',
    modules: modules,
    deployed: false,
    built: false,
    moves: 1,
    actions: 1,
    orders: [],
    capabilities: [],
    satisfies: [],
  };
}

export { makeAssembly };
